import { queryRunner } from '../config/db.js';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { serviceResponse } from '../utils/helper.js';
import { JWT_CONFIG } from "../config/constants.js";
import { ensureUserProfile } from './userService.js';

// No longer need dotenv.config() here as it's at the top of server.js

export const signToken = (payload) => {
    const JWT_SECRET = JWT_CONFIG.JWT_SECRET;
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

const validateSignature = (address, signature, origin, nonce) => {
    const msg = `Sign this message to authenticate with our dApp.\n\nURI: ${origin}\nNonce: ${nonce}`;
    const recoveredAddress = ethers.verifyMessage(msg, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
};

const updateUserAuthData = async (userId) => {
    const newNonce = Math.floor(Math.random() * 1000000).toString();
    await queryRunner('UPDATE users SET nonce = $1, last_login_at = CURRENT_TIMESTAMP WHERE id = $2', [newNonce, userId]);
};

export const generateNonce = async (address, referralCode = null) => {
    try {
        const wallet_address = address.toLowerCase();
        const nonce = Math.floor(Math.random() * 1000000).toString();

        console.log(`[AuthService] Generating nonce for ${wallet_address} (ref: ${referralCode})`);

        // Check if user exists
        const userResult = await queryRunner(
            'SELECT * FROM users WHERE wallet_address = $1',
            [wallet_address]
        );

        if (userResult.length === 0) {
            console.log(`[AuthService] New user detected: ${wallet_address}. Creating...`);

            let referredBy = null;
            if (referralCode) {
                const referrerResult = await queryRunner('SELECT id FROM users WHERE referral_code = $1', [referralCode]);
                if (referrerResult.length > 0) {
                    referredBy = referrerResult[0].id;
                    console.log(`[AuthService] User referred by: ${referredBy}`);
                }
            }

            // Signup: Create user with nonce and a dummy referral code
            const my_referral_code = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            await queryRunner(
                'INSERT INTO users (wallet_address, nonce, referral_code, referred_by, role) VALUES ($1, $2, $3, $4, $5)',
                [wallet_address, nonce, my_referral_code, referredBy, "USER"]
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

        // Recover address from signature
        if (!validateSignature(wallet_address, signature, origin, user.nonce)) {
            console.warn(`[AuthService] Signature mismatch for ${wallet_address}`);
            return serviceResponse(false, 401, 'Invalid signature or address mismatch');
        }

        // Authentication successful: Rotate nonce and update last login
        await updateUserAuthData(user.id);

        // Ensure profile and levels via userService
        await ensureUserProfile(user.id, wallet_address);

        console.log(`[AuthService] Generating JWT for user ${user.id}`);

        // Generate JWT
        const token = signToken({ id: user.id, wallet_address: user.wallet_address, role: user.role });

        return serviceResponse(true, 200, 'Authentication successful', {
            token,
            user: {
                id: user.id,
                wallet_address: user.wallet_address,
                role: user.role,
                referral_code: user.referral_code
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

        // Ensure profile and levels via userService
        await ensureUserProfile(user.id, wallet_address);

        console.log(`[AuthService] Generating JWT for dev user ${user.id}`);

        // Generate JWT
        const token = signToken({ id: user.id, wallet_address: user.wallet_address, role: user.role });

        return serviceResponse(true, 200, 'Dev login successful', {
            token,
            user: {
                id: user.id,
                wallet_address: user.wallet_address,
                role: user.role,
                referral_code: user.referral_code
            }
        });
    } catch (err) {
        console.error(`[AuthService] Error in devLogin: ${err.message}`);
        return serviceResponse(false, 500, 'Error during dev login', null, err.message);
    }
};
