import express from 'express';
import { queryRunner } from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// --- Authentication Routes ---

// 1. Request Nonce
router.get('/auth/nonce', authController.getNonce);

// 2. Verify Signature & Issue JWT
router.post('/auth/verify', authController.verify);

// --- Protected Routes ---
// Add other protected routes here if any


export default router;
