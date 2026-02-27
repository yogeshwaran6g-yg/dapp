import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useNonce, useVerifySignature } from '../hooks/useAuth';
import { toast } from 'react-toastify';

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
        const storedUserJSON = localStorage.getItem('user');
        
        if (!isConnected || !address) {
            // Only clear if we were previously authenticated
            if (isAuthenticated || user) {
                console.log('[Auth] Disconnected or no address, clearing state');
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
            return;
        }

        // We have address and isConnected
        if (token && storedUserJSON) {
            const storedUser = JSON.parse(storedUserJSON);
            if (storedUser.wallet_address?.toLowerCase() === address.toLowerCase()) {
                // Ensure we don't trigger re-render if state is already correct
                if (!isAuthenticated) setIsAuthenticated(true);
                setUser(prev => {
                    if (prev && prev.id === storedUser.id && prev.wallet_address === storedUser.wallet_address) {
                        return prev;
                    }
                    return storedUser;
                });
            } else {
                // Address mismatch
                console.log('[Auth] Address mismatch, clearing state');
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
    }, [address, isConnected, isAuthenticated, user]);

    const login = useCallback(async () => {
        if (!isConnected || !address) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsLoggingIn(true);
        try {
            console.log('[Auth] Fetching nonce for address:', address);
            const { data: nonce, error: nonceError } = await fetchNonce();
            
            if (nonceError) throw nonceError;
            if (!nonce) throw new Error('Failed to get nonce from server');

            console.log('[Auth] Nonce received:', nonce);

            const origin = window.location.origin;
            const message = `Sign this message to authenticate with our dApp.\n\nURI: ${origin}\nNonce: ${nonce}`;

            console.log('[Auth] Requesting signature...');
            const signature = await signMessageAsync({ message });
            
            console.log('[Auth] Signature received, verifying...');
            const result = await verifyMutation.mutateAsync({ address, signature });

            console.log('[Auth] Verification successful');
            setIsAuthenticated(true);
            setUser(result.user);
            
            toast.success('Successfully authenticated!');
            return result;
        } catch (error) {
            console.error('[Auth] Login flow error:', error);
            // Don't show toast for user rejection, it's annoying
            if (error.code !== 4001 && !error.message?.includes('User rejected')) {
                toast.error(error.message || 'Authentication failed');
            }
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
