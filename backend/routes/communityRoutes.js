import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Discussion from '../models/Discussion.js';

const router = express.Router();

// Initialize Gemini for Moderation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @route POST /api/community/discussions
 * @desc Create a new discussion with AI Moderation
 */
router.post('/discussions', async (req, res) => {
    const { title, content, category, type } = req.body;

    if (!title || !content || !category || !type) {
        return res.status(400).json({
            success: false,
            message: "All fields (title, content, category, type) are required."
        });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const moderationPrompt = `
            You are an AI Community Moderator for Nexus Care, a healthcare support platform.
            Analyze the following discussion post for safety and appropriateness.
            
            Rules:
            1. No hate speech, abuse, or harassment.
            2. No spam or commercial advertisements.
            3. No explicit medical advice that could be dangerous (though sharing personal experiences is allowed).
            4. No highly inappropriate language.
            
            Post Title: ${title}
            Post Content: ${content}
            
            Return ONLY a JSON object with this structure:
            {
                "decision": "Approved" | "Rejected" | "Flagged",
                "score": 0.0 to 1.0 (1.0 being perfectly safe),
                "reason": "Brief reason for the decision",
                "flaggedTerms": ["any", "specific", "words", "if", "rejected"]
            }
        `;

        const result = await model.generateContent(moderationPrompt);
        const response = await result.response;
        const text = response.text();

        // Robust JSON parsing
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid response from AI");
        const moderationResult = JSON.parse(jsonMatch[0].trim());

        const newPost = new Discussion({
            title,
            content,
            category,
            type,
            status: moderationResult.decision,
            moderationLog: {
                score: moderationResult.score,
                reason: moderationResult.reason,
                flaggedTerms: moderationResult.flaggedTerms
            }
        });

        if (moderationResult.decision === 'Rejected') {
            return res.status(400).json({
                success: false,
                message: "Post rejected by AI Moderator.",
                reason: moderationResult.reason,
                flaggedTerms: moderationResult.flaggedTerms
            });
        }

        // Save to DB (mocking the save for now since DB connection is optional in server.js)
        // await newPost.save();

        res.status(201).json({
            success: true,
            message: "Discussion posted successfully!",
            discussion: newPost
        });

    } catch (error) {
        console.error('Moderation Error:', error);
        res.status(500).json({
            success: false,
            message: "AI Moderation failed. Please check if your Gemini API key is active.",
            error: error.message
        });
    }
});

/**
 * @route GET /api/community/discussions
 * @desc Get all approved discussions
 */
router.get('/discussions', async (req, res) => {
    try {
        // In a real app: const discussions = await Discussion.find({ status: 'Approved', isDeleted: false }).sort({ createdAt: -1 });
        // For now, we return empty or mock data if DB isn't fully active
        res.json({ success: true, discussions: [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
