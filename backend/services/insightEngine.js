import HealthTimeline from '../models/HealthTimeline.js';

/**
 * Generates care insights for the family dashboard.
 * @param {string} memberId - Member ID.
 * @returns {Array} - Array of insight strings.
 */
export const generateInsights = async (memberId) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const history = await HealthTimeline.find({
        memberId,
        timestamp: { $gte: thirtyDaysAgo }
    });

    const insights = [];

    // Pattern 1: Weekend adherence
    const weekendMisses = history.filter(e => {
        const day = new Date(e.timestamp).getDay();
        return (day === 0 || day === 6) && e.eventType === 'ReminderMissed';
    }).length;

    const weekdayMisses = history.filter(e => {
        const day = new Date(e.timestamp).getDay();
        return (day !== 0 && day !== 6) && e.eventType === 'ReminderMissed';
    }).length;

    if (weekendMisses > weekdayMisses * 1.5 && weekendMisses > 2) {
        insights.push("Medication adherence drops on weekends. Consider setting extra reminders.");
    }

    // Pattern 2: Night doses
    const nightMisses = history.filter(e => {
        const hour = new Date(e.timestamp).getHours();
        return (hour >= 20 || hour <= 4) && e.eventType === 'ReminderMissed';
    }).length;

    if (nightMisses > 3) {
        insights.push("Multiple missed night doses detected. Suggest checking nighttime routine.");
    }

    // Pattern 3: Symptom vs Appointment
    const symptomReports = history.filter(e => e.eventType === 'SymptomReport');
    const missedAppointments = history.filter(e => e.eventType === 'Appointment' && e.details?.status === 'Missed');

    if (symptomReports.length > 0 && missedAppointments.length > 0) {
        insights.push("Symptoms reported before missed appointments. Prioritize next checkup.");
    }

    if (insights.length === 0) {
        insights.push("No significant patterns detected. Keep up the good work!");
    }

    return insights;
};

export default { generateInsights };
