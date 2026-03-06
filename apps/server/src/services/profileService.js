import { queryRunner } from '../config/db.js';
import { serviceResponse } from '../utils/helper.js';

export const getProfileByUserId = async (userId) => {
    try {
        console.log(`[ProfileService] Fetching profile for user ID: ${userId}`);
        const result = await queryRunner(
            'SELECT * FROM profile WHERE user_id = $1',
            [userId]
        );

        if (result.length === 0) {
            return serviceResponse(false, 404, 'Profile not found');
        }

        return serviceResponse(true, 200, 'Profile fetched successfully', result[0]);
    } catch (err) {
        console.error(`[ProfileService] Error in getProfileByUserId: ${err.message}`);
        return serviceResponse(false, 500, 'Error fetching profile', null, err.message);
    }
};

export const updateProfile = async (userId, profileData) => {
    try {
        const { username, email, phone_number, dob, city, country } = profileData;

        console.log(`[ProfileService] Updating profile for user ID: ${userId}`);

        await queryRunner(
            `UPDATE profile
             SET username = $1, email = $2, phone_number = $3, dob = $4, city = $5, country = $6
             WHERE user_id = $7`,
            [username, email, phone_number, dob, city, country, userId]
        );

        return serviceResponse(true, 200, 'Profile updated successfully');
    } catch (err) {
        console.error(`[ProfileService] Error in updateProfile: ${err.message}`);
        return serviceResponse(false, 500, 'Error updating profile', null, err.message);
    }
};

export const updateProfilePicture = async (userId, profilePicture) => {
    try {
        console.log(`[ProfileService] Updating profile picture for user ID: ${userId}`);

        await queryRunner(
            `INSERT INTO profile (user_id, profile_picture)
             VALUES ($1, $2)
             ON CONFLICT (user_id) DO UPDATE SET 
                profile_picture = EXCLUDED.profile_picture`,
            [userId, profilePicture]
        );

        return serviceResponse(true, 200, 'Profile picture updated successfully');
    } catch (err) {
        console.error(`[ProfileService] Error in updateProfilePicture: ${err.message}`);
        return serviceResponse(false, 500, 'Error updating profile picture', null, err.message);
    }
};

export const getAllProfiles = async () => {

    try {
        console.log(`[ProfileService] Fetching all profiles`);
        const allProfiles = await queryRunner('SELECT * FROM profile');
        return serviceResponse(true, 200, 'Profiles fetched successfully', allProfiles);
    } catch (err) {
        console.error(`[ProfileService] Error in getAllProfiles: ${err.message}`);
        return serviceResponse(false, 500, 'Error fetching all profiles', null, err.message);
    }
};
