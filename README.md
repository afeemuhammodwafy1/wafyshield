# WafyShield

A lightweight web security scanner: HTTPS/SSL check, security headers check, and cookie
security check, with a security score, risk level, PASS/WARNING/FAIL results, fix
recommendations, and scan history (stored in the browser via localStorage). No database,
no authentication, no server-side storage.

## Project structure (8 files)

```
package.json          dependencies + scripts
next.config.js         minimal Next.js config
pages/_app.js          global theme (light + green)
pages/index.js         scanner UI, SEO tags, history
pages/404.js           custom WafyShield 404 page
pages/api/scan.js      serverless scan engine (runs on Vercel functions)
public/robots.txt       crawler rules
public/sitemap.xml      sitemap
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy (GitHub -> Vercel, free tier)

1. Push this folder to a new GitHub repository.
2. In Vercel, click "Add New Project" and import the repository.
3. Framework preset: Next.js (auto-detected). No environment variables, no database
   needed. Click Deploy.

## Before going live

Replace `https://wafyshield.vercel.app` with your real deployed domain in:

- `pages/index.js` (`SITE_URL` constant, used for canonical/OG tags)
- `public/robots.txt` (Sitemap line)
- `public/sitemap.xml` (`<loc>`)

## Notes

- The scan reads only publicly available response headers of the target URL; it does not
  store or log scanned URLs anywhere server-side.
- Requests to localhost/private/internal IP ranges are blocked to prevent misuse.
