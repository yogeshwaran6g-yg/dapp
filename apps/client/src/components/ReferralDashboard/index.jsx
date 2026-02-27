import React from 'react';
import StatsCards from './StatsCards';
import NetworkVisualization from './NetworkVisualization';
import RecentActivity from './RecentActivity';

const ReferralDashboard = () => {
    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-1 sm:p-0">
            <StatsCards />
            <NetworkVisualization />
            <RecentActivity />
        </div>
    );
};

export default ReferralDashboard;
