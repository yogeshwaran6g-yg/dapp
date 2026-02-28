import { queryRunner } from '../config/db.js';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { serviceResponse } from '../utils/helper.js';
import { JWT_CONFIG } from "../config/constants.js";

dotenv.config();

const JWT_SECRET = JWT_CONFIG.JWT_SECRET;

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
            console.warn(`[AuthService] Signature mismatch for ${wallet_address}. Recovered: ${recoveredAddress}`);
            return serviceResponse(false, 401, 'Invalid signature or address mismatch');
        }

        // Authentication successful: Rotate nonce
        const newNonce = Math.floor(Math.random() * 1000000).toString();
        await queryRunner('UPDATE users SET nonce = $1, last_login_at = CURRENT_TIMESTAMP WHERE id = $2', [newNonce, user.id]);

        // Ensure profile exists
        const profileResult = await queryRunner('SELECT * FROM profile WHERE user_id = $1', [user.id]);
        if (profileResult.length === 0) {
            console.log(`[AuthService] Creating initial profile and levels for user ID ${user.id}`);
            await queryRunner('INSERT INTO profile (user_id) VALUES ($1)', [user.id]);
            await queryRunner('INSERT INTO levels (id, current_level_id) VALUES ($1, 1)', [user.id]);
        } else {
            // Ensure levels entry exists even if profile exists (for older users)
            const levelsResult = await queryRunner('SELECT * FROM levels WHERE id = $1', [user.id]);
            if (levelsResult.length === 0) {
                console.log(`[AuthService] Creating missing levels entry for user ID ${user.id}`);
                await queryRunner('INSERT INTO levels (id, current_level_id) VALUES ($1, 1)', [user.id]);
            }
        }

        console.log(`[AuthService] Generating JWT for user ${user.id}`);
        console.log(`[AuthService] JWT Secret: ${JWT_SECRET}`);

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, wallet_address: user.wallet_address, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`[AuthService] Successfully authenticated user ${user.id}`);

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

        let userResult = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);

        let user;
        if (userResult.length === 0) {
            const referral_code = `DEV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            const nonce = Math.floor(Math.random() * 1000000).toString();
            await queryRunner(
                'INSERT INTO users (wallet_address, nonce, referral_code, role) VALUES ($1, $2, $3, $4)',
                [wallet_address, nonce, referral_code, "USER"]
            );
            userResult = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);
        }

        user = userResult[0];

        // Ensure profile and levels exist
        const profileResult = await queryRunner('SELECT * FROM profile WHERE user_id = $1', [user.id]);
        if (profileResult.length === 0) {
            await queryRunner('INSERT INTO profile (user_id) VALUES ($1)', [user.id]);
            await queryRunner('INSERT INTO levels (id, current_level_id) VALUES ($1, 1)', [user.id]);
        }

        console.log(`[AuthService] Generating JWT for user ${user.id}`);
        console.log(`[AuthService] JWT Secret: ${JWT_SECRET}`);

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, wallet_address: user.wallet_address, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

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
