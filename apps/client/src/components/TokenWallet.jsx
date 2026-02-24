import React, { useState } from 'react';

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

const TokenCard = ({ icon, title, subtitle, balance, usdValue, change, actions, highlighted }) => (
    <div
        className={`glass-card rounded-2xl p-8 relative overflow-hidden group border ${highlighted ? 'border-[#D4AF37]/30' : 'border-[#D4AF37]/10'
            }`}
        style={{ boxShadow: '0 0 20px rgba(212,175,55,0.1)' }}
    >
        {/* Ambient glow */}
        <div
            className={`absolute -right-10 -top-10 size-40 rounded-full blur-3xl transition-all ${highlighted ? 'bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20' : 'bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10'
                }`}
        />

        {/* Header */}
        <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-4">
                <div
                    className={`size-14 rounded-xl bg-[#0b0b0f] border flex items-center justify-center ${highlighted
                            ? 'border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                            : 'border-[#D4AF37]/30'
                        }`}
                >
                    <span className="material-symbols-outlined text-[#D4AF37] text-3xl">{icon}</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-sm text-white/40 font-medium tracking-wide">{subtitle}</p>
                </div>
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                {change}
            </span>
        </div>

        {/* Balance */}
        <div className="mt-8 relative z-10">
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em] mb-1">Available Balance</p>
            <h4 className="text-4xl font-mono font-bold text-white tracking-tight">{balance}</h4>
            <p className="text-[#F9E076]/60 font-medium text-lg mt-1">≈ {usdValue}</p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3 relative z-10">
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-bold text-sm ${action.primary
                            ? 'bg-[#D4AF37] text-[#0b0b0f] border-[#D4AF37] hover:brightness-110'
                            : 'bg-white/5 hover:bg-[#D4AF37] hover:text-[#0b0b0f] border-white/10 hover:border-[#D4AF37]'
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
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const totalPages = 12;

    const filtered = transactions.filter(
        (tx) =>
            tx.hash.toLowerCase().includes(search.toLowerCase()) ||
            tx.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Hero Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TokenCard
                    icon="bolt"
                    title="Energy Token"
                    subtitle="NRG / GOVERNANCE"
                    balance="45,000.00"
                    usdValue="$20,250.00 USD"
                    change="+5.2%"
                    actions={[
                        { label: 'Deposit', icon: 'south_west' },
                        { label: 'Withdraw', icon: 'north_east' },
                        { label: 'Transfer', icon: 'send' },
                    ]}
                />
                <TokenCard
                    icon="star"
                    title="Own Token"
                    subtitle="OWN / UTILITY"
                    balance="12,500.24"
                    usdValue="$26,250.50 USD"
                    change="+12.8%"
                    highlighted
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
                <div className="p-6 border-b border-[#D4AF37]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#D4AF37]">history</span>
                        Recent Transactions
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-lg">
                                search
                            </span>
                            <input
                                className="bg-[#0b0b0f]/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-[#D4AF37] focus:outline-none w-64 transition-all text-white placeholder-white/30"
                                placeholder="Search hash or type..."
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="text-sm font-bold text-[#D4AF37] hover:underline whitespace-nowrap">
                            View All
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0b0b0f]/30">
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
                            {filtered.length > 0 ? (
                                filtered.map((tx, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 rounded ${tx.iconBg} flex items-center justify-center`}>
                                                    <span className={`material-symbols-outlined ${tx.iconColor} text-lg`}>
                                                        {tx.icon}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono font-bold text-white">{tx.amount}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">{tx.date}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={tx.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href="#"
                                                className="text-sm font-mono text-[#D4AF37] hover:underline flex items-center justify-end gap-1"
                                            >
                                                {tx.hash}
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-white/30 text-sm">
                                        No transactions match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-[#0b0b0f]/30 border-t border-[#D4AF37]/10 flex items-center justify-center gap-2">
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
