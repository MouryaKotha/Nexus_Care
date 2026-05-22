import express from 'express';
const router = express.Router();
import { getMyNotifications, markAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);

export default router;
