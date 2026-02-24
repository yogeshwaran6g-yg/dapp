import React from 'react';

const ActivityList = () => {
    const activities = [
        { icon: 'add_circle', label: 'Staking Reward Received', date: 'Feb 24, 2024 • 14:22', value: '+2.45 LX', status: 'Confirmed', iconBg: 'bg-green-500/10 text-green-500', valueColor: 'text-green-400' },
        { icon: 'electric_bolt', label: 'Slot Level Upgraded', date: 'Feb 23, 2024 • 09:15', value: 'Level 12', status: 'Success', iconBg: 'bg-accent-gold/10 text-accent-gold', valueColor: 'text-white' },
        { icon: 'sync', label: 'Token Swap: USDT to LX', date: 'Feb 21, 2024 • 18:40', value: '500.00 LX', status: 'Confirmed', iconBg: 'bg-blue-500/10 text-blue-500', valueColor: 'text-white' },
    ];

    return (
        <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-base font-bold">Recent Activities</h3>
                <button className="text-xs text-accent-gold font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-white/5">
                {activities.map((activity, idx) => (
                    <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded flex items-center justify-center ${activity.iconBg}`}>
                                <span className="material-symbols-outlined">{activity.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">{activity.label}</p>
                                <p className="text-[11px] text-gray-500">{activity.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-bold ${activity.valueColor}`}>{activity.value}</p>
                            <p className="text-[11px] text-gray-500">{activity.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityList;
