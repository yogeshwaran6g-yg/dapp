import { useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from '../services/authApi';

export const useNonce = (address) => {
    return useQuery({
        queryKey: ['nonce', address],
        queryFn: () => authApi.getNonce(address),
        enabled: !!address,
        staleTime: 0, // Always get a fresh nonce
        retry: false
    });
};

export const useVerifySignature = () => {
    return useMutation({
        mutationFn: ({ address, signature }) => authApi.verifySignature(address, signature),
        onSuccess: (data) => {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
    });
};
