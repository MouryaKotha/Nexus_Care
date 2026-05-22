import express from 'express';
import {
    registerDonor,
    createBloodRequest,
    updateBloodStock,
    getBloodStock,
    matchDonors
} from '../controllers/bloodController.js';

const router = express.Router();

router.post('/donor', registerDonor);
router.post('/request', createBloodRequest);
router.post('/stock', updateBloodStock);
router.get('/stock', getBloodStock);
router.get('/match/:bloodGroup/:location', matchDonors);

export default router;
