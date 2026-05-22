import mongoose from 'mongoose';

const healthTimelineSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember', required: true },
    eventType: {
        type: String,
        enum: ['ReminderTaken', 'ReminderMissed', 'ReminderSnoozed', 'Appointment', 'SymptomReport', 'Escalation'],
        required: true
    },
    details: { type: Object }, // Flexible metadata
    timestamp: { type: Date, default: Date.now }
});

const HealthTimeline = mongoose.models.HealthTimeline || mongoose.model('HealthTimeline', healthTimelineSchema);
export default HealthTimeline;
