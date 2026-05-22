import express from 'express';
const router = express.Router();

// Mock database for history (In real app, this would be MongoDB)
// For this MERN stack demonstration, we assume data is passed or fetched from a shared store
router.get('/report/:userId', (req, res) => {
    const { userId } = req.params;

    // In a real MERN app, we'd query the 'ReminderHistory' collection
    // For now, we return a structured report template
    console.log(`[Caregiver] Generating adherence report for User: ${userId}`);

    res.status(200).json({
        userId: userId,
        generatedAt: new Date().toISOString(),
        summary: {
            adherenceRate: "85%", // Mock data
            onTimePercentage: "78%",
            missedDoses: 3,
            escalationEvents: 1,
            streak: 5
        },
        logs: [
            { medicine: "Aspirin", action: "Taken", time: "2026-02-26T08:00:00Z" },
            { medicine: "Metformin", action: "Snoozed", time: "2026-02-26T09:00:00Z" },
            { medicine: "Metformin", action: "Taken", time: "2026-02-26T09:15:00Z" }
        ],
        optimizationSuggestions: [
            "Patient frequently snoozes morning doses. Consider moving 9AM dose to 9:30AM."
        ]
    });
});

export default router;
