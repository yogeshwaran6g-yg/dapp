import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DataTable from './common/DataTable';

const StakeHistory = () => {
    const { token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 10;

    const [searchQuery, setSearchQuery] = useState(search);

    const { data, isLoading } = useQuery({
        queryKey: ['adminStakeHistory', page, search],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: search
            });
            const response = await fetch(`/api/v1/admin/staking/history?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch stake history');
            const resData = await response.json();
            return resData.data;
        },
        enabled: !!token
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== search) {
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

    const handlePageChange = (newPage) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set('page', newPage.toString());
            return params;
        });
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        import('react-hot-toast').then(({ toast }) => {
            toast.success('Address copied!');
        });
    };

    const columns = [
        {
            header: "User Wallet",
            render: (row) => (
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
            )
        },
        {
            header: "Amount",
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <span className="text-white font-black text-base">{Number(row.amount).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">USDT</span>
                </div>
            )
        },
        {
            header: "Action Type",
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${row.type === 'STAKE' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                    'bg-blue-400/10 text-blue-400 border-blue-400/20'
                    }`}>
                    {row.type}
                </span>
            )
        },
        {
            header: "Transaction Date",
            render: (row) => (
                <>
                    <p className="text-slate-200 font-bold text-sm">
                        {new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-tighter">
                        {new Date(row.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </>
            )
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 glass-scrollbar">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl lg:text-4xl font-black text-white tracking-tight">Stake History</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs">Monitor protocol staking activities and audit trail</p>
            </div>

            {/* History Table Container */}
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

                <DataTable
                    columns={columns}
                    data={historyData?.history}
                    isLoading={isLoading}
                    pagination={{
                        page,
                        totalPages: Math.ceil((historyData?.total || 0) / limit) || 1,
                        totalCount: historyData?.total,
                        onPageChange: handlePageChange
                    }}
                />
            </div>
        </div>
    );
};

export default StakeHistory;
