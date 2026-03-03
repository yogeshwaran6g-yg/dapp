import express from 'express';
import * as walletController from '../controllers/walletController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/wallet/balance - Protected route to get real-time ETH balance
router.get('/balance', authMiddleware, walletController.getWalletBalance);

// POST /api/wallet/faucet - Get free test ETH for simulated world
router.post('/faucet', authMiddleware, walletController.getTestEth);

export default router;
