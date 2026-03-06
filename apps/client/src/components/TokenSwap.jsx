import React, { useState, useEffect, useCallback } from 'react';
import PageHeading from './PageHeading';
import SwapCard from './swap/SwapCard';
import MarketInfo from './swap/MarketInfo';
import RecentTransactions from './swap/RecentTransactions';
import { swapApiService } from '../services/swapApiService';
import { walletApiService } from '../services/walletApiService';

const TOKEN_DEFS = {
    USDT: {
        symbol: 'USDT',
        icon: 'payments',
        iconStyle: { background: 'linear-gradient(135deg, #26A17B 0%, #1a7a5c 100%)' },
        iconClass: 'text-white',
    },
    OWN: {
        symbol: 'OWN',
        icon: 'diamond',
        iconStyle: { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
        iconClass: 'text-white',
    },
    ENERGY: {
        symbol: 'ENERGY',
        icon: 'bolt',
        iconStyle: { background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' },
        iconClass: 'text-[#0b0b0f]',
    },
};

// Which "To" tokens are allowed for each "From" token
const ALLOWED_PAIRS = {
    USDT: ['OWN', 'ENERGY'],
    OWN: ['USDT', 'ENERGY'],
};

// Maps from/to selection to swap_type for the API
const SWAP_TYPE_MAP = {
    'USDT_OWN': 'USDT_TO_OWN',
    'USDT_ENERGY': 'USDT_TO_ENERGY',
    'OWN_USDT': 'OWN_TO_USDT',
    'OWN_ENERGY': 'OWN_TO_ENERGY',
};

const FROM_TOKENS = ['USDT', 'OWN'];

const TokenSwap = () => {
    const [fromSymbol, setFromSymbol] = useState('USDT');
    const [toSymbol, setToSymbol] = useState('OWN');
    const [fromAmount, setFromAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState({ usdt_balance: 0, own_token_balance: 0, energy_balance: 0 });
    const [rates, setRates] = useState({});
    const [swapHistory, setSwapHistory] = useState([]);

    // Build token objects with live balances
    const balanceMap = {
        USDT: parseFloat(balances.usdt_balance || 0).toFixed(2),
        OWN: parseFloat(balances.own_token_balance || 0).toFixed(2),
        ENERGY: parseFloat(balances.energy_balance || 0).toFixed(2),
    };

    const fromToken = { ...TOKEN_DEFS[fromSymbol], balance: balanceMap[fromSymbol] };
    const toToken = { ...TOKEN_DEFS[toSymbol], balance: balanceMap[toSymbol] };

    // Get the current rate
    const swapTypeKey = `${fromSymbol}_TO_${toSymbol}`;
    const currentRate = rates[swapTypeKey] || 0;

    // Calculate to amount
    const toAmount = fromAmount && currentRate
        ? (parseFloat(fromAmount) * currentRate).toFixed(2)
        : '0.00';

    // Fetch balances
    const fetchBalances = useCallback(async () => {
        try {
            const data = await walletApiService.getWalletInfo();
            if (data) setBalances(data);
        } catch (err) {
            console.error('Error fetching balances:', err);
        }
    }, []);

    // Fetch rates
    const fetchRates = useCallback(async () => {
        try {
            const data = await swapApiService.getSwapRates();
            if (data) setRates(data);
        } catch (err) {
            console.error('Error fetching rates:', err);
        }
    }, []);

    // Fetch history
    const fetchHistory = useCallback(async () => {
        try {
            const data = await swapApiService.getSwapHistory();
            if (Array.isArray(data)) setSwapHistory(data);
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    }, []);

    useEffect(() => {
        fetchBalances();
        fetchRates();
        fetchHistory();
    }, [fetchBalances, fetchRates, fetchHistory]);

    // Handle "from" token change — reset "to" to first allowed option
    const handleFromChange = (symbol) => {
        setFromSymbol(symbol);
        const allowed = ALLOWED_PAIRS[symbol] || [];
        if (!allowed.includes(toSymbol)) {
            setToSymbol(allowed[0] || '');
        }
        setFromAmount('');
    };

    // Handle swap toggle (reverse)
    const handleSwapToggle = () => {
        // Only reverse if the pair is valid
        if (FROM_TOKENS.includes(toSymbol) && ALLOWED_PAIRS[toSymbol]?.includes(fromSymbol)) {
            setFromSymbol(toSymbol);
            setToSymbol(fromSymbol);
            setFromAmount('');
        }
    };

    // Execute swap
    const handleSwapExecute = async () => {
        const key = `${fromSymbol}_${toSymbol}`;
        const swapType = SWAP_TYPE_MAP[key];
        if (!swapType || !fromAmount || parseFloat(fromAmount) <= 0) return;

        setLoading(true);
        try {
            await swapApiService.executeSwap(swapType, parseFloat(fromAmount));
            setFromAmount('');
            // Refresh balances and history
            await Promise.all([fetchBalances(), fetchHistory()]);
        } catch (err) {
            console.error('Swap execution error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Format swap history for the RecentTransactions component
    const formattedHistory = swapHistory.map((swap) => {
        const from = TOKEN_DEFS[swap.from_token] || {};
        const to = TOKEN_DEFS[swap.to_token] || {};
        const timeAgo = getTimeAgo(swap.created_at);
        return {
            from: swap.from_token,
            fromIcon: from.icon,
            fromIconStyle: from.iconStyle,
            fromIconClass: from.iconClass,
            to: swap.to_token,
            toIcon: to.icon,
            toIconStyle: to.iconStyle,
            toIconClass: to.iconClass,
            fromAmount: `${parseFloat(swap.from_amount).toFixed(2)} ${swap.from_token}`,
            toAmount: `${parseFloat(swap.to_amount).toFixed(2)} ${swap.to_token}`,
            status: swap.status === 'COMPLETED' ? 'Completed' : 'Failed',
            time: timeAgo,
            actionIcon: swap.status === 'COMPLETED' ? 'check_circle' : 'info',
        };
    });

    // Available "to" options for current "from"
    const toOptions = (ALLOWED_PAIRS[fromSymbol] || []).map((s) => TOKEN_DEFS[s]);

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
                    <button
                        onClick={() => { fetchBalances(); fetchRates(); fetchHistory(); }}
                        className="p-2 sm:p-2.5 rounded-lg glass-card hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">refresh</span>
                    </button>
                    <button className="p-2 sm:p-2.5 rounded-lg glass-card hover:bg-white/10 text-white/60 hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">settings</span>
                    </button>
                </div>
            </div>

            {/* Token Selection Tabs */}
            <div className="max-w-[520px] mx-auto">
                <div className="flex gap-2 mb-4">
                    <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mr-2 self-center">From:</span>
                    {FROM_TOKENS.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleFromChange(s)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                fromSymbol === s
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                {toOptions.length > 1 && (
                    <div className="flex gap-2 mb-4">
                        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mr-2 self-center">To:</span>
                        {toOptions.map((t) => (
                            <button
                                key={t.symbol}
                                onClick={() => setToSymbol(t.symbol)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                    toSymbol === t.symbol
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                                }`}
                            >
                                {t.symbol}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Swap Card with Market Info */}
            <div className="max-w-[520px] mx-auto">
                <SwapCard
                    fromToken={fromToken}
                    toToken={toToken}
                    fromAmount={fromAmount}
                    toAmount={toAmount}
                    onFromAmountChange={setFromAmount}
                    onSwapToggle={handleSwapToggle}
                    onSwapExecute={handleSwapExecute}
                    loading={loading}
                />
                <div className="mt-6">
                    <MarketInfo
                        fromSymbol={fromSymbol}
                        toSymbol={toSymbol}
                        rate={currentRate}
                        gasFee="0.00"
                    />
                </div>
            </div>

            {/* Recent Swaps */}
            <RecentTransactions transactions={formattedHistory} />
        </div>
    );
};

// Helper: relative time
function getTimeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default TokenSwap;
