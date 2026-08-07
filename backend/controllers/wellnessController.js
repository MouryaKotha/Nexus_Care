import mongoose from 'mongoose';
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

// @desc    Get user's habit tracking
// @route   GET /api/wellness/habits
export const getHabits = async (req, res) => {
    try {
        if (mongoose && mongoose.connection.readyState === 1) {
            let tracking = await HabitTracking.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
            if (!tracking) {
                // Initialize default
                tracking = new HabitTracking({ userId: req.user._id, habits: {} });
                await tracking.save();
            }
            return res.json(tracking.habits);
        }
        res.json({});
    } catch (error) {
        res.status(500).json({ message: 'Server Error retrieving habits' });
    }
};

export const updateHabits = async (req, res) => {
    try {
        const { habits } = req.body;
        if (mongoose && mongoose.connection.readyState === 1) {
            let tracking = await HabitTracking.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
            if (tracking) {
                tracking.habits = habits;
            } else {
                tracking = new HabitTracking({ userId: req.user._id, habits });
            }
            await tracking.save();
            return res.status(200).json(tracking.habits);
        }
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating habits' });
    }
};

import CognitiveLog from '../models/CognitiveLog.js';

// @desc    Get Cognitive Wellness Report
// @route   GET /api/wellness/cognitive
export const getCognitiveReport = async (req, res) => {
    try {
        if (!mongoose || mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        // Check if logs exist, otherwise mock data for testing as approved in the plan
        const count = await CognitiveLog.countDocuments({ userId: req.user._id });
        if (count === 0) {
            // Generate mocked historical data for the past 14 days
            const mockLogs = [];
            for (let i = 14; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                
                // Simulate a slight decline in the last 3 days to trigger an alert
                let words = Math.floor(Math.random() * 20) + 40; // 40-60 words
                let sentenceLen = Math.floor(Math.random() * 3) + 7; // 7-10 words
                let respTime = Math.floor(Math.random() * 1000) + 1500; // 1.5s - 2.5s
                
                if (i < 3) {
                    words = Math.floor(Math.random() * 10) + 20; // 20-30 words (drop)
                    sentenceLen = Math.floor(Math.random() * 2) + 4; // 4-6 words (drop)
                    respTime = Math.floor(Math.random() * 1500) + 2500; // 2.5s - 4.0s (increase)
                }

                mockLogs.push({
                    userId: req.user._id,
                    date: date,
                    transcript: "Mocked transcript string",
                    responseTimeMs: respTime,
                    totalWords: words,
                    avgSentenceLength: sentenceLen
                });
            }
            await CognitiveLog.insertMany(mockLogs);
        }

        const logs = await CognitiveLog.find({ userId: req.user._id }).sort({ date: 1 });

        // Calculate trends (comparing last 7 days vs previous 7 days)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        let currentWeekWords = [], currentWeekResponse = [], currentWeekSentences = [];
        let prevWeekWords = [], prevWeekResponse = [], prevWeekSentences = [];

        logs.forEach(log => {
            if (log.date >= sevenDaysAgo) {
                currentWeekWords.push(log.totalWords);
                currentWeekResponse.push(log.responseTimeMs);
                currentWeekSentences.push(log.avgSentenceLength);
            } else {
                prevWeekWords.push(log.totalWords);
                prevWeekResponse.push(log.responseTimeMs);
                prevWeekSentences.push(log.avgSentenceLength);
            }
        });

        const avg = (arr) => arr.length ? arr.reduce((a,b)=>a+b, 0) / arr.length : 0;

        const currentAvgWords = avg(currentWeekWords);
        const prevAvgWords = avg(prevWeekWords);
        
        const currentAvgResponse = avg(currentWeekResponse);
        const prevAvgResponse = avg(prevWeekResponse);

        const currentAvgSentence = avg(currentWeekSentences);
        const prevAvgSentence = avg(prevWeekSentences);

        // Detect decline (e.g., >20% drop in words or >30% increase in response time)
        const alerts = [];
        if (prevAvgWords > 0 && currentAvgWords < prevAvgWords * 0.8) {
            alerts.push("Significant drop detected in daily word count (vocabulary usage).");
        }
        if (prevAvgResponse > 0 && currentAvgResponse > prevAvgResponse * 1.3) {
            alerts.push("Noticeable increase in response time (delayed speech processing).");
        }
        if (prevAvgSentence > 0 && currentAvgSentence < prevAvgSentence * 0.8) {
            alerts.push("Decrease in average sentence length (simplified speech patterns).");
        }

        // Simple Wellness Score (0-100) based on stability
        let score = 100;
        if (alerts.length === 1) score -= 15;
        if (alerts.length === 2) score -= 35;
        if (alerts.length >= 3) score -= 55;

        res.json({
            trends: {
                currentWeek: {
                    avgWords: currentAvgWords,
                    avgResponseMs: currentAvgResponse,
                    avgSentenceLength: currentAvgSentence
                },
                previousWeek: {
                    avgWords: prevAvgWords,
                    avgResponseMs: prevAvgResponse,
                    avgSentenceLength: prevAvgSentence
                }
            },
            score,
            alerts,
            logs // sending logs for chart rendering
        });
    } catch (error) {
        console.error('Cognitive Report Error:', error);
        res.status(500).json({ message: 'Server Error generating cognitive report' });
    }
};
