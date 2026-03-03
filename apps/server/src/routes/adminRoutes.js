import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', adminController.getUsers);
router.post('/users/:userId/block', adminController.blockUser);
router.get('/stats', adminController.getStats);
router.get('/treasury/metrics', adminController.getTreasuryMetrics);
router.get('/treasury/logs', adminController.getTreasuryLogs);

export default router;
