import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAuthContext } from '../context/AuthContext';

export function WalletAuthListener() {
    const { isConnected, address } = useAccount();
    const { isAuthenticated, isLoggingIn, login, logout } = useAuthContext();

    const authAttemptedRef = useRef(false);
    const previousAddressRef = useRef(null);
    const retryCountRef = useRef(0);
    const MAX_RETRIES = 2;

    useEffect(() => {
        if (!isConnected) {
            // Only trigger logout if we were previously authenticated
            if (isAuthenticated) {
                logout();
            }
            authAttemptedRef.current = false;
            previousAddressRef.current = null;
            retryCountRef.current = 0;
            return;
        }

        // If address changed, we need a new session
        if (address && previousAddressRef.current && previousAddressRef.current.toLowerCase() !== address.toLowerCase()) {
            authAttemptedRef.current = false;
            previousAddressRef.current = address;
            retryCountRef.current = 0;
            logout();
        }

        if (!previousAddressRef.current) {
            previousAddressRef.current = address;
        }

        // Check if we need to login
        if (isConnected && !isAuthenticated && !isLoggingIn && !authAttemptedRef.current) {
            if (retryCountRef.current >= MAX_RETRIES) {
                console.warn('[Auth] Max retries reached. Stopping automatic login.');
                authAttemptedRef.current = true; // Mark as attempted to stop loop
                return;
            }

            authAttemptedRef.current = true;
            retryCountRef.current += 1;
            
            console.log(`[Auth] Attempting automatic login (attempt ${retryCountRef.current}/${MAX_RETRIES})...`);
            
            login().catch((err) => {
                console.error('[Auth] Login failed:', err);
                // If it's a user rejection, don't retry automatically
                if (err.code === 4001 || err.message?.includes('User rejected')) {
                    console.log('[Auth] User rejected request. Stopping retries.');
                } else {
                    // For other errors, allow one more retry after a short delay
                    setTimeout(() => {
                        authAttemptedRef.current = false;
                    }, 3000);
                }
            });
        }
    }, [isConnected, address, isAuthenticated, isLoggingIn, login, logout]);

    return null;
}
