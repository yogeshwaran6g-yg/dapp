import { queryRunner } from '../config/db.js';
import { rtnRes } from '../utils/helper.js';

export const getProfile = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id || isNaN(user_id)) {
            return rtnRes(res, 400, 'Valid user_id is required');
        }

        const result = await queryRunner(
            'SELECT * FROM profile WHERE user_id = $1',
            [user_id]
        );
        if (result.length === 0) {
            return rtnRes(res, 404, 'Profile not found');
        }
        return rtnRes(res, 200, 'Profile fetched successfully', result[0]);
    } catch (err) {
        console.error(err.message);
        return rtnRes(res, 500, err.message);
    }
};

// PUT /api/profile  — authenticated, update own profile via JWT user id
export const updateProfile = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { username, email, phone_number, dob, city, country } = req.body;

        if (!username || typeof username !== 'string' || username.trim() === '') {
            return rtnRes(res, 400, 'Username is required and must be a string');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return rtnRes(res, 400, 'A valid email is required');
        }

        if (phone_number && (typeof phone_number !== 'string' || phone_number.length < 10)) {
            return rtnRes(res, 400, 'Invalid phone number format');
        }

        if (dob && isNaN(Date.parse(dob))) {
            return rtnRes(res, 400, 'Invalid date of birth format');
        }

        await queryRunner(
            `UPDATE profile
             SET username = $1, email = $2, phone_number = $3, dob = $4, city = $5, country = $6
             WHERE user_id = $7`,
            [username, email, phone_number, dob, city, country, user_id]
        );

        return rtnRes(res, 200, 'Profile updated successfully');
    } catch (err) {
        console.error(err.message);
        return rtnRes(res, 500, err.message);
    }
};

// GET /api/profile  — admin, get all profiles
export const getAllProfiles = async (req, res) => {
    try {
        const allProfiles = await queryRunner('SELECT * FROM profile');
        return rtnRes(res, 200, 'Profiles fetched successfully', allProfiles);
    } catch (err) {
        console.error(err.message);
        return rtnRes(res, 500, err.message);
    }
};
