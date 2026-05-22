import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Medicine', 'Wellness', 'Vitamins & Supplements', 'Medical Devices', 'Personal Care', 'First Aid', 'Baby Care', 'Elderly Care', 'Equipment']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=Product'
    },
    inStock: {
        type: Boolean,
        default: true
    },
    dosage: {
        type: String,
        default: ''
    },
    sideEffects: {
        type: String,
        default: 'No common side effects reported.'
    },
    precautions: {
        type: String,
        default: 'Consult a doctor before use.'
    },
    manufacturer: {
        type: String,
        default: 'Nexus Pharmaceuticals'
    },
    storage: {
        type: String,
        default: 'Store in a cool, dry place.'
    },
    expiryDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
