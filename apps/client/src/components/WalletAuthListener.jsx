import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAuthContext } from '../context/AuthContext';

export function WalletAuthListener() {
    const { isConnected, address } = useAccount();
    const { isAuthenticated, isLoggingIn, login, logout } = useAuthContext();

    const authAttemptedRef = useRef(false);
    const previousAddressRef = useRef(null);

    useEffect(() => {
        if (!isConnected) {
            // Only trigger logout if we were previously authenticated
            if (isAuthenticated) {
                logout();
            }
            authAttemptedRef.current = false;
            previousAddressRef.current = null;
            return;
        }

        // If address changed, we need a new session
        if (address && previousAddressRef.current && previousAddressRef.current.toLowerCase() !== address.toLowerCase()) {
            authAttemptedRef.current = false;
            previousAddressRef.current = address;
            logout();
        }

        if (!previousAddressRef.current) {
            previousAddressRef.current = address;
        }

        // Check if we need to login
        if (isConnected && !isAuthenticated && !isLoggingIn && !authAttemptedRef.current) {
            authAttemptedRef.current = true;
            login().catch(() => {
                // If login fails, allow retrying on next change
                authAttemptedRef.current = false;
            });
        }
    }, [isConnected, address, isAuthenticated, isLoggingIn, login, logout]);

    return null;
}
