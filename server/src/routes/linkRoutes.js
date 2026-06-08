import express from 'express';
import { getAllLinks } from '../controllers/linkController.js';

const router = express.Router();

router.get('/', getAllLinks);

export default router;