import React from 'react';
import { useReferralNetwork } from '../../hooks/useReferral';

const RecentActivity = () => {
    const { data: network, isLoading } = useReferralNetwork();

    const formatAddress = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden mt-4 lg:mt-6">
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm sm:text-lg font-bold">Network Activity</h3>
                <button className="text-[9px] sm:text-xs text-silver/60 hover:text-gold-start transition-colors font-bold uppercase tracking-widest flex items-center gap-2 shrink-0">
                    VIEW ALL
                    <span className="material-symbols-outlined text-[10px] sm:text-sm">arrow_forward</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="text-left text-[10px] text-silver/40 uppercase tracking-[0.2em] bg-white/2">
                            <th className="px-4 sm:px-8 py-4 font-black">Wallet Address</th>
                            <th className="px-4 sm:px-8 py-4 font-black">Tier Level</th>
                            <th className="px-4 sm:px-8 py-4 font-black">Status</th>
                            <th className="px-4 sm:px-8 py-4 font-black">Date Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="px-8 py-10 text-center text-silver/40 font-bold uppercase tracking-widest text-[10px]">Loading Network Data...</td>
                            </tr>
                        ) : network?.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-8 py-10 text-center text-silver/40 font-bold uppercase tracking-widest text-[10px]">No referrals yet</td>
                            </tr>
                        ) : (
                            network?.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/3 transition-colors group">
                                    <td className="px-4 sm:px-8 py-4 lg:py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-linear-to-br from-gold-start/20 to-transparent shrink-0 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-gold-start text-xs">person</span>
                                            </div>
                                            <span className="text-xs sm:text-sm font-mono text-silver group-hover:text-white transition-colors">
                                                {formatAddress(row.wallet_address)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-8 py-4 lg:py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold bg-gold-start/10 text-gold-start border border-gold-start/20`}>
                                            LEVEL {row.level}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-8 py-4 lg:py-5">
                                        <span className="flex items-center gap-2 text-[10px] font-bold text-green-400">
                                            <span className="size-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                            ACTIVE
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-8 py-4 lg:py-5 text-[10px] sm:text-xs text-silver/60 font-medium">
                                        {formatDate(row.created_at)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivity;
