import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/' },
        { name: 'User Management', icon: 'person', path: '/users' },
        { name: 'Treasury', icon: 'account_balance', path: '/treasury' },
        { name: 'Slot Control', icon: 'view_cozy', path: '/slots' },
        { name: 'NFT Management', icon: 'token', path: '/nft' },
        { name: 'Tokenomics', icon: 'currency_bitcoin', path: '/tokenomics' },
        { name: 'Stake History', icon: 'history', path: '/staking' },
        { name: 'Notifications', icon: 'notifications', path: '/notifications' },
        { name: 'Support Tickets', icon: 'confirmation_number', path: '/tickets' },
        { name: 'Swap History', icon: 'swap_horiz', path: '/swaps' },
        { name: 'System Logs', icon: 'terminal', path: '/logs' },
        { name: 'Settings', icon: 'settings', path: '/settings' },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`w-64 flex-shrink-0 bg-background-dark border-r border-white/5 fixed h-full z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                        {navItems.map((item, idx) => (
                            <NavLink
                                key={idx}
                                to={item.path}
                                end={item.path === '/'}
                                onClick={() => {
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={({ isActive }) =>
                                    `flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all group cursor-pointer no-underline ${isActive
                                        ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined text-lg lg:text-xl">{item.icon}</span>
                                <span className="text-[11px] lg:text-sm font-bold tracking-wide">{item.name}</span>
                            </NavLink>
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
