import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    medicines: [
        {
            name: String,
            dosage: String,
            frequency: String,
            duration: String
        }
    ],
    notes: String,
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
    }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
