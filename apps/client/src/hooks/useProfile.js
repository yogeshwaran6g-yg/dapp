import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApiService } from '../services/profileApiService';

/**
 * Fetch a user's profile by their user_id.
 * @param {string|number} userId
 */
export const useGetProfile = (userId) => {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: () => profileApiService.fetchProfile(userId),
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
        mutationFn: (profileData) => profileApiService.updateProfile(profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        },
    });
};

/**
 * Upload profile picture for the authenticated user.
 * Automatically invalidates the profile cache on success.
 * @param {string|number} userId — used to invalidate the correct cache key
 */
export const useUploadProfilePicture = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => profileApiService.uploadProfilePicture(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        },
    });
};

