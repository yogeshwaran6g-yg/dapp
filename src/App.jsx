import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ecosystem from './components/Ecosystem'
import Footer from './components/Footer'

import Roadmap from './components/Roadmap'

function App() {
  return (
    <div className="bg-black-pure min-h-screen selection:bg-gold/30 selection:text-gold-light">
      <Navbar />
      <main>
        <Hero />
        <Ecosystem />
        <Roadmap />

        {/* Call to Action Section */}
        <section className="py-24 bg-gradient-to-b from-black-soft to-black-pure">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8 uppercase">
              READY TO <span className="text-gold">JOIN THE BMIN ECONOMY?</span>
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Join 150,000+ users worldwide and experience the most powerful decentralized infrastructure built for institutional growth.
            </p>
            <button className="bg-green-accent hover:bg-green-accent text-black px-12 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all transform hover:scale-105 uppercase tracking-wider">
              Enter the Metaverse
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
