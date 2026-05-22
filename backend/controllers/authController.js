import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        let { 
            firstName, lastName, email, password, role, phoneNumber, 
            gender, dateOfBirth, bloodGroup, 
            specialization, hospital, experienceYears, licenseNumber 
        } = req.body;

        email = email ? email.toLowerCase().trim() : '';

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'patient',
            phoneNumber,
            gender,
            dateOfBirth,
            bloodGroup,
            specialization: role === 'doctor' ? specialization : undefined,
            hospital: role === 'doctor' ? hospital : undefined,
            experienceYears: role === 'doctor' ? experienceYears : undefined,
            licenseNumber: role === 'doctor' ? licenseNumber : undefined,
            authProvider: 'local'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        
        email = email ? email.toLowerCase().trim() : '';
        console.log(`[Auth] Attempting login for: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`[Auth] Failed: Email not registered (${email})`);
            return res.status(401).json({ message: 'Email not registered' });
        }

        if (user && user.authProvider === 'google' && !user.password) {
            return res.status(400).json({ message: 'Please login using Google' });
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            const refreshToken = generateRefreshToken(user._id);
            user.refreshToken = refreshToken;
            user.lastLogin = new Date();
            await user.save();

            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                avatar: user.avatar || user.profilePic,
                token: generateToken(user._id),
                refreshToken
            });
        } else {
            console.log(`[Auth] Failed: Incorrect password for (${email})`);
            res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error(`[Auth] Server Error during login:`, error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'nexus_super_secret_key', {
        expiresIn: '15m', // Short-lived access token
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'nexus_refresh_secret', {
        expiresIn: '7d', // Long-lived refresh token
    });
};

// @desc    Google Login / Registration
// @route   POST /api/auth/google-login
export const googleLogin = async (req, res) => {
    try {
        const { email, firstName, lastName, picture } = req.body;
        
        let user = await User.findOne({ email });

        if (!user) {
            // Register new Google user
            user = await User.create({
                firstName,
                lastName: lastName || '',
                email,
                role: 'patient',
                avatar: picture,
                authProvider: 'google',
            });
        }

        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        user.avatar = picture || user.avatar; // Update avatar if changed
        await user.save();

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: 'Google Auth Error', error: error.message });
    }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
export const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'No refresh token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'nexus_refresh_secret');
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        res.json({
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(403).json({ message: 'Refresh token expired or invalid' });
    }
};

// @desc    Logout User
// @route   POST /api/auth/logout
export const logoutUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Logout Error', error: error.message });
    }
};
