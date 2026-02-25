import React from 'react';

const StatsGrid = () => {
    const stats = [
        { label: 'Total Earnings', value: '$12,450.00', trend: '+12.5%', trendIcon: 'trending_up', trendColor: 'text-green-400' },
        { label: 'Active Slot', value: 'Level 12', special: 'MAX LEVEL' },
        { label: 'Royalty Income', value: '$3,200.00', trend: '+8.2%', trendIcon: 'trending_up', trendColor: 'text-green-400' },
        { label: 'Referrals', value: '148', trend: '+5 New', trendIcon: 'group_add', trendColor: 'text-green-400' },
        { label: 'Staked', value: '5,000 LX', trend: '0% Change', trendColor: 'text-gray-500' },
        { label: 'Energy Bal.', value: '450.50', trend: '-2.1%', trendIcon: 'trending_down', trendColor: 'text-red-400' },
        { label: 'Pending Rewards', value: '$120.45', special: 'CLAIM NOW' },
    ];

    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="glass-panel gold-glow-border p-4 rounded-xl flex flex-col gap-1">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
                    {stat.trend && (
                        <p className={`text-[10px] font-bold flex items-center gap-1 ${stat.trendColor}`}>
                            {stat.trendIcon && <span className="material-symbols-outlined text-xs">{stat.trendIcon}</span>}
                            {stat.trend}
                        </p>
                    )}
                    {stat.special && (
                        <p className={`text-[10px] font-bold ${stat.special === 'CLAIM NOW' ? 'text-accent-gold-light' : 'text-accent-gold'}`}>
                            {stat.special}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
