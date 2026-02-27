import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
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
import WithdrawPortal from './components/WithdrawPortal';

import LandingPage from './components/landing/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';

const Dashboard = () => (
    <>
        <QuickActions />
        <StatsGrid />
        <Charts />
        <ActivityList />
    </>
);

function App() {
    return (
        <>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
                theme="dark"
            />
            <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/referral" element={<ReferralDashboard />} />
                    <Route path="/slot-activation" element={<SlotActivation />} />
                    <Route path="/nft-royalty" element={<NFTRoyalty />} />
                    <Route path="/wallet" element={<TokenWallet />} />
                    <Route path="/swap" element={<TokenSwap />} />
                    <Route path="/staking" element={<StakingDashboard />} />
                    <Route path="/withdraw" element={<WithdrawPortal />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
App;
