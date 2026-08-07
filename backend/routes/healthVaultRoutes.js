import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import HealthVault from '../models/HealthVault.js';

const router = express.Router();

// GET all records for the authenticated user
router.get('/', protect, async (req, res) => {
    try {
        const records = await HealthVault.find({ userId: req.user._id }).sort({ date: -1 });
        res.json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch records" });
    }
});

// POST a new uploaded file
router.post('/upload', protect, async (req, res) => {
    try {
        const { title, type, format, size, fileData } = req.body;
        
        if (!fileData) {
            return res.status(400).json({ success: false, message: "No file data provided." });
        }

        const newRecord = new HealthVault({
            userId: req.user._id,
            title,
            type: type || "Lab Report",
            format,
            size,
            fileData,
            date: new Date()
        });

        await newRecord.save();

        res.status(201).json({ success: true, record: newRecord });
    } catch (error) {
        console.error("Health Vault Upload Error:", error);
        res.status(500).json({ success: false, message: "Failed to upload document." });
    }
});

export default router;
