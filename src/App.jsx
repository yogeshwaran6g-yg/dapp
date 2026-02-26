import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ecosystem from './components/Ecosystem'
import Footer from './components/Footer'
import Roadmap from './components/Roadmap'
import { WalletAuthListener } from './components/WalletAuthListener'

function App() {
  return (
    <div className="bg-black-pure min-h-screen selection:bg-gold/30 selection:text-gold-light font-sans">
      <WalletAuthListener />
      <Navbar />
      <main>
        <Hero />
        <Ecosystem />
        <Roadmap />

        {/* Call to Action Section */}
        <section className="py-28 bg-gradient-to-b from-black-soft to-black-pure relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto px-4 text-center relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8 uppercase leading-tight">
              READY TO <span className="text-gold">JOIN THE BMIN ECONOMY?</span>
            </h2>
            <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
              Join 150,000+ users worldwide and experience the most powerful decentralized infrastructure built for institutional growth.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-gold hover:bg-gold-light text-black px-12 py-4 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(198,163,79,0.2)] transition-all uppercase tracking-wider flex items-center gap-2 mx-auto"
            >
              Enter the Metaverse
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
