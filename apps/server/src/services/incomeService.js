import { queryRunner } from '../config/db.js';

/**
 * Distributes slot activation income across referrals and system funds
 * @param {number} userId - The user activating the slot
 * @param {number} totalPrice - The total cost of the slot in USD (Fake ETH equivalent)
 */
export const distributeIncome = async (userId, totalPrice) => {
    try {
        console.log(`--- Starting Distribution for User ${userId}, Amount: $${totalPrice} ---`);

        // 1. Fetch Referral Path (Up to 4 levels)
        const referralPath = await getReferralPath(userId, 4);

        // 50% Referral Splits: L1: 25%, L2: 15%, L3: 5%, L4: 5%
        const referralSplits = [0.25, 0.15, 0.05, 0.05];
        let totalReferralDistributed = 0;

        for (let i = 0; i < referralPath.length; i++) {
            const referrer = referralPath[i];
            const amount = totalPrice * referralSplits[i];
            totalReferralDistributed += amount;

            // Distribution to OWN TOKEN wallet
            await queryRunner(`
                INSERT INTO user_wallets (user_id, own_token) 
                VALUES ($1, $2) 
                ON CONFLICT (user_id) DO UPDATE SET 
                    own_token = user_wallets.own_token + $2,
                    updated_at = CURRENT_TIMESTAMP
            `, [referrer.id, amount]);

            // Track income in logs
            await queryRunner(`
                INSERT INTO income_logs (user_id, source_user_id, amount, level, type)
                VALUES ($1, $2, $3, $4, 'COMMISSION')
            `, [referrer.id, userId, amount, i + 1]);

            console.log(`[Distributed] $${amount} (OWN TOKEN) to Referrer L${i + 1} (User ID: ${referrer.id})`);
        }

        // Calculate overflow (Any part of the 50% not distributed due to short referral chain)
        const maxReferralPool = totalPrice * 0.50;
        const overflowAmount = Math.max(0, maxReferralPool - totalReferralDistributed);

        if (overflowAmount > 0) {
            console.log(`[Overflow] $${overflowAmount} redirected to ROYALTY fund`);
        }

        // 2. System Funds Split (Total 50% + Overflow)
        const systemSplits = [
            { name: 'ROYALTY', percent: 0.20, overflow: true },
            { name: 'PRODUCT', percent: 0.10 },
            { name: 'DEVELOPERS', percent: 0.10 },
            { name: 'EXPENSE', percent: 0.05 },
            { name: 'DEVELOPMENT', percent: 0.05 }
        ];

        for (const fund of systemSplits) {
            let amount = totalPrice * fund.percent;
            if (fund.overflow) {
                amount += overflowAmount;
            }

            await queryRunner(
                'UPDATE system_funds SET balance = balance + $1 WHERE fund_name = $2',
                [amount, fund.name]
            );
            console.log(`✓ Distributed $${amount} to System Fund: ${fund.name}${fund.overflow ? ' (Includes Overflow)' : ''}`);
        }

        return { success: true };
    } catch (err) {
        console.error('Error in distributeIncome:', err.message);
        throw err;
    }
};

/**
 * Helper to fetch a path of referrers
 */
async function getReferralPath(userId, levels) {
    let path = [];
    let currentUserId = userId;

    for (let i = 0; i < levels; i++) {
        const result = await queryRunner(
            'SELECT referred_by FROM users WHERE id = $1',
            [currentUserId]
        );

        if (result.length > 0 && result[0].referred_by) {
            const referrerId = result[0].referred_by;
            const referrerResult = await queryRunner(
                'SELECT id FROM users WHERE id = $1',
                [referrerId]
            );

            if (referrerResult.length > 0) {
                path.push(referrerResult[0]);
                currentUserId = referrerId;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    return path;
}
