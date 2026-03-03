import React, { useState } from 'react';
import PageHeading from './PageHeading';

const WithdrawPortal = () => {
    const [asset, setAsset] = useState('OWN Token');
    const [amount, setAmount] = useState('');

    const balances = [
        { name: 'Energy Token', symbol: 'NRG', amount: '250.00', icon: 'bolt', status: 'Claimable', statusColor: 'text-green-400 bg-green-400/10' },
        { name: 'Own Token', symbol: 'OWN', amount: '1,200.0', icon: 'token', status: 'Available', statusColor: 'text-blue-400 bg-blue-400/10' },
        { name: 'Royalty Rewards', symbol: 'ETH', amount: '0.45', icon: 'workspace_premium', status: 'Pending', statusColor: 'text-yellow-500/80 bg-yellow-500/10' },
        { name: 'Referral Rewards', symbol: 'OWN', amount: '150.00', icon: 'diversity_3', status: 'Pending', statusColor: 'text-yellow-500/80 bg-yellow-500/10' },
        { name: 'Staking Rewards', symbol: 'OWN', amount: '85.50', icon: 'layers', status: 'Pending', statusColor: 'text-yellow-500/80 bg-yellow-500/10' },
    ];

    const recentWithdrawals = [
        { date: 'Oct 24, 2023', time: '14:22 PM', asset: 'OWN Token', amount: '500.00 OWN', status: 'Completed', txHash: '0x4f2...71e4', icon: 'token' },
        { date: 'Oct 22, 2023', time: '09:15 AM', asset: 'Ethereum', amount: '0.25 ETH', status: 'Pending', txHash: '0x2a1...bc90', icon: 'currency_bitcoin' },
        { date: 'Oct 18, 2023', time: '18:45 PM', asset: 'NRG Token', amount: '1,250.00 NRG', status: 'Completed', txHash: '0x992...2e0f', icon: 'bolt' },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <PageHeading
                highlight="WITHDRAW"
                title="FUNDS"
                subtitle="Manage your assets and claim rewards across the ecosystem."
            />

            {/* Balances Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {balances.map((item, idx) => (
                    <div key={idx} className="glass-card p-5 rounded-2xl flex flex-col justify-between group hover:border-gold-main/30 transition-all">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-gold-main bg-gold-main/10 p-2 rounded-lg">{item.icon}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${item.statusColor}`}>{item.status}</span>
                            </div>
                            <p className="text-xs text-silver/50 font-medium">{item.name}</p>
                            <h4 className="text-xl font-bold text-white">{item.amount} <span className="text-xs text-silver">{item.symbol}</span></h4>
                        </div>
                        <button className="mt-4 w-full py-2 rounded-lg border border-white/10 hover:border-gold-main/50 text-xs font-bold transition-all hover:bg-gold-main/5">
                            {item.status === 'Available' ? 'Withdraw' : 'Claim'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Main Withdrawal Form & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute -top-24 -right-24 size-64 bg-gold-main/10 rounded-full blur-[100px]"></div>
                        <div className="relative z-0">
                            <h4 className="text-2xl font-bold text-white mb-8">Initiate Withdrawal</h4>
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-silver/70 uppercase tracking-widest ml-1">Select Asset</label>
                                        <div className="relative">
                                            <select
                                                value={asset}
                                                onChange={(e) => setAsset(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-gold-main/50 outline-none transition-all cursor-pointer"
                                            >
                                                <option className="bg-primary">OWN Token</option>
                                                <option className="bg-primary">Ethereum (ETH)</option>
                                                <option className="bg-primary">Energy Token (NRG)</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-silver pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-silver/70 uppercase tracking-widest ml-1">Amount</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-gold-main/50 outline-none transition-all placeholder:text-gray-600"
                                                placeholder="0.00"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setAmount('1200')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gold-main bg-gold-main/10 px-2 py-1 rounded"
                                            >
                                                MAX
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-silver/70 uppercase tracking-widest ml-1">Destination Wallet</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-silver font-mono text-sm focus:ring-0 outline-none"
                                            value="0x71C21BF1D394539659A722830fF4e2A0"
                                            readOnly
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-silver/30">lock</span>
                                    </div>
                                    <p className="text-[10px] text-silver/40 px-1 italic">Funds will be sent to your connected ecosystem wallet.</p>
                                </div>
                                <button className="w-full py-4 gold-gradient-bg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] text-primary font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                                    Withdraw Now
                                    <span className="material-symbols-outlined font-black">arrow_forward</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-3xl h-full flex flex-col">
                        <h4 className="text-xl font-bold text-white mb-6">Withdrawal Summary</h4>
                        <div className="space-y-4 flex-1">
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-silver/60 text-sm">Selected Network</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-sm font-semibold">Ethereum Mainnet</span>
                                    <span className="size-2 rounded-full bg-green-500"></span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-silver/60 text-sm">Estimated Gas Fee</span>
                                <span className="text-white text-sm font-semibold">0.0024 ETH ($4.85)</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-silver/60 text-sm">Processing Time</span>
                                <span className="text-white text-sm font-semibold">~2-5 Minutes</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-silver/60 text-sm">Security Verification</span>
                                <span className="text-gold-main text-xs font-bold uppercase tracking-tighter bg-gold-main/10 px-2 py-0.5 rounded">Enabled</span>
                            </div>
                        </div>
                        <div className="mt-8 bg-gold-main/5 border border-gold-main/20 rounded-2xl p-4">
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-gold-main text-sm">info</span>
                                <p className="text-[10px] text-silver/70 leading-relaxed">
                                    Withdrawals are irreversible once processed on the blockchain. Please double-check your asset type and amount before confirming.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Withdrawals Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h4 className="text-xl font-bold text-white tracking-tight">Recent Withdrawals</h4>
                    <button className="text-gold-main text-xs font-bold hover:underline">View All Activity</button>
                </div>
                <div className="glass-card rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-silver/40 text-[10px] uppercase font-black tracking-widest">
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-6 py-5">Asset</th>
                                    <th className="px-6 py-5 text-right">Amount</th>
                                    <th className="px-6 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-right">Tx Hash</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentWithdrawals.map((tx, idx) => (
                                    <tr key={idx} className="hover:bg-white/2 transition-colors group">
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <div className="text-sm text-white font-medium">{tx.date}</div>
                                            <div className="text-[10px] text-silver/40 uppercase">{tx.time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-6 rounded-full flex items-center justify-center ${tx.asset === 'Ethereum' ? 'bg-blue-500/20' : 'bg-gold-main/20'}`}>
                                                    <span className={`material-symbols-outlined text-[14px] ${tx.asset === 'Ethereum' ? 'text-blue-400' : 'text-gold-main'}`}>{tx.icon}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-white">{tx.asset}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-bold text-white">{tx.amount}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${tx.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 text-silver/50 hover:text-gold-main cursor-pointer transition-colors">
                                                <span className="text-xs font-mono">{tx.txHash}</span>
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">© 2024 DECENTRALIZED ECOSYSTEM PORTAL</p>
                <div className="flex gap-6">
                    <a href="#" className="text-[10px] text-gray-500 hover:text-accent-gold font-bold uppercase transition-colors tracking-widest no-underline">Support</a>
                    <a href="#" className="text-[10px] text-gray-500 hover:text-accent-gold font-bold uppercase transition-colors tracking-widest no-underline">Documentation</a>
                    <a href="#" className="text-[10px] text-gray-500 hover:text-accent-gold font-bold uppercase transition-colors tracking-widest no-underline">Security Audit</a>
                </div>
            </footer>
        </div>
    );
};

export default WithdrawPortal;
