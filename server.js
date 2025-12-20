import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
const port = 3000;

// IMPORTANT: Replace with your actual Google API key.
const API_KEY = 'AIzaSyANC2KRkZ7W-LteTqRCwNRBfRYpteolcHI';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

// Middleware
app.use(express.json());
app.use(cors());

// A simple test route to confirm the server is running
app.get('/', (req, res) => {
    res.send('Backend server is running.');
});

// Main route for symptom checking
app.post('/api/symptom-check', async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms) {
        return res.status(400).json({ error: 'Symptoms field is required.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
            You are an AI-powered symptom checker. The user has described their symptoms. 
            Provide a helpful analysis based on these symptoms, formatted with clear sections using Markdown.

            ## Symptoms and Potential Causes
            Describe the common causes and conditions associated with the symptoms.

            ## General Advice and Precautions
            Provide general, non-medical advice such as rest, hydration, and over-the-counter medication recommendations.

            ## When to Seek Medical Attention
            Explain when the user should consider consulting a healthcare professional.

            ## Disclaimer
            Include a strong disclaimer that this is for informational purposes only and is not a substitute for professional medical advice.

            Symptoms: ${symptoms}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysis = response.text();

        res.status(200).json({ analysis });

    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ error: 'Failed to get symptom analysis. Please ensure your API key is correct and the server is running.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
