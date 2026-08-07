import Conversation from '../models/Conversation.js';
import CognitiveLog from '../models/CognitiveLog.js';
import HealthVault from '../models/HealthVault.js';
import MedicalDocument from '../models/MedicalDocument.js';
import PrivacySetting from '../models/PrivacySetting.js';

export const deleteAIMentorData = async (req, res) => {
    try {
        const userId = req.user._id;
        await Conversation.deleteMany({ userId, aiType: 'mentor' });
        await CognitiveLog.deleteMany({ userId });
        res.status(200).json({ success: true, message: "AI Mentor data deleted successfully." });
    } catch (error) {
        console.error('Delete AI Mentor Error:', error);
        res.status(500).json({ error: 'Unable to delete your data right now. Please try again.' });
    }
};

export const deleteHealthVaultData = async (req, res) => {
    try {
        const userId = req.user._id;
        await HealthVault.deleteMany({ userId });
        await MedicalDocument.deleteMany({ uploadedBy: userId.toString() });
        res.status(200).json({ success: true, message: "Health Vault data deleted successfully." });
    } catch (error) {
        console.error('Delete Health Vault Error:', error);
        res.status(500).json({ error: 'Unable to delete your data right now. Please try again.' });
    }
};

export const deleteCommunityData = async (req, res) => {
    try {
        const userId = req.user._id;
        const Discussion = (await import('../models/Discussion.js')).default;
        await Discussion.deleteMany({ userId });
        res.status(200).json({ success: true, message: "Community data deleted successfully." });
    } catch (error) {
        console.error('Delete Community Error:', error);
        res.status(500).json({ error: 'Unable to delete your data right now. Please try again.' });
    }
};

export const deleteAllData = async (req, res) => {
    try {
        const userId = req.user._id;
        await Conversation.deleteMany({ userId });
        await CognitiveLog.deleteMany({ userId });
        await HealthVault.deleteMany({ userId });
        await MedicalDocument.deleteMany({ uploadedBy: userId.toString() });
        // Delete Community posts (now securely linked)
        const Discussion = (await import('../models/Discussion.js')).default;
        await Discussion.deleteMany({ userId });

        res.status(200).json({ success: true, message: "Your personal Nexus Care data has been cleared successfully." });
    } catch (error) {
        console.error('Delete All Data Error:', error);
        res.status(500).json({ error: 'Unable to delete your data right now. Please try again.' });
    }
};

export const getPrivacySettings = async (req, res) => {
    try {
        let settings = await PrivacySetting.findOne({ userId: req.user._id });
        if (!settings) {
            settings = await PrivacySetting.create({ userId: req.user._id });
        }
        res.json(settings);
    } catch (error) {
        console.error('Get Privacy Settings Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const updatePrivacySettings = async (req, res) => {
    try {
        const { analyticsEnabled, speechDataEnabled, personalizationEnabled } = req.body;
        const settings = await PrivacySetting.findOneAndUpdate(
            { userId: req.user._id },
            { 
                analyticsEnabled: analyticsEnabled ?? true,
                speechDataEnabled: speechDataEnabled ?? true,
                personalizationEnabled: personalizationEnabled ?? true
            },
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        console.error('Update Privacy Settings Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};
