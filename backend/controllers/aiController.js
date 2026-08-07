import { getGeminiModel } from '../ai/gemini/geminiConfig.js';
import Conversation from '../models/Conversation.js';
import { getSymptomPrompt } from '../ai/prompts/symptomPrompt.js';
import { getMentorPrompt } from '../ai/prompts/mentorPrompt.js';
import { getTranslatorPrompt } from '../ai/prompts/translatorPrompt.js';

// Helper to get or create conversation history
const getConversationHistory = async (userId, aiType) => {
    let conv = await Conversation.findOne({ userId, aiType });
    if (!conv) {
        conv = new Conversation({ userId, aiType, messages: [] });
    }
    return conv;
};

// Format history for context
const formatHistory = (messages) => {
    return messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n');
};

export const symptomCheck = async (req, res) => {
    try {
        const { symptoms, lang } = req.body;
        if (!symptoms) return res.status(400).json({ error: 'Symptoms are required' });

        const model = getGeminiModel();
        const conv = await getConversationHistory(req.user._id, 'symptom');
        const historyContext = formatHistory(conv.messages.slice(-5)); // Last 5 messages

        const prompt = getSymptomPrompt(symptoms, req.user, historyContext, lang);
        
        const result = await model.generateContent(prompt);
        const analysis = result.response.text();

        // Save to memory
        conv.messages.push({ role: 'user', content: symptoms });
        conv.messages.push({ role: 'model', content: analysis });
        await conv.save();

        res.status(200).json({ analysis });
    } catch (error) {
        console.error('Symptom Check Error:', error);
        res.status(500).json({ error: 'Failed to process symptoms' });
    }
};

import CognitiveLog from '../models/CognitiveLog.js';

export const mentorAI = async (req, res) => {
    try {
        const { message, lang, cognitiveMetrics } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const model = getGeminiModel();
        const conv = await getConversationHistory(req.user._id, 'mentor');
        const historyContext = formatHistory(conv.messages.slice(-10));

        const prompt = getMentorPrompt(message, req.user, historyContext, lang);
        
        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        conv.messages.push({ role: 'user', content: message });
        conv.messages.push({ role: 'model', content: reply });
        await conv.save();

        // Save Cognitive Metrics if provided (only for voice interactions)
        if (cognitiveMetrics && cognitiveMetrics.isVoice) {
            const log = new CognitiveLog({
                userId: req.user._id,
                transcript: message,
                responseTimeMs: cognitiveMetrics.responseTimeMs || 0,
                totalWords: cognitiveMetrics.totalWords || 0,
                avgSentenceLength: cognitiveMetrics.avgSentenceLength || 0
            });
            await log.save();
        }

        res.status(200).json({ reply });
    } catch (error) {
        console.error('Mentor AI Error:', error);
        res.status(500).json({ error: 'Mentor AI failed to respond' });
    }
};

export const mediTranslate = async (req, res) => {
    try {
        const { text, lang, level } = req.body;
        if (!text) return res.status(400).json({ error: 'Text is required' });

        const model = getGeminiModel();
        const prompt = getTranslatorPrompt(text, lang, level);
        
        const result = await model.generateContent(prompt);
        const simplifiedText = result.response.text();

        // Optional: Save translations to history if needed
        const conv = await getConversationHistory(req.user._id, 'translator');
        conv.messages.push({ role: 'user', content: `Translate to ${lang}: ${text}` });
        conv.messages.push({ role: 'model', content: simplifiedText });
        await conv.save();

        res.status(200).json({ simplifiedText });
    } catch (error) {
        console.error('Translator Error:', error);
        res.status(500).json({ error: 'Failed to translate' });
    }
};
