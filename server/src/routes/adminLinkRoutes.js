import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getAllLinks, createLink, updateLink, deleteLink } from '../controllers/linkController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllLinks);
router.post('/', createLink);
router.put('/:id', updateLink);
router.delete('/:id', deleteLink);

export default router;