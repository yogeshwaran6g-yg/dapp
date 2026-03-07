import React, { useState } from 'react';
import PageHeading from './PageHeading';
import { useWalletTransactions } from '../hooks/useWallet';
import { walletApiService } from '../services/walletApiService';
import { useWallet } from '../context/WalletContext';

const transactions = [
    {
        type: 'Deposit',
        icon: 'call_received',
        iconColor: 'text-green-400',
        iconBg: 'bg-green-400/10',
        amount: '+500.00 NRG',
        date: 'Oct 24, 2023 • 14:20',
        status: 'Completed',
        hash: '0x8f2a...3e19',
    },
    {
        type: 'Stake',
        icon: 'lock',
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-400/10',
        amount: '-1,200.00 OWN',
        date: 'Oct 22, 2023 • 09:15',
        status: 'Completed',
        hash: '0x4b7c...9a2e',
    },
    {
        type: 'Withdraw',
        icon: 'call_made',
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-400/10',
        amount: '-2,500.00 NRG',
        date: 'Oct 21, 2023 • 18:44',
        status: 'Pending',
        hash: '0x1a2b...4c5d',
    },
    {
        type: 'Transfer',
        icon: 'sync',
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-400/10',
        amount: '-50.00 OWN',
        date: 'Oct 20, 2023 • 11:30',
        status: 'Completed',
        hash: '0x9d8e...f7a6',
    },
];

const TokenCard = ({ icon, title, subtitle, balance, change, actions, highlighted, onEdit }) => (
    <div
        className={`glass-card rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden group border ${highlighted ? 'border-[#D4AF37]/30' : 'border-[#D4AF37]/10'
            }`}
        style={{ boxShadow: '0 0 20px rgba(212,175,55,0.1)' }}
    >
        {/* Ambient glow */}
        <div
            className={`absolute -right-10 -top-10 size-40 rounded-full blur-3xl transition-all ${highlighted ? 'bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20' : 'bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10'
                }`}
        />

        {/* Edit Button (Dev Only) */}
        <button
            onClick={onEdit}
            className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white"
            title="Edit Base Balance"
        >
            <span className="material-symbols-outlined text-sm">edit</span>
        </button>

        {/* Header */}
        <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3 sm:gap-4">
                <div
                    className={`size-10 sm:size-14 rounded-xl bg-background-dark border flex items-center justify-center ${highlighted
                        ? 'border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'border-[#D4AF37]/30'
                        }`}
                >
                    <span className="material-symbols-outlined text-[#D4AF37] text-2xl sm:text-3xl">{icon}</span>
                </div>
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
                    <p className="text-xs sm:text-sm text-white/40 font-medium tracking-wide">{subtitle}</p>
                </div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                {change}
            </span>
        </div>

        {/* Balance */}
        <div className="mt-4 sm:mt-8 relative z-10">
            <h4 className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight">{balance}</h4>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3 relative z-10">
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-bold text-sm ${action.primary
                        ? 'bg-[#D4AF37] text-background-dark border-[#D4AF37] hover:brightness-110'
                        : 'bg-white/5 hover:bg-[#D4AF37] hover:text-background-dark border-white/10 hover:border-[#D4AF37]'
                        }`}
                >
                    <span className="material-symbols-outlined text-lg">{action.icon}</span>
                    {action.label}
                </button>
            ))}
        </div>
    </div>
);

const StatusBadge = ({ status }) =>
    status === 'Completed' ? (
        <span className="px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/20">
            Completed
        </span>
    ) : (
        <span className="px-2.5 py-1 rounded bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider border border-white/5">
            Pending
        </span>
    );

const TokenWallet = () => {
    const { energyBalance, ownBalance, refreshBalance, isLoading: isWalletLoading } = useWallet();
    const { data: transactionsData, isLoading: isTxLoading } = useWalletTransactions();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const totalPages = 1; // Simplified for now since we usually have limited recent tx

    const formatBalance = (val) => {
        const num = parseFloat(val || '0');
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const getTxIcon = (type, subtype) => {
        if (subtype === 'ENERGY_CREDIT') return { icon: 'bolt', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
        if (subtype === 'COMMISSION') return { icon: 'payments', color: 'text-green-400', bg: 'bg-green-400/10' };
        if (type === 'Stake') return { icon: 'lock', color: 'text-blue-400', bg: 'bg-blue-400/10' };
        return { icon: 'sync', color: 'text-purple-400', bg: 'bg-purple-400/10' };
    };

    // Map backend data to UI format
    const mappedTransactions = (transactionsData || []).map(tx => {
        const style = getTxIcon(tx.type, tx.subtype);
        return {
            ...tx,
            ...style,
            amount: `${tx.subtype === 'ENERGY_CREDIT' ? '+' : ''}${parseFloat(tx.amount).toLocaleString()} ${tx.subtype === 'ENERGY_CREDIT' ? 'NRG' : 'OWN'}`,
            displayDate: new Date(tx.date).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            status: 'Completed',
            displayHash: (tx.hash && tx.hash.toString().length > 10) ? `0x${tx.hash.toString().slice(0, 6)}...${tx.hash.toString().slice(-4)}` : `#${tx.hash || 'unknown'}`
        };
    });

    const filtered = mappedTransactions.filter(
        (tx) =>
            (tx.hash ? tx.hash.toString().toLowerCase() : '').includes(search.toLowerCase()) ||
            tx.type.toLowerCase().includes(search.toLowerCase()) ||
            (tx.subtype && tx.subtype.toLowerCase().includes(search.toLowerCase()))
    );

    const handleEditBalance = async (type, currentVal) => {
        const newVal = window.prompt(`Enter new ${type} balance:`, currentVal);
        if (newVal !== null && !isNaN(parseFloat(newVal))) {
            try {
                await walletApiService.updateBalance(type, parseFloat(newVal));
                refreshBalance();
            } catch (error) {
                console.error('Failed to update balance:', error);
            }
        }
    };

    const isLoading = isWalletLoading || isTxLoading;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <PageHeading
                    highlight="TOKEN"
                    title="WALLET"
                    subtitle="Manage your assets with multi-chain security and real-time tracking."
                />
                <div className="text-right pb-2 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Live Data</span>
                    <div className="text-[10px] text-accent-gold/60 font-mono">
                        User ID: {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : 'N/A'}<br />
                        Connection: PostgreSQL
                    </div>
                </div>
            </div>
            {/* Hero Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TokenCard
                    icon="bolt"
                    title="Energy Token"
                    subtitle="NRG / GOVERNANCE"
                    balance={isWalletLoading ? "..." : formatBalance(energyBalance)}
                    change="+5.2%"
                    onEdit={() => handleEditBalance('NRG', energyBalance || 0)}
                    actions={[
                        { label: 'Deposit', icon: 'south_west' },
                        { label: 'Withdraw', icon: 'north_east' },
                        { label: 'Transfer', icon: 'send' },
                    ]}
                />
                <TokenCard
                    icon="star"
                    title="OWN Token"
                    subtitle="OWN / UTILITY"
                    balance={isWalletLoading ? "..." : formatBalance(ownBalance)}
                    change="+12.8%"
                    highlighted
                    onEdit={() => handleEditBalance('DB', ownBalance || 0)}
                    actions={[
                        { label: 'Deposit', icon: 'south_west' },
                        { label: 'Withdraw', icon: 'north_east' },
                        { label: 'Stake', icon: 'lock', primary: true },
                    ]}
                />
            </div>

            {/* Transaction History */}
            <div
                className="glass-card rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(212,175,55,0.1)' }}
            >
                {/* Table Header */}
                <div className="p-4 sm:p-6 border-b border-[#D4AF37]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-white/2">
                    <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#D4AF37]">history</span>
                        Recent Transactions
                    </h3>
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-base sm:text-lg">
                                search
                            </span>
                            <input
                                className="bg-background-dark/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-[#D4AF37] focus:outline-none w-full sm:w-64 transition-all text-white placeholder-white/30"
                                placeholder="Search hash or type..."
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="text-xs sm:text-sm font-bold text-[#D4AF37] hover:underline whitespace-nowrap">
                            View All
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-dark/30">
                                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">
                                    Transaction Hash
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D4AF37]/5">
                            {filtered && filtered.length > 0 ? (
                                filtered.map((tx, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 rounded ${tx.bg} flex items-center justify-center`}>
                                                    <span className={`material-symbols-outlined ${tx.color} text-lg`}>
                                                        {tx.icon}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold">{tx.subtype || tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono font-bold text-white">{tx.amount}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">{tx.displayDate}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={tx.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href="#"
                                                className="text-sm font-mono text-[#D4AF37] hover:underline flex items-center justify-end gap-1"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                {tx.displayHash}
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-white/30 text-sm">
                                        {isTxLoading ? "Loading transactions..." : "No transactions match your search."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-background-dark/30 border-t border-[#D4AF37]/10 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 text-white/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="text-xs font-bold text-white/60">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 text-white/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenWallet;
