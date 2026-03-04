import { api, handleServiceError } from './axios';
import { API_ENDPOINTS } from '../utils/endpoints';

export const walletApiService = {
    /**
     * Fetch the user's on-chain balance from the backend
     * @returns {Promise<Object>} The balance data { ethBalance, address }
     */
    async getBalance() {
        try {
            const response = await api.get(API_ENDPOINTS.WALLET.BALANCE, {}, {
                showErrorToast: false
            });
            // The axios interceptor returns response.data (the whole { status, message, data } object)
            // We need to return the nested data object
            return response?.data || { ethBalance: '0.00', usdtBalance: '0.00' };
        } catch (error) {
            return handleServiceError(error, 'WalletApiService.getBalance');
        }
    },

    /**
     * Request test funds from the faucet
     * @param {number} amount - Amount to request
     * @returns {Promise<Object>} Result of the faucet request
     */
    async requestFaucet(amount) {
        try {
            const data = await api.post(API_ENDPOINTS.WALLET.FAUCET, { amount }, {
                showSuccessToast: true
            });
            return data;
        } catch (error) {
            return handleServiceError(error, 'WalletApiService.requestFaucet');
        }
    }
};
