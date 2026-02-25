import React from 'react';

const AdminSidebar = ({ activeItem, onItemClick, isOpen, onClose }) => {
    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`w-64 flex-shrink-0 bg-background-dark border-r border-white/5 fixed lg:static h-full z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full bg-background-dark">
                    <div className="p-2 lg:p-3 flex items-center justify-between border-b border-white/5 mb-1">
                        <div className="flex items-center gap-2">
                            <div className="size-7 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/20 flex-shrink-0">
                                <span className="material-symbols-outlined text-black font-bold text-lg">account_balance_wallet</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-white text-xs lg:text-sm font-bold leading-tight">Admin</h1>
                                <p className="text-yellow-400 text-[6px] lg:text-[7px] uppercase tracking-[0.2em] font-black italic">Institutional</p>
                            </div>
                        </div>
                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="lg:hidden text-slate-500 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-1 lg:py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
                        <div
                            onClick={() => {
                                onItemClick('Dashboard');
                                if (window.innerWidth < 1024) onClose();
                            }}
                            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all group cursor-pointer ${activeItem === 'Dashboard' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-lg lg:text-xl">dashboard</span>
                            <span className="text-[11px] lg:text-sm font-bold tracking-wide">Dashboard</span>
                        </div>
                        {/* Other Items */}
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
                                onClick={() => {
                                    onItemClick(item.name);
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all group cursor-pointer ${activeItem === item.name ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-lg lg:text-xl">{item.icon}</span>
                                <span className="text-[11px] lg:text-sm font-bold tracking-wide">{item.name}</span>
                            </div>
                        ))}
                    </nav>

                    <div className="p-2 lg:p-3">
                        <div className="flex items-center gap-3 bg-card-dark p-2 lg:p-3 rounded-xl border border-white/5">
                            <div className="size-7 lg:size-8 rounded-full bg-cover bg-center ring-2 ring-white/5" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgaUoWB4LvjL5diobtPh_FfCccwb7wUuyQM9MN_WSYa3BuHPjLSOHkbefVGd8rsYDKrUS6Q5mQuwkX0gUjdYZN4sJ7aflQc4d4NIilvvZDToINodsLFhAjKIBCcVGUP8JqoVc66m7ojrSQtFnZrzssqvmvTFVKIU_6xKmQaYzaBI0g0hEH6Q4FfDUOXMUBVMX4LUVkZvUD4Ef5rCDizJAkuj0TDA6wiQYPwWu-k0DneP_GtMDrfNJvzQJWLTI3vSSlzrCo-GTl6PIW")' }}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] lg:text-xs font-bold text-white truncate">0x71C...4E2a</p>
                                <p className="text-[7px] lg:text-[10px] text-slate-500 uppercase font-black tracking-widest">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
