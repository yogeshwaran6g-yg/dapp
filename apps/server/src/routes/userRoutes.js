import express from 'express';
import { queryRunner } from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// --- Authentication Routes ---

// 1. Request Nonce
router.get('/auth/nonce', authController.getNonce);

// 2. Verify Signature & Issue JWT
router.post('/auth/verify', authController.verify);

// --- Protected Routes ---

// Get Profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await queryRunner('SELECT * FROM profile WHERE user_id = $1', [userId]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, phone_number, dob, city, country } = req.body;

        await queryRunner(
            'UPDATE profile SET username = $1, email = $2, phone_number = $3, dob = $4, city = $5, country = $6, updated_at = CURRENT_TIMESTAMP WHERE user_id = $7',
            [username, email, phone_number, dob, city, country, userId]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all users (Administrative or directory)
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Only return public profile info for others, or check roles
        const allProfiles = await queryRunner('SELECT p.*, u.wallet_address FROM profile p JOIN users u ON p.user_id = u.id');
        res.json(allProfiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


export default router;
