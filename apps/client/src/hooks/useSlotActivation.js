import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { slotApiService } from '../services/slotApiService';

/**
 * Fetch a user's slot activation by their user_id.
 * @param {string|number} userId
 */
export const useGetSlotActivation = (userId) => {
    return useQuery({
        queryKey: ['slotActivation', userId],
        queryFn: () => slotApiService.fetchSlotActivation(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Update the authenticated user's own slot activation.
 * Automatically invalidates the slot activation cache on success.
 * @param {string|number} userId — used to invalidate the correct cache key
 */
export const useUpdateSlotActivation = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slotActivationData) => slotApiService.updateSlotActivation(slotActivationData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['slotActivation', userId] });
            queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
        },
    });
};