import React from 'react';
import SwapField from './SwapField';

const SwapCard = ({ 
    fromToken, 
    toToken, 
    fromAmount, 
    toAmount, 
    onFromAmountChange, 
    onSwapToggle, 
    onSwapExecute,
    loading
}) => {
    return (
        <div className="max-w-[520px] mx-auto">
            <div
                className="glass-card rounded-3xl p-6 relative overflow-hidden"
                style={{ boxShadow: '0 0 20px rgba(212,175,55,0.15)' }}
            >
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

                {/* From Field */}
                <SwapField
                    label="Pay From"
                    balance={fromToken.balance}
                    amount={fromAmount}
                    symbol={fromToken.symbol}
                    tokenIcon={{
                        icon: fromToken.icon,
                        iconStyle: fromToken.iconStyle,
                        iconClass: fromToken.iconClass
                    }}
                    onAmountChange={onFromAmountChange}
                />

                {/* Swap Toggle Button */}
                <div className="relative h-12 flex items-center justify-center -my-4 z-10">
                    <button
                        onClick={onSwapToggle}
                        className="w-10 h-10 rounded-xl bg-[#16161a] border border-white/10 flex items-center justify-center hover:border-[#D4AF37] transition-all text-[#D4AF37]"
                        style={{ boxShadow: '0 0 20px rgba(212,175,55,0.15)' }}
                    >
                        <span
                            className="material-symbols-outlined text-[20px] transition-transform duration-300"
                        >
                            swap_vert
                        </span>
                    </button>
                </div>

                {/* To Field */}
                <SwapField
                    label="Receive"
                    balance={toToken.balance}
                    amount={toAmount}
                    symbol={toToken.symbol}
                    tokenIcon={{
                        icon: toToken.icon,
                        iconStyle: toToken.iconStyle,
                        iconClass: toToken.iconClass
                    }}
                    readOnly
                />

                {/* CTA */}
                <button
                    onClick={onSwapExecute}
                    disabled={loading || !fromAmount}
                    className="w-full py-4 rounded-2xl text-background-dark font-black text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                        boxShadow: '0 10px 30px -10px rgba(212,175,55,0.4)',
                    }}
                >
                    {loading ? 'Processing...' : 'Swap Now'}
                </button>
            </div>
        </div>
    );
};

export default SwapCard;
