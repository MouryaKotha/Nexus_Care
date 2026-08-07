import express from 'express';
import { createLog, getLogs, getHabits, updateHabits, getCognitiveReport } from '../controllers/wellnessController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/log', protect, createLog);
router.get('/logs', protect, getLogs);
router.get('/habits', protect, getHabits);
router.post('/habits', protect, updateHabits);
router.get('/cognitive', protect, getCognitiveReport);

export default router;
