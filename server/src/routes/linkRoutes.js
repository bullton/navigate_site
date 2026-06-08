import express from 'express';
import { getLinksByApp } from '../controllers/linkController.js';

const router = express.Router();

router.get('/app/:appId', getLinksByApp);

export default router;