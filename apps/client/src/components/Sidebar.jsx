import React, { useState } from 'react';

const Sidebar = ({ activeItem, onItemClick }) => {
    const navItems = [
        { icon: 'grid_view', label: 'Dashboard' },
        { icon: 'group', label: 'Referral' },
        { icon: 'electric_bolt', label: 'Slot Activation' },
        { icon: 'token', label: 'NFT Royalty' },
        { icon: 'account_balance_wallet', label: 'Token Wallet' },
        { icon: 'swap_horiz', label: 'Swap' },
        { icon: 'lock', label: 'Staking' },
        { icon: 'download', label: 'Withdraw' },
        { icon: 'person', label: 'Profile' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-[#0b0b0f] fixed h-full z-50">
            <div className="flex h-full flex-col p-4">
                <div className="flex items-center gap-3 px-2 py-6 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center action-gradient-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                        <span className="material-symbols-outlined text-primary font-bold">diamond</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-base font-bold tracking-tight">LUXE ECOSYSTEM</h1>
                        <p className="text-accent-gold text-[10px] font-bold uppercase tracking-[0.2em]">Premium Access</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => onItemClick(item.label)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group cursor-pointer ${activeItem === item.label
                                ? 'active-nav-bg border-l-2 border-accent-gold'
                                : 'hover:bg-white/5'
                                }`}
                        >
                            <span className={`material-symbols-outlined transition-colors ${activeItem === item.label ? 'text-accent-gold' : 'text-gray-500 group-hover:text-accent-gold'
                                }`}>
                                {item.icon}
                            </span>
                            <p className={`text-sm font-medium ${activeItem === item.label ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                }`}>
                                {item.label}
                            </p>
                        </div>
                    ))}
                </nav>

                <div className="mt-auto p-4 glass-panel rounded-xl border border-accent-gold/10">
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Network</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="text-xs font-medium text-white">Mainnet Connected</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
