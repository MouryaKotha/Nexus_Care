import mongoose from 'mongoose';

const healthVaultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, default: "Lab Report" },
    format: { type: String },
    size: { type: String },
    fileData: { type: String },
    icon: { type: String, default: "📄" },
    theme: { type: String, default: "indigo" },
    doctor: { type: String, default: "Unknown" },
    hospital: { type: String, default: "Uploaded File" },
    diagnosis: { type: String, default: "Pending Medical Review" },
    observations: { type: [String], default: ["Self uploaded document"] },
    prescriptions: { type: [String], default: ["Pending"] },
    nextVisit: { type: String, default: "- -" }
});

const HealthVault = mongoose.models.HealthVault || mongoose.model('HealthVault', healthVaultSchema);
export default HealthVault;
