import { queryRunner, transactionRunner } from '../config/db.js';
import { serviceResponse } from '../utils/helper.js';
import { ACTIVE_CONFIG } from '../config/constants.js';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(ACTIVE_CONFIG.RPC_URLS[0]);
const USDT_ADDRESS = ACTIVE_CONFIG.USDT_ADDRESS.toLowerCase();
const ADMIN_WALLET = ACTIVE_CONFIG.ADMIN_WALLET.toLowerCase();

/**
 * Record a successful on-chain staking transaction
 */
export const recordStakingTransaction = async (userId, amount, txHash) => {
    try {
        console.log(`[WalletService] Verifying transaction ${txHash} on-chain...`);
        const tx = await provider.getTransaction(txHash);

        if (!tx) {
            return serviceResponse(false, 400, 'Transaction not found on-chain');
        }

        const receipt = await provider.getTransactionReceipt(txHash);

        if (!receipt || receipt.status !== 1) {
            return serviceResponse(false, 400, 'Transaction failed or not confirmed');
        }

        if (tx.to.toLowerCase() !== USDT_ADDRESS) {
            return serviceResponse(false, 400, 'Transaction is not a USDT transfer');
        }

        return await transactionRunner(async (client) => {

            await client.query(`
                INSERT INTO user_wallets (user_id, locked_balance) 
                VALUES ($1, $2) 
                ON CONFLICT (user_id) DO UPDATE SET 
                    locked_balance = user_wallets.locked_balance + $2,
                    updated_at = CURRENT_TIMESTAMP
            `, [userId, amount]);

            await client.query(`
                INSERT INTO yeild (user_id, amount, asset) 
                VALUES ($1, $2, 'USDT')
            `, [userId, amount]);

            await client.query(`
                INSERT INTO treasury_logs (type, asset, amount, tx_hash, status) 
                VALUES ('INFLOW', 'USDT', $1, $2, 'CONFIRMED')
            `, [amount, txHash]);

            return serviceResponse(true, 200, 'Staking transaction verified and recorded successfully');
        });

    } catch (err) {
        console.error(`[WalletService] Error in recordStakingTransaction: ${err.message}`);
        return serviceResponse(false, 500, 'Error recording staking transaction', null, err.message);
    }
};

/**
 * Stake internal token
 */
export const stakeInternalToken = async (userId, amount) => {
    try {
        return await transactionRunner(async (client) => {

            const balanceRes = await client.query(
                'SELECT own_token_balance FROM user_wallets WHERE user_id = $1',
                [userId]
            );

            if (balanceRes.rows.length === 0 || parseFloat(balanceRes.rows[0].own_token_balance) < amount) {
                return serviceResponse(false, 400, 'Insufficient internal token balance');
            }

            await client.query(`
                UPDATE user_wallets 
                SET own_token_balance = own_token_balance - $1,
                    locked_balance = locked_balance + $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $2
            `, [amount, userId]);

            // credit admin wallet
            await client.query(`
                UPDATE user_wallets 
                SET own_token_balance = own_token_balance + $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = (
                    SELECT id FROM users 
                    WHERE role = 'ADMIN' 
                    ORDER BY id ASC LIMIT 1
                )
            `, [amount]);

            await client.query(`
                INSERT INTO internal_stakes (user_id, amount, status)
                VALUES ($1, $2, 'ACTIVE')
            `, [userId, amount]);

            await client.query(`
                INSERT INTO yeild (user_id, amount, asset) 
                VALUES ($1, $2, 'INTERNAL')
            `, [userId, amount]);

            await client.query(`
                INSERT INTO stake_history (user_id, amount, type) 
                VALUES ($1, $2, 'STAKE')
            `, [userId, amount]);

            return serviceResponse(true, 200, 'Internal staking successful');
        });

    } catch (err) {
        console.error(`[WalletService] Error in stakeInternalToken: ${err.message}`);
        return serviceResponse(false, 500, 'Error in internal staking', null, err.message);
    }
};

/**
 * Faucet / Top-up internal tokens
 */
export const topUpInternalToken = async (userId, amount) => {
    try {

        await queryRunner(`
            INSERT INTO user_wallets (user_id, own_token_balance) 
            VALUES ($1, $2) 
            ON CONFLICT (user_id) DO UPDATE SET 
                own_token_balance = user_wallets.own_token_balance + $2,
                updated_at = CURRENT_TIMESTAMP
        `, [userId, amount]);

        return serviceResponse(true, 200, `${amount} DB Tokens added successfully!`);

    } catch (err) {
        console.error(`[WalletService] Error in topUpInternalToken: ${err.message}`);
        return serviceResponse(false, 500, 'Error topping up internal balance', null, err.message);
    }
};

/**
 * Update wallet balance (testing)
 */
export const updateWalletBalance = async (userId, type, amount) => {

    try {

        let column;

        switch (type.toUpperCase()) {
            case 'NRG': column = 'energy_balance'; break;
            case 'DB': column = 'own_token_balance'; break;
            case 'LOCKED': column = 'locked_balance'; break;
            default: column = 'own_token_balance';
        }

        await queryRunner(`
            INSERT INTO user_wallets (user_id, ${column}) 
            VALUES ($1, $2) 
            ON CONFLICT (user_id) DO UPDATE SET 
                ${column} = $2,
                updated_at = CURRENT_TIMESTAMP
        `, [userId, amount]);

        return serviceResponse(true, 200, `${type} balance updated to ${amount}`);

    } catch (err) {
        console.error(`[WalletService] Error in updateWalletBalance: ${err.message}`);
        return serviceResponse(false, 500, 'Error updating balance', null, err.message);
    }
};

/**
 * Get wallet info
 */
export const getWalletInfo = async (userId) => {

    try {

        let walletRes = await queryRunner(
            'SELECT energy_balance, own_token_balance FROM user_wallets WHERE user_id = $1',
            [userId]
        );

        if (walletRes.length === 0) {

            await queryRunner(`
                INSERT INTO user_wallets (user_id, energy_balance, own_token_balance, locked_balance)
                VALUES ($1, 0, 0, 0)
                ON CONFLICT (user_id) DO NOTHING
            `, [userId]);

            walletRes = [{
                energy_balance: 0,
                own_token_balance: 0
            }];
        }

        const stakingRes = await queryRunner(`
            SELECT COALESCE(SUM(amount),0) as locked_balance
            FROM internal_stakes
            WHERE user_id = $1 AND status = 'ACTIVE'
        `, [userId]);

        const wallet = walletRes[0];

        const energyBalance = parseFloat(wallet.energy_balance || 0);
        const ownTokenBalance = parseFloat(wallet.own_token_balance || 0);
        const locked_balance = parseFloat(stakingRes[0]?.locked_balance || 0);

        return serviceResponse(true, 200, 'Wallet info fetched successfully', {
            energy_balance: energyBalance,
            own_token: ownTokenBalance,
            locked_balance: locked_balance
        });

    } catch (err) {
        console.error(`[WalletService] Error in getWalletInfo: ${err.message}`);
        return serviceResponse(false, 500, 'Error fetching wallet info', null, err.message);
    }
};

/**
 * Stake history
 */
export const getStakeHistory = async (userId) => {

    try {

        const historyRes = await queryRunner(`
            SELECT amount, type, created_at, tx_hash 
            FROM stake_history
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 10
        `, [userId]);

        return serviceResponse(true, 200, 'Stake history fetched successfully', historyRes);

    } catch (err) {
        console.error(`[WalletService] Error in getStakeHistory: ${err.message}`);
        return serviceResponse(false, 500, 'Error fetching stake history', null, err.message);
    }
};

/**
 * Claim rewards
 */
export const claimRewards = async (userId, amount) => {

    try {

        return await transactionRunner(async (client) => {

            await client.query(`
                INSERT INTO stake_history (user_id, amount, type)
                VALUES ($1, $2, 'REWARD_CLAIM')
            `, [userId, amount]);

            return serviceResponse(true, 200, 'Rewards claimed successfully');

        });

    } catch (err) {
        console.error(`[WalletService] Error in claimRewards: ${err.message}`);
        return serviceResponse(false, 500, 'Error claiming rewards', null, err.message);
    }
};