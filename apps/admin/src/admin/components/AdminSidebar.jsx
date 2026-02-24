import React from 'react';

const AdminSidebar = ({ activeItem, onItemClick }) => {
    return (
        <aside className="w-64 flex-shrink-0 bg-background-dark border-r border-white/5 flex flex-col h-full z-20">
            <div className="p-8 flex items-center gap-4">
                <div className="size-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/20 flex-shrink-0">
                    <span className="material-symbols-outlined text-black font-bold text-2xl">account_balance_wallet</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-xl font-bold leading-tight">Web3 Admin</h1>
                    <p className="text-yellow-400 text-[9px] uppercase tracking-[0.2em] font-black">Institutional Suite</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                <div
                    onClick={() => onItemClick('Dashboard')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group cursor-pointer ${activeItem === 'Dashboard' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-sm font-bold tracking-wide">Dashboard</span>
                </div>
                {[
                    { name: 'User Management', icon: 'person' },
                    { name: 'Treasury', icon: 'account_balance' },
                    { name: 'Slot Control', icon: 'view_cozy' },
                    { name: 'NFT Management', icon: 'token' },
                    { name: 'Tokenomics', icon: 'currency_bitcoin' },
                    { name: 'Staking Config', icon: 'layers' },
                    { name: 'System Logs', icon: 'terminal' },
                    { name: 'Settings', icon: 'settings' },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => onItemClick(item.name)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group cursor-pointer ${activeItem === item.name ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        <span className="text-sm font-bold tracking-wide">{item.name}</span>
                    </div>
                ))}
            </nav>

            <div className="p-6">
                <div className="flex items-center gap-3 bg-card-dark p-4 rounded-2xl border border-white/5">
                    <div className="size-9 rounded-full bg-cover bg-center ring-2 ring-white/5" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgaUoWB4LvjL5diobtPh_FfCccwb7wUuyQM9MN_WSYa3BuHPjLSOHkbefVGd8rsYDKrUS6Q5mQuwkX0gUjdYZN4sJ7aflQc4d4NIilvvZDToINodsLFhAjKIBCcVGUP8JqoVc66m7ojrSQtFnZrzssqvmvTFVKIU_6xKmQaYzaBI0g0hEH6Q4FfDUOXMUBVMX4LUVkZvUD4Ef5rCDizJAkuj0TDA6wiQYPwWu-k0DneP_GtMDrfNJvzQJWLTI3vSSlzrCo-GTl6PIW")' }}></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">0x71C...4E2a</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Super Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
