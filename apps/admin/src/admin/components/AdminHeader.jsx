import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminHeader = ({ onMenuClick }) => {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchValue.trim()) {
            navigate(`/users/${searchValue.trim()}`);
            setSearchValue(''); // Clear after searching
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 flex items-center justify-between px-4 lg:px-10 bg-background-dark/80 backdrop-blur-md border-b border-white/5 z-10">
            <div className="flex items-center gap-4 lg:gap-8 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">menu</span>
                </button>
                <div className="relative w-full max-w-xs lg:max-w-lg hidden sm:block">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                    <input
                        className="w-full bg-card-dark border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400/50 text-white placeholder:text-slate-500 transition-all font-medium"
                        placeholder="Search wallet, txn hash, or proposal..."
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
                {/* Admin Profile & Logout */}
                <div className="items-center gap-3 pr-3 border-r border-white/5 hidden xs:flex">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-white uppercase tracking-tight">{user?.username || 'Admin'}</p>
                        <p className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest opacity-70">Super Admin</p>
                    </div>
                    <div className="size-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                        <span className="material-symbols-outlined text-lg">shield_person</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                    <div className="relative p-2 lg:p-2.5 bg-card-dark rounded-lg lg:rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-slate-400 text-xl">notifications</span>
                        <span className="absolute top-1.5 right-1.5 size-1.5 bg-yellow-400 rounded-full border-2 border-background-dark"></span>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="p-2 lg:p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg lg:rounded-xl border border-red-500/10 transition-all group flex items-center gap-2"
                        title="Logout"
                    >
                        <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">logout</span>
                        <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
