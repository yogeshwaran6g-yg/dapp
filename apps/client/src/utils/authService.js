import axios from 'axios';
import { ethers } from 'ethers';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

export const authService = {
    async getNonce(address) {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/nonce`, { address });
            return response.data.nonce;
        } catch (error) {
            console.error('Error fetching nonce:', error);
            throw new Error(error.response?.data?.message || 'Failed to get nonce');
        }
    },

    async verifySignature(address, signature) {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify`, { address, signature });
            return response.data; // Returns { token, user }
        } catch (error) {
            console.error('Verification error:', error);
            throw new Error(error.response?.data?.message || 'Verification failed');
        }
    },

    async login() {
        try {
            const address = await this.connectWallet();
            const nonce = await this.getNonce(address);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const message = `Sign this message to authenticate: ${nonce}`;
            const signature = await signer.signMessage(message);

            const authData = await this.verifySignature(address, signature);

            // Store token and user data
            localStorage.setItem('authToken', authData.token);
            localStorage.setItem('user', JSON.stringify(authData.user));

            return authData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    isLoggedIn() {
        return !!localStorage.getItem('authToken');
    },

    getAuthHeader() {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};
