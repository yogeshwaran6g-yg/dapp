import express from 'express';
import * as swapController from '../controllers/swapController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/execute', authMiddleware, swapController.executeSwap);
router.get('/history', authMiddleware, swapController.getSwapHistory);
router.get('/rates', authMiddleware, swapController.getSwapRates);

export default router;
