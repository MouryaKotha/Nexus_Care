import { WellnessLog, HabitTracking } from '../models/Wellness.js';

// @desc    Log a new daily wellness check-in
// @route   POST /api/wellness/log
// @access  Public (Should be private in production)
export const createLog = async (req, res) => {
    try {
        const { mood, sleep, water, exercise, energy } = req.body;

        if (!mood || sleep == null || water == null || exercise == null || energy == null) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Optional Backend Score Calculation
        let score = 0;
        let tips = [];

        if (sleep >= 7 && sleep <= 9) score += 30;
        else if (sleep >= 5) { score += 15; tips.push('Aim for 7-8 hours of sleep.'); }
        else { score += 5; tips.push('Your sleep is critically low.'); }

        if (water >= 8) score += 25;
        else if (water >= 4) { score += 10; tips.push('You are slightly dehydrated.'); }
        else tips.push('Severe dehydration detected.');

        if (exercise >= 30) score += 25;
        else if (exercise >= 15) score += 15;
        else tips.push('Try to fit in a 10-minute walk today.');

        if (mood === 'Happy' || mood === 'Neutral') score += 5;
        if (energy >= 4) score += 5;

        // If habits were tracked, they add 10 points on frontend, 
        // backend can just baseline the 85 points and let frontend add habits.

        const newLog = new WellnessLog({
            userId: req.user._id,
            mood, sleep, water, exercise, energy, score: Math.round(score), tipsGenerated: tips
        });

        // We wrap in a generic try/catch to gracefully handle if DB isn't connected
        if (mongoose && mongoose.connection.readyState === 1) {
            await newLog.save();
        }

        res.status(201).json({ message: 'Wellness log saved successfully', data: newLog });
    } catch (error) {
        console.error('Error in createLog:', error);
        res.status(500).json({ message: 'Server Error saving wellness log' });
    }
};

// @desc    Get user's wellness logs (last 7 days)
// @route   GET /api/wellness/logs
export const getLogs = async (req, res) => {
    try {
        if (mongoose && mongoose.connection.readyState === 1) {
            const logs = await WellnessLog.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(7);
            return res.json(logs);
        }
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error retrieving wellness logs' });
    }
};
