import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
    medicineA: {
        type: String,
        required: true
    },
    medicineB: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['Low', 'Moderate', 'High', 'Severe'],
        required: true
    },
    warningMessage: {
        type: String,
        required: true
    }
});

// Index for quick lookup in both directions
interactionSchema.index({ medicineA: 1, medicineB: 1 }, { unique: true });

const Interaction = mongoose.model('Interaction', interactionSchema);

export default Interaction;
