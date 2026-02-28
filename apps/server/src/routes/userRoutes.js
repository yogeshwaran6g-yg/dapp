import express from 'express';
import * as authController from '../controllers/authController.js';
import { getNonceValidator, verifyValidator } from '../middleware/validators/authValidator.js';
import { validate } from '../middleware/validatorMiddleware.js';

const router = express.Router();

router.get('/auth/nonce', getNonceValidator, validate, authController.getNonce);
router.post('/auth/verify', verifyValidator, validate, authController.verify);
router.get('/auth/devlogin/:address', authController.devLogin);

export default router;
