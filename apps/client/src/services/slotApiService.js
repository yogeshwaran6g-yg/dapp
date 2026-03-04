import { api, handleServiceError } from './axios';
import { API_ENDPOINTS } from '../utils/endpoints';

export const slotApiService = {
    /**
     * Fetch slot activation/levels for a user
     * @param {string|number} userId 
     * @returns {Promise<Object>}
     */
    async fetchSlotActivation(userId) {
        try {
            const data = await api.get(API_ENDPOINTS.SLOT_ACTIVATION.GET_BY_USER(userId));
            return data;
        } catch (error) {
            return handleServiceError(error, 'SlotApiService.fetchSlotActivation');
        }
    },

    /**
     * Update slot activation/levels
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async updateSlotActivation(data) {
        try {
            const response = await api.put(API_ENDPOINTS.SLOT_ACTIVATION.UPDATE, data, {
                showSuccessToast: true
            });
            return response;
        } catch (error) {
            return handleServiceError(error, 'SlotApiService.updateSlotActivation');
        }
    },

    /**
     * Fetch the admin wallet address for payments
     * @returns {Promise<Object>}
     */
    async fetchAdminWallet() {
        try {
            const response = await api.get(API_ENDPOINTS.SLOT_ACTIVATION.GET_ADMIN_WALLET);
            return response;
        } catch (error) {
            return handleServiceError(error, 'SlotApiService.fetchAdminWallet');
        }
    }
};
