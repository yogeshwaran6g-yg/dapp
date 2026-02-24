import React from 'react';

const QuickActions = () => {
    const actions = [
        { icon: 'electric_bolt', label: 'Activate Slot', primary: true },
        { icon: 'token', label: 'Mint NFT' },
        { icon: 'lock_open', label: 'Stake Luxe' },
        { icon: 'currency_exchange', label: 'Instant Swap' },
        { icon: 'upload', label: 'Withdraw' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl transition-all border ${action.primary
                            ? 'action-gradient-gold text-primary font-bold hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] border-transparent'
                            : 'glass-panel text-white font-bold hover:border-accent-gold/50 border-white/10'
                        }`}
                >
                    <span className={`material-symbols-outlined text-3xl ${!action.primary && 'text-accent-gold'}`}>
                        {action.icon}
                    </span>
                    <span className="text-xs uppercase tracking-widest">{action.label}</span>
                </button>
            ))}
        </div>
    );
};

export default QuickActions;
