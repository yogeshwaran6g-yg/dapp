import { queryRunner } from '../config/db.js';

/**
 * Get referral statistics for a user
 * @param {number} userId 
 */
export const getReferralStats = async (userId) => {
    try {
        // 1. Get Direct Referrals Count
        const directResult = await queryRunner(
            'SELECT COUNT(*) as count FROM users WHERE referred_by = $1',
            [userId]
        );
        const directCount = parseInt(directResult[0]?.count || 0);

        // 2. Get Total Team Size (Recursive CTE with safety limits)
        const teamResult = await queryRunner(`
            WITH RECURSIVE referral_tree AS (
                -- Anchor member: immediate children of the user
                SELECT id, 1 as depth, ARRAY[id] as path
                FROM users
                WHERE referred_by = $1
                
                UNION ALL
                
                -- Recursive member: children of children
                SELECT u.id, rt.depth + 1, rt.path || u.id
                FROM users u
                INNER JOIN referral_tree rt ON u.referred_by = rt.id
                WHERE rt.depth < 10 -- Safety limit for depth
                AND NOT (u.id = ANY(rt.path)) -- Cycle detection
            )
            SELECT COUNT(*) as count FROM referral_tree;
        `, [userId]);
        const teamSize = parseInt(teamResult[0]?.count || 0);

        // 3. Get Total Referral Earnings 
        const earningsResult = await queryRunner(
            'SELECT SUM(amount) as total FROM income_logs WHERE user_id = $1',
            [userId]
        );
        const referralEarnings = parseFloat(earningsResult[0]?.total || 0);

        return {
            directCount,
            teamSize,
            referralEarnings
        };
    } catch (err) {
        console.error('[ReferralService] Error getting stats:', err);
        throw err;
    }
};

/**
 * Get the list of direct referrals
 * @param {number} userId 
 */
export const getDirectReferrals = async (userId) => {
    try {
        const query = `
            SELECT 
                u.id,
                u.wallet_address,
                u.created_at,
                COALESCE(l.current_level_id, 1) as level
            FROM users u
            LEFT JOIN levels l ON u.id = l.id
            WHERE u.referred_by = $1
            ORDER BY u.created_at DESC
        `;
        const referrals = await queryRunner(query, [userId]);
        return referrals;
    } catch (err) {
        console.error('[ReferralService] Error getting direct referrals:', err);
        throw err;
    }
};

/**
 * Get the full referral network up to 6 levels deep with profile data
 * @param {number} userId 
 */
export const getTeamNetwork = async (userId) => {
    try {
        const query = `
            WITH RECURSIVE referral_tree AS (
                -- Anchor: Direct referrals
                SELECT 
                    u.id, 
                    u.wallet_address,
                    u.referred_by,
                    1 as level,
                    ARRAY[u.id] as path
                FROM users u
                WHERE u.referred_by = $1
                
                UNION ALL
                
                -- Recursive: Referrals of referrals
                SELECT 
                    u.id, 
                    u.wallet_address,
                    u.referred_by,
                    rt.level + 1,
                    rt.path || u.id
                FROM users u
                INNER JOIN referral_tree rt ON u.referred_by = rt.id
                WHERE rt.level < 6 -- Limit to 6 levels
                AND NOT (u.id = ANY(rt.path)) -- Cycle detection
            )
            SELECT 
                rt.id,
                rt.wallet_address,
                rt.level,
                p.username,
                p.avatar_url
            FROM referral_tree rt
            LEFT JOIN profile p ON rt.id = p.user_id
            ORDER BY rt.level ASC, rt.id ASC;
        `;
        const network = await queryRunner(query, [userId]);
        return network;
    } catch (err) {
        console.error('[ReferralService] Error getting team network:', err);
        throw err;
    }
};
