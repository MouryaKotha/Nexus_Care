import mongoose from 'mongoose';

const cognitiveLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, default: Date.now },
    transcript: { type: String, required: true },
    responseTimeMs: { type: Number, required: true },
    totalWords: { type: Number, required: true },
    avgSentenceLength: { type: Number, required: true }
}, { timestamps: true });

const CognitiveLog = mongoose.model('CognitiveLog', cognitiveLogSchema);
export default CognitiveLog;
