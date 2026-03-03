import { useQuery } from '@tanstack/react-query';
import axios from '../services/axios';

/**
 * Hook to fetch the real on-chain balance from the backend
 * @returns {Object} query result
 */
export const useWalletBalance = () => {
    return useQuery({
        queryKey: ['walletBalance'],
        queryFn: async () => {
            try {
                const response = await axios.get('/api/v1/wallet/balance');
                // axios interceptor returns the data body directly
                // Our backend returns { status, message, data: { address, ethBalance } }
                return response?.data || { ethBalance: '0.00' };
            } catch (err) {
                console.error("[useWalletBalance] Error fetching balance:", err);
                return { ethBalance: '0.00' };
            }
        },
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000,
        retry: 1,
    });
};
