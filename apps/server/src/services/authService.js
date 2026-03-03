import { queryRunner } from '../config/db.js';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { serviceResponse } from '../utils/helper.js';
import { JWT_CONFIG } from "../config/constants.js";
import { getWalletBalance, calculateEligibleLevel } from './blockchainService.js';

// No longer need dotenv.config() here as it's at the top of server.js

export const signToken = (payload) => {
    const JWT_SECRET = JWT_CONFIG.JWT_SECRET;
    console.log(`[AuthService] Signing token. Secret present: ${!!JWT_SECRET}`);
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const generateNonce = async (address) => {
    try {
        const wallet_address = address.toLowerCase();
        const nonce = Math.floor(Math.random() * 1000000).toString();

        console.log(`[AuthService] Generating nonce for ${wallet_address}`);

        // Check if user exists
        const userResult = await queryRunner(
            'SELECT * FROM users WHERE wallet_address = $1',
            [wallet_address]
        );

        if (userResult.length === 0) {
            console.log(`[AuthService] New user detected: ${wallet_address}. Creating...`);
            // Signup: Create user with nonce and a dummy referral code
            const referral_code = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            await queryRunner(
                'INSERT INTO users (wallet_address, nonce, referral_code, role) VALUES ($1, $2, $3, $4)',
                [wallet_address, nonce, referral_code, "USER"]
            );
        } else {
            console.log(`[AuthService] Existing user: ${wallet_address}. Updating nonce.`);
            // Login: Update existing user's nonce
            await queryRunner('UPDATE users SET nonce = $1 WHERE wallet_address = $2', [nonce, wallet_address]);
        }

        return serviceResponse(true, 200, 'Nonce generated successfully', { nonce });
    } catch (err) {
        console.error(`[AuthService] Error in generateNonce: ${err.message}`);
        return serviceResponse(false, 500, 'Error generating nonce', null, err.message);
    }
};

export const verifySignature = async (address, signature, origin) => {
    try {
        const wallet_address = address.toLowerCase();
        console.log(`[AuthService] Verifying signature for ${wallet_address}`);

        // Fetch user from DB
        const userResult = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);
        if (userResult.length === 0) {
            console.warn(`[AuthService] User not found for ${wallet_address}`);
            return serviceResponse(false, 404, 'User not found');
        }

        const user = userResult[0];

        // Match the client-side template exactly
        const msg = `Sign this message to authenticate with our dApp.\n\nURI: ${origin}\nNonce: ${user.nonce}`;

        // Recover address from signature
        const recoveredAddress = ethers.verifyMessage(msg, signature);

        if (recoveredAddress.toLowerCase() !== wallet_address) {
            console.warn(`[AuthService] Signature mismatch!`);
            console.warn(`[AuthService] Expected: ${wallet_address}`);
            console.warn(`[AuthService] Recovered: ${recoveredAddress}`);
            console.warn(`[AuthService] Message used:\n"${msg}"`);
            return serviceResponse(false, 401, 'Invalid signature or address mismatch');
        }

        // Authentication successful: Rotate nonce
        const newNonce = Math.floor(Math.random() * 1000000).toString();
        await queryRunner('UPDATE users SET nonce = $1, last_login_at = CURRENT_TIMESTAMP WHERE id = $2', [newNonce, user.id]);

        // --- Handle Slot Activation based on Balance ---
        const balance = await getWalletBalance(wallet_address);
        const eligibleLevel = calculateEligibleLevel(balance);
        console.log(`[AuthService] User ${wallet_address} eligible for level ${eligibleLevel} (Balance: ${balance} ETH)`);

        // Ensure profile and levels exist
        const profileResult = await queryRunner('SELECT * FROM profile WHERE user_id = $1', [user.id]);
        if (profileResult.length === 0) {
            await queryRunner('INSERT INTO profile (user_id) VALUES ($1)', [user.id]);
        }

        const levelsResult = await queryRunner('SELECT * FROM levels WHERE id = $1', [user.id]);
        if (levelsResult.length === 0) {
            console.log(`[AuthService] Creating missing levels entry for user ID ${user.id} with level ${eligibleLevel}`);
            await queryRunner('INSERT INTO levels (id, current_level_id) VALUES ($1, $2)', [user.id, eligibleLevel]);
        } else {
            console.log(`[AuthService] Updating levels for user ID ${user.id} to level ${eligibleLevel}`);
            await queryRunner('UPDATE levels SET current_level_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [eligibleLevel, user.id]);
        }

        console.log(`[AuthService] Generating JWT for user ${user.id}`);

        // Generate JWT
        const token = signToken({ id: user.id, wallet_address: user.wallet_address, role: user.role });

        return serviceResponse(true, 200, 'Authentication successful', {
            token,
            user: {
                id: user.id,
                wallet_address: user.wallet_address,
                role: user.role
            }
        });
    } catch (err) {
        console.error(`[AuthService] Error in verifySignature: ${err.message}`);
        return serviceResponse(false, 500, 'Error during verification', null, err.message);
    }
};

export const devLogin = async (address) => {
    try {
        const wallet_address = address.toLowerCase();
        console.log(`[AuthService] Dev login for ${wallet_address}`);

        // Get or create user
        let userResult = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);
        if (userResult.length === 0) {
            const referral_code = `REF-DEV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            await queryRunner(
                'INSERT INTO users (wallet_address, role, referral_code) VALUES ($1, $2, $3)',
                [wallet_address, 'USER', referral_code]
            );
            userResult = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);
        }

        const user = userResult[0];

        // Ensure profile exists
        const profileResult = await queryRunner('SELECT * FROM profile WHERE user_id = $1', [user.id]);
        if (profileResult.length === 0) {
            await queryRunner('INSERT INTO profile (user_id) VALUES ($1)', [user.id]);
        }

        // --- Handle Slot Activation based on Balance (Dev mode check) ---
        const balance = await getWalletBalance(wallet_address);
        const eligibleLevel = calculateEligibleLevel(balance);

        const levelsResult = await queryRunner('SELECT * FROM levels WHERE id = $1', [user.id]);
        if (levelsResult.length === 0) {
            await queryRunner('INSERT INTO levels (id, current_level_id) VALUES ($1, $2)', [user.id, eligibleLevel]);
        } else {
            await queryRunner('UPDATE levels SET current_level_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [eligibleLevel, user.id]);
        }

        console.log(`[AuthService] Generating JWT for dev user ${user.id}`);

        // Generate JWT
        const token = signToken({ id: user.id, wallet_address: user.wallet_address, role: user.role });

        return serviceResponse(true, 200, 'Dev login successful', {
            token,
            user: {
                id: user.id,
                wallet_address: user.wallet_address,
                role: user.role
            }
        });
    } catch (err) {
        console.error(`[AuthService] Error in devLogin: ${err.message}`);
        return serviceResponse(false, 500, 'Error during dev login', null, err.message);
    }
};
