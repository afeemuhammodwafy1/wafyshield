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
    'WafyShield is a free web security scanner that checks HTTPS/SSL, security headers, and cookie security in seconds. Get an instant security score, risk level, and clear fix recommendations.'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="web security scanner, website security checker, security headers checker, HTTPS security checker, website security assessment, SSL checker, cookie security scanner"
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
