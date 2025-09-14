import '../styles.css'
import NavBar from './components/NavBar'

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  )
}
