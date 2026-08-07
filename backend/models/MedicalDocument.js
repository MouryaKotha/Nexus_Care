import mongoose from 'mongoose';

const medicalDocumentSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyMember', required: true },
    documentName: { type: String, required: true },
    documentType: { type: String }, // e.g., 'Prescription', 'Lab Report'
    filePath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    uploadedBy: { type: String, index: true } // User ID
});

const MedicalDocument = mongoose.models.MedicalDocument || mongoose.model('MedicalDocument', medicalDocumentSchema);
export default MedicalDocument;
