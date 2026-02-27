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
router.post('/auth/nonce', async (req, res) => {
    try {
        const { address } = req.body;
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
        const msg = `Sign this message to authenticate: ${user.nonce}`;

        // Recover address from signature
        const recoveredAddress = ethers.verifyMessage(msg, signature);

        if (recoveredAddress.toLowerCase() !== wallet_address) {
            return res.status(401).json({ message: 'Invalid signature' });
        }

        // Authentication successful: Rotate nonce
        const newNonce = Math.floor(Math.random() * 1000000).toString();
        await queryRunner('UPDATE users SET nonce = $1, last_login_at = CURRENT_TIMESTAMP WHERE id = $2', [newNonce, user.id]);

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
// Add other protected routes here if any

export default router;
