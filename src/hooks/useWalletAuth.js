import { useState, useCallback, useEffect } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useWalletAuth() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { disconnect } = useDisconnect();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const logout = useCallback(() => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('wallet_address');
        setIsAuthenticated(false);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const storedAddress = localStorage.getItem('wallet_address');

        if (token && storedAddress === address && isConnected) {
            setIsAuthenticated(true);
        } else if (!isConnected || storedAddress !== address) {
            logout();
        }
    }, [address, isConnected, logout]);

    const login = useCallback(async () => {
        if (!address || isAuthenticating) return;

        try {
            setIsAuthenticating(true);

            const nonceRes = await fetch(`${API_URL}/auth/nonce?address=${address}`);
            if (!nonceRes.ok) throw new Error('Failed to fetch nonce');
            const { nonce } = await nonceRes.json();

            const message = `Sign this message to authenticate with our dApp.\n\nURI: ${window.location.origin}\nNonce: ${nonce}`;
            const signature = await signMessageAsync({ message });

            const verifyRes = await fetch(`${API_URL}/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, signature, message })
            });

            if (!verifyRes.ok) throw new Error('Signature verification failed');
            const { token } = await verifyRes.json();

            localStorage.setItem('jwt_token', token);
            localStorage.setItem('wallet_address', address);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Authentication error:', error);
            logout();
            disconnect();
        } finally {
            setIsAuthenticating(false);
        }
    }, [address, signMessageAsync, disconnect, logout, isAuthenticating]);

    return {
        isAuthenticated,
        isAuthenticating,
        login,
        logout
    };
}
