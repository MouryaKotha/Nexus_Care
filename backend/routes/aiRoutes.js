import express from 'express';
import { symptomCheck, mediTranslate, mentorAI } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/symptom-check', protect, symptomCheck);
router.post('/mentor', protect, mentorAI);
router.post('/meditranslate', protect, mediTranslate);

export default router;
