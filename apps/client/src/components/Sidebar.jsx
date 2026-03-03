import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { icon: 'grid_view', label: 'Dashboard', path: '/dashboard' },
        { icon: 'group', label: 'Referral', path: '/referral' },
        { icon: 'electric_bolt', label: 'Slot Activation', path: '/slot-activation' },
        { icon: 'token', label: 'NFT Royalty', path: '/nft-royalty' },
        { icon: 'account_balance_wallet', label: 'Token Wallet', path: '/wallet' },
        { icon: 'swap_horiz', label: 'Swap', path: '/swap' },
        { icon: 'lock', label: 'Staking', path: '/staking' },
        { icon: 'north_east', label: 'Withdraw', path: '/withdraw' },
        { icon: 'person', label: 'Profile', path: '/profile' },
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

            <aside className={`w-64 shrink-0 border-r border-white/5 bg-sidebar-bg fixed h-full z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex h-full flex-col p-4">
                    <div className="flex items-center justify-between px-2 py-2 lg:py-3 mb-2 lg:mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full flex items-center justify-center action-gradient-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                                <span className="material-symbols-outlined text-primary font-bold text-base lg:text-lg">diamond</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-white text-[10px] lg:text-sm font-bold tracking-tight">LUXE ECOSYSTEM</h1>
                                <p className="text-accent-gold text-[7px] lg:text-[9px] font-bold uppercase tracking-[0.2em]">Premium Access</p>
                            </div>
                        </div>
                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="lg:hidden text-gray-400 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item, idx) => (
                            <NavLink
                                key={idx}
                                to={item.path}
                                end={item.path === '/'}
                                onClick={() => {
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all group cursor-pointer no-underline ${isActive
                                        ? 'active-nav-bg border-l-2 border-accent-gold'
                                        : 'hover:bg-white/5'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`material-symbols-outlined text-xl transition-colors ${isActive ? 'text-accent-gold' : 'text-gray-500 group-hover:text-accent-gold'
                                            }`}>
                                            {item.icon}
                                        </span>
                                        <p className={`text-xs lg:text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                            }`}>
                                            {item.label}
                                        </p>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto p-3 glass-panel rounded-xl border border-accent-gold/10">
                        <div className="flex flex-col gap-1.5">
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Network Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <p className="text-[10px] font-medium text-white">Mainnet Connected</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
