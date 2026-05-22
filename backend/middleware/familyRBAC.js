import FamilyMember from '../models/FamilyMember.js';

export const checkFamilyRole = (allowedRoles) => {
    return async (req, res, next) => {
        const { memberId } = req.params;
        const sessionId = req.headers['x-session-id']; // Mock session check

        try {
            const member = await FamilyMember.findById(memberId);
            if (!member) {
                return res.status(404).json({ error: 'Family member not found' });
            }

            // In a real app, compare session user role within THIS family
            // For now, we validate based on the stored role for the target member
            // OR the requester's identity if provided.

            if (!allowedRoles.includes(member.role)) {
                return res.status(403).json({
                    error: `Forbidden: ${member.role} role does not have permission for this action.`
                });
            }

            req.member = member;
            next();
        } catch (error) {
            res.status(500).json({ error: 'RBAC verification failed' });
        }
    };
};

export default checkFamilyRole;
