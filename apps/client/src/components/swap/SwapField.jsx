import React from 'react';
import TokenIcon from './TokenIcon';

const SwapField = ({ label, balance, amount, symbol, tokenIcon, onAmountChange, readOnly = false, usdValue }) => {
    return (
        <div className="mb-2 last:mb-0">
            <div className="flex justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</span>
                <span className="text-xs font-medium text-white/60">
                    Balance:{' '}
                    <span className="text-[#D4AF37]">
                        {balance} {symbol}
                    </span>
                </span>
            </div>
            <div className={`bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-[#D4AF37]/30 transition-all ${readOnly ? 'cursor-not-allowed' : ''}`}>
                <div className="flex flex-col flex-1 min-w-0">
                    <input
                        className={`bg-transparent border-none focus:ring-0 text-xl sm:text-2xl font-bold p-0 text-white placeholder-white/20 w-full focus:outline-none ${readOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                        placeholder="0.00"
                        type="text"
                        value={amount}
                        readOnly={readOnly}
                        onChange={(e) => {
                            if (!readOnly && onAmountChange) {
                                const val = e.target.value.replace(/[^0-9.]/g, '');
                                onAmountChange(val);
                            }
                        }}
                    />
                    <span className="text-[10px] text-white/30 font-medium mt-1">{usdValue}</span>
                </div>
                <button className="flex items-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/10 transition-all px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-white/5 ml-2 sm:ml-3 shrink-0">
                    <TokenIcon
                        {...tokenIcon}
                        size="w-5 h-5 sm:w-6 sm:h-6"
                        textSize="text-[10px] sm:text-[14px]"
                    />
                    <span className="text-xs sm:text-sm font-bold">{symbol}</span>
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-white/40">expand_more</span>
                </button>
            </div>
        </div>
    );
};

export default SwapField;
