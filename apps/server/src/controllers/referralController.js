import * as referralService from '../services/referralService.js';
import { rtnRes } from '../utils/helper.js';

export const getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await referralService.getReferralStats(userId);
        return rtnRes(res, 200, "Referral stats fetched successfully", stats);
    } catch (err) {
        console.error("[ReferralController] Error in getStats:", err);
        return rtnRes(res, 500, "Internal Server Error");
    }
};

export const getNetwork = async (req, res) => {
    try {
        const userId = req.user.id;
        const network = await referralService.getTeamNetwork(userId);
        return rtnRes(res, 200, "Referral network fetched successfully", network);
    } catch (err) {
        console.error("[ReferralController] Error in getNetwork:", err);
        return rtnRes(res, 500, "Internal Server Error");
    }
};
