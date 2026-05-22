import express from 'express';
const router = express.Router();
import { getUserActivity, getUserStats, logActivity } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

router.get('/activity', protect, getUserActivity);
router.get('/stats', protect, getUserStats);
router.post('/activity', protect, logActivity);

export default router;
