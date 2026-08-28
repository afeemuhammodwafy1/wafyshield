import Head from 'next/head'
import Link from 'next/link'

function ShieldWarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--green-600)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />
      <path d="M12 9v4.2" />
      <circle cx="12" cy="16" r="0.6" fill="var(--green-600)" stroke="none" />
    </svg>
  )
}

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - WafyShield</title>
        <meta name="description" content="The page you are looking for could not be found on WafyShield, the free web security scanner." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="wrap">
        <div className="card">
          <ShieldWarningIcon />
          <p className="code">404</p>
          <h1>This page could not be found</h1>
          <p className="msg">
            The page you are looking for was not scanned, moved, or never existed. Head back to run a
            fresh security scan.
          </p>
          <Link href="/" className="home-btn">
            Back to WafyShield
          </Link>
        </div>
      </div>
      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--green-50);
          padding: 24px;
        }
        .card {
          background: var(--white);
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 44px 36px;
          text-align: center;
          max-width: 420px;
        }
        .code {
          font-size: 44px;
          font-weight: 800;
          color: var(--green-700);
          margin: 14px 0 4px;
          letter-spacing: -0.02em;
        }
        h1 {
          font-size: 18px;
          margin: 0 0 10px;
          color: var(--gray-900);
        }
        .msg {
          font-size: 14px;
          color: var(--gray-700);
          line-height: 1.55;
          margin: 0 0 22px;
        }
        .home-btn {
          display: inline-block;
          background: var(--green-600);
          color: var(--white);
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          padding: 11px 22px;
          border-radius: 10px;
        }
        .home-btn:hover {
          background: var(--green-700);
        }
      `}</style>
    </>
  )
}
