import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './backend/models/Product.js';

dotenv.config();

const products = [
    // --- MEDICINES (Tablets, Syrups, etc.) ---
    {
        name: 'Paracetamol 650mg',
        price: 35,
        category: 'Medicine',
        description: 'Quality pain relief and temperature reduction tablets.',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=compress&cs=tinysrgb&w=400',
        dosage: '1 tablet every 6 hours',
        sideEffects: 'Mild nausea, stomach discomfort.',
        precautions: 'Do not exceed 4g daily. Avoid alcohol.',
        manufacturer: 'Nexus Life Sciences'
    },
    {
        name: 'Ibuprofen 400mg',
        price: 65,
        category: 'Medicine',
        description: 'Anti-inflammatory tablets for relief from muscle pain and fever.',
        image: 'https://images.unsplash.com/photo-1550572017-ed20015dd085?auto=compress&cs=tinysrgb&w=400',
        dosage: '1 tablet twice daily after food',
        sideEffects: 'Acidity, stomach pain.',
        precautions: 'Not for patients with stomach ulcers.',
        manufacturer: 'BioHeal'
    },
    {
        name: 'Azithromycin 500mg',
        price: 180,
        category: 'Medicine',
        description: 'Potent antibiotic for respiratory and skin infections.',
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=compress&cs=tinysrgb&w=400',
        dosage: '1 tablet daily for 3-5 days',
        sideEffects: 'Diarrhea, abdominal cramps.',
        precautions: 'Finish the full dose even if feeling better.',
        manufacturer: 'PharmaMax'
    },
    {
        name: 'Cetirizine 10mg',
        price: 40,
        category: 'Medicine',
        description: 'Effective non-drowsy relief from allergic reactions.',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=compress&cs=tinysrgb&w=400',
        dosage: '1 tablet at bedtime',
        sideEffects: 'Dry mouth, fatigue.',
        manufacturer: 'Shield Labs'
    },
    {
        name: 'Metformin 500mg',
        price: 120,
        category: 'Medicine',
        description: 'Essential medication for controlling blood sugar in type 2 diabetes.',
        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=compress&cs=tinysrgb&w=400',
        dosage: 'As directed by your physician',
        sideEffects: 'Metallic taste, bloating.',
        manufacturer: 'Glucostad'
    },
    {
        name: 'Amlodipine 5mg',
        price: 95,
        category: 'Medicine',
        description: 'Commonly prescribed for management of hypertension (high blood pressure).',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=compress&cs=tinysrgb&w=400',
        dosage: '1 tablet daily morning',
        manufacturer: 'HeartGuard'
    },
    {
        name: 'Omeprazole 20mg',
        price: 110,
        category: 'Medicine',
        description: 'Acid reducer used to treat heartburn and GERD.',
        image: 'https://images.unsplash.com/photo-1576071804486-b8bc22106dbf?auto=compress&cs=tinysrgb&w=400',
        dosage: '1 tablet daily 30 mins before breakfast',
        manufacturer: 'SafeGastro'
    },
    {
        name: 'Digene Antacid Syrup',
        price: 145,
        category: 'Medicine',
        description: 'Relieves acidity, gas, and stomach upset quickly.',
        image: 'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?auto=compress&cs=tinysrgb&w=400',
        dosage: '2 teaspoons after meals',
        manufacturer: 'Abbott Labs'
    },

    // --- WELLNESS & SUPPLEMENTS ---
    {
        name: 'Vitamin D3 60K UI',
        price: 250,
        category: 'Vitamins & Supplements',
        description: 'Stronger bones and improved immunity with high-dose Vitamin D.',
        image: 'https://images.unsplash.com/photo-1631549916768-4119b295f78b?auto=compress&cs=tinysrgb&w=400',
        dosage: '1 capsule weekly',
        manufacturer: 'BoneHealth'
    },
    {
        name: 'Calcium + Magnesium',
        price: 399,
        category: 'Vitamins & Supplements',
        description: 'A perfect blend for muscle and skeletal health.',
        image: 'https://images.unsplash.com/photo-1626202341253-154dfdae6f24?auto=compress&cs=tinysrgb&w=400',
        dosage: '1 tablet daily with food',
        manufacturer: 'NutriPlus'
    },
    {
        name: 'Ashwagandha Capsules',
        price: 499,
        category: 'Wellness',
        description: 'Traditional herb to help reduce stress and improve energy levels.',
        image: 'https://images.unsplash.com/photo-1611073113567-2826330002b6?auto=compress&cs=tinysrgb&w=400',
        dosage: '1-2 capsules daily',
        manufacturer: 'VedaCare'
    },
    {
        name: 'Protein Shake (Vanilla)',
        price: 2450,
        category: 'Wellness',
        description: 'High-quality whey protein for muscle recovery and performance.',
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=compress&cs=tinysrgb&w=400',
        manufacturer: 'MuscleMaster'
    },

    // --- MEDICAL DEVICES ---
    {
        name: 'Pulse Oximeter',
        price: 899,
        category: 'Medical Devices',
        description: 'Measure your SpO2 and pulse rate instantly and accurately.',
        image: 'https://images.unsplash.com/photo-1616391182219-a060c3279822?auto=compress&cs=tinysrgb&w=400',
        manufacturer: 'OxiCheck'
    },
    {
        name: 'Glucose Monitoring System',
        price: 1450,
        category: 'Medical Devices',
        description: 'Painless and quick blood sugar testing at home.',
        image: 'https://images.unsplash.com/photo-1590779033100-9f60705a2f3a?auto=compress&cs=tinysrgb&w=400',
        manufacturer: 'AccuSugar'
    },
    {
        name: 'Omron BP Monitor',
        price: 2200,
        category: 'Medical Devices',
        description: 'Clinical grade blood pressure monitoring for home use.',
        image: 'https://images.unsplash.com/photo-1616391182219-a060c3279822?auto=compress&cs=tinysrgb&w=400',
        manufacturer: 'Omron Health'
    },

    // --- FIRST AID ---
    {
        name: 'Dettol liquid 500ml',
        price: 195,
        category: 'First Aid',
        description: 'Complete protection from germs and bacteria.',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446f04?auto=compress&cs=tinysrgb&w=400',
        manufacturer: 'Reckitt'
    },
    {
        name: 'Cotton Crepe Bandage',
        price: 120,
        category: 'First Aid',
        description: 'Stretchy bandage for support in sprains and muscle strains.',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446f04?auto=compress&cs=tinysrgb&w=400',
        manufacturer: 'BioWrap'
    },

    // --- BABY CARE ---
    {
        name: 'Baby Sunscreen SPF 50',
        price: 450,
        category: 'Baby Care',
        description: 'Gentle, mineral-based protection for sensitive baby skin.',
        image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=compress&cs=tinysrgb&w=400',
        manufacturer: 'TinyCare'
    },
    {
        name: 'Gentle Baby Wipes (300s)',
        price: 350,
        category: 'Baby Care',
        description: 'Alcohol-free and hypoallergenic wipes for everyday use.',
        image: 'https://images.unsplash.com/photo-1624538183181-ed5786a51d45?auto=compress&cs=tinysrgb&w=400',
        manufacturer: 'HappyBums'
    },

    // --- PERSONAL CARE ---
    {
        name: 'Charcoal Face Wash',
        price: 299,
        category: 'Personal Care',
        description: 'Deep cleaning face wash with activated charcoal.',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=compress&cs=tinysrgb&w=400',
        manufacturer: 'GlowRoot'
    }
];

// Add 10 generic medicines to hit the 30+ mark
for (let i = 1; i <= 15; i++) {
    products.push({
        name: `HealthPlus Supplement v${i}`,
        price: 200 + (i * 50),
        category: i % 2 === 0 ? 'Wellness' : 'Medicine',
        description: 'Advanced nutritional support and daily health maintenance.',
        image: 'https://via.placeholder.com/400?text=Health+Product',
        manufacturer: 'General Pharma'
    });
}

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected for Seeding');

        await Product.deleteMany({});
        console.log('🗑️ Existing products cleared');

        await Product.insertMany(products);
        console.log(`🌱 Seeded ${products.length} products across multiple categories`);

        process.exit();
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDB();
