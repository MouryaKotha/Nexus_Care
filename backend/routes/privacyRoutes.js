import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    deleteAIMentorData,
    deleteHealthVaultData,
    deleteCommunityData,
    deleteAllData,
    getPrivacySettings,
    updatePrivacySettings
} from '../controllers/privacyController.js';

const router = express.Router();

router.get('/settings', protect, getPrivacySettings);
router.put('/settings', protect, updatePrivacySettings);

router.delete('/ai-mentor', protect, deleteAIMentorData);
router.delete('/health-vault', protect, deleteHealthVaultData);
router.delete('/community', protect, deleteCommunityData);
router.delete('/all', protect, deleteAllData);
router.delete('/data', protect, deleteAllData); // Alias for Clear My Data

export default router;
