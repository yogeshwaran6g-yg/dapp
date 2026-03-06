import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
import PageHeading from './components/PageHeading';
import Tickets from './components/Tickets';
import Notifications from './components/Notifications';

import LandingPage from './components/landing/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { authApiService } from './services/authApiService';
import { useAuthContext } from './context/AuthContext';

const Dashboard = () => (
    <div className="space-y-6">
        <PageHeading
            highlight="SYSTEM"
            title="OVERVIEW"
            subtitle="Real-time analytics and protocol management interface."
        />
        <QuickActions />
        <StatsGrid />
        <Charts />
        <ActivityList />
    </div>
);

const DevLoginHandler = () => {
    const { address } = useParams();
    const navigate = useNavigate();
    const { setUser, setIsAuthenticated } = useAuthContext();

    useEffect(() => {
        const performDevLogin = async () => {
            try {
                // Use address from URL or a default test address
                const loginAddress = address || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
                console.log("Dev Logging in with:", loginAddress);

                const result = await authApiService.devLogin(loginAddress);
                console.log("Dev login result:", result);

                const { token, user } = result.data;

                localStorage.setItem('authToken', token);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    setUser(user);
                }
                setIsAuthenticated(true);

                toast.success('Developer login successful!');
                navigate('/slot-activation');
            } catch (err) {
                console.error("Dev login failed", err);
                toast.error("Dev login failed. Check console.");
                navigate('/');
            }
        };
        performDevLogin();
    }, [address, navigate, setUser, setIsAuthenticated]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-gold animate-pulse text-xl">Authenticating Dev Session...</div>
        </div>
    );
};

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
                <Route path="/devlogin" element={<DevLoginHandler />} />
                <Route path="/devlogin/:address" element={<DevLoginHandler />} />

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
                        <Route path="/tickets" element={<Tickets />} />
                        <Route path="/notifications" element={<Notifications />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
App;
