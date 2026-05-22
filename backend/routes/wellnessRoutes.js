import express from 'express';
import { createLog, getLogs } from '../controllers/wellnessController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/log', protect, createLog);
router.get('/logs', protect, getLogs);

export default router;
