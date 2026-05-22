import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The patient
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional at booking, populated later
    name: { type: String, required: true },
    email: { type: String, required: true },
    doctor: { type: String, required: true }, // The string name of doctor for display
    date: { type: String, required: true },
    time: { type: String, required: true },
    symptoms: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
