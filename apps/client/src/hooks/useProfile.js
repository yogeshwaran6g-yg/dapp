import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, updateProfile } from '../utils/api';

/**
 * Fetch a user's profile by their user_id.
 * @param {string|number} userId
 */
export const useGetProfile = (userId) => {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: () => fetchProfile(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Update the authenticated user's own profile.
 * Automatically invalidates the profile cache on success.
 * @param {string|number} userId — used to invalidate the correct cache key
 */
export const useUpdateProfile = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (profileData) => updateProfile(profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        },
    });
};
