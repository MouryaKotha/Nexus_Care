import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ WARNING: GEMINI_API_KEY is not set in environment variables.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Export a robust model instance
export const getGeminiModel = () => {
    return genAI.getGenerativeModel({ 
        model: 'gemini-flash-latest',
        generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
        }
    });
};

export default genAI;
