import express from 'express';
import { login, logout, getMe, getStats } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);
router.get('/stats', authMiddleware, getStats);

export default router;