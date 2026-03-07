import { api, handleServiceError } from './axios';
import { API_ENDPOINTS } from '../utils/endpoints';

export const walletApiService = {
    /**
     * Fetch the user's on-chain balance from the backend
     * @returns {Promise<Object>} The balance data { bnbBalance, usdtBalance, address }
     */
    async getBalance() {
        try {
            const response = await api.get(API_ENDPOINTS.WALLET.BALANCE, {}, {
                showErrorToast: false
            });
            // The axios interceptor returns response.data (the whole { status, message, data } object)
            // We need to return the nested data object
            return response?.data || { bnbBalance: '0.00', usdtBalance: '0.00' };
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
    },

    /**
     * Top up internal OWN TOKEN balance (Faucet)
     * @param {number} amount 
     * @returns {Promise<Object>}
     */
    async topUpInternal(amount = 1000) {
        try {
            const data = await api.post(API_ENDPOINTS.WALLET.TOPUP_INTERNAL, { amount }, {
                showSuccessToast: true
            });
            return data;
        } catch (error) {
            return handleServiceError(error, 'WalletApiService.topUpInternal');
        }
    },

    /**
     * Manually update wallet balance (Admin/Testing)
     * @param {string} type - 'NRG' or 'DB'
     * @param {number} amount 
     * @returns {Promise<Object>}
     */
    async updateBalance(type, amount) {
        try {
            const data = await api.post(API_ENDPOINTS.WALLET.UPDATE_BALANCE, { type, amount }, {
                showSuccessToast: true
            });
            return data;
        } catch (error) {
            return handleServiceError(error, 'WalletApiService.updateBalance');
        }
    },

    /**
     * Fetch user transaction history
     * @returns {Promise<Array>}
     */
    async getTransactions() {
        try {
            const response = await api.get(API_ENDPOINTS.WALLET.TRANSACTIONS, {}, {
                showErrorToast: false
            });
            return response?.data || [];
        } catch (error) {
            return handleServiceError(error, 'WalletApiService.getTransactions');
        }
    }
};
