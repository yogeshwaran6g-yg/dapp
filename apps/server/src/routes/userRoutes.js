import express from 'express';
import { queryRunner } from '../config/db.js';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

const router = express.Router();

// --- Authentication Routes ---

// 1. Request Nonce
router.get('/auth/nonce', async (req, res) => {
    try {
        const { address } = req.query;
        if (!address) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        const wallet_address = address.toLowerCase();
        const nonce = Math.floor(Math.random() * 1000000).toString();

        // Check if user exists
        const userResult = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);

        if (userResult.length === 0) {
            // Signup: Create user with nonce and a dummy referral code
            const referral_code = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            await queryRunner(
                'INSERT INTO users (wallet_address, nonce, referral_code) VALUES ($1, $2, $3)',
                [wallet_address, nonce, referral_code]
            );
        } else {
            // Login: Update existing user's nonce
            await queryRunner('UPDATE users SET nonce = $1 WHERE wallet_address = $2', [nonce, wallet_address]);
        }

        res.json({ nonce });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 2. Verify Signature & Issue JWT
router.post('/auth/verify', async (req, res) => {
    try {
        const { address, signature } = req.body;
        if (!address || !signature) {
            return res.status(400).json({ message: 'Address and signature are required' });
        }

        const wallet_address = address.toLowerCase();

        // Fetch user from DB
        const userResult = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);
        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult[0];

        // Match the client-side template exactly
        // Example: Sign this message to authenticate with our dApp.\n\nURI: http://localhost:5173\nNonce: 123456
        const origin = req.get('origin') || 'http://localhost:5173';
        const msg = `Sign this message to authenticate with our dApp.\n\nURI: ${origin}\nNonce: ${user.nonce}`;

        // Recover address from signature
        const recoveredAddress = ethers.verifyMessage(msg, signature);

        if (recoveredAddress.toLowerCase() !== wallet_address) {
            console.log('Address mismatch:', recoveredAddress.toLowerCase(), wallet_address);
            return res.status(401).json({ message: 'Invalid signature' });
        }

        // Authentication successful: Rotate nonce
        const newNonce = Math.floor(Math.random() * 1000000).toString();
        await queryRunner('UPDATE users SET nonce = $1, last_login_at = CURRENT_TIMESTAMP WHERE id = $2', [newNonce, user.id]);

        // Ensure profile exists
        const profileResult = await queryRunner('SELECT * FROM profile WHERE user_id = $1', [user.id]);
        if (profileResult.length === 0) {
            await queryRunner('INSERT INTO profile (user_id) VALUES ($1)', [user.id]);
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, wallet_address: user.wallet_address, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, wallet_address: user.wallet_address, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

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
