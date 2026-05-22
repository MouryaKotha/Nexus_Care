import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: false }, // false for OAuth users
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    profilePic: { type: String, default: '' },
    avatar: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    
    // Auth Extensions
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    profileCompletion: { type: Number, default: 0 },
    lastLogin: { type: Date },
    refreshToken: { type: String },
    deviceSessions: [{
        deviceId: String,
        lastActive: Date
    }],
    
    // Healthcare Specific
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String },
    
    // Doctor Specific Conditional Fields
    specialization: { type: String },
    hospital: { type: String },
    experienceYears: { type: Number },
    licenseNumber: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
