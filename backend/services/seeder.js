import mongoose from 'mongoose';
import Family from '../models/Family.js';
import FamilyMember from '../models/FamilyMember.js';
import HealthTimeline from '../models/HealthTimeline.js';

const seedFamilyData = async () => {
    try {
        // Clear existing demo data (safely)
        await Family.deleteMany({ name: "Kotha Family Demo" });
        await FamilyMember.deleteMany({ name: { $in: ["Mourya", "Gokul Kotha", "Leo Kotha"] } });

        const rootFamily = new Family({
            _id: new mongoose.Types.ObjectId("65db4f3a1d2e3c4b5a6d7e8f"), // Locked ID for demo
            name: "Kotha Family Demo",
            primaryGuardian: "mouryakotha@gmail.com"
        });
        await rootFamily.save();

        const members = [
            {
                _id: new mongoose.Types.ObjectId("65db4f3a1d2e3c4b5a6d7e90"),
                familyId: rootFamily._id,
                name: "Mourya",
                age: 24,
                relation: "Primary",
                role: "Primary Guardian",
                healthProfile: { bloodGroup: "O+", allergies: ["None"], conditions: ["Fit"], medications: ["Multivitamins"] }
            },
            {
                _id: new mongoose.Types.ObjectId("65db4f3a1d2e3c4b5a6d7e91"),
                familyId: rootFamily._id,
                name: "Gokul Kotha",
                age: 62,
                relation: "Parent",
                role: "Caregiver",
                healthProfile: { bloodGroup: "B+", allergies: ["Penicillin"], conditions: ["Hypertension"], medications: ["Lisinopril"] }
            },
            {
                _id: new mongoose.Types.ObjectId("65db4f3a1d2e3c4b5a6d7e92"),
                familyId: rootFamily._id,
                name: "Leo Kotha",
                age: 6,
                relation: "Child",
                role: "Viewer",
                healthProfile: { bloodGroup: "O+", allergies: ["Peanuts"], conditions: ["Asthma"], medications: ["Inhaler"] }
            }
        ];

        const savedMembers = await FamilyMember.insertMany(members);

        // Seed some timeline events
        const timelineEvents = [
            { memberId: savedMembers[1]._id, eventType: 'ReminderTaken', details: { medicine: 'Lisinopril' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
            { memberId: savedMembers[1]._id, eventType: 'ReminderMissed', details: { medicine: 'Lisinopril' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
            { memberId: savedMembers[1]._id, eventType: 'SymptomReport', details: { symptoms: 'Slight headache' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
            { memberId: savedMembers[0]._id, eventType: 'Appointment', details: { type: 'General Checkup', status: 'Completed' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) }
        ];

        await HealthTimeline.insertMany(timelineEvents);

        console.log("✅ [Seeder] Advanced Family Ecosystem data seeded successfully.");
    } catch (err) {
        console.error("❌ [Seeder] Error seeding data:", err);
    }
};

export default seedFamilyData;
