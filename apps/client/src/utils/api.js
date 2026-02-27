import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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
