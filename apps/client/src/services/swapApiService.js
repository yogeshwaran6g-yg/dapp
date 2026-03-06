import { api, handleServiceError } from './axios';
import { API_ENDPOINTS } from '../utils/endpoints';

export const swapApiService = {
    /**
     * Execute a token swap
     * @param {string} swapType - e.g. 'USDT_TO_OWN', 'USDT_TO_ENERGY', 'OWN_TO_USDT', 'OWN_TO_ENERGY'
     * @param {number} amount - amount of the source token to swap
     * @returns {Promise<Object>}
     */
    async executeSwap(swapType, amount) {
        try {
            const data = await api.post(API_ENDPOINTS.SWAP.EXECUTE, { swapType, amount }, {
                showSuccessToast: true,
            });
            return data;
        } catch (error) {
            return handleServiceError(error, 'SwapApiService.executeSwap');
        }
    },

    /**
     * Fetch swap history for the current user
     * @returns {Promise<Object>}
     */
    async getSwapHistory() {
        try {
            const response = await api.get(API_ENDPOINTS.SWAP.HISTORY, {}, {
                showErrorToast: false,
            });
            return response?.data || [];
        } catch (error) {
            return handleServiceError(error, 'SwapApiService.getSwapHistory');
        }
    },

    /**
     * Fetch current swap rates
     * @returns {Promise<Object>}
     */
    async getSwapRates() {
        try {
            const response = await api.get(API_ENDPOINTS.SWAP.RATES, {}, {
                showErrorToast: false,
            });
            return response?.data || {};
        } catch (error) {
            return handleServiceError(error, 'SwapApiService.getSwapRates');
        }
    },
};
