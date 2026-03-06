import { api, handleServiceError } from './axios';
import { API_ENDPOINTS } from '../utils/endpoints';

export const referralApiService = {
    async getStats() {
        try {
            const response = await api.get(API_ENDPOINTS.REFERRAL.STATS);
            return response.data;
        } catch (error) {
            return handleServiceError(error, 'ReferralApiService.getStats');
        }
    },

    async getNetwork() {
        try {
            const response = await api.get(API_ENDPOINTS.REFERRAL.NETWORK);
            return response.data;
        } catch (error) {
            return handleServiceError(error, 'ReferralApiService.getNetwork');
        }
    }
};
