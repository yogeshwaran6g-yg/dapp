import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { address, isConnected } = useAccount();

    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            if (stored && stored !== 'undefined') {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Initial parse error for user', e);
        }
        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));

    // Sync state when wallet disconnects or address changes
    useEffect(() => {
        if (!isConnected || !address) {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return;
        }

        const token = localStorage.getItem('authToken');
        const storedUserJSON = localStorage.getItem('user');

        if (token && storedUserJSON && storedUserJSON !== 'undefined') {
            try {
                const storedUser = JSON.parse(storedUserJSON);
                if (storedUser && storedUser.wallet_address?.toLowerCase() === address.toLowerCase()) {
                    setIsAuthenticated(true);
                    setUser(prev => prev?.id === storedUser.id ? prev : storedUser);
                } else {
                    // Different address or invalid user object — clear stale session
                    setIsAuthenticated(false);
                    setUser(null);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
            } catch (e) {
                console.error('Effect parse error for user', e);
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
    }, [address, isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, setUser, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
};
