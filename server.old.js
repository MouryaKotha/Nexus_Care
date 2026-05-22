import express from 'express';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import connectDB from './backend/config/db.js';
import Appointment from './backend/models/Appointment.js';

const app = express();
const port = process.env.PORT || 5000;

// Connect to Database
// connectDB();

// IMPORTANT: The Gemini API key is now loaded from the .env file.
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('❌ ERROR: GEMINI_API_KEY is missing in your .env file!');
    console.error('Please add GEMINI_API_KEY=your_actual_key to the .env file and restart the server.');
    process.exit(1);
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);
console.log('✅ Gemini API client initialized.');

// Middleware
app.use(express.json());
app.use(cors());

// A simple test route to confirm the server is running
app.get('/', (req, res) => {
    res.json({ message: 'Nexus Care Backend is running.', version: '1.1' });
});

// GET check for debugging
app.get('/api/meditranslate', (req, res) => {
    res.json({ message: 'MediTranslate API endpoint is ready (POST required).' });
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

// New route for medical jargon simplification (MediTranslate)
app.post('/api/meditranslate', async (req, res) => {
    const { text, level, lang } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Medical text is required.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
            You are a medical communication expert. 
            Simplify the following medical text for a ${level || 'adult'} audience.
            The final explanation should be in ${lang || 'English'}.
            
            Structure your response as follows:
            1. Heading: A clear summary of the document.
            2. Plain Language Explanation: Break down complex terms and explain what they mean for the patient's health.
            3. Key Findings: Bullet points.
            4. Visual Actions: 3 specific steps for the patient to take next.
            
            Medical Text:
            ${text}
            
            Return the response in valid HTML format (use <h3> for headings, <p> for paragraphs, and <ul>/<li> for lists).
            IMPORTANT: For the "Visual Actions", prefix each step with "STEP_ACTION:" followed by the text, so these can be parsed into visual cards.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const simplifiedText = response.text();

        res.status(200).json({ simplifiedText });

    } catch (error) {
        console.error('Error with MediTranslate API:', error);
        res.status(500).json({ error: 'Failed to simplify document. Please try again later.' });
    }
});

// Escalation endpoint for missed medication
app.post('/api/escalate', async (req, res) => {
    const { patientName, medicineName, time, emergencyContact } = req.body;

    if (!emergencyContact) {
        return res.status(400).json({ error: 'Emergency contact is required for escalation.' });
    }

    console.log(`\n🚨 [ESCALATION ALERT] 🚨`);
    console.log(`TIME: ${new Date().toLocaleString()}`);
    console.log(`TO: ${emergencyContact}`);
    console.log(`MESSAGE: ALERT: ${patientName} did not confirm taking ${medicineName} at ${time}. Please check on them immediately.`);
    console.log(`-------------------------\n`);

    // In a real app, you would integrate Twilio here:
    // client.messages.create({ body: '...', to: emergencyContact, from: '...' });

    res.status(200).json({
        success: true,
        message: 'Emergency contact has been notified via simulated SMS.'
    });
});

// Consultation booking endpoint
app.post('/api/book-consultation', async (req, res) => {
    const { doctorId, patientId, mode, time, meetLink, skypeId } = req.body;

    console.log(`\n📅 [NEW CONSULTATION BOOKING] 📅`);
    console.log(`DOCTOR ID: ${doctorId}`);
    console.log(`PATIENT ID: ${patientId}`);
    console.log(`MODE: ${mode}`);
    console.log(`TIME: ${time}`);
    if (meetLink) console.log(`GOOGLE MEET: ${meetLink}`);
    if (skypeId) console.log(`SKYPE ID: ${skypeId}`);
    console.log(`---------------------------------\n`);

    // In a production app, you would save this to a database (e.g., MongoDB/PostgreSQL)
    res.status(200).json({
        success: true,
        message: 'Consultation booked successfully.',
        booking: { doctorId, patientId, mode, time }
    });
});

// Appointment booking endpoint (Stores in MongoDB - DISABLED)
app.post('/api/appointments/book', async (req, res) => {
    console.log('📥 Incoming appointment booking request (Skipped DB):', req.body);
    return res.status(200).json({ message: 'Appointment booking received (DB connection removed)', data: req.body });
    /*
    try {
        const newAppointment = await Appointment.create(req.body);
        console.log('✅ Appointment saved successfully:', newAppointment._id);
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('❌ Error saving appointment:', error.message);
        res.status(400).json({ message: error.message });
    }
    */
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
