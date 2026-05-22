export const escalateMedicine = async (req, res) => {
    const { patientName, medicineName, time, emergencyContact } = req.body;

    if (!emergencyContact) {
        return res.status(400).json({ error: 'Emergency contact is required for escalation.' });
    }

    console.log(`\n🚨 [ESCALATION ALERT] 🚨`);
    console.log(`TIME: ${new Date().toLocaleString()}`);
    console.log(`TO: ${emergencyContact}`);
    console.log(`MESSAGE: ALERT: ${patientName} did not confirm taking ${medicineName} at ${time}. Please check on them immediately.`);
    console.log(`-------------------------\n`);

    res.status(200).json({
        success: true,
        message: 'Emergency contact has been notified via simulated SMS.'
    });
};

export const bookConsultation = async (req, res) => {
    const { doctorId, patientId, mode, time, meetLink, skypeId } = req.body;

    console.log(`\n📅 [NEW CONSULTATION BOOKING] 📅`);
    console.log(`DOCTOR ID: ${doctorId}`);
    console.log(`PATIENT ID: ${patientId}`);
    console.log(`MODE: ${mode}`);
    console.log(`TIME: ${time}`);
    if (meetLink) console.log(`GOOGLE MEET: ${meetLink}`);
    if (skypeId) console.log(`SKYPE ID: ${skypeId}`);
    console.log(`---------------------------------\n`);

    res.status(200).json({
        success: true,
        message: 'Consultation booked successfully.',
        booking: { doctorId, patientId, mode, time }
    });
};
