import mongoose from 'mongoose';

const wellnessLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    mood: { type: String, enum: ['Happy', 'Neutral', 'Stressed', 'Sad'], required: true },
    sleep: { type: Number, required: true },
    water: { type: Number, required: true },
    exercise: { type: Number, required: true },
    energy: { type: Number, min: 1, max: 5, required: true },
    score: { type: Number },
    tipsGenerated: [String]
}, { timestamps: true });

const WellnessLog = mongoose.model('WellnessLog', wellnessLogSchema);

const habitTrackingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    habits: {
        walk: { type: Boolean, default: false },
        meditation: { type: Boolean, default: false },
        water: { type: Boolean, default: false },
        sleep: { type: Boolean, default: false },
        junkfood: { type: Boolean, default: false }
    }
}, { timestamps: true });

const HabitTracking = mongoose.model('HabitTracking', habitTrackingSchema);

export { WellnessLog, HabitTracking };
