import express from 'express';
import { escalateMedicine, bookConsultation } from '../controllers/consultationController.js';

const router = express.Router();

router.post('/escalate', escalateMedicine);
router.post('/book-consultation', bookConsultation);

export default router;
