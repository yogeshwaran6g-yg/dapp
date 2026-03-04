import React from 'react';
import StatsCards from './StatsCards';
import StakingPanel from './StakingPanel';
import YieldAndActivity from './YieldAndActivity';

const StakingDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Hero Title */}
            <div className="mb-2">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-1">Staking Dashboard</h2>
                <p className="text-white/50 text-xs sm:text-sm max-w-xl">
                    Maximize yield with institutional security and real-time distribution.
                </p>
            </div>

            {/* Stats Overview */}
            <StatsCards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <StakingPanel />
                <YieldAndActivity />
            </div>
        </div>
    );
};

export default StakingDashboard;
