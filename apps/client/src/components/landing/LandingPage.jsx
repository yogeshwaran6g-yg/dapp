import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Navbar from './Navbar'
import Hero from './Hero'
import Ecosystem from './Ecosystem'
import Footer from './Footer'
import Roadmap from './Roadmap'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { WalletAuthListener } from '../WalletAuthListener'
import SignupView from './SignupView'
import { useAuthContext } from '../../context/AuthContext'
import { useLogin, useNonce } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
    const { open } = useAppKit()
    const navigate = useNavigate()
    const { address, isConnected } = useAccount()
    const { isAuthenticated } = useAuthContext()
    const { login } = useLogin()
    const { data: nonce, refetch: fetchNonce } = useNonce(
        isConnected && !isAuthenticated ? address : null
    )
    const [isSignupViewOpen, setIsSignupViewOpen] = React.useState(false)

    const handleConnectClick = async () => {
        if (!isConnected) {
            setIsSignupViewOpen(true)
        } else if (!isAuthenticated) {
            // Ensure we have a fresh nonce before signing
            let resolvedNonce = nonce
            if (!resolvedNonce) {
                const result = await fetchNonce()
                resolvedNonce = result.data
            }
            const loginResult = await login(resolvedNonce)
            if (loginResult) {
                navigate('/dashboard')
            }
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-black-pure text-white font-sans selection:bg-gold selection:text-black-pure overflow-x-hidden bg-linear-to-b from-black-pure via-black-soft to-black-pure">
            <WalletAuthListener />
            <Navbar onConnectClick={handleConnectClick} />
            <main>
                <Hero />
                <Ecosystem />
                <Roadmap />

                {/* Call to Action Section */}
                <section className="py-28 bg-linear-to-b from-black-soft to-black-pure relative overflow-hidden">
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
                            onClick={handleConnectClick}
                            className="group bg-gold hover:bg-gold-light text-black px-12 py-4 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(198,163,79,0.25)] transition-all uppercase tracking-wider flex items-center gap-2 mx-auto"
                        >
                            Enter the Metaverse
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </motion.button>
                    </motion.div>
                </section>
            </main>
            <Footer />

            <SignupView
                isOpen={isSignupViewOpen}
                onClose={() => setIsSignupViewOpen(false)}
                onConnect={() => {
                    setIsSignupViewOpen(false);
                    open();
                }}
            />
        </div>
    )
}

export default LandingPage
