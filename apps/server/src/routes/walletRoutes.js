import express from 'express';
import * as walletController from '../controllers/walletController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/wallet/balance - Protected route to get real-time ETH balance
router.get('/balance', authMiddleware, walletController.getWalletBalance);

// GET /api/wallet/info - Get internal wallet data (staked, rewards, energy)
router.get('/info', authMiddleware, walletController.getWalletInfo);

router.post('/faucet', authMiddleware, walletController.getTestEth);

// POST /api/wallet/record-stake - Record successful on-chain staking
router.post('/record-stake', authMiddleware, walletController.recordStake);

export default router;
