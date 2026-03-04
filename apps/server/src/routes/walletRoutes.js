import express from 'express';
import * as walletController from '../controllers/walletController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/balance', authMiddleware, walletController.getWalletBalance);
router.get('/info', authMiddleware, walletController.getWalletInfo);
router.post('/faucet', authMiddleware, walletController.getTestEth);
router.post('/record-stake', authMiddleware, walletController.recordStake);
router.post('/stake-internal', authMiddleware, walletController.stakeInternal);

export default router;
