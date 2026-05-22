import express from 'express';
import { getAllApps, createApp, updateApp, deleteApp, toggleAppStatus } from '../controllers/appController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllApps);
router.post('/', createApp);
router.put('/:id', updateApp);
router.delete('/:id', deleteApp);
router.patch('/:id/toggle-status', toggleAppStatus);

export default router;