import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoggingIn } = useAuthContext();

    // Show a loading state if we are currently authenticating
    if (isLoggingIn) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black-pure">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        );
    }

    // Redirect to landing page if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Render children if authenticated
    return <Outlet />;
};

export default ProtectedRoute;
