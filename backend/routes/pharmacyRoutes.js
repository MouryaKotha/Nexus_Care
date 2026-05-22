import express from 'express';
const router = express.Router();
import { getProducts, getMyPrescriptions, createPrescription, placeOrder, getMyOrders } from '../controllers/pharmacyController.js';
import { protect } from '../middleware/auth.js';

router.get('/products', getProducts);
router.get('/prescriptions', protect, getMyPrescriptions);
router.post('/prescriptions', protect, createPrescription);
router.post('/orders', protect, placeOrder);
router.get('/orders', protect, getMyOrders);

export default router;
