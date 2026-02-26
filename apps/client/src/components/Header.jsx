import React, { useState, useEffect } from 'react';

const Header = ({ onMenuClick }) => {
    const [address, setAddress] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setAddress(user.wallet_address);
        }
    }, []);

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
            <div className="flex items-center gap-3 sm:gap-6">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="flex flex-col hidden sm:flex">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Status</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-accent-gold-light bg-accent-gold/10 px-2 py-0.5 rounded border border-accent-gold/20">
                            {address ? formatAddress(address) : 'Disconnected'}
                        </span>
                    </div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                <div className="flex gap-3 sm:gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight hidden xs:block">Energy</span>
                        <span className="text-xs sm:text-sm font-bold text-white">450.00 <span className="xs:hidden text-[8px] text-gray-500">NRJ</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight hidden xs:block">LUXE Token</span>
                        <span className="text-xs sm:text-sm font-bold text-white">1,250.00 <span className="xs:hidden text-[8px] text-gray-500">LX</span></span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent-gold rounded-full"></span>
                </button>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 border border-white/10 overflow-hidden">
                    <img
                        className="w-full h-full object-cover"
                        alt="User profile"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFKaOGEqx67axoW6iLXhSdvdyvxDb170U5VryWHnElt8B3QKCoot9mI3RUcatVZuM5rltR8cmExLDnrl_qsNwJBKSWJ6IESqKE7jtV5trks0gBD0ikRyggNLDZju4NL_dHT_qL4IKZl2YkK5nhwjM81QMVMHF5cs_4VGOBa2KfROplMXKA7hoh0uPc5xu1YaEdSa9r7MrlepExGa4G1dGmzZ3j6X_251LoiCgf46PRS98ilHdr2GxmH1QaHqcYhB-sHIbLdRdoAjrj"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
