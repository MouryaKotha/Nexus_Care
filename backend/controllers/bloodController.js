import Donor from '../models/Donor.js';
import BloodRequest from '../models/BloodRequest.js';
import BloodStock from '../models/BloodStock.js';

// Blood Compatibility Logic
// Key: Recipient Blood Type, Value: List of Compatible Donor Blood Types
const compatibilityMap = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-'] // Only O-
};

// Register a new Donor
export const registerDonor = async (req, res) => {
    try {
        const donor = await Donor.create(req.body);
        res.status(201).json({ success: true, data: donor });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Create a new Blood Request
export const createBloodRequest = async (req, res) => {
    try {
        const bloodRequest = await BloodRequest.create(req.body);
        res.status(201).json({ success: true, data: bloodRequest });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update Hospital Blood Stock
export const updateBloodStock = async (req, res) => {
    try {
        const { hospitalName, location, bloodGroup, unitsAvailable } = req.body;

        // Find if stock already exists for this hospital and blood group
        let stock = await BloodStock.findOne({ hospitalName, location, bloodGroup });

        if (stock) {
            stock.unitsAvailable = unitsAvailable;
            await stock.save();
        } else {
            stock = await BloodStock.create(req.body);
        }

        res.status(200).json({ success: true, data: stock });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all Blood Stock
export const getBloodStock = async (req, res) => {
    try {
        const stocks = await BloodStock.find();
        res.status(200).json({ success: true, data: stocks });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Match Donors based on Blood Group and Location (with Compatibility Logic)
export const matchDonors = async (req, res) => {
    try {
        const { bloodGroup, location } = req.params;

        // Get list of compatible blood groups for the requested group
        const compatibleGroups = compatibilityMap[bloodGroup] || [bloodGroup];

        const donors = await Donor.find({
            bloodGroup: { $in: compatibleGroups },
            location: { $regex: new RegExp(location, 'i') }, // Case-insensitive location match
            available: true
        });

        res.status(200).json({ success: true, data: donors });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
