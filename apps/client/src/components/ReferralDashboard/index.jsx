import React from 'react';
import PageHeading from '../PageHeading';
import StatsCards from './StatsCards';
import NetworkVisualization from './NetworkVisualization';
import RecentActivity from './RecentActivity';

const ReferralDashboard = () => {
    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-1 sm:p-0">
            <PageHeading
                highlight="REFERRAL"
                title="NETWORK"
                subtitle="Grow your network and earn exponential rewards through the matrix protocol."
            />
            <StatsCards />
            <NetworkVisualization />
            <RecentActivity />
        </div>
    );
};

export default ReferralDashboard;
