export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --green-900: #052e1d;
          --green-800: #0b3d2a;
          --green-700: #0f5132;
          --green-600: #157347;
          --green-500: #198754;
          --green-400: #2fa96b;
          --green-100: #d8f3e2;
          --green-50: #f2fbf6;
          --gray-900: #14181a;
          --gray-700: #3f4a45;
          --gray-500: #6b7770;
          --gray-300: #d6ded9;
          --gray-100: #eef4f0;
          --white: #ffffff;
          --red-600: #c0392b;
          --red-100: #fbe4e1;
          --amber-600: #b7791f;
          --amber-100: #fdf1da;
          --radius: 14px;
          --shadow: 0 1px 2px rgba(11, 61, 42, 0.06), 0 8px 24px rgba(11, 61, 42, 0.06);
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          padding: 0;
          margin: 0;
          background: var(--green-50);
          color: var(--gray-900);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
            sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        a {
          color: inherit;
        }

        button {
          font-family: inherit;
          cursor: pointer;
        }

        input {
          font-family: inherit;
        }

        ::selection {
          background: var(--green-100);
        }

        code,
        pre {
          font-family: 'SFMono-Regular', Consolas, Menlo, monospace;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
