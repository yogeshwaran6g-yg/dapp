import express from 'express';
import { getUsers, getUserDetail, blockUser, getStats, getTreasuryMetrics, getTreasuryLogs, getStakeHistory, getSwapHistory } from '../controllers/adminController.js';
import { adminLogin } from '../controllers/adminAuthController.js';
import { adminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public admin routes
router.post('/login', adminLogin);

// Protected admin routes
router.use(adminAuth);

router.get('/users', getUsers);
router.get('/users/:userId', getUserDetail);
router.post('/users/:userId/block', blockUser);
router.get('/stats', getStats);
router.get('/treasury/metrics', getTreasuryMetrics);
router.get('/treasury/logs', getTreasuryLogs);
router.get('/staking/history', getStakeHistory);
router.get('/swaps', getSwapHistory);

export default router;
