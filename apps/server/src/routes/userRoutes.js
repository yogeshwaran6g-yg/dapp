import express from 'express';
import pool from '../../db.js';

const router = express.Router();

// Get Profile
router.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM profile WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Profile
router.put('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone_number, dob, city, country } = req.body;

        await pool.query(
            'UPDATE profile SET username = $1, email = $2, phone_number = $3, dob = $4, city = $5, country = $6 WHERE id = $7',
            [username, email, phone_number, dob, city, country, id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const allProfiles = await pool.query('SELECT * FROM profile');
        res.json(allProfiles.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
