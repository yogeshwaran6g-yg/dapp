import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useWalletAuth } from '../hooks/useWalletAuth';

export function WalletAuthListener() {
    const { isConnected, address } = useAccount();
    const { isAuthenticated, isAuthenticating, login, logout } = useWalletAuth();

    const authAttemptedRef = useRef(false);
    const previousAddressRef = useRef(null);

    useEffect(() => {
        if (!isConnected) {
            logout();
            authAttemptedRef.current = false;
            previousAddressRef.current = null;
            return;
        }

        if (previousAddressRef.current !== address) {
            authAttemptedRef.current = false;
            previousAddressRef.current = address;
            logout();
        }

        const token = localStorage.getItem('jwt_token');
        const storedAddress = localStorage.getItem('wallet_address');
        const hasValidSession = token && storedAddress === address;

        if (isConnected && !hasValidSession && !isAuthenticating && !authAttemptedRef.current) {
            authAttemptedRef.current = true;
            login();
        }
    }, [isConnected, address, isAuthenticated, isAuthenticating, login, logout]);

    return null;
}
