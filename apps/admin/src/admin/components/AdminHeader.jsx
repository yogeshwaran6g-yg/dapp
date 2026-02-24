import React from 'react';

const AdminHeader = () => {
    return (
        <header className="h-24 flex items-center justify-between px-10 bg-background-dark/80 backdrop-blur-md border-b border-white/5 z-10">
            <div className="flex items-center gap-8 flex-1">
                <div className="relative w-full max-w-lg">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                    <input className="w-full bg-card-dark border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400/50 text-white placeholder:text-slate-500 transition-all font-medium" placeholder="Search wallet, txn hash, or proposal..." type="text" />
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <span className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)] animate-pulse"></span>
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Network: <span className="text-white">Mainnet</span></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <span className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></span>
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Contracts: <span className="text-white">Healthy</span></span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2.5 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] shadow-xl shadow-yellow-400/10 uppercase tracking-widest border border-yellow-500/20">
                    <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                    Connect Wallet
                </button>
                <div className="relative p-2.5 bg-card-dark rounded-xl border border-white/5 cursor-pointer">
                    <span className="material-symbols-outlined text-slate-400">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-yellow-400 rounded-full border-2 border-background-dark"></span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
