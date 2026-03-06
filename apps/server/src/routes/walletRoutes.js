import express from 'express';
import * as walletController from '../controllers/walletController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/balance', authMiddleware, walletController.getWalletBalance);
router.get('/info', authMiddleware, walletController.getWalletInfo);
router.get('/stake-history', authMiddleware, walletController.getStakeHistory);
router.post('/faucet', authMiddleware, walletController.getTestEth);
router.post('/stake-internal', authMiddleware, walletController.stakeInternal);
router.post('/claim-rewards', authMiddleware, walletController.claimRewards);
router.post('/topup-internal', authMiddleware, walletController.topUpInternal);
router.post('/update-balance', authMiddleware, walletController.updateBalance);
router.get('/transactions', authMiddleware, walletController.getTransactions);

export default router;
