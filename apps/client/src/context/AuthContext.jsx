import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { address, isConnected } = useAccount();

    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            if (stored && stored !== 'undefined' && stored !== 'null') {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to parse initial user from localStorage', e);
        }
        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => 
        !!localStorage.getItem('authToken')
    );

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUserJSON = localStorage.getItem('user');

        // Case 1: Wallet disconnected or no address
        if (!isConnected || !address) {
            // If we have a token + user → probably dev login → keep it
            if (token && storedUserJSON && storedUserJSON !== 'undefined' && storedUserJSON !== 'null') {
                return; // preserve dev session across refreshes
            }

            // Otherwise → real wallet disconnect → clear everything
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return;
        }

        // Case 2: We have an active wallet connection
        if (!token || !storedUserJSON || storedUserJSON === 'undefined' || storedUserJSON === 'null') {
            // No session → probably needs to sign in
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        try {
            const storedUser = JSON.parse(storedUserJSON);

            if (storedUser?.wallet_address?.toLowerCase() === address.toLowerCase()) {
                // Session matches current wallet → good to go
                setIsAuthenticated(true);
                setUser(prev => (prev?.id === storedUser.id ? prev : storedUser));
            } else {
                // Wallet changed → clear old / stale session
                console.warn('Wallet address mismatch — clearing stale session');
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        } catch (e) {
            console.error('Failed to parse user during wallet sync', e);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    }, [address, isConnected]);

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