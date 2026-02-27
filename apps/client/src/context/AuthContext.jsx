import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useNonce, useVerifySignature } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { refetch: fetchNonce } = useNonce(address);
    const verifyMutation = useVerifySignature();
    
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));

    // Synchronize state with storage or account changes
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (token && storedUser && isConnected && storedUser.wallet_address?.toLowerCase() === address?.toLowerCase()) {
            setIsAuthenticated(true);
            setUser(storedUser);
        } else if (!isConnected || (address && storedUser && storedUser.wallet_address?.toLowerCase() !== address?.toLowerCase())) {
            // Only clear if we explicitly have a mismatch or disconnect
            // This prevents clearing state during initial load if wagmi isn't ready
            if (!isConnected || (address && storedUser)) {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
    }, [address, isConnected]);

    const login = useCallback(async () => {
        if (!isConnected || !address) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsLoggingIn(true);
        try {
            const { data: nonce } = await fetchNonce();
            if (!nonce) throw new Error('Failed to get nonce');

            const origin = window.location.origin;
            const message = `Sign this message to authenticate with our dApp.\n\nURI: ${origin}\nNonce: ${nonce}`;

            const signature = await signMessageAsync({ message });
            const result = await verifyMutation.mutateAsync({ address, signature });

            setIsAuthenticated(true);
            setUser(result.user);
            
            toast.success('Successfully authenticated!');
            return result;
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.message || 'Authentication failed');
            throw error;
        } finally {
            setIsLoggingIn(false);
        }
    }, [address, isConnected, fetchNonce, signMessageAsync, verifyMutation]);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        toast.success('Logged out');
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthenticated,
        isLoggingIn,
        login,
        logout
    }), [user, isAuthenticated, isLoggingIn, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
