import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));

    // Sync state when wallet disconnects or address changes
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUserJSON = localStorage.getItem('user');

        if (!isConnected || !address) {
            // If we have a valid session in storage, don't clear it 
            // (allows dev login and page refreshes without re-connecting wallet)
            if (token && storedUserJSON) {
                return;
            }

            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return;
        }

        if (token && storedUserJSON) {
            const storedUser = JSON.parse(storedUserJSON);
            if (storedUser.wallet_address?.toLowerCase() === address.toLowerCase()) {
                setIsAuthenticated(true);
                setUser(prev => prev?.id === storedUser.id ? prev : storedUser);
            } else {
                // Different address — clear stale session
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
