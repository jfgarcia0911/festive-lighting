import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Process from './components/Process'
import QuoteForm from './components/QuoteForm'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Process />
        <QuoteForm />
      </main>
      <Footer />
    </>
  )
}