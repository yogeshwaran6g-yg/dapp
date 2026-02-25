import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchProfile = async (userId) => {
    try {
        const { data } = await api.get(`/profile/${userId}`);
        return data;
    } catch (error) {
        console.error('API Error (fetchProfile):', error);
        throw error;
    }
};

export const updateProfile = async (userId, profileData) => {
    try {
        const { data } = await api.put(`/profile/${userId}`, profileData);
        return data;
    } catch (error) {
        console.error('API Error (updateProfile):', error);
        throw error;
    }
};

export default api;
