import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

const UserDetail = () => {
    const { token } = useAuth();
    const { userId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['adminUserDetail', userId],
        queryFn: async () => {
            const response = await fetch(`/api/v1/admin/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user details');
            const data = await response.json();
            return data.data;
        },
        enabled: !!token && !!userId
    });

    const handleBlockUser = async (currentlyBlocked) => {
        try {
            const response = await fetch(`/api/v1/admin/users/${userId}/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ blocked: !currentlyBlocked })
            });

            if (response.ok) {
                queryClient.invalidateQueries({ queryKey: ['adminUserDetail', userId] });
                queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
                import('react-hot-toast').then(({ toast }) => {
                    toast.success(currentlyBlocked ? 'User unblocked' : 'User blocked');
                });
            } else {
                import('react-hot-toast').then(({ toast }) => {
                    toast.error('Failed to update user status');
                });
            }
        } catch (err) {
            console.error(err);
            import('react-hot-toast').then(({ toast }) => {
                toast.error('Network error, please try again');
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-dark">
                <div className="size-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const user = data?.user || {};

    return (
        <div className="flex-1 overflow-y-auto bg-background-dark p-4 lg:p-8">
            <div className="w-full space-y-8">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors font-bold uppercase tracking-widest text-xs"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Users
                </button>

                {/* Header & Block Button Row */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between max-w-4xl">
                    <div>
                        <h1 className="text-2xl lg:text-4xl font-black text-white tracking-tight">User Details</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs">
                             Protocol Identity: {userId}
                        </p>
                    </div>
                    <button
                        onClick={() => handleBlockUser(user.is_blocked)}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border flex items-center gap-2 w-fit ${
                            user.is_blocked 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                            : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg">
                            {user.is_blocked ? 'check_circle' : 'block'}
                        </span>
                        {user.is_blocked ? 'Unblock User' : 'Block User'}
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Identity Card */}
                    <div className="glass-card rounded-3xl p-6 lg:p-7 border border-white/5 w-full max-w-md shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-7xl">fingerprint</span>
                        </div>
                        
                        <div className="flex flex-col gap-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20 flex-shrink-0">
                                    <span className="material-symbols-outlined text-yellow-400 text-2xl">person</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Username</p>
                                    <p className="text-base text-white font-black tracking-tight">{user.username || 'Anon User'}</p>
                                </div>
                            </div>

                            <div className="space-y-3.5 pt-2">
                                <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5">
                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest whitespace-nowrap">User ID</span>
                                    <span className="text-[11px] text-gray-300 font-mono font-bold">{userId}</span>
                                </div>
                                <div className="flex flex-col gap-2 py-2 border-b border-white/5">
                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Wallet Address</span>
                                    <span className="text-[10px] text-yellow-400/80 font-mono break-all bg-black/30 p-2 rounded-lg border border-white/5 leading-relaxed">
                                        {user.wallet_address}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5">
                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Status</span>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${user.is_blocked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                        {user.is_blocked ? 'Blocked' : 'Active'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5">
                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Joined</span>
                                    <span className="text-[10px] text-gray-300 font-bold">
                                        {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-4 gap-2 pt-6 mt-4">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-center">
                                <p className="text-[7px] text-gray-500 font-black uppercase mb-0.5">Slot</p>
                                <p className="text-sm font-black text-yellow-400 leading-none">{user.level || 1}</p>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-center">
                                <p className="text-[7px] text-gray-500 font-black uppercase mb-0.5">XP</p>
                                <p className="text-sm font-black text-white leading-none">{(user.total_xp || 0).toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-center">
                                <p className="text-[7px] text-gray-500 font-black uppercase mb-0.5">Refs</p>
                                <p className="text-sm font-black text-white leading-none">{user.total_referrals || 0}</p>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-center">
                                <p className="text-[7px] text-gray-500 font-black uppercase mb-0.5">Active</p>
                                <p className={`text-sm font-black leading-none ${user.is_active ? 'text-green-400' : 'text-gray-600'}`}>{user.is_active ? 'YES' : 'NO'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Side Info (Referral) */}
                    <div className="w-full lg:w-72 space-y-4">
                        <div className="glass-card rounded-2xl p-5 border border-white/5 shadow-xl">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Referrer Details</p>
                            <div className="space-y-4">
                                {user.referred_by_address ? (
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-indigo-400 font-bold uppercase">Invited By</p>
                                        <div className="bg-black/40 p-3 rounded-lg border border-white/10 font-mono text-[10px] break-all leading-relaxed text-gray-400">
                                            {user.referred_by_address}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-gray-600 italic text-xs">
                                        <span className="material-symbols-outlined">stars</span>
                                        Genesis User
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
