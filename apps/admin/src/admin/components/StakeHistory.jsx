import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const StakeHistory = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1');
    const urlSearch = searchParams.get('search') || '';
    const limit = 10;

    const [searchQuery, setSearchQuery] = useState(urlSearch);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== urlSearch) {
                setSearchParams(prev => {
                    const params = new URLSearchParams(prev);
                    if (searchQuery) params.set('search', searchQuery);
                    else params.delete('search');
                    params.set('page', '1');
                    return params;
                });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, urlSearch, setSearchParams]);

    const { data: historyData, isLoading } = useQuery({
        queryKey: ['stakingHistory', page, urlSearch],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: urlSearch
            });
            const response = await fetch(`/api/v1/admin/staking/history?${params}`);
            if (!response.ok) throw new Error('Failed to fetch history');
            const data = await response.json();
            return data.data;
        }
    });

    const handlePageChange = (newPage) => {
        const totalPages = Math.ceil((historyData?.total || 0) / limit) || 1;
        if (newPage >= 1 && newPage <= totalPages) {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.set('page', newPage.toString());
                return params;
            });
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Address copied!');
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 glass-scrollbar">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl lg:text-4xl font-black text-white tracking-tight">Stake History</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs">Monitor protocol staking activities and audit trail</p>
            </div>

            {/* History Table */}
            <div className="bg-card-dark rounded-3xl border border-white/5 overflow-hidden flex flex-col">
                <div className="p-6 lg:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-blue-400/10 rounded-2xl flex items-center justify-center border border-blue-400/20">
                            <span className="material-symbols-outlined text-blue-400 text-2xl">history</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">Audit Trail</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Real-time record of all user stakes</p>
                        </div>
                    </div>
                    <div className="relative group min-w-[320px]">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-lg group-focus-within:text-yellow-400 transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search by wallet address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white font-bold focus:outline-none focus:border-yellow-400/50 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] text-[10px] uppercase text-slate-500 font-black tracking-widest">
                            <tr>
                                <th className="px-8 py-6">User Wallet</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6">Action Type</th>
                                <th className="px-8 py-6">Transaction Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="inline-flex items-center gap-3 text-slate-500 font-black uppercase tracking-widest">
                                            <div className="size-5 border-2 border-yellow-400 border-t-transparent animate-spin rounded-full"></div>
                                            Syncing protocol records...
                                        </div>
                                    </td>
                                </tr>
                            ) : historyData?.history?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center text-slate-500 font-black uppercase tracking-widest">
                                        No staking activities found
                                    </td>
                                </tr>
                            ) : (
                                historyData?.history?.map((row) => (
                                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-yellow-400 font-bold text-sm tracking-wide">
                                                    {row.wallet_address.slice(0, 10)}...{row.wallet_address.slice(-8)}
                                                </span>
                                                <button
                                                    onClick={() => handleCopy(row.wallet_address)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-xs text-slate-400">content_copy</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-white font-black text-base">{Number(row.amount).toLocaleString()}</span>
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">USDT</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${row.type === 'STAKE' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                                                'bg-blue-400/10 text-blue-400 border-blue-400/20'
                                                }`}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-slate-200 font-bold text-sm">
                                                {new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-tighter">
                                                {new Date(row.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        Total {historyData?.total || 0} activities recorded
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="h-12 px-5 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 transition-all font-bold group"
                        >
                            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">chevron_left</span>
                            <span className="ml-2 text-[10px] uppercase tracking-widest">Prev</span>
                        </button>
                        <div className="h-12 px-6 flex items-center bg-white/5 border border-white/5 rounded-2xl font-black text-sm text-yellow-400">
                            {page} <span className="mx-2 text-slate-600">/</span> {Math.ceil((historyData?.total || 0) / limit) || 1}
                        </div>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= Math.ceil((historyData?.total || 0) / limit)}
                            className="h-12 px-5 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 transition-all font-bold group"
                        >
                            <span className="mr-2 text-[10px] uppercase tracking-widest">Next</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StakeHistory;
