const API_BASE_URL = 'http://localhost:5000/api';

export const fetchProfile = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        return await response.json();
    } catch (error) {
        console.error('API Error (fetchProfile):', error);
        throw error;
    }
};

export const updateProfile = async (userId, profileData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return await response.json();
    } catch (error) {
        console.error('API Error (updateProfile):', error);
        throw error;
    }
};
