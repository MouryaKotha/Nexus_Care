import express from 'express';
import { registerUser, loginUser, getUserProfile, googleLogin, refreshToken, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);

export default router;
