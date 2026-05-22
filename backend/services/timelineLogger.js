import HealthTimeline from '../models/HealthTimeline.js';

/**
 * Logs a health-related event to the member's timeline.
 * @param {string} memberId - MongoDB ObjectId of the family member.
 * @param {string} eventType - Type of event (e.g., 'ReminderMissed').
 * @param {Object} details - Additional metadata.
 */
export const logEvent = async (memberId, eventType, details = {}) => {
    try {
        const entry = new HealthTimeline({
            memberId,
            eventType,
            details,
            timestamp: new Date()
        });
        await entry.save();
        console.log(`[TimelineLogger] Event logged: ${eventType} for member ${memberId}`);
        return entry;
    } catch (error) {
        console.error(`[TimelineLogger] Error logging event:`, error);
    }
};

export default { logEvent };
