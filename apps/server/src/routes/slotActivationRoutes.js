import express from 'express';
import * as slotActivationController from '../controllers/slotActivationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET slot activation by user ID - Public or Protected (Frontend uses userId from localStorage)
router.get('/:userId', slotActivationController.getSlotActivation);

// PUT update slot activation - Protected
router.put('/', authMiddleware, slotActivationController.updateSlotActivation);

export default router;
