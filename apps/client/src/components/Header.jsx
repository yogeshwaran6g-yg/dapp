import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Menu, LogOut, Wallet, ExternalLink, Copy, Check } from 'lucide-react';
import { useLogout } from '../hooks/useAuth';
import { useWallet } from '../context/WalletContext';
import { useWalletBalance } from '../hooks/useWallet';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Header = ({ onMenuClick }) => {
    const [address, setAddress] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef(null);
    const logout = useLogout();
    const { data: balanceData } = useWalletBalance();
    const { ownBalance, energyBalance } = useWallet();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                const user = JSON.parse(storedUser);
                if (user) setAddress(user.wallet_address);
            }
        } catch (e) {
            console.error('Error parsing user from localStorage', e);
        }
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    const fmt = (val) => {
        const n = Number(val);
        if (isNaN(n)) return '0.00';
        return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            toast.success('Address copied!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <header className="h-20 bg-background-dark/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-40 transition-all duration-300">

            {/* ── Left: hamburger ── */}
            <div className="flex items-center gap-4 shrink-0">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* ── token pills + wallet + actions ── */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                {/* ── ENERGY Token Balance Pill ── */}
                <div
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all duration-300 cursor-default shrink-0"
                    title={`ENERGY Balance: ${fmt(energyBalance)}`}
                >
                    {/* bolt icon  */}
                    <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' }}
                    >
                        <span className="material-symbols-outlined text-[10px] font-bold leading-none text-[#0b0b0f]">
                            bolt
                        </span>
                    </div>
                    {/* label + value */}
                    <div className="flex flex-col leading-none">
                        <span className="text-[8px] font-black text-[#D4AF37]/70 uppercase tracking-widest whitespace-nowrap">
                            ENERGY
                        </span>
                        <span className="text-[11px] font-black text-white tabular-nums whitespace-nowrap">
                            {fmt(energyBalance)}
                        </span>
                    </div>
                </div>

                {/* ── OWN Token Balance Pill ── */}
                <div
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-300 cursor-default shrink-0"
                    title={`OWN Balance: ${fmt(ownBalance)}`}
                >
                    {/* diamond icon  */}
                    <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
                    >
                        <span className="material-symbols-outlined text-[10px] font-bold leading-none text-white">
                            diamond
                        </span>
                    </div>
                    {/* label + value */}
                    <div className="flex flex-col leading-none">
                        <span className="text-[8px] font-black text-blue-400/80 uppercase tracking-widest whitespace-nowrap">
                            OWN
                        </span>
                        <span className="text-[11px] font-black text-white tabular-nums whitespace-nowrap">
                            {fmt(ownBalance)}
                        </span>
                    </div>
                </div>

                {/* ── Wallet Address Pill + Dropdown ── */}
                <div className="relative">
                    <div
                        onClick={() => address && setShowDropdown(!showDropdown)}
                        className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-accent-gold/30 cursor-pointer transition-all duration-300 group shadow-lg"
                    >
                        <span className={`w-2 h-2 rounded-full shrink-0 transition-shadow duration-300 ${address ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-accent-gold shadow-[0_0_10px_#D4AF37]'}`}></span>
                        {/* address text — hidden on mobile, shown sm+ */}
                        <span className="hidden sm:inline text-[10px] font-black text-accent-gold uppercase tracking-[0.15em]">
                            {address ? formatAddress(address) : 'Disconnected'}
                        </span>
                        {address && (
                            <ChevronDown
                                size={14}
                                className={`text-accent-gold transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                            />
                        )}
                    </div>

                    <AnimatePresence>
                        {showDropdown && address && (
                            <>
                                {/* Backdrop */}
                                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />

                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-72 bg-[#0b0b0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="p-5 space-y-4">
                                        {/* Wallet header row */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20">
                                                    <Wallet size={18} className="text-accent-gold" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Connected Wallet</h4>
                                                    <p className="text-[10px] text-gray-500 font-medium">Polygon Network</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={copyAddress}
                                                className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-accent-gold transition-colors"
                                            >
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>

                                        {/* Balance block */}
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                                            {/* POL */}
                                            <div>
                                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">
                                                    Native Balance
                                                </span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xl font-black text-white">
                                                        {balanceData?.polBalance || '0.00'}
                                                    </span>
                                                    <span className="text-xs font-bold text-accent-gold uppercase">POL</span>
                                                </div>
                                            </div>

                                            {/* USDT */}
                                            <div className="pt-2 border-t border-white/5">
                                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">
                                                    Asset Balance
                                                </span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xl font-black text-white">
                                                        {balanceData?.usdtBalance || '0.00'}
                                                    </span>
                                                    <span className="text-xs font-bold text-green-500 uppercase">USDT</span>
                                                </div>
                                            </div>


                                            {/* Full address */}
                                            <p className="text-[10px] text-gray-500 font-mono break-all opacity-60 pt-1">
                                                {address}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-2">
                                            <a
                                                href={`https://polygonscan.com/address/${address}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white transition-all border border-white/5 hover:border-white/10 group"
                                            >
                                                <span className="font-bold uppercase tracking-wider">View on Scan</span>
                                                <ExternalLink size={14} className="text-gray-500 group-hover:text-accent-gold transition-colors" />
                                            </a>

                                            <button
                                                onClick={() => { setShowDropdown(false); logout(); }}
                                                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all border border-red-500/10 hover:border-red-500/20 group"
                                            >
                                                <span className="font-black uppercase tracking-wider text-[10px]">Disconnect Wallet</span>
                                                <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Notifications ── */}
                <button className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all relative shrink-0">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-gold rounded-full border border-background-dark"></span>
                </button>

                {/* ── Logout quick button ── */}
                <button
                    onClick={logout}
                    className="hidden sm:flex items-center justify-center p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all group shrink-0"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>

                {/* ── Profile ── */}
                <Link
                    to="/profile"
                    className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5 p-1 shadow-inner">
                        <img
                            className="w-full h-full object-cover rounded-lg"
                            alt="User profile"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFKaOGEqx67axoW6iLXhSdvdyvxDb170U5VryWHnElt8B3QKCoot9mI3RUcatVZuM5rltR8cmExLDnrl_qsNwJBKSWJ6IESqKE7jtV5trks0gBD0ikRyggNLDZju4NL_dHT_qL4IKZl2YkK5nhwjM81QMVMHF5cs_4VGOBa2KfROplMXKA7hoh0uPc5xu1YaEdSa9r7MrlepExGa4G1dGmzZ3j6X_251LoiCgf46PRS98ilHdr2GxmH1QaHqcYhB-sHIbLdRdoAjrj"
                        />
                    </div>
                    <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
                </Link>
            </div>
        </header>
    );
};

export default Header;