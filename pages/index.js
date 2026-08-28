import Head from 'next/head'
import { useEffect, useState } from 'react'

const HISTORY_KEY = 'wafyshield_scan_history'
const HISTORY_LIMIT = 10
const SITE_URL = 'https://wafyshield.vercel.app'

/* ---------------------------- Inline SVG icons ---------------------------- */

function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  )
}

function CheckCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5" />
    </svg>
  )
}

function WarningIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l9 15.5H3L12 4z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17.2" r="0.6" fill={props.color || 'currentColor'} stroke="none" />
    </svg>
  )
}

function XCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </svg>
  )
}

function CookieIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12.5A8 8 0 1 1 11.5 4c.2 1.5 1.4 2.7 2.9 2.7.2 1.6 1.5 2.9 3.1 2.9.3 1 1 1.8 1.9 2.2z" />
      <circle cx="9.5" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="13" cy="16" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="11" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  )
}

function HistoryIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 1 0 2.6-5.9" />
      <path d="M4 4v4h4" />
      <path d="M12 8v4l3 2" />
    </svg>
  )
}

function GlobeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
    </svg>
  )
}

function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
    </svg>
  )
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.42.36.78 1.08.78 2.18v3.23c0 .3.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  )
}

function CodeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

/* ------------------------------- Helpers -------------------------------- */

function statusColor(status) {
  if (status === 'PASS') return { fg: 'var(--green-600)', bg: 'var(--green-100)' }
  if (status === 'WARNING') return { fg: 'var(--amber-600)', bg: 'var(--amber-100)' }
  return { fg: 'var(--red-600)', bg: 'var(--red-100)' }
}

function StatusIcon({ status, size }) {
  const c = statusColor(status)
  if (status === 'PASS') return <CheckCircleIcon color={c.fg} size={size} />
  if (status === 'WARNING') return <WarningIcon color={c.fg} size={size} />
  return <XCircleIcon color={c.fg} size={size} />
}

function riskColor(risk) {
  if (risk === 'Low') return 'var(--green-600)'
  if (risk === 'Medium') return 'var(--amber-600)'
  if (risk === 'High') return '#c25a2b'
  return 'var(--red-600)'
}

function ScoreRing({ score }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference
  const color = score >= 90 ? 'var(--green-500)' : score >= 70 ? '#d9a441' : score >= 50 ? '#c25a2b' : 'var(--red-600)'
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--gray-100)" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="66" textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--gray-900)">
        {score}
      </text>
      <text x="70" y="86" textAnchor="middle" fontSize="11" fill="var(--gray-500)">
        SECURITY SCORE
      </text>
    </svg>
  )
}

function loadHistory() {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(list) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_LIMIT)))
  } catch {
    /* localStorage unavailable, ignore */
  }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

/* --------------------------------- Page ---------------------------------- */

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  async function runScan(e) {
    if (e) e.preventDefault()
    setError('')
    if (!url.trim()) {
      setError('Please enter a website URL to scan.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong while scanning that URL.')
        return
      }
      if (data.error) {
        setError(data.error)
        return
      }
      setResult(data)
      const entry = {
        url: data.finalUrl,
        score: data.score,
        riskLevel: data.riskLevel,
        overall: data.overall,
        scannedAt: data.scannedAt,
      }
      const updated = [entry, ...history.filter((h) => h.url !== entry.url)].slice(0, HISTORY_LIMIT)
      setHistory(updated)
      saveHistory(updated)
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function rescan(target) {
    setUrl(target)
    setTimeout(() => runScan(), 0)
  }

  function clearHistory() {
    setHistory([])
    saveHistory([])
  }

  const pageTitle = 'WafyShield - Free Web Security Scanner & Website Security Checker'
  const pageDescription =
    'WafyShield is a free web security scanner developed by Afee Muhammod Wafy that checks HTTPS/SSL, security headers, and cookie security in seconds. Get an instant security score, risk level, and clear fix recommendations.'

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WafyShield",
    "url": SITE_URL,
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Person",
      "@id": "https://www.amwafy.xyz/#person",
      "name": "Afee Muhammod Wafy",
      "alternateName": ["Wafy", "Muhammod Wafy", "আফী মুহাম্মদ ওয়াফী"],
      "jobTitle": "Web Developer & Science Student",
      "nationality": { "@type": "Country", "name": "Bangladesh" },
      "url": "https://www.amwafy.xyz/",
      "sameAs": [
        "https://github.com/afeemuhammodwafy1",
        "https://bd.linkedin.com/in/afeemuhammodwafy1",
        "https://twitter.com/muhammodwafy"
      ]
    },
    "description": pageDescription
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="web security scanner, website security checker, security headers checker, HTTPS security checker, website security assessment, SSL checker, cookie security scanner, Afee Muhammod Wafy, WafyShield"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={SITE_URL + '/'} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={SITE_URL + '/'} />
        <meta property="og:site_name" content="WafyShield" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="page">
        <header className="topbar">
          <div className="brand">
            <ShieldIcon color="var(--green-600)" size={28} />
            <span className="brand-name">WafyShield</span>
          </div>
          <p className="tagline">Web Security Scanner</p>
        </header>

        <main className="container">
          <section className="hero" aria-labelledby="hero-heading">
            <h1 id="hero-heading">Web Security Scanner &amp; Website Security Checker</h1>
            <p className="hero-sub">
              Run an instant HTTPS security check, security headers check, and cookie security scan on any public
              website. Get a clear security score, risk level, and practical fix recommendations.
            </p>

            <form className="scan-form" onSubmit={runScan}>
              <div className="input-wrap">
                <GlobeIcon color="var(--gray-500)" />
                <input
                  type="text"
                  inputMode="url"
                  placeholder="example.com or https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  aria-label="Website URL to scan"
                />
              </div>
              <button type="submit" className="scan-btn" disabled={loading}>
                <SearchIcon size={17} />
                {loading ? 'Scanning...' : 'Scan Now'}
              </button>
            </form>

            {error && (
              <div className="error-box" role="alert">
                <XCircleIcon color="var(--red-600)" size={18} />
                <span>{error}</span>
              </div>
            )}
          </section>

          {result && (
            <section className="results" aria-labelledby="results-heading">
              <h2 id="results-heading">Security Assessment Results</h2>

              <div className="summary-card">
                <ScoreRing score={result.score} />
                <div className="summary-meta">
                  <div className="summary-url">
                    <GlobeIcon size={16} color="var(--gray-500)" />
                    <span>{result.finalUrl}</span>
                  </div>
                  <div className="badges">
                    <span className="badge" style={{ color: riskColor(result.riskLevel), background: 'var(--gray-100)' }}>
                      Risk: {result.riskLevel}
                    </span>
                    <span
                      className="badge"
                      style={{
                        color: statusColor(result.overall).fg,
                        background: statusColor(result.overall).bg,
                      }}
                    >
                      Overall: {result.overall}
                    </span>
                  </div>
                  <p className="summary-note">Scanned {formatDate(result.scannedAt)}</p>
                </div>
              </div>

              <h3 className="checks-heading">Detailed Checks</h3>
              <ul className="checks-list">
                {result.checks.map((c) => (
                  <li key={c.id} className="check-item">
                    <div className="check-top">
                      <StatusIcon status={c.status} size={20} />
                      <span className="check-title">{c.title}</span>
                      <span
                        className="check-status"
                        style={{ color: statusColor(c.status).fg, background: statusColor(c.status).bg }}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="check-desc">{c.description}</p>
                    {c.recommendation && (
                      <p className="check-fix">
                        <strong>Fix: </strong>
                        {c.recommendation}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="features" aria-labelledby="features-heading">
            <h2 id="features-heading">What WafyShield Checks</h2>
            <div className="feature-grid">
              <div className="feature">
                <LockIcon color="var(--green-600)" size={22} />
                <h3>HTTPS &amp; SSL Security Check</h3>
                <p>Confirms your site enforces HTTPS and correctly redirects insecure HTTP traffic.</p>
              </div>
              <div className="feature">
                <ShieldIcon color="var(--green-600)" size={22} />
                <h3>Security Headers Checker</h3>
                <p>Reviews HSTS, Content-Security-Policy, X-Frame-Options, and more browser-security headers.</p>
              </div>
              <div className="feature">
                <CookieIcon color="var(--green-600)" size={22} />
                <h3>Cookie Security Check</h3>
                <p>Verifies cookies use Secure, HttpOnly, and SameSite attributes to reduce hijacking and CSRF risk.</p>
              </div>
            </div>
          </section>

          <section className="history" aria-labelledby="history-heading">
            <div className="history-head">
              <h2 id="history-heading">
                <HistoryIcon size={18} color="var(--green-600)" /> Scan History
              </h2>
              {history.length > 0 && (
                <button className="clear-btn" onClick={clearHistory} type="button">
                  <TrashIcon size={14} /> Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="empty-note">Your recent scans will appear here. History is stored only in your browser.</p>
            ) : (
              <ul className="history-list">
                {history.map((h) => (
                  <li key={h.url + h.scannedAt} className="history-item">
                    <button type="button" className="history-link" onClick={() => rescan(h.url)}>
                      <GlobeIcon size={15} color="var(--gray-500)" />
                      <span className="history-url">{h.url}</span>
                    </button>
                    <span className="badge small" style={{ color: riskColor(h.riskLevel), background: 'var(--gray-100)' }}>
                      {h.riskLevel}
                    </span>
                    <span className="history-score">{h.score}/100</span>
                    <span className="history-date">{formatDate(h.scannedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ----------------- SEO Optimized About Section ----------------- */}
          <section className="about-section" aria-labelledby="about-heading">
            <div className="about-project">
              <div className="section-title-wrap">
                <ShieldIcon color="var(--green-600)" size={20} />
                <h2 id="about-heading">About WafyShield</h2>
              </div>
              <p>
                <strong>WafyShield</strong> is an open-access, lightweight web security assessment platform engineered to help developers, sysadmins, and website owners quickly evaluate their web security posture. By performing instant non-intrusive scans on public HTTP response headers, WafyShield verifies whether vital defense mechanisms—such as HTTPS enforcement, SSL/TLS certificate health, OWASP security headers, and cookie flags—are properly deployed.
              </p>
              <div className="about-grid">
                <div className="about-card">
                  <div className="card-head">
                    <CodeIcon color="var(--green-600)" size={18} />
                    <h4>Header Analysis</h4>
                  </div>
                  <p>Audits HSTS, CSP, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy against OWASP guidelines.</p>
                </div>
                <div className="about-card">
                  <div className="card-head">
                    <LockIcon color="var(--green-600)" size={18} />
                    <h4>SSL &amp; Cookie Audit</h4>
                  </div>
                  <p>Checks HTTPS redirection and verifies Secure, HttpOnly, and SameSite attributes on cookies.</p>
                </div>
                <div className="about-card">
                  <div className="card-head">
                    <CheckCircleIcon color="var(--green-600)" size={18} />
                    <h4>Remediation Guide</h4>
                  </div>
                  <p>Provides a transparent security score (0-100) alongside actionable, copy-paste developer fix suggestions.</p>
                </div>
              </div>
            </div>

            <div className="about-author">
              <div className="section-title-wrap">
                <UserIcon color="var(--green-600)" size={20} />
                <h3>Developed by Afee Muhammod Wafy</h3>
              </div>
              <p>
                WafyShield was designed and developed by <strong>Afee Muhammod Wafy</strong> (also known as <strong>Wafy</strong>), a science student and web developer from Rangpur, Bangladesh[cite: 2]. Driven by curiosity and a focus on hands-on learning, he builds clean, functional web applications, full-stack tools (like <em>WafyURL</em>, <em>WafyDev</em>, and <em>AstroWafy</em>), and experiments in cybersecurity and AI[cite: 2].
              </p>
              <div className="author-links">
                <a href="https://www.amwafy.xyz" target="_blank" rel="noopener noreferrer">
                  <GlobeIcon size={15} color="var(--green-800)" /> Portfolio
                </a>
                <span>•</span>
                <a href="https://github.com/afeemuhammodwafy1" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon size={15} /> GitHub
                </a>
                <span>•</span>
                <a href="https://bd.linkedin.com/in/afeemuhammodwafy1" target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon size={15} /> LinkedIn
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>WafyShield performs lightweight, read-only checks against publicly available response headers. It does not store scanned data on any server.</p>
        </footer>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: var(--white);
          border-bottom: 1px solid var(--gray-100);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-name {
          font-size: 20px;
          font-weight: 700;
          color: var(--green-800);
          letter-spacing: -0.02em;
        }
        .tagline {
          margin: 0;
          font-size: 13px;
          color: var(--gray-500);
        }
        .container {
          max-width: 880px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 20px 60px;
          flex: 1;
        }
        .hero {
          text-align: center;
          margin-bottom: 36px;
        }
        .hero h1 {
          font-size: 30px;
          margin: 0 0 12px;
          color: var(--green-900);
          letter-spacing: -0.02em;
        }
        .hero-sub {
          color: var(--gray-700);
          max-width: 620px;
          margin: 0 auto 26px;
          line-height: 1.55;
        }
        .scan-form {
          display: flex;
          gap: 10px;
          max-width: 560px;
          margin: 0 auto;
        }
        .input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--white);
          border: 1px solid var(--gray-300);
          border-radius: 10px;
          padding: 0 14px;
        }
        .input-wrap input {
          border: none;
          outline: none;
          flex: 1;
          padding: 13px 0;
          font-size: 15px;
          background: transparent;
        }
        .scan-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--green-600);
          color: var(--white);
          border: none;
          padding: 0 22px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
        }
        .scan-btn:hover {
          background: var(--green-700);
        }
        .scan-btn:disabled {
          opacity: 0.7;
          cursor: default;
        }
        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 560px;
          margin: 14px auto 0;
          background: var(--red-100);
          color: var(--red-600);
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 14px;
        }
        .results {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 28px;
          margin-bottom: 40px;
        }
        .results h2 {
          margin-top: 0;
          font-size: 20px;
          color: var(--green-900);
        }
        .summary-card {
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--gray-100);
          margin-bottom: 20px;
        }
        .summary-meta {
          flex: 1;
          min-width: 220px;
        }
        .summary-url {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--gray-700);
          word-break: break-all;
          margin-bottom: 10px;
        }
        .badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .badge {
          font-size: 12px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 999px;
          letter-spacing: 0.02em;
        }
        .badge.small {
          font-size: 11px;
          padding: 3px 8px;
        }
        .summary-note {
          margin: 0;
          font-size: 12px;
          color: var(--gray-500);
        }
        .checks-heading {
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--gray-500);
          margin-bottom: 14px;
        }
        .checks-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .check-item {
          border: 1px solid var(--gray-100);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .check-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .check-title {
          font-weight: 600;
          flex: 1;
          font-size: 14.5px;
        }
        .check-status {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
        }
        .check-desc {
          margin: 8px 0 0 30px;
          font-size: 13.5px;
          color: var(--gray-700);
        }
        .check-fix {
          margin: 6px 0 0 30px;
          font-size: 13.5px;
          color: var(--green-800);
          background: var(--green-50);
          padding: 8px 10px;
          border-radius: 8px;
        }
        .features {
          margin-bottom: 40px;
        }
        .features h2 {
          font-size: 20px;
          color: var(--green-900);
          margin-bottom: 18px;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .feature {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 20px;
        }
        .feature h3 {
          font-size: 15.5px;
          margin: 10px 0 6px;
          color: var(--green-900);
        }
        .feature p {
          font-size: 13.5px;
          color: var(--gray-700);
          margin: 0;
          line-height: 1.5;
        }
        .history {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 24px;
          margin-bottom: 40px;
        }
        .history-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .history-head h2 {
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          color: var(--green-900);
        }
        .clear-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid var(--gray-300);
          color: var(--gray-700);
          font-size: 12.5px;
          padding: 6px 10px;
          border-radius: 8px;
        }
        .clear-btn:hover {
          border-color: var(--red-600);
          color: var(--red-600);
        }
        .empty-note {
          font-size: 13.5px;
          color: var(--gray-500);
          margin: 14px 0 0;
        }
        .history-list {
          list-style: none;
          margin: 14px 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .history-item {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          padding: 10px 12px;
          border: 1px solid var(--gray-100);
          border-radius: 8px;
          font-size: 13px;
        }
        .history-link {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          padding: 0;
          color: var(--green-700);
          font-weight: 600;
          flex: 1;
          min-width: 160px;
          text-align: left;
        }
        .history-link:hover {
          text-decoration: underline;
        }
        .history-url {
          word-break: break-all;
        }
        .history-score {
          font-weight: 700;
          color: var(--gray-900);
        }
        .history-date {
          color: var(--gray-500);
          font-size: 12px;
        }

        /* ---------------- About Section Styles ---------------- */
        .about-section {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 32px 28px;
          margin-bottom: 40px;
        }
        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .about-project h2 {
          font-size: 20px;
          color: var(--green-900);
          margin: 0;
        }
        .about-project > p {
          color: var(--gray-700);
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 28px;
        }
        .about-card {
          background: var(--gray-50, #f9fafb);
          border: 1px solid var(--gray-100);
          border-radius: 10px;
          padding: 16px;
        }
        .card-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .about-card h4 {
          font-size: 14px;
          color: var(--green-900);
          margin: 0;
          font-weight: 600;
        }
        .about-card p {
          font-size: 12.5px;
          color: var(--gray-700);
          margin: 0;
          line-height: 1.45;
        }
        .about-author {
          background: var(--green-50);
          border: 1px solid var(--green-100);
          border-radius: 12px;
          padding: 22px;
        }
        .about-author h3 {
          font-size: 16px;
          color: var(--green-900);
          margin: 0;
        }
        .about-author p {
          font-size: 13.5px;
          color: var(--gray-700);
          line-height: 1.55;
          margin: 0 0 14px;
        }
        .author-links {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 13px;
          font-weight: 600;
          color: var(--green-800);
        }
        .author-links a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--green-800);
          text-decoration: none;
        }
        .author-links a:hover {
          text-decoration: underline;
        }

        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12.5px;
          color: var(--gray-500);
        }
        @media (max-width: 520px) {
          .scan-form {
            flex-direction: column;
          }
          .hero h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  )
}
