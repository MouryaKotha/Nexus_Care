import express from 'express';
import Family from '../models/Family.js';
import FamilyMember from '../models/FamilyMember.js';
import HealthTimeline from '../models/HealthTimeline.js';
import MedicalDocument from '../models/MedicalDocument.js';
import { calculateRisk } from '../services/riskEngine.js';
import { generateInsights } from '../services/insightEngine.js';
import { checkFamilyRole } from '../middleware/familyRBAC.js';
import seedFamilyData from '../services/seeder.js';

const router = express.Router();

/**
 * GET /api/family/seed
 * (Demo Only) Seeds initial family data.
 */
router.get('/seed', async (req, res) => {
    await seedFamilyData();
    res.json({ message: "Demo data seeded successfully." });
});

/**
 * GET /api/family/dashboard/:familyId
 * Aggregates data for the entire family.
 */
router.get('/dashboard/:familyId', async (req, res) => {
    try {
        const members = await FamilyMember.find({ familyId: req.params.familyId });

        const memberStats = await Promise.all(members.map(async (m) => {
            const risk = await calculateRisk(m._id);
            return {
                id: m._id,
                name: m.name,
                relation: m.relation,
                role: m.role,
                adherence: risk.adherence,
                riskLevel: risk.level,
                riskSummary: risk.summary
            };
        }));

        const totalActiveReminders = 0; // In real app, query Reminders collection
        const totalEscalations = await HealthTimeline.countDocuments({
            memberId: { $in: members.map(m => m._id) },
            eventType: 'Escalation'
        });

        const globalInsights = await Promise.all(members.map(m => generateInsights(m._id)));

        res.json({
            familyId: req.params.familyId,
            totalMembers: members.length,
            activeReminders: totalActiveReminders,
            escalationSummary: totalEscalations,
            members: memberStats,
            careInsights: globalInsights.flat()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/family/:memberId/timeline
 */
router.get('/:memberId/timeline', checkFamilyRole(['Primary Guardian', 'Caregiver', 'Viewer']), async (req, res) => {
    try {
        const timeline = await HealthTimeline.find({ memberId: req.params.memberId })
            .sort({ timestamp: -1 })
            .limit(50);
        res.json(timeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/family/member/:id/emergency-card
 */
router.get('/member/:id/emergency-card', checkFamilyRole(['Primary Guardian', 'Caregiver', 'Emergency Contact']), async (req, res) => {
    try {
        const member = await FamilyMember.findById(req.params.id);
        res.json(member.healthProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/family/member/:id/documents
 * (Note: In a real app, use multer for actual file uploads)
 */
router.post('/member/:id/documents', checkFamilyRole(['Primary Guardian', 'Caregiver']), async (req, res) => {
    try {
        const doc = new MedicalDocument({
            memberId: req.params.id,
            ...req.body
        });
        await doc.save();
        res.status(201).json(doc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/family/member
 * Adds a new family member.
 */
router.post('/member', async (req, res) => {
    try {
        const member = new FamilyMember(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
