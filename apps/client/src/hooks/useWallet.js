import { useQuery } from '@tanstack/react-query';
import { walletApiService } from '../services/walletApiService';

/**
 * Hook to fetch the real on-chain balance from the backend
 * @returns {Object} query result
 */
export const useWalletBalance = () => {
    const token = localStorage.getItem('authToken');

    return useQuery({
        queryKey: ['walletBalance'],
        queryFn: async () => {
            return await walletApiService.getBalance();
        },
        enabled: !!token && token !== 'undefined' && token !== 'null',
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000,
        retry: 1,
    });
};

/**
 * Hook to fetch the user's transaction history
 * @returns {Object} query result
 */
export const useWalletTransactions = () => {
    const token = localStorage.getItem('authToken');

    return useQuery({
        queryKey: ['walletTransactions'],
        queryFn: async () => {
            return await walletApiService.getTransactions();
        },
        enabled: !!token && token !== 'undefined' && token !== 'null',
        refetchInterval: 30000,
        staleTime: 10000,
        retry: 1,
    });
};
