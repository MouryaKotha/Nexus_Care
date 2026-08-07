import mongoose from 'mongoose';

const privacySettingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    analyticsEnabled: { type: Boolean, default: true },
    speechDataEnabled: { type: Boolean, default: true },
    personalizationEnabled: { type: Boolean, default: true },
    consentGiven: { type: Boolean, default: true },
    consentVersion: { type: String, default: "1.0" }
}, { timestamps: true });

const PrivacySetting = mongoose.models.PrivacySetting || mongoose.model('PrivacySetting', privacySettingSchema);
export default PrivacySetting;
