import express from 'express';
import * as profileController from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:user_id', profileController.getProfile);               
router.put('/', authMiddleware, profileController.updateProfile);  
router.get('/', authMiddleware, profileController.getAllProfiles);   

export default router;
