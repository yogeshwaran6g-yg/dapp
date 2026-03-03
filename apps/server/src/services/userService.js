import { queryRunner } from '../config/db.js';
import { serviceResponse } from '../utils/helper.js';

export const findUserById = async (id) => {
    try {
        const result = await queryRunner('SELECT * FROM users WHERE id = $1', [id]);
        if (result.length === 0) {
            return serviceResponse(false, 404, 'User not found');
        }
        return serviceResponse(true, 200, 'User found', result[0]);
    } catch (err) {
        return serviceResponse(false, 500, 'Error finding user', null, err.message);
    }
};

export const findUserByAddress = async (address) => {
    try {
        const result = await queryRunner('SELECT * FROM users WHERE wallet_address = $1', [address.toLowerCase()]);
        if (result.length === 0) {
            return serviceResponse(false, 404, 'User not found');
        }
        return serviceResponse(true, 200, 'User found', result[0]);
    } catch (err) {
        return serviceResponse(false, 500, 'Error finding user by address', null, err.message);
    }
};

export const getAllUsersForAdmin = async (search = '', page = 1, limit = 10) => {
    try {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let whereClause = '';

        if (search) {
            // Check if search is a valid numeric ID (integer)
            const isNumericId = /^\d+$/.test(search);
            if (isNumericId) {
                // Search by exact numeric ID only
                whereClause = `WHERE u.id = $1`;
                queryParams.push(parseInt(search, 10));
            } else {
                // Search by partial match on wallet address or username
                whereClause = `WHERE u.wallet_address ILIKE $1 OR p.username ILIKE $1`;
                queryParams.push(`%${search}%`);
            }
        }

        const dataQuery = `
            SELECT 
                u.id, 
                u.wallet_address, 
                u.is_active, 
                u.is_blocked, 
                u.created_at,
                p.username,
                p.email,
                l.current_level_id as level,
                l.total_xp,
                r.wallet_address as referred_by_address
            FROM users u
            LEFT JOIN profile p ON u.id = p.user_id
            LEFT JOIN levels l ON u.id = l.id
            LEFT JOIN users r ON u.referred_by = r.id
            ${whereClause}
            ORDER BY u.created_at DESC
            LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
        `;

        const countQuery = `
            SELECT COUNT(*) as total
            FROM users u
            LEFT JOIN profile p ON u.id = p.user_id
            ${whereClause}
        `;

        const [data, countResult] = await Promise.all([
            queryRunner(dataQuery, [...queryParams, limit, offset]),
            queryRunner(countQuery, queryParams)
        ]);

        return serviceResponse(true, 200, 'Users fetched successfully', {
            users: data,
            total: parseInt(countResult[0]?.total || 0),
            page,
            limit
        });
    } catch (err) {
        return serviceResponse(false, 500, 'Error fetching users for admin', null, err.message);
    }
};

export const getDashboardStats = async () => {
    try {
        const statsQuery = `
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
                (SELECT COUNT(*) FROM users WHERE is_blocked = true) as blocked_users,
                (SELECT COALESCE(SUM(total_xp), 0) FROM levels) as total_xp,
                (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '24 hours') as users_24h
        `;
        const result = await queryRunner(statsQuery);

        // Fetch recent activities (registrations for now)
        const recentActivitiesQuery = `
            SELECT 
                u.wallet_address,
                'New User Registered' as action,
                u.created_at as timestamp,
                'CONFIRMED' as status
            FROM users u
            ORDER BY u.created_at DESC
            LIMIT 5
        `;
        const recentActivities = await queryRunner(recentActivitiesQuery);

        return serviceResponse(true, 200, 'Dashboard stats fetched successfully', {
            stats: result[0],
            recentActivities
        });
    } catch (err) {
        return serviceResponse(false, 500, 'Error fetching dashboard stats', null, err.message);
    }
};

export const getTreasuryMetrics = async () => {
    try {
        const query = `
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'INFLOW' THEN usd_value ELSE -usd_value END), 0) as total_balance,
                COALESCE(SUM(CASE WHEN asset = 'ETH' AND type = 'INFLOW' THEN amount ELSE 0 END), 0) as eth_balance,
                COALESCE(SUM(CASE WHEN asset = 'USDC' AND type = 'INFLOW' THEN amount ELSE 0 END), 0) as usdc_balance,
                COALESCE(SUM(CASE WHEN asset = 'USDT' AND type = 'INFLOW' THEN amount ELSE 0 END), 0) as usdt_balance
            FROM treasury_logs
        `;
        const result = await queryRunner(query);
        return serviceResponse(true, 200, 'Treasury metrics fetched successfully', result[0]);
    } catch (err) {
        return serviceResponse(false, 500, 'Error fetching treasury metrics', null, err.message);
    }
};

export const blockUser = async (userId, blocked) => {
    try {
        const result = await queryRunner(
            'UPDATE users SET is_blocked = $1 WHERE id = $2 RETURNING id, is_blocked',
            [blocked, userId]
        );
        if (result.length === 0) {
            return serviceResponse(false, 404, 'User not found');
        }
        return serviceResponse(true, 200, blocked ? 'User blocked successfully' : 'User unblocked successfully', result[0]);
    } catch (err) {
        return serviceResponse(false, 500, 'Error updating user block status', null, err.message);
    }
};

export const getTreasuryLogs = async () => {
    try {
        const query = `SELECT * FROM treasury_logs ORDER BY created_at DESC LIMIT 50`;
        const result = await queryRunner(query);
        return serviceResponse(true, 200, 'Treasury logs fetched successfully', result);
    } catch (err) {
        return serviceResponse(false, 500, 'Error fetching treasury logs', null, err.message);
    }
};
