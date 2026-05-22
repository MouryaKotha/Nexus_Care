import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    unitsRequired: { type: Number, required: true },
    hospitalName: { type: String, required: true },
    location: { type: String, required: true },
    urgency: { type: String, required: true, enum: ['Normal', 'Urgent', 'Critical'] }
}, { timestamps: true });

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);
export default BloodRequest;
