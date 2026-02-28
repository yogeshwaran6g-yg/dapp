import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSignMessage, useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { authApiService } from '../services/authApiService';
import { useAuthContext } from '../context/AuthContext';

// ─── Data Hooks ───────────────────────────────────────────────────────────────

export const useNonce = (address) =>
    useQuery({
        queryKey: ['nonce', address],
        queryFn: () => authApiService.getNonce(address),
        enabled: !!address,
        staleTime: Infinity,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

export const useVerifySignature = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ address, signature }) => authApiService.verifySignature(address, signature),
        onSuccess: (data) => {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            queryClient.invalidateQueries();
        },
    });
};

// ─── Action Hooks ─────────────────────────────────────────────────────────────

/**
 * useLogin — signs a nonce and verifies with the server.
 * Call `login(nonce)` from a direct user gesture (button click) only.
 */
export const useLogin = () => {
    const { address } = useAccount();
    const { setUser, setIsAuthenticated } = useAuthContext();
    const { signMessageAsync, isPending: isSigning } = useSignMessage();
    const verifyMutation = useVerifySignature();
    const verifyMutationRef = useRef(verifyMutation);
    verifyMutationRef.current = verifyMutation;
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const login = useCallback(async (nonce) => {
        if (!nonce) {
            toast.error('Could not get a nonce. Please try again.');
            return;
        }

        try {
            const origin = window.location.origin;
            const message = `Sign this message to authenticate with our dApp.\n\nURI: ${origin}\nNonce: ${nonce}`;

            // Use mutateAsync for promise control, or mutate with callbacks
            const signature = await signMessageAsync({ message });

            // Then verify...
            const result = await verifyMutationRef.current.mutateAsync({ address, signature });

            setUser(result.user);
            setIsAuthenticated(true);
            toast.success('Successfully authenticated!');
            return result;
        } catch (error) {
            if (error.code !== 4001 && !error.message?.includes('User rejected')) {
                toast.error(error.message || 'Authentication failed');
            }
            throw error;
        }
    }, [address, verifyMutationRef, setUser, setIsAuthenticated]);
    return { login, isLoggingIn };
};

/**
 * useLogout — clears auth state and local storage.
 */
export const useLogout = () => {
    const { setUser, setIsAuthenticated } = useAuthContext();

    return useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        toast.success('Logged out');
    }, [setUser, setIsAuthenticated]);
};
