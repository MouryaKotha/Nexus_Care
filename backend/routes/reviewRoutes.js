import express from 'express';
const router = express.Router();
import { addReview, getDoctorReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

router.post('/', protect, addReview);
router.get('/:doctorId', getDoctorReviews);

export default router;
