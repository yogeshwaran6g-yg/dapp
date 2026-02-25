import React from 'react';

const AdminHeader = ({ onMenuClick }) => {
    return (
        <header className="h-16 flex items-center justify-between px-4 lg:px-10 bg-background-dark/80 backdrop-blur-md border-b border-white/5 z-10">
            <div className="flex items-center gap-4 lg:gap-8 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">menu</span>
                </button>
                <div className="relative w-full max-w-xs lg:max-w-lg hidden sm:block">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                    <input className="w-full bg-card-dark border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400/50 text-white placeholder:text-slate-500 transition-all font-medium" placeholder="Search wallet, txn hash, or proposal..." type="text" />
                </div>
                <div className="flex items-center gap-4 lg:gap-6">
                    <div className="flex items-center gap-2">
                        <span className="size-1.5 lg:size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)] animate-pulse"></span>
                        <span className="text-[9px] lg:text-[11px] font-bold text-slate-300 uppercase tracking-widest hidden xs:block">Net: <span className="text-white">Main</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="size-1.5 lg:size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></span>
                        <span className="text-[9px] lg:text-[11px] font-bold text-slate-300 uppercase tracking-widest hidden xs:block">Safe: <span className="text-white">Yes</span></span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 lg:gap-6">
                <button className="flex items-center gap-2 lg:gap-2.5 bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 lg:px-6 lg:py-2.5 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-bold transition-all hover:scale-[1.02] shadow-xl shadow-yellow-400/10 uppercase tracking-widest border border-yellow-500/20">
                    <span className="material-symbols-outlined text-base lg:text-lg">account_balance_wallet</span>
                    <span className="hidden sm:inline">Connect</span>
                </button>
                <div className="relative p-2 lg:p-2.5 bg-card-dark rounded-lg lg:rounded-xl border border-white/5 cursor-pointer">
                    <span className="material-symbols-outlined text-slate-400 text-xl lg:text-2xl">notifications</span>
                    <span className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 size-1.5 lg:size-2 bg-yellow-400 rounded-full border-2 border-background-dark"></span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
