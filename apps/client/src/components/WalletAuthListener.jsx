import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useAuthContext } from '../context/AuthContext';
import { useNonce, useLogin } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * WalletAuthListener
 * Automatically triggers the signature request immediately after connection
 * if the user is not authenticated.
 */
export function WalletAuthListener() {
    const { address, isConnected } = useAccount();
    const { isAuthenticated } = useAuthContext();
    const { login } = useLogin();
    const referralCode = localStorage.getItem('referralCode');
    const { data: nonce, refetch: fetchNonce } = useNonce(
        isConnected && !isAuthenticated ? address : null,
        referralCode
    );
    const navigate = useNavigate();

    // Use a ref to prevent multiple simultaneous signing requests
    const isAuthenticating = useRef(false);

    useEffect(() => {
        const handleAutoLogin = async () => {
            if (isConnected && address && !isAuthenticated && !isAuthenticating.current) {
                isAuthenticating.current = true;

                try {
                    // 1. Get a fresh nonce (referralCode is already in the hook's queryKey)
                    const result = await fetchNonce();
                    const currentNonce = result.data;

                    if (currentNonce) {
                        // 2. Trigger the login (signature prompt)
                        const loginResult = await login(currentNonce);
                        if (loginResult) {
                            // Clear referral code after successful login
                            localStorage.removeItem('referralCode');
                            navigate('/dashboard');
                        }
                    }
                } catch (error) {
                    console.error('Auto-login failed:', error);
                } finally {
                    isAuthenticating.current = false;
                }
            }
        };

        handleAutoLogin();
    }, [isConnected, address, isAuthenticated, fetchNonce, login, navigate]);

    return null;
}
