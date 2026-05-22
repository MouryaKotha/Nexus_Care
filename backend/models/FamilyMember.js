import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
    name: { type: String, required: true },
    age: { type: Number },
    relation: { type: String },
    role: {
        type: String,
        enum: ['Primary Guardian', 'Caregiver', 'Viewer', 'Emergency Contact'],
        default: 'Viewer'
    },
    healthProfile: {
        bloodGroup: { type: String },
        allergies: [String],
        conditions: [String],
        medications: [String],
        emergencyContacts: [{
            name: String,
            phone: String,
            relation: String
        }]
    },
    adherence: { type: Number, default: 100 }, // % adherence
    lastCalculated: { type: Date, default: Date.now }
});

const FamilyMember = mongoose.models.FamilyMember || mongoose.model('FamilyMember', familyMemberSchema);
export default FamilyMember;
