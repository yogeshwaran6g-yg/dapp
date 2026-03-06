import * as authService from '../services/authService.js';
import { rtnRes } from '../utils/helper.js';

export const getNonce = async (req, res) => {
    try {
        const { address, ref } = req.query;
        if (!address) {
            return rtnRes(res, 400, "wallet address is required, must connect the wallet");
        }
        const result = await authService.generateNonce(address, ref);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.log("error from the get nonce", err);
        return rtnRes(res, 500, "Internal Error");
    }
};

export const verify = async (req, res) => {
    try {

        const { address, signature } = req.body;
        if (!address || !signature) {
            return rtnRes(res, 400, "address and signature are required");
        }
        const origin = req.get('origin') || process.env.CLIENT_URL || 'http://localhost:3000';
        console.log(`[AuthController] Verifying for origin: ${origin}`);

        const result = await authService.verifySignature(address, signature, origin);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.log("error from the verify nonce", err);
        return rtnRes(res, 500, "Internal Error");
    }
};

export const devLogin = async (req, res) => {
    try {
        const { address } = req.params;
        if (!address) {
            return rtnRes(res, 400, "Address is required for dev login");
        }
        const result = await authService.devLogin(address);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.log("error from the dev login", err);
        return rtnRes(res, 500, "Internal Error");
    }
};
