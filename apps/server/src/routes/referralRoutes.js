import express from 'express';
import * as referralController from '../controllers/referralController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authMiddleware, referralController.getStats);
router.get('/network', authMiddleware, referralController.getNetwork);

export default router;
