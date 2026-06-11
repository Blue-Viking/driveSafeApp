// pages/_app.js
import '../src/app/globals.css';   // your Tailwind / globals

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

