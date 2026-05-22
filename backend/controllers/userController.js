import Activity from '../models/Activity.js';
import Stats from '../models/Stats.js';
import User from '../models/User.js';

// @desc    Get user activity timeline
// @route   GET /api/users/activity
// @access  Private
const getUserActivity = async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching activity' });
    }
};

// @desc    Get user weekly statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
    try {
        const stats = await Stats.find({ user: req.user._id }).sort({ year: -1, week: -1 }).limit(4);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

// @desc    Log a new activity
// @route   POST /api/users/activity
// @access  Private
const logActivity = async (req, res) => {
    const { action, description } = req.body;
    try {
        const activity = await Activity.create({
            user: req.user._id,
            action,
            description
        });
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ message: 'Error logging activity' });
    }
};

export { getUserActivity, getUserStats, logActivity };
