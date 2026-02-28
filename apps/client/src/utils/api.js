import api from '../services/axios';
import { API_ENDPOINTS } from './endpoints';

export const fetchProfile = async (userId) => {
    try {
        const data = await api.get(API_ENDPOINTS.PROFILE.GET_BY_USER(userId));
        return data;
    } catch (error) {
        console.error('API Error (fetchProfile):', error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const data = await api.put(API_ENDPOINTS.PROFILE.UPDATE, profileData, {
            showSuccessToast: true,
            showErrorToast: true
        });
        return data;
    } catch (error) {
        console.error('API Error (updateProfile):', error);
        throw error;
    }
};

export const fetchSlotActivation = async (userId) => {
    try {
        const data = await api.get(API_ENDPOINTS.SLOT_ACTIVATION.GET_BY_USER(userId));
        return data;
    } catch (error) {
        console.error('API Error (fetchSlotActivation):', error);
        throw error;
    }
};

export const updateSlotActivation = async (slotActivationData) => {
    try {
        const data = await api.put(API_ENDPOINTS.SLOT_ACTIVATION.UPDATE, slotActivationData, {
            showSuccessToast: true,
            showErrorToast: true
        });
        return data;
    } catch (error) {
        console.error('API Error (updateSlotActivation):', error);
        throw error;
    }
};

export default api;
