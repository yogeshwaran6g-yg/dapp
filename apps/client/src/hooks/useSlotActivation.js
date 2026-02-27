import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSlotActivation, updateSlotActivation } from '../utils/api';

/**
 * Fetch a user's slot activation by their user_id.
 * @param {string|number} userId
 */
export const useGetSlotActivation = (userId) => {
    return useQuery({
        queryKey: ['slotActivation', userId],
        queryFn: () => fetchSlotActivation(userId),
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
        mutationFn: (slotActivationData) => updateSlotActivation(slotActivationData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['slotActivation', userId] });
        },
    });
};