import { queryRunner } from '../config/db.js';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

export const generateNonce = async (address) => {
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

    return nonce;
};

export const verifySignature = async (address, signature, origin) => {
    const wallet_address = address.toLowerCase();

    // Fetch user from DB
    const userResult = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);
    if (userResult.length === 0) {
        throw new Error('User not found');
    }

    const user = userResult[0];

    // Match the client-side template exactly
    const msg = `Sign this message to authenticate with our dApp.\n\nURI: ${origin}\nNonce: ${user.nonce}`;

    // Recover address from signature
    const recoveredAddress = ethers.verifyMessage(msg, signature);

    if (recoveredAddress.toLowerCase() !== wallet_address) {
        console.log('Address mismatch:', recoveredAddress.toLowerCase(), wallet_address);
        throw new Error('Invalid signature');
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

    return {
        token,
        user: {
            id: user.id,
            wallet_address: user.wallet_address,
            role: user.role
        }
    };
};
