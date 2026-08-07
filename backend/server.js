import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import connectDB from './config/db.js';
import aiRoutes from './routes/aiRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import wellnessRoutes from './routes/wellnessRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import healthVaultRoutes from './routes/healthVaultRoutes.js';
import privacyRoutes from './routes/privacyRoutes.js';

const app = express();
const port = process.env.PORT || 5005;

// Connect to Database
connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Serve Static Frontend Files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/healthvault', healthVaultRoutes);
app.use('/api/privacy', privacyRoutes);

// Compatibility redirect if needed for old frontend paths (optional)
app.post('/api/symptom-check', (req, res) => res.redirect(307, '/api/ai/symptom-check'));
app.post('/api/meditranslate', (req, res) => res.redirect(307, '/api/ai/meditranslate'));
app.post('/api/escalate', (req, res) => res.redirect(307, '/api/consultation/escalate'));
app.post('/api/book-consultation', (req, res) => res.redirect(307, '/api/consultation/book-consultation'));

// Fallback for SPA routing
app.get(/^.*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Modular backend server listening at http://localhost:${port}`);
});

export default app;
