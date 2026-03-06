import { api, handleServiceError } from './axios';
import { API_ENDPOINTS } from '../utils/endpoints';

export const authApiService = {

    async getNonce(address, options = {}) {
        try {
            const { referralCode } = options;
            const params = { address };
            if (referralCode) params.ref = referralCode;

            const response = await api.get(API_ENDPOINTS.AUTH.NONCE, params);
            return response.data?.nonce || response.nonce;
        } catch (error) {
            return handleServiceError(error, 'AuthApiService.getNonce');
        }
    },


    async verifySignature(address, signature) {
        try {
            const data = await api.post(API_ENDPOINTS.AUTH.VERIFY, { address, signature }, {
                showSuccessToast: true
            });
            return data;
        } catch (error) {
            return handleServiceError(error, 'AuthApiService.verifySignature');
        }
    },

    async devLogin(address) {
        try {
            const data = await api.get(API_ENDPOINTS.AUTH.DEV_LOGIN(address), {
                showSuccessToast: true
            });
            return data;
        } catch (error) {
            return handleServiceError(error, 'AuthApiService.devLogin');
        }
    }
};
