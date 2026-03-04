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

        for (let i = 0; i < referralPath.length; i++) {
            const referrer = referralPath[i];
            const amount = totalPrice * referralSplits[i];

            // Distribution to internal balance postponed per user request
            // await queryRunner(
            //     'UPDATE users SET fake_eth_balance = fake_eth_balance + $1 WHERE id = $2',
            //     [amount, referrer.id]
            // );
            console.log(`[Pushed] $${amount} to Referrer L${i + 1} (User ID: ${referrer.id}) - Internal balance update skipped.`);
        }

        // 2. System Funds Split (Total 50%)
        const systemSplits = [
            { name: 'ROYALTY', percent: 0.20 },
            { name: 'PRODUCT', percent: 0.10 },
            { name: 'DEVELOPERS', percent: 0.10 },
            { name: 'EXPENSE', percent: 0.05 },
            { name: 'DEVELOPMENT', percent: 0.05 }
        ];

        for (const fund of systemSplits) {
            const amount = totalPrice * fund.percent;
            await queryRunner(
                'UPDATE system_funds SET balance = balance + $1 WHERE fund_name = $2',
                [amount, fund.name]
            );
            console.log(`✓ Distributed $${amount} to System Fund: ${fund.name}`);
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
