import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DataTable from './common/DataTable';

const SwapHistory = () => {
    const { token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['adminSwapHistory', page, search],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: search
            });
            const response = await fetch(`/api/v1/admin/swaps?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch swap history');
            const resData = await response.json();
            return resData.data;
        },
        enabled: !!token
    });

    const columns = [
        {
            header: 'User',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-white font-bold">{row.username || 'Anonymous'}</span>
                    <span className="text-[10px] text-slate-500 font-mono tracking-tighter">
                        {row.wallet_address.slice(0, 6)}...{row.wallet_address.slice(-4)}
                    </span>
                </div>
            )
        },
        {
            header: 'Pair',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-black text-yellow-400">{row.from_asset}</span>
                    <span className="material-symbols-outlined text-slate-600 text-sm">trending_flat</span>
                    <span className="font-black text-blue-400">{row.to_asset}</span>
                </div>
            )
        },
        {
            header: 'Amounts',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-white font-bold">{parseFloat(row.from_amount).toLocaleString()} {row.from_asset}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{parseFloat(row.to_amount).toLocaleString()} {row.to_asset}</span>
                </div>
            )
        },
        {
            header: 'Hash',
            render: (row) => (
                <span className="font-mono text-slate-400 text-xs">
                    {row.tx_hash ? `${row.tx_hash.slice(0, 10)}...` : 'N/A'}
                </span>
            )
        },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    row.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    row.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Time',
            render: (row) => (
                <div className="flex flex-col text-right">
                    <span className="text-white text-xs">{new Date(row.created_at).toLocaleDateString()}</span>
                    <span className="text-[9px] text-slate-500 font-bold">{new Date(row.created_at).toLocaleTimeString()}</span>
                </div>
            )
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-white tracking-tight">Swap History</h2>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Protocol exchange records</p>
            </div>

            <DataTable
                columns={columns}
                data={data?.history || []}
                isLoading={isLoading}
                emptyMessage="No swaps found"
                pagination={{
                    page: data?.page || 1,
                    totalPages: Math.ceil((data?.total || 0) / limit),
                    onPageChange: (newPage) => {
                        setSearchParams(prev => {
                            const params = new URLSearchParams(prev);
                            params.set('page', newPage.toString());
                            return params;
                        });
                    }
                }}
            />
        </div>
    );
};

export default SwapHistory;
