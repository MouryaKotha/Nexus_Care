import mongoose from 'mongoose';

const bloodStockSchema = new mongoose.Schema({
    hospitalName: { type: String, required: true },
    location: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    unitsAvailable: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const BloodStock = mongoose.model('BloodStock', bloodStockSchema);
export default BloodStock;
