import React from 'react';
import { useWallet } from '../../context/WalletContext';

const YieldAndActivity = () => {
    const { ownBalance, stakedAmount, totalEarned, stakeHistory } = useWallet();

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Yield Projection 
            <div className="glass-panel rounded-xl p-6">
                ... 
            </div>
            */}

            {/* Security Badge 
            <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-white/5 flex items-start gap-4">
                ...
            </div>
            */}

            {/* Recent Activity
            <div className="glass-panel rounded-xl p-6">
                ...
            </div>
            */}
        </div>
    );
};

export default YieldAndActivity;
