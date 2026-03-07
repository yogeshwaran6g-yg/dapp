import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TransactionHistory = () => {
    const { token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;

    const { data: logsData, isLoading } = useQuery({
        queryKey: ['treasuryLogs', page],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });
            const response = await fetch(`/api/v1/admin/treasury/logs?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch treasury logs');
            const data = await response.json();
            return data.data;
        },
        enabled: !!token
    });

    const logs = logsData?.logs || [];
    const totalLogs = logsData?.total || 0;
    const totalPages = Math.ceil(totalLogs / limit);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.set('page', newPage.toString());
                return params;
            });
        }
    };

    return (
        <div className="bg-card-dark border border-white/5 rounded-xl overflow-hidden shadow-2xl mt-4 lg:mt-8">
            <div className="p-3 lg:p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 lg:gap-4">
                    <h3 className="text-sm lg:text-lg font-bold text-white tracking-tight">Logs</h3>
                    <div className="flex gap-0.5 lg:gap-1 bg-background-dark p-0.5 lg:p-1 rounded-lg border border-white/5">
                        <button className="px-2 lg:px-3 py-1 lg:py-1.5 text-[8px] lg:text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white rounded shadow-sm">All</button>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-background-dark/50 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <tr>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4">Type</th>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4">Asset</th>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4">Amount</th>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4">Hash</th>
                            <th className="px-4 lg:px-6 py-2.5 lg:py-4 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr><td colSpan="5" className="py-20 text-center text-slate-500 font-black uppercase tracking-widest">Loading logs...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan="5" className="py-20 text-center text-slate-500 font-black uppercase tracking-widest">No transaction logs</td></tr>
                        ) : (
                            logs.map((log, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-4 lg:px-6 py-2 lg:py-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`size-5 lg:size-6 rounded-full flex items-center justify-center ${log.type === 'INFLOW' ? 'bg-green-500/10 text-green-500' :
                                                log.type === 'PAYOUT' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                <span className="material-symbols-outlined text-[10px] lg:text-xs">
                                                    {log.type === 'INFLOW' ? 'south_west' : 'north_east'}
                                                </span>
                                            </div>
                                            <span className="text-[9px] lg:text-[10px] font-bold text-white">{log.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3">
                                        <div className="flex items-center gap-2 text-slate-200">
                                            <div className="size-4 lg:size-5 rounded-full bg-background-dark flex items-center justify-center overflow-hidden border border-white/5 font-bold text-[8px]">
                                                {log.asset === 'ETH' ? 'Ξ' : '$'}
                                            </div>
                                            <span className="text-[9px] lg:text-[10px] font-medium">{log.asset}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3">
                                        <span className={`text-[9px] lg:text-[10px] font-bold tracking-tight ${log.type === 'INFLOW' ? 'text-green-400' : 'text-red-400'}`}>
                                            {log.type === 'INFLOW' ? '+' : '-'}{parseFloat(log.amount).toLocaleString()}
                                        </span>
                                        <p className="text-[7px] lg:text-[8px] text-slate-500 font-bold">${parseFloat(log.usd_value).toLocaleString()}</p>
                                    </td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] lg:text-[10px] font-mono text-slate-400 font-bold">
                                                {log.tx_hash.slice(0, 6)}...{log.tx_hash.slice(-4)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-2 lg:py-3 text-right">
                                        <p className="text-[9px] lg:text-[10px] font-medium text-white">
                                            {new Date(log.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-[7px] lg:text-[8px] text-slate-500 font-bold">
                                            {new Date(log.created_at).toLocaleTimeString()}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="p-3 lg:p-4 bg-background-dark/30 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Showing {logs.length} of {totalLogs} logs
                </span>
                <div className="flex gap-1 lg:gap-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        className="size-7 lg:size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30"
                        disabled={page <= 1}
                    >
                        <span className="material-symbols-outlined text-base lg:text-lg">chevron_left</span>
                    </button>
                    <div className="flex items-center gap-0.5 lg:gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`size-7 lg:size-8 rounded text-[10px] lg:text-xs font-bold transition-all ${page === i + 1 ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        className="size-7 lg:size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                        disabled={page >= totalPages}
                    >
                        <span className="material-symbols-outlined text-base lg:text-lg">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
