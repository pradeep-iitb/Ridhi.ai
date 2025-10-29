import '../styles/globals.css'
import Header from '../components/Header'

export default function App({ Component, pageProps }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#020617,#061021)' }}>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  )
}
