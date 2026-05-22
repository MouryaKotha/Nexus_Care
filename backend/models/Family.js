import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
    name: { type: String, required: true },
    primaryGuardian: { type: String, required: true }, // User ID or Email
    createdAt: { type: Date, default: Date.now }
});

const Family = mongoose.models.Family || mongoose.model('Family', familySchema);
export default Family;
