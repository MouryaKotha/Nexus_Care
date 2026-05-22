/**
 * Nexus Care — Family Ecosystem Engine (v1.0)
 * ─────────────────────────────────────────────
 * Fully localStorage-based. No backend required for basic use.
 * Can be extended to use the existing familyRoutes.js API.
 */

(function FamilyEcosystem() {
    // ─── Storage Keys ─────────────────────────────────────────────────────────
    const MEMBERS_KEY = 'nexus_family_members';
    const APPTS_KEY = 'nexus_family_appointments';
    const ESCALATIONS_KEY = 'nexus_family_escalations';

    // ─── State ────────────────────────────────────────────────────────────────
    let members = JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');
    let appointments = JSON.parse(localStorage.getItem(APPTS_KEY) || '[]');
    let escalations = JSON.parse(localStorage.getItem(ESCALATIONS_KEY) || '[]');
    let activeFilter = 'all';
    let avatarDataUrl = null;

    // ─── Init ─────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        bindEvents();
        render();
        pullEscalationsFromReminders();
    });

    // ─────────────────────────────────────────────────────────────────────────
    //  EVENT BINDING
    // ─────────────────────────────────────────────────────────────────────────
    function bindEvents() {
        // Add member button
        document.getElementById('btn-add-member')?.addEventListener('click', () => openMemberModal());

        // Member form submit
        document.getElementById('member-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            saveMember();
        });

        // Appointment form submit
        document.getElementById('appt-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            saveAppointment();
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  MEMBER CRUD
    // ─────────────────────────────────────────────────────────────────────────
    function saveMember() {
        const editingId = document.getElementById('fm-editing-id').value;
        const conditions = [...document.querySelectorAll('.cond-check:checked')].map(c => c.value);

        const memberData = {
            id: editingId || String(Date.now()),
            name: document.getElementById('fm-name').value.trim(),
            relation: document.getElementById('fm-relation').value,
            age: parseInt(document.getElementById('fm-age').value) || null,
            gender: document.getElementById('fm-gender').value,
            role: document.getElementById('fm-role').value,
            avatar: avatarDataUrl || (editingId ? (members.find(m => m.id === editingId)?.avatar || null) : null),
            healthProfile: {
                bloodGroup: document.getElementById('fm-blood').value,
                allergies: document.getElementById('fm-allergies').value.split(',').map(s => s.trim()).filter(Boolean),
                conditions: conditions,
                medications: document.getElementById('fm-medicines').value.split(',').map(s => s.trim()).filter(Boolean),
                emergencyContacts: [{ phone: document.getElementById('fm-emergency').value }]
            },
            adherence: Math.floor(Math.random() * 40) + 60, // Simulated; replace with real calc
            missedDoses: Math.floor(Math.random() * 5),
            riskLevel: 'Low',
            lastActivity: new Date().toISOString(),
            createdAt: editingId ? (members.find(m => m.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
        };

        // Calculate risk
        memberData.riskLevel = calcRisk(memberData);

        if (editingId) {
            const idx = members.findIndex(m => m.id === editingId);
            if (idx > -1) members[idx] = memberData;
        } else {
            members.push(memberData);
        }

        save();
        render();
        closeMemberModal();
        toast(`✅ ${memberData.name} ${editingId ? 'updated' : 'added'} to family.`, 'success');
    }

    function deleteMember(id) {
        if (!confirm('Remove this family member?')) return;
        members = members.filter(m => m.id !== id);
        save();
        render();
        toast('Member removed.', 'info');
    }

    function editMember(id) {
        const m = members.find(m => m.id === id);
        if (!m) return;
        openMemberModal(m);
    }

    function calcRisk(member) {
        if (member.adherence < 60 || member.missedDoses >= 4) return 'High';
        if (member.adherence < 80 || member.missedDoses >= 2) return 'Moderate';
        return 'Low';
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────────────────────────
    function render() {
        renderStats();
        renderInsights();
        renderGrid();
        renderEscalationLog();
        renderAppointments();
        populateApptMemberDropdown();
    }

    function renderStats() {
        const total = members.length;
        const highRisk = members.filter(m => m.riskLevel === 'High').length;
        const avgAdherence = total
            ? Math.round(members.reduce((s, m) => s + (m.adherence || 0), 0) / total)
            : null;
        const totalMissed = members.reduce((s, m) => s + (m.missedDoses || 0), 0);

        setText('stat-total', total);
        setText('stat-avg-adherence', avgAdherence !== null ? avgAdherence + '%' : '—');
        setText('stat-high-risk', highRisk);
        setText('stat-missed', totalMissed);
        setText('stat-escalations', escalations.length);
    }

    function renderGrid() {
        const grid = document.getElementById('family-grid');
        const placeholder = document.getElementById('no-members-placeholder');

        const filtered = activeFilter === 'all'
            ? members
            : members.filter(m => (m.healthProfile?.conditions || []).includes(activeFilter));

        // Remove old cards (keep placeholder)
        grid.querySelectorAll('.fe-member-card').forEach(c => c.remove());

        if (filtered.length === 0) {
            placeholder.classList.remove('hidden');
            return;
        }
        placeholder.classList.add('hidden');

        filtered.forEach(m => {
            const card = buildMemberCard(m);
            grid.appendChild(card);
        });
    }

    function buildMemberCard(m) {
        const riskColors = { Low: '#10b981', Moderate: '#f59e0b', High: '#ef4444' };
        const riskBg = { Low: '#dcfce7', Moderate: '#fef9c3', High: '#fee2e2' };
        const riskC = riskColors[m.riskLevel] || '#10b981';
        const riskB = riskBg[m.riskLevel] || '#dcfce7';

        const roleIcons = {
            'Primary Guardian': '👑',
            'Caregiver': '🩺',
            'Viewer': '👁️',
            'Emergency Contact': '🚨'
        };

        const conditions = (m.healthProfile?.conditions || []).join(', ') || 'None';
        const card = document.createElement('div');
        card.className = 'fe-member-card';
        card.style.borderTopColor = riskC;

        card.innerHTML = `
            <div class="fe-card-header">
                <div class="fe-card-avatar" style="background:${riskB}; border-color:${riskC};">
                    ${m.avatar
                ? `<img src="${m.avatar}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
                : `<span style="font-size:1.75rem;">${getInitialEmoji(m.relation)}</span>`}
                </div>
                <div class="fe-card-info">
                    <h3 class="fe-card-name">${m.name}</h3>
                    <p class="fe-card-relation">${m.relation || ''}${m.age ? ` · ${m.age} yrs` : ''}${m.gender ? ` · ${m.gender}` : ''}</p>
                    <span class="fe-role-chip">${roleIcons[m.role] || ''} ${m.role}</span>
                </div>
                <div class="fe-risk-badge" style="background:${riskB}; color:${riskC}; border-color:${riskC};">
                    ${m.riskLevel}
                </div>
            </div>

            <div class="fe-card-body">
                <!-- Adherence Bar -->
                <div class="fe-adherence-row">
                    <span class="fe-adherence-label">Adherence</span>
                    <div class="fe-adherence-bar-bg">
                        <div class="fe-adherence-bar" style="width:${m.adherence}%; background:${riskC};"></div>
                    </div>
                    <span class="fe-adherence-pct" style="color:${riskC};">${m.adherence}%</span>
                </div>

                <!-- Metrics Row -->
                <div class="fe-metrics-row">
                    <div class="fe-metric"><span class="fe-metric-val text-red-500">${m.missedDoses || 0}</span><span class="fe-metric-lbl">Missed</span></div>
                    <div class="fe-metric"><span class="fe-metric-val">${(m.healthProfile?.bloodGroup || '?')}</span><span class="fe-metric-lbl">Blood</span></div>
                    <div class="fe-metric"><span class="fe-metric-val text-blue-500">${(m.healthProfile?.medications || []).length}</span><span class="fe-metric-lbl">Medicines</span></div>
                </div>

                ${conditions !== 'None' ? `<div class="fe-conditions-row">${(m.healthProfile?.conditions || []).map(c => `<span class="fe-cond-tag">${c}</span>`).join('')}</div>` : ''}

                <p class="fe-last-activity">Last activity: ${formatTime(m.lastActivity)}</p>
            </div>

            <div class="fe-card-actions">
                <button onclick="window.showEmergencyCard('${m.id}')" class="fe-action-btn fe-btn-ec">🆘 Emergency Card</button>
                <button onclick="window.editMemberById('${m.id}')" class="fe-action-btn fe-btn-edit">✏️ Edit</button>
                <button onclick="window.deleteMemberById('${m.id}')" class="fe-action-btn fe-btn-del">🗑️</button>
            </div>
        `;
        return card;
    }

    function renderInsights() {
        const banner = document.getElementById('insights-banner');
        const insights = generateInsights();
        if (insights.length === 0) {
            banner.classList.add('hidden');
            return;
        }
        banner.classList.remove('hidden');
        banner.innerHTML = `
            <div class="fe-insights-title">💡 Health Insights</div>
            <ul class="fe-insights-list">
                ${insights.map(i => `<li>${i}</li>`).join('')}
            </ul>
        `;
    }

    function generateInsights() {
        const insights = [];
        members.forEach(m => {
            if (m.adherence < 70) insights.push(`⚠️ <strong>${m.name}</strong>'s medication adherence is below 70% (${m.adherence}%). Review their care plan.`);
            if ((m.missedDoses || 0) >= 3) insights.push(`⚠️ <strong>${m.name}</strong> missed ${m.missedDoses} doses. Consider increasing caregiver check-ins.`);
            if (m.riskLevel === 'High') insights.push(`🚨 <strong>${m.name}</strong> is flagged as HIGH RISK. Immediate attention recommended.`);
            if ((m.healthProfile?.conditions || []).includes('Heart') && m.adherence < 80) {
                insights.push(`💊 <strong>${m.name}</strong> has a heart condition but poor adherence — consult cardiologist.`);
            }
            if ((m.healthProfile?.conditions || []).includes('Diabetes') && m.missedDoses >= 2) {
                insights.push(`🩸 <strong>${m.name}</strong> missed ${m.missedDoses} diabetes medications this period.`);
            }
        });
        return insights;
    }

    function renderEscalationLog() {
        const log = document.getElementById('escalation-log');
        if (escalations.length === 0) {
            log.innerHTML = '<p class="text-slate-400 text-sm">No escalation events recorded.</p>';
            return;
        }
        log.innerHTML = escalations.slice().reverse().map(e => `
            <div class="fe-escalation-item">
                <div class="fe-esc-dot"></div>
                <div>
                    <span class="fe-esc-member">${e.memberName}</span>
                    <span class="fe-esc-med"> — ${e.medicine}</span>
                    <div class="fe-esc-time">${new Date(e.timestamp).toLocaleString()}</div>
                    <div class="fe-esc-level">Escalation Level ${e.level || 1}</div>
                </div>
            </div>
        `).join('');
    }

    function renderAppointments() {
        const list = document.getElementById('appointments-list');
        if (appointments.length === 0) {
            list.innerHTML = '<p class="text-slate-400 text-sm">No appointments scheduled.</p>';
            return;
        }
        list.innerHTML = appointments.map((a, i) => `
            <div class="fe-appt-item">
                <div>
                    <span class="fe-appt-member">${a.memberName}</span>
                    <span class="fe-appt-doctor"> · ${a.doctor}</span>
                    <div class="fe-appt-time">📅 ${new Date(a.time).toLocaleString()}</div>
                    ${a.notes ? `<div class="fe-appt-notes">📝 ${a.notes}</div>` : ''}
                </div>
                <button onclick="window.deleteAppt(${i})" class="fe-btn-del-small">🗑️</button>
            </div>
        `).join('');
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  MODALS
    // ─────────────────────────────────────────────────────────────────────────
    function openMemberModal(member = null) {
        avatarDataUrl = null;
        const form = document.getElementById('member-form');
        form.reset();
        document.querySelectorAll('.cond-check').forEach(c => c.checked = false);
        document.getElementById('fm-editing-id').value = '';
        document.getElementById('member-modal-title').textContent = 'Add Family Member';
        document.getElementById('fm-submit-btn').textContent = 'Add Member';
        document.getElementById('avatar-preview').textContent = '👤';
        document.getElementById('avatar-preview').style.backgroundImage = '';

        if (member) {
            document.getElementById('fm-editing-id').value = member.id;
            document.getElementById('fm-name').value = member.name || '';
            document.getElementById('fm-relation').value = member.relation || '';
            document.getElementById('fm-age').value = member.age || '';
            document.getElementById('fm-gender').value = member.gender || '';
            document.getElementById('fm-role').value = member.role || 'Viewer';
            document.getElementById('fm-blood').value = member.healthProfile?.bloodGroup || '';
            document.getElementById('fm-allergies').value = (member.healthProfile?.allergies || []).join(', ');
            document.getElementById('fm-medicines').value = (member.healthProfile?.medications || []).join(', ');
            document.getElementById('fm-emergency').value = member.healthProfile?.emergencyContacts?.[0]?.phone || '';
            (member.healthProfile?.conditions || []).forEach(c => {
                const el = document.querySelector(`.cond-check[value="${c}"]`);
                if (el) el.checked = true;
            });
            if (member.avatar) {
                const preview = document.getElementById('avatar-preview');
                preview.style.backgroundImage = `url(${member.avatar})`;
                preview.textContent = '';
            }
            document.getElementById('member-modal-title').textContent = 'Edit Family Member';
            document.getElementById('fm-submit-btn').textContent = 'Save Changes';
        }

        document.getElementById('member-modal').classList.remove('hidden');
    }

    window.closeMemberModal = () => {
        document.getElementById('member-modal').classList.add('hidden');
    };

    window.showEmergencyCard = (id) => {
        const m = members.find(m => m.id === id);
        if (!m) return;
        const p = m.healthProfile || {};

        // Avatar
        const ecAvatar = document.getElementById('ec-avatar');
        if (m.avatar) {
            ecAvatar.innerHTML = `<img src="${m.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        } else {
            ecAvatar.textContent = getInitialEmoji(m.relation);
        }

        setText('ec-name', m.name);
        setText('ec-relation', `${m.relation || ''}${m.age ? ` · ${m.age} yrs` : ''}`);
        setText('ec-blood', p.bloodGroup || '?');

        const ec = document.getElementById('ec-allergies');
        ec.innerHTML = (p.allergies || []).length
            ? (p.allergies).map(a => `<span class="ec-tag ec-tag-allergy">${a}</span>`).join('')
            : '<span class="ec-none">None reported</span>';

        document.getElementById('ec-conditions').innerHTML = (p.conditions || []).length
            ? (p.conditions).map(c => `<span class="ec-tag ec-tag-cond">${c}</span>`).join('')
            : '<span class="ec-none">None reported</span>';

        document.getElementById('ec-medicines').innerHTML = (p.medications || []).length
            ? (p.medications).map(m => `<span class="ec-tag ec-tag-med">${m}</span>`).join('')
            : '<span class="ec-none">None listed</span>';

        document.getElementById('ec-contact').innerHTML = (p.emergencyContacts || []).length
            ? (p.emergencyContacts).map(c => `<div class="ec-contact-row">📞 ${c.phone}</div>`).join('')
            : '<span class="ec-none">No contact set</span>';

        document.getElementById('emergency-card-modal').classList.remove('hidden');
    };

    window.editMemberById = (id) => editMember(id);
    window.deleteMemberById = (id) => deleteMember(id);

    // ─────────────────────────────────────────────────────────────────────────
    //  APPOINTMENTS
    // ─────────────────────────────────────────────────────────────────────────
    function saveAppointment() {
        const memberId = document.getElementById('appt-member').value;
        const member = members.find(m => m.id === memberId);
        const appt = {
            memberId,
            memberName: member?.name || '—',
            doctor: document.getElementById('appt-doctor').value.trim(),
            time: document.getElementById('appt-time').value,
            notes: document.getElementById('appt-notes').value.trim(),
            created: new Date().toISOString()
        };
        appointments.push(appt);
        localStorage.setItem(APPTS_KEY, JSON.stringify(appointments));
        renderAppointments();
        document.getElementById('appt-modal').classList.add('hidden');
        document.getElementById('appt-form').reset();
        toast(`📅 Appointment scheduled for ${appt.memberName}`, 'success');
    }

    window.deleteAppt = (idx) => {
        appointments.splice(idx, 1);
        localStorage.setItem(APPTS_KEY, JSON.stringify(appointments));
        renderAppointments();
    };

    function populateApptMemberDropdown() {
        const sel = document.getElementById('appt-member');
        if (!sel) return;
        sel.innerHTML = members.map(m => `<option value="${m.id}">${m.name} (${m.relation || '—'})</option>`).join('') || '<option>No members yet</option>';
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  CONDITION FILTER
    // ─────────────────────────────────────────────────────────────────────────
    window.filterByCondition = (condition) => {
        activeFilter = condition;
        document.querySelectorAll('.fe-filter-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-condition="${condition}"]`)?.classList.add('active');
        renderGrid();
    };

    // ─────────────────────────────────────────────────────────────────────────
    //  PULL ESCALATIONS FROM REMINDER SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    function pullEscalationsFromReminders() {
        // Read the reminder.js escalation log (they share localStorage)
        const reminders = JSON.parse(localStorage.getItem('nexus_reminders') || '[]');
        const escalated = reminders.filter(r => r.status === 'escalated');

        if (escalated.length > escalations.length) {
            escalated.forEach(r => {
                const alreadyLogged = escalations.some(e => e.reminderId === r.id);
                if (!alreadyLogged) {
                    escalations.push({
                        reminderId: r.id,
                        memberName: 'Main Account',
                        medicine: r.medicine,
                        timestamp: r.time || new Date().toISOString(),
                        level: r.escalationLevel || 1
                    });
                }
            });
            localStorage.setItem(ESCALATIONS_KEY, JSON.stringify(escalations));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  AVATAR UPLOAD
    // ─────────────────────────────────────────────────────────────────────────
    window.previewAvatar = (input) => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarDataUrl = e.target.result;
            const preview = document.getElementById('avatar-preview');
            preview.style.backgroundImage = `url(${avatarDataUrl})`;
            preview.style.backgroundSize = 'cover';
            preview.style.backgroundPosition = 'center';
            preview.textContent = '';
        };
        reader.readAsDataURL(file);
    };

    // ─────────────────────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────────────────────
    function save() {
        localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }

    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function formatTime(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleString();
    }

    function getInitialEmoji(relation) {
        const map = { Father: '👴', Mother: '👵', Son: '👦', Daughter: '👧', Spouse: '💑', Grandparent: '🧓', Sibling: '🧑' };
        return map[relation] || '👤';
    }

    function toast(msg, type = 'info') {
        const colors = { success: '#10b981', warning: '#f59e0b', info: '#3b82f6' };
        const t = document.createElement('div');
        t.style.cssText = `
            position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;
            background:${colors[type] || '#3b82f6'};color:white;
            padding:0.75rem 1.25rem;border-radius:12px;font-size:0.9rem;font-weight:500;
            box-shadow:0 8px 24px rgba(0,0,0,0.15);font-family:Inter,sans-serif;
            animation:toastIn 0.3s ease;max-width:320px;
        `;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
    }
})();
