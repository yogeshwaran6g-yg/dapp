import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Menu, LogOut } from 'lucide-react';
import { useLogout } from '../hooks/useAuth';
import { useWalletBalance } from '../hooks/useWallet';
import { API_ENDPOINTS } from '../utils/endpoints';
import { useQueryClient } from '@tanstack/react-query';

const Header = ({ onMenuClick }) => {
    const [address, setAddress] = useState('');
    const logout = useLogout();
    const queryClient = useQueryClient();
    const { data: walletData, isLoading: isBalanceLoading } = useWalletBalance();
    const [faucetAmount, setFaucetAmount] = useState('10');

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

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <header className="h-20 bg-background-dark/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-40 transition-all duration-300">
            <div className="flex items-center gap-6 sm:gap-12">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Left Stats Section */}
                <div className="flex gap-8 sm:gap-12">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.15em] mb-1">Energy</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-base sm:text-lg font-black text-white leading-none">450.00</span>
                            <span className="text-[9px] font-bold text-accent-gold uppercase tracking-wider">NRJ</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.15em] mb-1">Luxe Balance</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-base sm:text-lg font-black text-white leading-none">1,250.00</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">LX</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                {/* Status Pill */}
                <div className="hidden sm:flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-accent-gold/30 cursor-pointer transition-all duration-300 group shadow-lg">
                        <span className={`w-2 h-2 rounded-full transition-shadow duration-300 ${address ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-accent-gold shadow-[0_0_10px_#D4AF37]'}`}></span>
                        <span className="text-[10px] font-black text-accent-gold uppercase tracking-[0.15em]">
                            {address ? formatAddress(address) : 'Disconnected'}
                        </span>
                    </div>
                    {address && (
                        <div className="flex items-center gap-3 px-2">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Test Balance:</span>
                                <span className="text-[10px] font-black text-white italic">
                                    {isBalanceLoading ? '...' : `$${walletData?.ethBalance || '0.00'}`}
                                </span>
                            </div>
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-md overflow-hidden">
                                <input
                                    type="number"
                                    value={faucetAmount}
                                    onChange={(e) => setFaucetAmount(e.target.value)}
                                    className="w-12 bg-transparent text-[9px] font-black text-white px-2 py-0.5 outline-none border-r border-white/10"
                                    placeholder="Amount"
                                />
                                <button
                                    onClick={async () => {
                                        try {
                                            const { default: axios } = await import('../services/axios');
                                            await axios.post(API_ENDPOINTS.WALLET.FAUCET, { amount: parseFloat(faucetAmount) });
                                            queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
                                        } catch (e) {
                                            console.error('Faucet error', e);
                                        }
                                    }}
                                    className="px-2 py-0.5 text-[8px] font-black text-accent-gold hover:bg-white/5 transition-all uppercase"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <button className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all relative">
                    < Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent-gold rounded-full border border-background-dark"></span>
                </button>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all group"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5 p-1 shadow-inner">
                        <img
                            className="w-full h-full object-cover rounded-lg"
                            alt="User profile"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFKaOGEqx67axoW6iLXhSdvdyvxDb170U5VryWHnElt8B3QKCoot9mI3RUcatVZuM5rltR8cmExLDnrl_qsNwJBKSWJ6IESqKE7jtV5trks0gBD0ikRyggNLDZju4NL_dHT_qL4IKZl2YkK5nhwjM81QMVMHF5cs_4VGOBa2KfROplMXKA7hoh0uPc5xu1YaEdSa9r7MrlepExGa4G1dGmzZ3j6X_251LoiCgf46PRS98ilHdr2GxmH1QaHqcYhB-sHIbLdRdoAjrj"
                        />
                    </div>
                    <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
                </div>
            </div>
        </header>
    );
};

export default Header;
