import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

export const authApi = {
    async getNonce(address) {
        const { data } = await axios.get(`${API_BASE_URL}/auth/nonce`, {
            params: { address }
        });
        return data.nonce;
    },

    async verifySignature(address, signature) {
        const { data } = await axios.post(`${API_BASE_URL}/auth/verify`, {
            address,
            signature
        });
        return data; // { token, user }
    }
};
