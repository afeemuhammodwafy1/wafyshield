// WafyShield scan engine
// Runs as a Vercel serverless function. No database, no auth, no state.

const BLOCKED_HOSTNAMES = new Set(['localhost', '0.0.0.0', '::1', '127.0.0.1'])

function isPrivateHost(hostname) {
  const host = hostname.toLowerCase()
  if (BLOCKED_HOSTNAMES.has(host)) return true
  if (/^127\./.test(host)) return true
  if (/^10\./.test(host)) return true
  if (/^192\.168\./.test(host)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true
  if (/^169\.254\./.test(host)) return true
  if (host.endsWith('.local')) return true
  return false
}

function normalizeUrl(input) {
  let raw = (input || '').trim()
  if (!raw) {
    throw new Error('Please enter a URL to scan.')
  }
  if (!/^https?:\/\//i.test(raw)) {
    raw = 'https://' + raw
  }
  let parsed
  try {
    parsed = new URL(raw)
  } catch {
    throw new Error('That does not look like a valid URL.')
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only http and https URLs are supported.')
  }
  if (isPrivateHost(parsed.hostname)) {
    throw new Error('Scanning private, local or internal addresses is not allowed.')
  }
  if (!parsed.hostname.includes('.')) {
    throw new Error('Please enter a fully qualified domain name, e.g. example.com')
  }
  return parsed
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 9000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

function getSetCookies(headers) {
  if (typeof headers.getSetCookie === 'function') {
    const list = headers.getSetCookie()
    if (Array.isArray(list) && list.length) return list
  }
  const raw = headers.get('set-cookie')
  if (!raw) return []
  return raw.split(/,(?=\s*[A-Za-z0-9_-]+=)/)
}

function makeCheck(id, title, status, description, recommendation) {
  return {
    id,
    title,
    status,
    description,
    recommendation: status === 'PASS' ? null : recommendation,
  }
}

const WEIGHTS = {
  https: 20,
  hsts: 10,
  csp: 15,
  frameOptions: 10,
  contentTypeOptions: 10,
  referrerPolicy: 10,
  permissionsPolicy: 10,
  cookieSecure: 5,
  cookieHttpOnly: 5,
  cookieSameSite: 5,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  let target
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    target = normalizeUrl(body.url)
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Invalid request.' })
  }

  const startedHttp = target.protocol === 'http:'
  let response
  let finalUrl = target.toString()

  try {
    response = await fetchWithTimeout(target.toString(), {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; WafyShieldBot/1.0; +https://wafyshield.vercel.app) SecurityScanner',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })
    finalUrl = response.url || finalUrl
  } catch (err) {
    const isAbort = err && err.name === 'AbortError'
    return res.status(200).json({
      error: isAbort
        ? 'The site took too long to respond. It may be offline or blocking automated requests.'
        : 'Could not reach that URL. Check that it is spelled correctly and publicly accessible.',
    })
  }

  const headers = response.headers
  const usesHttps = finalUrl.startsWith('https://')
  const checks = []
  let score = 0

  // 1. HTTPS
  if (usesHttps) {
    checks.push(makeCheck('https', 'HTTPS in use', 'PASS', 'The site loads over an encrypted HTTPS connection.', null))
    score += WEIGHTS.https
  } else {
    checks.push(
      makeCheck(
        'https',
        'HTTPS in use',
        'FAIL',
        'The site does not use HTTPS, or does not redirect HTTP traffic to HTTPS.',
        'Enable HTTPS with a valid TLS certificate and redirect all HTTP requests to HTTPS.'
      )
    )
  }

  if (startedHttp && usesHttps) {
    checks.push(
      makeCheck('https-redirect', 'HTTP to HTTPS redirect', 'PASS', 'HTTP requests are redirected to a secure HTTPS URL.', null)
    )
  } else if (startedHttp && !usesHttps) {
    checks.push(
      makeCheck(
        'https-redirect',
        'HTTP to HTTPS redirect',
        'FAIL',
        'The site was reached over HTTP and did not redirect to HTTPS.',
        'Configure a server-side or CDN-level 301 redirect from HTTP to HTTPS.'
      )
    )
  }

  // 2. HSTS
  const hsts = headers.get('strict-transport-security')
  if (usesHttps && hsts) {
    checks.push(makeCheck('hsts', 'Strict-Transport-Security header', 'PASS', 'HSTS is enabled: ' + hsts, null))
    score += WEIGHTS.hsts
  } else if (usesHttps) {
    checks.push(
      makeCheck(
        'hsts',
        'Strict-Transport-Security header',
        'WARNING',
        'No HSTS header was found.',
        'Add "Strict-Transport-Security: max-age=15552000; includeSubDomains" to enforce HTTPS in browsers.'
      )
    )
  } else {
    checks.push(
      makeCheck(
        'hsts',
        'Strict-Transport-Security header',
        'FAIL',
        'HSTS cannot be evaluated because the site is not served over HTTPS.',
        'Enable HTTPS first, then add a Strict-Transport-Security header.'
      )
    )
  }

  // 3. Content-Security-Policy
  const csp = headers.get('content-security-policy')
  if (csp) {
    checks.push(makeCheck('csp', 'Content-Security-Policy header', 'PASS', 'A Content-Security-Policy header is present.', null))
    score += WEIGHTS.csp
  } else {
    checks.push(
      makeCheck(
        'csp',
        'Content-Security-Policy header',
        'WARNING',
        'No Content-Security-Policy header was found.',
        'Define a Content-Security-Policy header to restrict where scripts, styles and other resources may load from.'
      )
    )
  }

  // 4. Clickjacking protection
  const xfo = headers.get('x-frame-options')
  const hasFrameAncestors = !!(csp && /frame-ancestors/i.test(csp))
  if (xfo || hasFrameAncestors) {
    checks.push(
      makeCheck(
        'frame-options',
        'Clickjacking protection',
        'PASS',
        xfo ? 'X-Frame-Options is set to "' + xfo + '".' : 'CSP frame-ancestors directive restricts framing.',
        null
      )
    )
    score += WEIGHTS.frameOptions
  } else {
    checks.push(
      makeCheck(
        'frame-options',
        'Clickjacking protection',
        'WARNING',
        'No X-Frame-Options header or CSP frame-ancestors directive was found.',
        'Add "X-Frame-Options: DENY" or a CSP frame-ancestors directive to prevent clickjacking.'
      )
    )
  }

  // 5. MIME-sniffing protection
  const xcto = headers.get('x-content-type-options')
  if (xcto && xcto.toLowerCase().includes('nosniff')) {
    checks.push(
      makeCheck('content-type-options', 'MIME-sniffing protection', 'PASS', 'X-Content-Type-Options is set to "nosniff".', null)
    )
    score += WEIGHTS.contentTypeOptions
  } else {
    checks.push(
      makeCheck(
        'content-type-options',
        'MIME-sniffing protection',
        'WARNING',
        'No X-Content-Type-Options header was found.',
        'Add "X-Content-Type-Options: nosniff" to stop browsers from guessing content types.'
      )
    )
  }

  // 6. Referrer-Policy
  const referrer = headers.get('referrer-policy')
  if (referrer) {
    checks.push(makeCheck('referrer-policy', 'Referrer-Policy header', 'PASS', 'Referrer-Policy is set to "' + referrer + '".', null))
    score += WEIGHTS.referrerPolicy
  } else {
    checks.push(
      makeCheck(
        'referrer-policy',
        'Referrer-Policy header',
        'WARNING',
        'No Referrer-Policy header was found.',
        'Add a Referrer-Policy header, such as "strict-origin-when-cross-origin", to limit referrer data leakage.'
      )
    )
  }

  // 7. Permissions-Policy
  const permissions = headers.get('permissions-policy')
  if (permissions) {
    checks.push(makeCheck('permissions-policy', 'Permissions-Policy header', 'PASS', 'A Permissions-Policy header is present.', null))
    score += WEIGHTS.permissionsPolicy
  } else {
    checks.push(
      makeCheck(
        'permissions-policy',
        'Permissions-Policy header',
        'WARNING',
        'No Permissions-Policy header was found.',
        'Add a Permissions-Policy header to restrict access to sensitive browser features such as camera, microphone and geolocation.'
      )
    )
  }

  // 8. Cookie security
  const cookies = getSetCookies(headers)
  if (cookies.length === 0) {
    checks.push(makeCheck('cookie-secure', 'Cookie Secure attribute', 'PASS', 'No cookies were set by the server.', null))
    checks.push(makeCheck('cookie-httponly', 'Cookie HttpOnly attribute', 'PASS', 'No cookies were set by the server.', null))
    checks.push(makeCheck('cookie-samesite', 'Cookie SameSite attribute', 'PASS', 'No cookies were set by the server.', null))
    score += WEIGHTS.cookieSecure + WEIGHTS.cookieHttpOnly + WEIGHTS.cookieSameSite
  } else {
    const missingSecure = cookies.filter((c) => !/;\s*secure/i.test(c))
    const missingHttpOnly = cookies.filter((c) => !/;\s*httponly/i.test(c))
    const missingSameSite = cookies.filter((c) => !/;\s*samesite=/i.test(c))

    if (missingSecure.length === 0) {
      checks.push(
        makeCheck('cookie-secure', 'Cookie Secure attribute', 'PASS', 'All ' + cookies.length + ' cookie(s) set the Secure attribute.', null)
      )
      score += WEIGHTS.cookieSecure
    } else {
      checks.push(
        makeCheck(
          'cookie-secure',
          'Cookie Secure attribute',
          'FAIL',
          missingSecure.length + ' of ' + cookies.length + ' cookie(s) are missing the Secure attribute.',
          'Mark all cookies as Secure so they are only ever sent over HTTPS.'
        )
      )
    }

    if (missingHttpOnly.length === 0) {
      checks.push(
        makeCheck(
          'cookie-httponly',
          'Cookie HttpOnly attribute',
          'PASS',
          'All ' + cookies.length + ' cookie(s) set the HttpOnly attribute.',
          null
        )
      )
      score += WEIGHTS.cookieHttpOnly
    } else {
      checks.push(
        makeCheck(
          'cookie-httponly',
          'Cookie HttpOnly attribute',
          'WARNING',
          missingHttpOnly.length + ' of ' + cookies.length + ' cookie(s) are missing the HttpOnly attribute.',
          'Mark session and authentication cookies HttpOnly so they cannot be read by client-side JavaScript.'
        )
      )
    }

    if (missingSameSite.length === 0) {
      checks.push(
        makeCheck(
          'cookie-samesite',
          'Cookie SameSite attribute',
          'PASS',
          'All ' + cookies.length + ' cookie(s) set the SameSite attribute.',
          null
        )
      )
      score += WEIGHTS.cookieSameSite
    } else {
      checks.push(
        makeCheck(
          'cookie-samesite',
          'Cookie SameSite attribute',
          'WARNING',
          missingSameSite.length + ' of ' + cookies.length + ' cookie(s) are missing the SameSite attribute.',
          'Set SameSite=Lax or SameSite=Strict on cookies to reduce cross-site request forgery risk.'
        )
      )
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)))

  let riskLevel = 'Low'
  if (score < 50) riskLevel = 'Critical'
  else if (score < 70) riskLevel = 'High'
  else if (score < 90) riskLevel = 'Medium'

  const failCount = checks.filter((c) => c.status === 'FAIL').length
  const warnCount = checks.filter((c) => c.status === 'WARNING').length
  const overall = failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARNING' : 'PASS'

  return res.status(200).json({
    requestedUrl: target.toString(),
    finalUrl,
    score,
    riskLevel,
    overall,
    checks,
    scannedAt: new Date().toISOString(),
  })
}
