import React from 'react';

const MarketInfo = ({ fromSymbol, toSymbol, rate, gasFee, slippage = '0.5%' }) => {
    return (
        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-xs text-white/50">Exchange Rate</span>
                <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">
                        1 {fromSymbol} = {rate} {toSymbol}
                    </span>
                    <span className="material-symbols-outlined text-[14px] text-[#D4AF37] cursor-pointer">info</span>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs text-white/50">Slippage Tolerance</span>
                <span className="text-xs font-bold text-[#D4AF37]">{slippage}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs text-white/50">Estimated Gas Fee</span>
                <span className="text-xs font-bold text-white/80">${gasFee}</span>
            </div>
        </div>
    );
};

export default MarketInfo;
