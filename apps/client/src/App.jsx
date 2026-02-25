import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import QuickActions from './components/QuickActions';
import StatsGrid from './components/StatsGrid';
import Charts from './components/Charts';
import ActivityList from './components/ActivityList';
import ReferralDashboard from './components/ReferralDashboard';
import TokenWallet from './components/TokenWallet';
import TokenSwap from './components/TokenSwap';
import NFTRoyalty from './components/NFTRoyalty';
import StakingDashboard from './components/StakingDashboard';
import SlotActivation from './components/SlotActivation';
import Profile from './components/Profile';

function App() {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const renderContent = () => {
        if (activeItem === 'Referral') {
            return <ReferralDashboard />;
        }
        if (activeItem === 'Token Wallet') {
            return <TokenWallet />;
        }
        if (activeItem === 'Swap') {
            return <TokenSwap />;
        }
        if (activeItem === 'Slot Activation') {
            return <SlotActivation />;
        }
        if (activeItem === 'NFT Royalty') {
            return <NFTRoyalty />;
        }
        if (activeItem === 'Staking') {
            return <StakingDashboard />;
        }
        if (activeItem === 'Profile') {
            return <Profile />;
        }
        return (
            <>
                <QuickActions />
                <StatsGrid />
                <Charts />
                <ActivityList />
            </>
        );
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-sans text-white selection:bg-accent-gold/30">
            <Sidebar
                activeItem={activeItem}
                onItemClick={setActiveItem}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col transition-all duration-300">
                <Header onMenuClick={toggleSidebar} />
                <div className="p-3 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 max-w-[1600px] mx-auto w-full">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default App;
