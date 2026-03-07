import * as userService from '../services/userService.js';
import { rtnRes } from '../utils/helper.js';
import pool from '../config/db.js';

export const getUsers = async (req, res) => {
    const { search, page, limit } = req.query;
    const result = await userService.getAllUsersForAdmin(
        search,
        parseInt(page) || 1,
        parseInt(limit) || 10
    );
    return rtnRes(res, result.status, result.message, result.data);
};

export const getStats = async (req, res) => {
    const result = await userService.getDashboardStats();
    return rtnRes(res, result.status, result.message, result.data);
};

export const getTreasuryMetrics = async (req, res) => {
    const result = await userService.getTreasuryMetrics();
    return rtnRes(res, result.status, result.message, result.data);
};

export const blockUser = async (req, res) => {
    const { userId } = req.params;
    const { blocked } = req.body;
    const result = await userService.blockUser(userId, blocked);
    return rtnRes(res, result.status, result.message, result.data);
};

export const getTreasuryLogs = async (req, res) => {
    const result = await userService.getTreasuryLogs();
    return rtnRes(res, result.status, result.message, result.data);
};

export const getStakeHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const query = `
            SELECT sh.*, u.wallet_address 
            FROM stake_history sh
            JOIN users u ON sh.user_id = u.id
            WHERE u.wallet_address ILIKE $3
            ORDER BY sh.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const values = [limit, offset, `%${search}%` || '%%'];
        const result = await pool.query(query, values);

        const countQuery = `
            SELECT COUNT(*) 
            FROM stake_history sh
            JOIN users u ON sh.user_id = u.id
            WHERE u.wallet_address ILIKE $1
        `;
        const countResult = await pool.query(countQuery, [`%${search}%` || '%%']);

        return rtnRes(res, 200, 'Stake history fetched successfully', {
            history: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching stake history:', error);
        return rtnRes(res, 500, 'Failed to fetch stake history');
    }
};

export const getUserDetail = async (req, res) => {
    const { userId } = req.params;
    const result = await userService.getUserDetailForAdmin(userId);
    return rtnRes(res, result.status, result.message, result.data);
};

export const getSwapHistory = async (req, res) => {
    const { page, limit, search } = req.query;
    const result = await userService.getSwapHistoryForAdmin(
        parseInt(page) || 1,
        parseInt(limit) || 10,
        search
    );
    return rtnRes(res, result.status, result.message, result.data);
};
