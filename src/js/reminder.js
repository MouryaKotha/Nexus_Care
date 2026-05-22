/**
 * Nexus Care — Advanced Smart Medical Reminder (v2.0)
 * ─────────────────────────────────────────────────────
 * BACKWARD COMPATIBLE: All original logic preserved.
 * New features layered on top as optional extensions.
 * Original localStorage key: 'nexus_reminders'
 */
document.addEventListener('DOMContentLoaded', () => {

    // ─── DOM References (original IDs preserved) ────────────────────────────
    const reminderForm = document.getElementById('reminder-form');
    const contactForm = document.getElementById('contact-form');
    const reminderList = document.getElementById('reminder-list');
    const emptyState = document.getElementById('empty-state');
    const modal = document.getElementById('reminder-modal');
    const modalMedName = document.getElementById('modal-med-name');
    const modalMedInstr = document.getElementById('modal-med-instr');
    const countdownEl = document.getElementById('countdown');
    const btnTaken = document.getElementById('btn-taken');
    const btnSnooze = document.getElementById('btn-snooze');

    // ─── New element refs (safe: optional chaining if page doesn't have them) ─
    const btnSkip = document.getElementById('btn-skip');
    const skipPanel = document.getElementById('skip-reason-panel');
    const snoozeCountEl = document.getElementById('snooze-count');
    const modalPriorityBanner = document.getElementById('modal-priority-banner');
    const modalMedDetail = document.getElementById('modal-med-detail');
    const modalPillsAlert = document.getElementById('modal-pills-alert');
    const modalPillsCount = document.getElementById('modal-pills-count');
    const healthAlerts = document.getElementById('health-alerts-banner');

    // ─── State ──────────────────────────────────────────────────────────────
    let reminders = JSON.parse(localStorage.getItem('nexus_reminders') || '[]');
    let emergencyContact = localStorage.getItem('nexus_emergency_contact') || '';
    let secondaryContact = localStorage.getItem('nexus_secondary_contact') || '';
    let tertiaryContact = localStorage.getItem('nexus_tertiary_contact') || '';
    let analytics = JSON.parse(localStorage.getItem('nexus_analytics') || '{"taken":[],"missed":[],"skipped":[],"escalations":0,"streak":0,"lastTaken":null}');

    let escalationTimer = null;
    let activeReminderId = null;
    let currentSnoozeCount = 0;
    let currentFilter = 'all';

    // ─── Init ────────────────────────────────────────────────────────────────
    if (emergencyContact) document.getElementById('emergency-phone').value = emergencyContact;
    if (secondaryContact && document.getElementById('secondary-phone')) document.getElementById('secondary-phone').value = secondaryContact;
    if (tertiaryContact && document.getElementById('tertiary-phone')) document.getElementById('tertiary-phone').value = tertiaryContact;

    renderReminders();
    updateAnalyticsDashboard();
    updateCaregiverPanel();
    showHealthAlerts();
    checkReminders();
    setInterval(checkReminders, 10000);
    setInterval(() => checkLowStock(), 60000 * 60); // hourly refill check

    // ─── Form: Add Reminder ──────────────────────────────────────────────────
    reminderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const pillsRaw = document.getElementById('med-pills')?.value;
        const pills = pillsRaw !== '' && pillsRaw != null ? parseInt(pillsRaw) : null;

        const newReminder = {
            // ── Original fields ──
            id: Date.now(),
            medicine: document.getElementById('med-name').value.trim(),
            time: document.getElementById('med-time').value,
            instructions: document.getElementById('med-instr')?.value || '',
            status: 'pending',
            created: new Date().toISOString(),

            // ── New optional fields ──
            type: document.getElementById('med-type')?.value || '',
            frequency: document.getElementById('med-freq')?.value || '',
            route: document.getElementById('med-route')?.value || '',
            condition: document.getElementById('med-condition')?.value || '',
            doctor: document.getElementById('med-doctor')?.value || '',
            rxStart: document.getElementById('med-start')?.value || '',
            rxEnd: document.getElementById('med-end')?.value || '',
            pillsLeft: pills,
            pharmacy: document.getElementById('med-pharmacy')?.value || '',
            highPriority: document.getElementById('med-priority')?.checked || false,
            snoozeCount: 0,
            missedStreak: 0,
            skipReasons: [],
            adherenceLog: []
        };

        reminders.push(newReminder);
        saveReminders();
        renderReminders();
        updateAnalyticsDashboard();
        reminderForm.reset();
        document.getElementById('adv-fields')?.classList.add('hidden');

        if (Notification.permission !== 'granted') Notification.requestPermission();
        showToast(`✅ Reminder set for ${newReminder.medicine}`, 'success');
    });

    // ─── Form: Emergency Contacts ─────────────────────────────────────────────
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        emergencyContact = document.getElementById('emergency-phone').value;
        secondaryContact = document.getElementById('secondary-phone')?.value || '';
        tertiaryContact = document.getElementById('tertiary-phone')?.value || '';

        localStorage.setItem('nexus_emergency_contact', emergencyContact);
        localStorage.setItem('nexus_secondary_contact', secondaryContact);
        localStorage.setItem('nexus_tertiary_contact', tertiaryContact);
        showToast('📞 Emergency contacts saved!', 'success');
    });

    // ─── Modal: TAKEN ────────────────────────────────────────────────────────
    btnTaken.addEventListener('click', () => {
        const r = reminders.find(r => r.id === activeReminderId);
        if (r) {
            if (r.pillsLeft !== null && r.pillsLeft > 0) r.pillsLeft--;
            r.adherenceLog = r.adherenceLog || [];
            r.adherenceLog.push({ date: new Date().toISOString(), action: 'taken' });
        }
        updateReminderStatus(activeReminderId, 'taken');
        recordAnalytics('taken');
        updateCaregiverPanel();
        closeModal();
    });

    // ─── Modal: SNOOZE (max 3) ───────────────────────────────────────────────
    btnSnooze.addEventListener('click', () => {
        const reminder = reminders.find(r => r.id === activeReminderId);
        if (reminder) {
            reminder.snoozeCount = (reminder.snoozeCount || 0) + 1;
            currentSnoozeCount = reminder.snoozeCount;

            if (reminder.snoozeCount >= 3) {
                showToast('⚠️ Max snoozes reached. Escalating now…', 'warning');
                escalateReminder(reminder);
                return;
            }

            const newTime = new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16);
            reminder.time = newTime;
            reminder.status = 'pending';
            saveReminders();
            renderReminders();
            if (snoozeCountEl) snoozeCountEl.textContent = reminder.snoozeCount;
        }
        closeModal();
    });

    // ─── Modal: SKIP ─────────────────────────────────────────────────────────
    if (btnSkip) {
        btnSkip.addEventListener('click', () => {
            skipPanel?.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('.skip-reason-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reason = btn.dataset.reason;
            const r = reminders.find(r => r.id === activeReminderId);
            if (r) {
                r.skipReasons = r.skipReasons || [];
                r.skipReasons.push({ reason, date: new Date().toISOString() });
                r.missedStreak = (r.missedStreak || 0) + 1;
                r.adherenceLog = r.adherenceLog || [];
                r.adherenceLog.push({ date: new Date().toISOString(), action: 'skipped', reason });
            }
            updateReminderStatus(activeReminderId, 'missed');
            recordAnalytics('missed');
            checkSafetyFlags();
            updateCaregiverPanel();
            closeModal();
            showToast(`Skipped: ${reason}`, 'info');
        });
    });

    // ─── Core: Check Pending Reminders ────────────────────────────────────────
    function checkReminders() {
        const now = new Date();
        reminders.forEach(r => {
            if (r.status === 'pending') {
                const reminderTime = new Date(r.time);
                if (now >= reminderTime) triggerReminder(r);
            }
        });
    }

    // ─── Core: Trigger Reminder Modal ────────────────────────────────────────
    function triggerReminder(reminder) {
        activeReminderId = reminder.id;
        currentSnoozeCount = reminder.snoozeCount || 0;

        modalMedName.innerText = reminder.medicine;
        modalMedInstr.innerText = reminder.instructions || 'No special instructions.';

        if (modalMedDetail) {
            const parts = [reminder.type, reminder.frequency, reminder.route, reminder.condition].filter(Boolean);
            modalMedDetail.textContent = parts.length ? parts.join(' · ') : '';
        }
        if (snoozeCountEl) snoozeCountEl.textContent = currentSnoozeCount;

        // High priority banner
        if (modalPriorityBanner) {
            reminder.highPriority
                ? modalPriorityBanner.classList.remove('hidden')
                : modalPriorityBanner.classList.add('hidden');
        }

        // Low-stock alert
        if (reminder.pillsLeft !== null && reminder.pillsLeft <= 3) {
            if (modalPillsAlert) modalPillsAlert.classList.remove('hidden');
            if (modalPillsCount) modalPillsCount.textContent = reminder.pillsLeft;
        } else {
            modalPillsAlert?.classList.add('hidden');
        }

        skipPanel?.classList.add('hidden');
        modal.classList.remove('hidden');

        if (Notification.permission === 'granted') {
            new Notification('💊 Medication Reminder', {
                body: `Time to take ${reminder.medicine}. ${reminder.instructions || ''}`,
                icon: 'nexus-logo.png'
            });
        }

        // Faster timer for high-priority
        const timerDuration = reminder.highPriority ? 120 : 300;
        startEscalationTimer(reminder, timerDuration);
    }

    // ─── Core: Escalation Timer ───────────────────────────────────────────────
    function startEscalationTimer(reminder, durationSecs = 300) {
        let timeLeft = durationSecs;
        if (escalationTimer) clearInterval(escalationTimer);

        escalationTimer = setInterval(() => {
            timeLeft--;
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            countdownEl.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            if (timeLeft <= 0) escalateReminder(reminder);
        }, 1000);
    }

    // ─── Core: Escalation (Primary → Secondary → Tertiary) ───────────────────
    async function escalateReminder(reminder) {
        clearInterval(escalationTimer);
        updateReminderStatus(reminder.id, 'escalated');
        recordAnalytics('escalated');
        logEscalationEvent(reminder);

        const escalationLevel = reminder.escalationLevel || 0;
        let contactToNotify = '';

        if (escalationLevel === 0) contactToNotify = emergencyContact;
        else if (escalationLevel === 1) contactToNotify = secondaryContact;
        else contactToNotify = tertiaryContact;

        // Update escalation level for next time
        const r = reminders.find(r => r.id === reminder.id);
        if (r) r.escalationLevel = escalationLevel + 1;
        saveReminders();

        try {
            const response = await fetch('/api/escalate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientName: 'Patient',
                    medicineName: reminder.medicine,
                    time: new Date(reminder.time).toLocaleString(),
                    emergencyContact: contactToNotify || emergencyContact,
                    escalationLevel: escalationLevel,
                    highPriority: reminder.highPriority || false
                })
            });
            if (response.ok) {
                showToast(`⚠️ Escalation alert sent (Level ${escalationLevel + 1})`, 'warning');
            }
        } catch (err) {
            console.warn('Escalation server not reachable:', err.message);
            showToast(`⚠️ Could not reach server. Manual check required.`, 'warning');
        }
        closeModal();
        updateCaregiverPanel();
    }

    function logEscalationEvent(reminder) {
        analytics.escalations = (analytics.escalations || 0) + 1;
        saveAnalytics();
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────────────────────────

    function renderReminders() {
        reminderList.innerHTML = '';
        const filtered = currentFilter === 'all'
            ? reminders
            : reminders.filter(r => r.status === currentFilter);

        const sorted = [...filtered].sort((a, b) => new Date(a.time) - new Date(b.time));

        if (sorted.length === 0) {
            reminderList.appendChild(emptyState);
            return;
        }

        sorted.forEach(r => renderMedicineCard(r));
    }

    function renderMedicineCard(r) {
        const date = new Date(r.time).toLocaleString();
        const card = document.createElement('div');

        const statusColorMap = {
            pending: 'border-l-yellow-400 bg-yellow-50',
            taken: 'border-l-green-400 bg-green-50',
            missed: 'border-l-red-400 bg-red-50',
            escalated: 'border-l-blue-400 bg-blue-50',
        };
        const statusBg = statusColorMap[r.status] || 'border-l-gray-300 bg-white';

        card.className = `med-card ${statusBg}`;
        card.innerHTML = `
            <div class="med-card-left">
                <div class="med-card-header">
                    <span class="med-name">${r.medicine}</span>
                    ${r.highPriority ? '<span class="priority-chip">🚨 HIGH</span>' : ''}
                    ${r.condition ? `<span class="condition-chip">${r.condition}</span>` : ''}
                </div>
                <div class="med-card-meta">
                    <span>🕐 ${date}</span>
                    ${r.type ? `<span>💊 ${r.type}</span>` : ''}
                    ${r.frequency ? `<span>📅 ${r.frequency}</span>` : ''}
                    ${r.doctor ? `<span>👨‍⚕️ ${r.doctor}</span>` : ''}
                </div>
                ${r.instructions ? `<p class="med-instr">📌 ${r.instructions}</p>` : ''}
                ${r.pillsLeft !== null ? `<div class="pills-bar ${r.pillsLeft <= 3 ? 'pills-low' : ''}">💊 ${r.pillsLeft} pills left ${r.pillsLeft <= 3 ? '⚠️ Refill soon' : ''}</div>` : ''}
                ${r.rxEnd ? `<div class="rx-end">📋 Rx ends: ${new Date(r.rxEnd).toLocaleDateString()}</div>` : ''}
            </div>
            <div class="med-card-right">
                <span class="status-badge status-${r.status}">${r.status.toUpperCase()}</span>
                <button onclick="window.deleteReminder(${r.id})" class="delete-btn" title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        `;
        reminderList.appendChild(card);
    }

    // ─── Analytics Dashboard ──────────────────────────────────────────────────
    function updateAnalyticsDashboard() {
        const now = new Date();
        const week = new Date(now - 7 * 86400000);
        const month = new Date(now - 30 * 86400000);

        const all = analytics.taken || [];
        const takenWeek = all.filter(d => new Date(d) >= week).length;
        const takenMonth = all.filter(d => new Date(d) >= month).length;
        const missedAll = (analytics.missed || []).length;

        const totalWeek = takenWeek + (analytics.missed || []).filter(d => new Date(d) >= week).length;
        const totalMonth = takenMonth + (analytics.missed || []).filter(d => new Date(d) >= month).length;

        const weekPct = totalWeek ? Math.round((takenWeek / totalWeek) * 100) : null;
        const monthPct = totalMonth ? Math.round((takenMonth / totalMonth) * 100) : null;

        if (document.getElementById('stat-weekly')) document.getElementById('stat-weekly').textContent = weekPct !== null ? weekPct + '%' : '—';
        if (document.getElementById('stat-monthly')) document.getElementById('stat-monthly').textContent = monthPct !== null ? monthPct + '%' : '—';
        if (document.getElementById('stat-missed')) document.getElementById('stat-missed').textContent = missedAll;
        if (document.getElementById('stat-streak')) document.getElementById('stat-streak').textContent = analytics.streak || 0;
        if (document.getElementById('stat-escalations')) document.getElementById('stat-escalations').textContent = analytics.escalations || 0;
    }

    function recordAnalytics(action) {
        const today = new Date().toDateString();
        if (action === 'taken') {
            analytics.taken = analytics.taken || [];
            analytics.taken.push(new Date().toISOString());
            analytics.lastTaken = new Date().toISOString();

            // Streak logic
            const lastDate = analytics.streakDate;
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastDate === yesterday || lastDate === today) {
                analytics.streak = (analytics.streak || 0) + 1;
            } else {
                analytics.streak = 1;
            }
            analytics.streakDate = today;
        } else if (action === 'missed') {
            analytics.missed = analytics.missed || [];
            analytics.missed.push(new Date().toISOString());
            analytics.streak = 0;
        } else if (action === 'escalated') {
            analytics.escalations = (analytics.escalations || 0) + 1;
        }
        saveAnalytics();
        updateAnalyticsDashboard();
    }

    // ─── Health Safety Flags ──────────────────────────────────────────────────
    function checkSafetyFlags() {
        const alerts = [];
        reminders.forEach(r => {
            if ((r.missedStreak || 0) >= 3) {
                alerts.push(`⚠️ <strong>${r.medicine}</strong>: 3+ consecutive missed doses.`);
            }
            if ((r.skipReasons || []).length >= 5) {
                alerts.push(`⚠️ <strong>${r.medicine}</strong>: Frequently skipped. Review with doctor.`);
            }
        });

        if (healthAlerts && alerts.length > 0) {
            healthAlerts.classList.remove('hidden');
            healthAlerts.innerHTML = alerts.map(a => `<div class="health-alert-item">${a}</div>`).join('');
        }
    }

    function showHealthAlerts() {
        checkSafetyFlags();
    }

    // ─── Caregiver Panel ─────────────────────────────────────────────────────
    function updateCaregiverPanel() {
        if (document.getElementById('cg-last')) {
            document.getElementById('cg-last').textContent = analytics.lastTaken
                ? new Date(analytics.lastTaken).toLocaleString()
                : '—';
        }
        if (document.getElementById('cg-missed')) {
            const today = new Date().toDateString();
            const missedToday = (analytics.missed || []).filter(d => new Date(d).toDateString() === today).length;
            document.getElementById('cg-missed').textContent = missedToday;
        }
        if (document.getElementById('cg-escalations')) {
            document.getElementById('cg-escalations').textContent = analytics.escalations || 0;
        }
        if (document.getElementById('cg-lowstock')) {
            const lowCount = reminders.filter(r => r.pillsLeft !== null && r.pillsLeft <= 3).length;
            document.getElementById('cg-lowstock').textContent = lowCount;
        }
    }

    // ─── Low Stock / Refill Reminder ─────────────────────────────────────────
    function checkLowStock() {
        const today = new Date();
        reminders.forEach(r => {
            // Low pills warning
            if (r.pillsLeft !== null && r.pillsLeft <= 3) {
                showToast(`💊 Low stock: ${r.medicine} only has ${r.pillsLeft} pill(s) left!`, 'warning');
            }
            // Rx ending in 3 days
            if (r.rxEnd) {
                const rxEndDate = new Date(r.rxEnd);
                const daysLeft = (rxEndDate - today) / 86400000;
                if (daysLeft >= 0 && daysLeft <= 3) {
                    showToast(`📋 Prescription for ${r.medicine} ends in ${Math.ceil(daysLeft)} day(s). Refill soon!`, 'warning');
                }
            }
        });
    }

    // ─── Filter ───────────────────────────────────────────────────────────────
    window.filterReminders = (filter) => {
        currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');
        renderReminders();
    };

    // ─── Helpers ──────────────────────────────────────────────────────────────
    function updateReminderStatus(id, status) {
        const reminder = reminders.find(r => r.id === id);
        if (reminder) {
            reminder.status = status;
            saveReminders();
            renderReminders();
        }
    }

    function saveReminders() {
        localStorage.setItem('nexus_reminders', JSON.stringify(reminders));
    }

    function saveAnalytics() {
        localStorage.setItem('nexus_analytics', JSON.stringify(analytics));
    }

    function closeModal() {
        modal.classList.add('hidden');
        clearInterval(escalationTimer);
        activeReminderId = null;
        currentSnoozeCount = 0;
        skipPanel?.classList.add('hidden');
    }

    window.deleteReminder = (id) => {
        reminders = reminders.filter(r => r.id !== id);
        saveReminders();
        renderReminders();
        updateCaregiverPanel();
        updateAnalyticsDashboard();
    };

    // ─── Toast Notification ───────────────────────────────────────────────────
    function showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        const colors = { success: '#10b981', warning: '#f59e0b', info: '#3b82f6', error: '#ef4444' };
        toast.style.cssText = `
            position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999;
            background:${colors[type] || '#3b82f6'}; color:white;
            padding:0.75rem 1.25rem; border-radius:12px;
            font-size:0.9rem; font-weight:500; font-family:Inter,sans-serif;
            box-shadow:0 8px 24px rgba(0,0,0,0.15);
            animation: toastIn 0.3s ease;
            max-width: 320px;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
    }
});
