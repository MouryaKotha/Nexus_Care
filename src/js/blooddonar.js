/**
 * Nexus Care — Blood Donation & Request Engine
 * v2.0 - Complete End-to-End Matching System
 * Uses localStorage for offline persistence + backend sync simulation
 */

class BloodDonationSystem {
    constructor() {
        this.STORAGE_DONORS = 'nexus_blood_donors';
        this.STORAGE_REQUESTS = 'nexus_blood_requests';

        // Mock initial seed data for demo structure
        this.donors = JSON.parse(localStorage.getItem(this.STORAGE_DONORS)) || [
            { id: 1, name: 'Alex Johnson', age: 28, gender: 'Male', bloodGroup: 'O+', city: 'Main Campus', phone: '555-0101', lastDate: '2023-01-10', eligible: true },
            { id: 2, name: 'Sarah Wu', age: 34, gender: 'Female', bloodGroup: 'A-', city: 'North Branch', phone: '555-0202', lastDate: '2024-02-15', eligible: false }
        ];

        this.requests = JSON.parse(localStorage.getItem(this.STORAGE_REQUESTS)) || [
            { id: 1, patientName: 'Michael Chang', bloodGroup: 'O+', units: 2, urgency: 'Critical', hospital: 'General Hospital', city: 'Main Campus', phone: '555-8899', date: '2024-11-20' },
            { id: 2, patientName: 'Emily Rose', bloodGroup: 'AB+', units: 1, urgency: 'Urgent', hospital: 'St. Judes', city: 'South Branch', phone: '555-7766', date: '2024-11-22' }
        ];

        this.init();
    }

    init() {
        this.setupTabs();
        this.setupDonorForm();
        this.setupRequestForm();
        this.updateLiveStats();
        this.renderMatchingNetwork();

        // Live mock data heartbeat
        setInterval(() => this.simulateLiveStats(), 5000);
    }

    // ─── TABS NAVIGATION ────────────────────────────────────
    setupTabs() {
        const btns = document.querySelectorAll('.blood-tab-btn');
        const panes = document.querySelectorAll('.blood-tab-pane');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Deactivate all
                btns.forEach(b => b.classList.remove('active'));
                panes.forEach(p => p.classList.add('hidden'));

                // Activate clicked
                btn.classList.add('active');
                document.getElementById(btn.dataset.target).classList.remove('hidden');
            });
        });
    }

    // ─── DONOR REGISTRATION LOGIC ─────────────────────────────
    setupDonorForm() {
        const dateInput = document.getElementById('donor-last-date');
        const statusEl = document.getElementById('eligibility-status');
        const form = document.getElementById('donor-form');

        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                const isEligible = this.checkEligibility(e.target.value);
                statusEl.classList.remove('hidden');

                if (isEligible) {
                    statusEl.textContent = '✅ Eligible to donate (90 days cleared)';
                    statusEl.className = 'text-sm font-bold mt-2 text-emerald-600 block';
                } else {
                    statusEl.textContent = '❌ Not eligible yet. Needs 90 days break.';
                    statusEl.className = 'text-sm font-bold mt-2 text-red-600 block';
                }
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const lastDate = document.getElementById('donor-last-date').value;
                const isEligible = !lastDate || this.checkEligibility(lastDate);

                if (!isEligible) {
                    alert('You must wait 90 days between blood donations for your safety.');
                    return;
                }

                const payload = {
                    id: Date.now(),
                    name: document.getElementById('donor-name').value,
                    age: document.getElementById('donor-age').value,
                    gender: document.getElementById('donor-gender').value,
                    bloodGroup: document.getElementById('donor-blood').value,
                    phone: document.getElementById('donor-phone').value,
                    city: document.getElementById('donor-city').value,
                    lastDate: lastDate,
                    eligible: true
                };

                this.donors.unshift(payload);
                this.saveDb();

                // Feedback
                const btn = document.getElementById('donor-submit-btn');
                const orig = btn.innerHTML;
                btn.innerHTML = '✅ Registered Successfully!';
                btn.classList.replace('bg-red-600', 'bg-emerald-600');

                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.classList.replace('bg-emerald-600', 'bg-red-600');
                    form.reset();
                    if (statusEl) statusEl.classList.add('hidden');
                    // Switch to matching tab
                    document.querySelector('[data-target="tab-matches"]').click();
                    this.updateLiveStats();
                    this.renderMatchingNetwork();
                }, 1500);
            });
        }
    }

    checkEligibility(dateString) {
        if (!dateString) return true; // Never donated
        const lastDonation = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - lastDonation);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 90;
    }

    // ─── BLOOD REQUEST LOGIC ────────────────────────────────
    setupRequestForm() {
        const form = document.getElementById('request-form');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const urgencyRaw = document.querySelector('input[name="req-urgency"]:checked');

                const payload = {
                    id: Date.now(),
                    patientName: document.getElementById('req-name').value,
                    bloodGroup: document.getElementById('req-blood').value,
                    units: document.getElementById('req-units').value,
                    urgency: urgencyRaw ? urgencyRaw.value : 'Normal',
                    hospital: document.getElementById('req-hospital').value,
                    phone: document.getElementById('req-phone').value,
                    date: document.getElementById('req-date').value,
                    city: 'Unknown' // simplified
                };

                this.requests.unshift(payload);
                this.saveDb();

                // Feedback
                const btn = form.querySelector('button[type="submit"]');
                const orig = btn.innerHTML;
                btn.innerHTML = '📡 Request Broadcasted!';
                btn.classList.replace('bg-blue-600', 'bg-emerald-600');

                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.classList.replace('bg-emerald-600', 'bg-blue-600');
                    form.reset();
                    // Switch to matching tab
                    document.querySelector('[data-target="tab-matches"]').click();
                    this.updateLiveStats();
                    this.renderMatchingNetwork();
                }, 1500);
            });
        }
    }

    // ─── MATCHING NETWORK RENDERER ───────────────────────────
    renderMatchingNetwork() {
        const rList = document.getElementById('requests-list');
        const dList = document.getElementById('donors-list');

        if (!rList || !dList) return;

        // Render Requests
        if (this.requests.length === 0) {
            rList.innerHTML = `<div class="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">No active requests.</div>`;
        } else {
            rList.innerHTML = this.requests.map(req => {
                const bgType = req.bloodGroup.includes('+') ? 'bg-blood-pos' : 'bg-blood-neg';
                return `
                <div class="match-card urgency-${req.urgency.toLowerCase()}">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-4">
                            <div class="blood-drop ${bgType}"><span>${req.bloodGroup}</span></div>
                            <div>
                                <h4 class="font-bold text-slate-900">${req.patientName} <span class="text-slate-400 font-normal">(${req.units} Units)</span></h4>
                                <p class="text-xs font-semibold text-slate-500">${req.hospital}</p>
                            </div>
                        </div>
                        <span class="urgency-badge text-xs font-bold px-2 py-1 rounded-full uppercase">${req.urgency}</span>
                    </div>
                    <div class="mt-4 flex gap-2">
                        <a href="tel:${req.phone}" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-center text-sm transition transition-all duration-300">📞 Contact</a>
                        <button onclick="alert('Sending matching alert to ${req.bloodGroup} donors...')" class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-lg text-center text-sm transition">⚡ Match Base</button>
                    </div>
                </div>
                `;
            }).join('');
        }

        // Render Donors
        const eligibleDonors = this.donors.filter(d => d.eligible);
        if (eligibleDonors.length === 0) {
            dList.innerHTML = `<div class="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">No active donors currently visible.</div>`;
        } else {
            dList.innerHTML = eligibleDonors.map(don => {
                const bgType = don.bloodGroup.includes('+') ? 'bg-blood-pos' : 'bg-blood-neg';
                return `
                <div class="match-card border-emerald-500" style="border-left-width: 4px;">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="blood-drop ${bgType} w-10 h-10 text-sm"><span>${don.bloodGroup}</span></div>
                            <div>
                                <h4 class="font-bold text-slate-900">${don.name}</h4>
                                <p class="text-xs font-semibold text-slate-500">📍 ${don.city}</p>
                            </div>
                        </div>
                        <a href="tel:${don.phone}" class="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full transition">📞</a>
                    </div>
                </div>
                `;
            }).join('');
        }
    }

    // ─── LIVE STATS & UTILS ─────────────────────────────────
    updateLiveStats() {
        // Critical count
        const critical = this.requests.filter(r => r.urgency === 'Critical').length;
        if (document.getElementById('critical-count')) document.getElementById('critical-count').textContent = critical;

        // Donor count
        const activeDonors = this.donors.filter(d => d.eligible).length;
        if (document.getElementById('donor-count')) document.getElementById('donor-count').textContent = activeDonors + 140; // baseline

        this.renderBloodStock();
    }

    renderBloodStock() {
        const root = document.getElementById('blood-stock-live');
        if (!root) return;

        const types = [
            { t: 'A+', s: 'Good', c: 'text-emerald-600 bg-emerald-50' },
            { t: 'O-', s: 'Critical', c: 'text-red-600 bg-red-50 ring-1 ring-red-400 animate-pulse' },
            { t: 'B+', s: 'Good', c: 'text-emerald-600 bg-emerald-50' },
            { t: 'AB-', s: 'Low', c: 'text-orange-600 bg-orange-50' }
        ];

        root.innerHTML = types.map(x => `
            <div class="flex justify-between items-center px-4 py-2.5 rounded-xl font-bold text-sm transition ${x.c}">
                <span>${x.t}</span>
                <span class="uppercase tracking-wide text-xs">${x.s}</span>
            </div>
        `).join('');
    }

    simulateLiveStats() {
        // Pulse critical request effect softly
        const crit = document.getElementById('critical-count');
        if (crit && crit.textContent !== '0') {
            crit.classList.add('opacity-50');
            setTimeout(() => crit.classList.remove('opacity-50'), 400);
        }
    }

    saveDb() {
        localStorage.setItem(this.STORAGE_DONORS, JSON.stringify(this.donors));
        localStorage.setItem(this.STORAGE_REQUESTS, JSON.stringify(this.requests));
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    window.bloodSystem = new BloodDonationSystem();
});
