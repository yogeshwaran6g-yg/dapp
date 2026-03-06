import { api, handleServiceError } from './axios';
import { API_ENDPOINTS } from '../utils/endpoints';

export const profileApiService = {

    async fetchProfile(userId) {
        try {
            const data = await api.get(API_ENDPOINTS.PROFILE.GET_BY_USER(userId), {}, {
                showErrorToast: false
            });
            return data;
        } catch (error) {
            return handleServiceError(error, 'ProfileApiService.fetchProfile');
        }
    },

    async updateProfile(profileData) {
        try {
            const data = await api.put(API_ENDPOINTS.PROFILE.UPDATE, profileData, {
                showSuccessToast: true,
            });
            return data;
        } catch (error) {
            return handleServiceError(error, 'ProfileApiService.updateProfile');
        }
    },

    async uploadProfilePicture(formData) {
        try {
            const data = await api.post(`${API_ENDPOINTS.PROFILE.UPDATE}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                showSuccessToast: true,
            });
            return data;
        } catch (error) {
            return handleServiceError(error, 'ProfileApiService.uploadProfilePicture');
        }
    },

    async getAllProfiles() {

        try {
            const data = await api.get(API_ENDPOINTS.PROFILE.GET_ALL);
            return data;
        } catch (error) {
            return handleServiceError(error, 'ProfileApiService.getAllProfiles');
        }
    }
};
