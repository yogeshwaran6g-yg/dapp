import React, { useState } from 'react';

const Header = () => {
    const [connected, setConnected] = useState(false);

    return (
        <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Status</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-accent-gold-light bg-accent-gold/10 px-2 py-0.5 rounded border border-accent-gold/20">
                            {connected ? '0x71C...4e2' : 'Disconnected'}
                        </span>
                    </div>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Energy</span>
                        <span className="text-sm font-bold text-white">450.00</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">LUXE Token</span>
                        <span className="text-sm font-bold text-white">1,250.00</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent-gold rounded-full"></span>
                </button>
                <button
                    onClick={() => setConnected(!connected)}
                    className="h-10 px-6 rounded-lg action-gradient-gold text-primary font-bold text-sm tracking-wide shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform"
                >
                    {connected ? 'Disconnect' : 'Connect Wallet'}
                </button>
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 overflow-hidden">
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
