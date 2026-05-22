import HealthTimeline from '../models/HealthTimeline.js';

/**
 * Calculates risk status based on historical adherence and events.
 * @param {string} memberId - Member identifier.
 * @returns {Object} - Risk status (Low, Medium, High) and triggers.
 */
export const calculateRisk = async (memberId) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const events = await HealthTimeline.find({
        memberId,
        timestamp: { $gte: sevenDaysAgo }
    });

    const missedCount = events.filter(e => e.eventType === 'ReminderMissed').length;
    const escalationCount = events.filter(e => e.eventType === 'Escalation' && e.timestamp >= fiveDaysAgo).length;

    // Check for symptom keywords in details
    const symptomKeywords = ['chest pain', 'shortness of breath', 'severe headache', 'fainting'];
    const hasCriticalSymptoms = events.some(e =>
        e.eventType === 'SymptomReport' &&
        symptomKeywords.some(kw => e.details?.symptoms?.toLowerCase().includes(kw))
    );

    let riskLevel = 'Low';
    let triggers = [];

    if (missedCount > 3) {
        riskLevel = 'Medium';
        triggers.push('More than 3 missed doses in 7 days');
    }

    if (escalationCount > 2) {
        riskLevel = 'High';
        triggers.push('Multiple escalation events in 5 days');
    }

    if (hasCriticalSymptoms) {
        riskLevel = 'High';
        triggers.push('Critical symptom keywords detected');
    }

    // Mock adherence for now (in real app, calculate Take vs Miss)
    const takenCount = events.filter(e => e.eventType === 'ReminderTaken').length;
    const totalReminders = takenCount + missedCount;
    const adherence = totalReminders > 0 ? (takenCount / totalReminders) * 100 : 100;

    if (adherence < 70) {
        riskLevel = riskLevel === 'High' ? 'High' : 'Medium';
        triggers.push(`Adherence is ${adherence.toFixed(0)}% (Below 70%)`);
    }

    return {
        level: riskLevel,
        triggers,
        adherence: Math.round(adherence),
        summary: triggers.length > 0 ? triggers.join('. ') : 'Stable conditions.'
    };
};

export default { calculateRisk };
