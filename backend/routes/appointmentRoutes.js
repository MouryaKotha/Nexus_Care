import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', protect, async (req, res) => {
    try {
        const appointment = new Appointment({
            ...req.body,
            user: req.user._id
        });
        await appointment.save();
        res.status(201).json({ message: 'Appointment booked successfully', data: appointment });
    } catch (error) {
        res.status(500).json({ message: 'Error booking appointment', error: error.message });
    }
});

// GET route to view user-specific appointments
router.get('/', protect, async (req, res) => {
    try {
        let query = { user: req.user._id };
        if (req.user.role === 'doctor') {
            query = { doctorId: req.user._id }; // or based on doctor name if ID isn't mapped yet
        }
        const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
});

export default router;
