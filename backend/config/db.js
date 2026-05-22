import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Atlas Error: ${error.message}. Attempting to spawn in-memory DB...`);
        try {
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            const localConn = await mongoose.connect(mongoUri);
            console.log(`✅ Local In-Memory MongoDB Connected: ${localConn.connection.host}`);
            
            // Seed Demo User
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            await User.create([
                {
                    firstName: 'Demo',
                    lastName: 'User',
                    email: 'demo@nexuscare.com',
                    password: hashedPassword,
                    role: 'patient',
                    authProvider: 'local'
                },
                {
                    firstName: 'Mourya',
                    lastName: 'Kotha',
                    email: 'mouryakotha@gmail.com',
                    password: hashedPassword,
                    role: 'patient',
                    authProvider: 'local'
                }
            ]);
            console.log(`✅ Demo Users Seeded (demo@nexuscare.com & mouryakotha@gmail.com / password123)`);

        } catch (localError) {
            console.error(`❌ Memory DB Error: ${localError.message}`);
            console.log(`⚠️ Warning: Running backend without Database connection.`);
        }
    }
};

export default connectDB;
