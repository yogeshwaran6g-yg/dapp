import { queryRunner } from '../config/db.js';

export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await queryRunner('SELECT * FROM profile WHERE id = $1', [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone_number, dob, city, country } = req.body;

        await queryRunner(
            'UPDATE profile SET username = $1, email = $2, phone_number = $3, dob = $4, city = $5, country = $6 WHERE id = $7',
            [username, email, phone_number, dob, city, country, id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getAllProfiles = async (req, res) => {
    try {
        const allProfiles = await queryRunner('SELECT * FROM profile');
        res.json(allProfiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
