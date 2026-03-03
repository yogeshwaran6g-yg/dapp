import React, { useState } from 'react';
import PageHeading from './PageHeading';

const TOKENS = [
    {
        symbol: 'ENERGY',
        icon: 'bolt',
        iconStyle: { background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' },
        iconClass: 'text-[#0b0b0f]',
        balance: '1,250.00',
    },
    {
        symbol: 'OWN',
        icon: 'diamond',
        iconStyle: { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
        iconClass: 'text-white',
        balance: '0.00',
    },
];

const RATE = 0.8542; // 1 ENERGY = 0.8542 OWN

const recentSwaps = [
    {
        from: 'ENERGY',
        fromIcon: 'bolt',
        fromIconStyle: { background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' },
        fromIconClass: 'text-[#0b0b0f]',
        to: 'OWN',
        toIcon: 'diamond',
        toIconStyle: { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
        toIconClass: 'text-white',
        fromAmount: '250.00 ENERGY',
        toAmount: '213.55 OWN',
        status: 'Completed',
        time: '2 mins ago',
        actionIcon: 'open_in_new',
    },
    {
        from: 'OWN',
        fromIcon: 'diamond',
        fromIconStyle: { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
        fromIconClass: 'text-white',
        to: 'ENERGY',
        toIcon: 'bolt',
        toIconStyle: { background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' },
        toIconClass: 'text-[#0b0b0f]',
        fromAmount: '1,000.00 OWN',
        toAmount: '1,165.20 ENERGY',
        status: 'Completed',
        time: '1 hour ago',
        actionIcon: 'open_in_new',
    },
    {
        from: 'ENERGY',
        fromIcon: 'bolt',
        fromIconStyle: { background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' },
        fromIconClass: 'text-[#0b0b0f]',
        to: 'WBTC',
        toIcon: 'currency_bitcoin',
        toIconStyle: { background: '#4b5563' },
        toIconClass: 'text-white',
        fromAmount: '5,000.00 ENERGY',
        toAmount: '0.082 WBTC',
        status: 'Failed',
        time: '3 hours ago',
        actionIcon: 'info',
    },
];

const StatusBadge = ({ status }) => {
    if (status === 'Completed') {
        return (
            <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">
                Completed
            </span>
        );
    }
    if (status === 'Failed') {
        return (
            <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20">
                Failed
            </span>
        );
    }
    return (
        <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold border border-yellow-500/20">
            Pending
        </span>
    );
};

const TokenIcon = ({ icon, iconStyle, iconClass, size = 'w-6 h-6', textSize = 'text-[14px]' }) => (
    <div
        className={`${size} rounded-full flex items-center justify-center`}
        style={iconStyle}
    >
        <span className={`material-symbols-outlined ${textSize} ${iconClass} font-bold`}>{icon}</span>
    </div>
);

const TokenSwap = () => {
    const [fromToken, setFromToken] = useState(TOKENS[0]);
    const [toToken, setToToken] = useState(TOKENS[1]);
    const [fromAmount, setFromAmount] = useState('100.00');
    const [swapped, setSwapped] = useState(false);

    const toAmount = fromAmount
        ? (parseFloat(fromAmount.replace(/,/g, '')) * RATE).toFixed(2)
        : '0.00';
    const fromUSD = fromAmount
        ? `~$${(parseFloat(fromAmount.replace(/,/g, '')) * 42.5).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
        : '~$0.00 USD';
    const toUSD = toAmount
        ? `~$${(parseFloat(toAmount) * 49.7).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
        : '~$0.00 USD';

    const handleSwapTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setSwapped((s) => !s);
        setFromAmount('');
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
                <PageHeading
                    highlight="SWAP"
                    title="TOKENS"
                    subtitle="Institutional grade liquidity for your digital assets."
                />
                <div className="flex gap-2 sm:gap-3 mb-12">
                    <button className="p-2 sm:p-2.5 rounded-lg glass-card hover:bg-white/10 text-white/60 hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">refresh</span>
                    </button>
                    <button className="p-2 sm:p-2.5 rounded-lg glass-card hover:bg-white/10 text-white/60 hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">settings</span>
                    </button>
                </div>
            </div>

            {/* Swap Card */}
            <div className="max-w-[520px] mx-auto">
                <div
                    className="glass-card rounded-3xl p-6 relative overflow-hidden"
                    style={{ boxShadow: '0 0 20px rgba(212,175,55,0.15)' }}
                >
                    {/* Ambient glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

                    {/* From Field */}
                    <div className="mb-2">
                        <div className="flex justify-between mb-2 px-1">
                            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Pay From</span>
                            <span className="text-xs font-medium text-white/60">
                                Balance:{' '}
                                <span className="text-[#D4AF37]">
                                    {fromToken.balance} {fromToken.symbol}
                                </span>
                            </span>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-[#D4AF37]/30 transition-all">
                            <div className="flex flex-col flex-1 min-w-0">
                                <input
                                    className="bg-transparent border-none focus:ring-0 text-xl sm:text-2xl font-bold p-0 text-white placeholder-white/20 w-full focus:outline-none"
                                    placeholder="0.00"
                                    type="text"
                                    value={fromAmount}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9.]/g, '');
                                        setFromAmount(val);
                                    }}
                                />
                                <span className="text-[10px] text-white/30 font-medium mt-1">{fromUSD}</span>
                            </div>
                            <button className="flex items-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/10 transition-all px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-white/5 ml-2 sm:ml-3 shrink-0">
                                <TokenIcon
                                    icon={fromToken.icon}
                                    iconStyle={fromToken.iconStyle}
                                    iconClass={fromToken.iconClass}
                                    size="w-5 h-5 sm:w-6 sm:h-6"
                                    textSize="text-[10px] sm:text-[14px]"
                                />
                                <span className="text-xs sm:text-sm font-bold">{fromToken.symbol}</span>
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-white/40">expand_more</span>
                            </button>
                        </div>
                    </div>

                    {/* Swap Toggle Button */}
                    <div className="relative h-12 flex items-center justify-center -my-4 z-10">
                        <button
                            onClick={handleSwapTokens}
                            className="w-10 h-10 rounded-xl bg-[#16161a] border border-white/10 flex items-center justify-center hover:border-[#D4AF37] transition-all text-[#D4AF37]"
                            style={{ boxShadow: '0 0 20px rgba(212,175,55,0.15)' }}
                        >
                            <span
                                className="material-symbols-outlined text-[20px] transition-transform duration-300"
                                style={{ transform: swapped ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            >
                                swap_vert
                            </span>
                        </button>
                    </div>

                    {/* To Field */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-2 px-1">
                            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Receive</span>
                            <span className="text-xs font-medium text-white/60">
                                Balance:{' '}
                                <span className="text-[#D4AF37]">
                                    {toToken.balance} {toToken.symbol}
                                </span>
                            </span>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-[#D4AF37]/30 transition-all">
                            <div className="flex flex-col flex-1 min-w-0">
                                <input
                                    className="bg-transparent border-none focus:ring-0 text-xl sm:text-2xl font-bold p-0 text-white placeholder-white/20 w-full focus:outline-none cursor-not-allowed opacity-80"
                                    placeholder="0.00"
                                    type="text"
                                    value={toAmount}
                                    readOnly
                                />
                                <span className="text-[10px] text-white/30 font-medium mt-1">{toUSD}</span>
                            </div>
                            <button className="flex items-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/10 transition-all px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-white/5 ml-2 sm:ml-3 shrink-0">
                                <TokenIcon
                                    icon={toToken.icon}
                                    iconStyle={toToken.iconStyle}
                                    iconClass={toToken.iconClass}
                                    size="w-5 h-5 sm:w-6 sm:h-6"
                                    textSize="text-[10px] sm:text-[14px]"
                                />
                                <span className="text-xs sm:text-sm font-bold">{toToken.symbol}</span>
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-white/40">expand_more</span>
                            </button>
                        </div>
                    </div>

                    {/* Market Info */}
                    <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/50">Exchange Rate</span>
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-bold">
                                    1 {fromToken.symbol} = {RATE} {toToken.symbol}
                                </span>
                                <span className="material-symbols-outlined text-[14px] text-[#D4AF37] cursor-pointer">info</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/50">Slippage Tolerance</span>
                            <span className="text-xs font-bold text-[#D4AF37]">0.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/50">Estimated Gas Fee</span>
                            <span className="text-xs font-bold text-white/80">$7.24</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        className="w-full py-4 rounded-2xl text-background-dark font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all"
                        style={{
                            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                            boxShadow: '0 10px 30px -10px rgba(212,175,55,0.4)',
                        }}
                    >
                        Swap Now
                    </button>
                </div>
            </div>

            {/* Recent Swaps */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#D4AF37]">history</span>
                        Recent Transactions
                    </h3>
                    <button className="text-xs font-bold text-[#D4AF37] hover:underline">View All</button>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px]">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/3">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Asset Pair</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Time</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentSwaps.map((swap, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-all">
                                        {/* Asset Pair */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    <TokenIcon
                                                        icon={swap.fromIcon}
                                                        iconStyle={swap.fromIconStyle}
                                                        iconClass={swap.fromIconClass}
                                                        size="w-6 h-6"
                                                        textSize="text-[12px]"
                                                    />
                                                    <TokenIcon
                                                        icon={swap.toIcon}
                                                        iconStyle={swap.toIconStyle}
                                                        iconClass={swap.toIconClass}
                                                        size="w-6 h-6"
                                                        textSize="text-[12px]"
                                                    />
                                                </div>
                                                <span className="text-sm font-bold ml-2">
                                                    {swap.from} → {swap.to}
                                                </span>
                                            </div>
                                        </td>
                                        {/* Amount */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">{swap.fromAmount}</span>
                                                <span className="text-[10px] text-white/40">{swap.toAmount}</span>
                                            </div>
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-5">
                                            <StatusBadge status={swap.status} />
                                        </td>
                                        {/* Time */}
                                        <td className="px-6 py-5 text-xs text-white/50">{swap.time}</td>
                                        {/* Action */}
                                        <td className="px-6 py-5">
                                            <a href="#" className="text-[#D4AF37] hover:text-[#F9E498] transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">{swap.actionIcon}</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenSwap;
