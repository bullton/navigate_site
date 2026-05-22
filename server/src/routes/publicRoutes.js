import express from 'express';
import { getPublicApps, getPublicAppBySlug, getFeaturedApps, getPublicCategories } from '../controllers/publicController.js';

const router = express.Router();

router.get('/apps', getPublicApps);
router.get('/apps/featured', getFeaturedApps);
router.get('/apps/:slug', getPublicAppBySlug);
router.get('/categories', getPublicCategories);

export default router;