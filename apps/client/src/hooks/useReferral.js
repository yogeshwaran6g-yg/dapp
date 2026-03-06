import { useQuery } from '@tanstack/react-query';
import { referralApiService } from '../services/referralApiService';

/**
 * Hook to fetch referral statistics
 */
export const useReferralStats = () => {
    return useQuery({
        queryKey: ['referral-stats'],
        queryFn: () => referralApiService.getStats(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to fetch direct referral network
 */
export const useReferralNetwork = () => {
    return useQuery({
        queryKey: ['referral-network'],
        queryFn: () => referralApiService.getNetwork(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
