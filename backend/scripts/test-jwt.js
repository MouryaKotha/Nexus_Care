import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import 'dotenv/config';
import connectDB from '../config/db.js';

(async () => {
    await connectDB();
    const token = process.argv[2];
    if (!token) {
        console.log("No token provided");
        process.exit(1);
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        
        const user = await User.findById(decoded.id);
        console.log("User Found:", user ? user._id : null);
        
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
})();
