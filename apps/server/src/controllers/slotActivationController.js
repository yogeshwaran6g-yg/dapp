import * as slotActivationService from '../services/slotActivationService.js';
import { rtnRes } from '../utils/helper.js';

export const getSlotActivation = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return rtnRes(res, 400, "User ID is required");
        }
        const result = await slotActivationService.getSlotActivation(userId);
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from getSlotActivation controller:", err);
        return rtnRes(res, 500, "Internal Error");
    }
};

export const updateSlotActivation = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId; // Prefer authenticated user ID
        const { current_level_id, tx_hash } = req.body;

        if (!userId) {
            return rtnRes(res, 400, "User ID is required");
        }
        if (!current_level_id) {
            return rtnRes(res, 400, "Current level ID is required");
        }

        const result = await slotActivationService.updateSlotActivation(userId, { current_level_id, tx_hash });
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from updateSlotActivation controller:", err);
        return rtnRes(res, 500, "Internal Error");
    }
};

export const getAdminWallet = async (req, res) => {
    try {
        const result = await slotActivationService.getAdminWallet();
        return rtnRes(res, result.status, result.message, result.data);
    } catch (err) {
        console.error("Error from getAdminWallet controller:", err);
        return rtnRes(res, 500, "Internal Error");
    }
};
