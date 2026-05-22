/**
 * Nexus Care — Find a Doctor: Premium Enhancement Layer (v1.0)
 * ─────────────────────────────────────────────────────────────
 * ADDITIVE ONLY. Never modifies DoctorsDirectory class.
 * Hooks into the existing `doctorsDirectory` instance via
 * observing the DOM and post-render patching.
 */

(function DoctorsEnhanced() {
    // ─── Saved (Favourite) Doctors ────────────────────────────────────────
    const FAV_KEY = 'nexus_saved_doctors';
    let savedDoctors = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');

    // ─── Enhanced filter state ────────────────────────────────────────────
    let dxSpecFilter = '';
    let dxAvailOnly = false;
    let dxFavOnly = false;
    let dxSortMode = 'default';

    // ─── Reference to base directory ─────────────────────────────────────
    // We wait until the base DoctorsDirectory has loaded + rendered
    const waitForDirectory = setInterval(() => {
        if (window.doctorsDirectory && window.doctorsDirectory.doctors.length > 0) {
            clearInterval(waitForDirectory);
            initEnhanced();
        }
    }, 200);

    function initEnhanced() {
        updateStats();
        patchRenderDoctors();
        addQuickContactModal();
    }

    // ─── Update Stats Bar ─────────────────────────────────────────────────
    function updateStats() {
        const docs = window.doctorsDirectory.doctors;
        const specs = new Set(docs.map(d => d.specialty)).size;
        const locs = new Set(docs.map(d => d.location)).size;
        const avgR = (docs.reduce((s, d) => s + d.rating, 0) / docs.length).toFixed(1);
        const totalExp = docs.reduce((s, d) => s + (d.experience || 0), 0);

        setTxt('dx-total', docs.length);
        setTxt('dx-specs', specs);
        setTxt('dx-rating', avgR);
        setTxt('dx-exp', totalExp + '+');
        setTxt('dx-locs', locs);
    }

    // ─── Patch renderDoctors to inject enhancement badges ─────────────────
    function patchRenderDoctors() {
        const dir = window.doctorsDirectory;
        const originalRender = dir.renderDoctors.bind(dir);

        dir.renderDoctors = function () {
            // Apply enhanced filters on top of base filtered list
            const base = [...dir.filteredDoctors];

            let enhanced = base;
            if (dxSpecFilter) {
                enhanced = enhanced.filter(d => d.specialty === dxSpecFilter);
            }
            if (dxAvailOnly) {
                enhanced = enhanced.filter(d => d.availability === 'available');
            }
            if (dxFavOnly) {
                enhanced = enhanced.filter(d => savedDoctors.includes(d.id));
            }
            // Sort
            enhanced = sortDoctors(enhanced, dxSortMode);

            dir.filteredDoctors = enhanced;
            originalRender();
            dir.filteredDoctors = base; // Restore so base filters still work

            // Inject badges into rendered cards
            requestAnimationFrame(() => {
                injectBadges();
            });
        };

        // Trigger first enhanced render
        dir.renderDoctors();
    }

    function sortDoctors(list, mode) {
        const sorted = [...list];
        if (mode === 'rating') sorted.sort((a, b) => b.rating - a.rating);
        if (mode === 'experience') sorted.sort((a, b) => b.experience - a.experience);
        if (mode === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
        if (mode === 'reviews') sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        return sorted;
    }

    // ─── Inject Badges into Rendered Cards ────────────────────────────────
    function injectBadges() {
        const dir = window.doctorsDirectory;
        const cards = document.querySelectorAll('.doctor-card');

        cards.forEach(card => {
            const id = parseInt(card.dataset.doctorId);
            const doc = dir.doctors.find(d => d.id === id);
            if (!doc) return;

            // Skip if already enhanced
            if (card.querySelector('.dx-badge-row')) return;

            const badgeRow = document.createElement('div');
            badgeRow.className = 'dx-badge-row';

            // Experience badge
            if (doc.experience >= 15) {
                badgeRow.innerHTML += `<span class="dx-badge dx-badge-exp">🏆 ${doc.experience}yr Expert</span>`;
            }
            // Top Rated badge
            if (doc.rating >= 4.8) {
                badgeRow.innerHTML += `<span class="dx-badge dx-badge-top">⭐ Top Rated</span>`;
            }

            // Favourite button
            const isSaved = savedDoctors.includes(id);
            const favBtn = document.createElement('button');
            favBtn.className = `dx-fav-btn ${isSaved ? 'saved' : ''}`;
            favBtn.title = isSaved ? 'Remove from saved' : 'Save doctor';
            favBtn.innerHTML = isSaved ? '❤️' : '🤍';
            favBtn.onclick = (e) => {
                e.stopPropagation();
                toggleSaved(id, favBtn);
            };

            // Quick Contact button
            const qcBtn = document.createElement('button');
            qcBtn.className = 'dx-qc-btn';
            qcBtn.innerHTML = '📞 Quick Contact';
            qcBtn.title = 'Quick contact info';
            qcBtn.onclick = (e) => {
                e.stopPropagation();
                showQuickContact(doc);
            };

            // Insert before action buttons
            const docInfo = card.querySelector('.doctor-info');
            if (docInfo) {
                if (badgeRow.innerHTML) docInfo.insertBefore(badgeRow, docInfo.querySelector('.doctor-actions'));
                const actions = docInfo.querySelector('.doctor-actions');
                if (actions) {
                    actions.parentNode.insertBefore(qcBtn, actions.nextSibling);
                }
                card.appendChild(favBtn);
            }
        });
    }

    // ─── Saved Doctors Toggle ─────────────────────────────────────────────
    function toggleSaved(id, btn) {
        if (savedDoctors.includes(id)) {
            savedDoctors = savedDoctors.filter(x => x !== id);
            btn.innerHTML = '🤍';
            btn.classList.remove('saved');
        } else {
            savedDoctors.push(id);
            btn.innerHTML = '❤️';
            btn.classList.add('saved');
        }
        localStorage.setItem(FAV_KEY, JSON.stringify(savedDoctors));
    }

    // ─── Quick Contact Modal ──────────────────────────────────────────────
    function addQuickContactModal() {
        const modal = document.createElement('div');
        modal.id = 'dx-qc-modal';
        modal.className = 'dx-modal-overlay hidden';
        modal.innerHTML = `
            <div class="dx-modal">
                <button class="dx-modal-close" onclick="document.getElementById('dx-qc-modal').classList.add('hidden')">✕</button>
                <div id="dx-qc-content"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    function showQuickContact(doc) {
        const content = document.getElementById('dx-qc-content');
        content.innerHTML = `
            <div class="dx-qc-header">
                <img src="${doc.image}" class="dx-qc-avatar" onerror="this.src='https://via.placeholder.com/80?text=Dr'">
                <div>
                    <h3 class="dx-qc-name">${doc.name}</h3>
                    <p class="dx-qc-spec">${doc.specialty} · ${doc.location}</p>
                    <div class="dx-qc-avail ${doc.availability === 'available' ? 'avail-yes' : 'avail-no'}">
                        ${doc.availability === 'available' ? '🟢 Available' : '🔴 Unavailable'}
                    </div>
                </div>
            </div>
            <div class="dx-qc-body">
                <div class="dx-qc-row">📞 <strong>Phone:</strong> <a href="tel:${doc.phone}">${doc.phone}</a></div>
                <div class="dx-qc-row">📧 <strong>Email:</strong> <a href="mailto:${doc.email}">${doc.email}</a></div>
                <div class="dx-qc-row">🎓 <strong>From:</strong> ${doc.education}</div>
                <div class="dx-qc-row">🕐 <strong>Experience:</strong> ${doc.experience} years</div>
                <div class="dx-qc-row">🗣️ <strong>Languages:</strong> ${(doc.languages || []).join(', ')}</div>
                ${doc.office_hours && doc.office_hours.length > 0 ? `
                <div class="dx-qc-hours">
                    <strong>🕰️ Office Hours</strong>
                    <div class="dx-hours-grid">
                        ${doc.office_hours.map(h => `<span>${h.day}</span><span>${h.hours}</span>`).join('')}
                    </div>
                </div>` : ''}
                <div class="dx-qc-row">🏥 <strong>Insurance:</strong> ${(doc.insurance_accepted || []).join(', ')}</div>
            </div>
            <div class="dx-qc-actions">
                <button class="dx-qc-book ${doc.availability !== 'available' ? 'disabled' : ''}"
                        onclick="doctorsDirectory.bookAppointment(${doc.id})"
                        ${doc.availability !== 'available' ? 'disabled' : ''}>
                    📅 Book Appointment
                </button>
                <button class="dx-qc-profile" onclick="doctorsDirectory.viewDoctorProfile(${doc.id}); document.getElementById('dx-qc-modal').classList.add('hidden')">
                    👤 Full Profile
                </button>
            </div>
        `;
        document.getElementById('dx-qc-modal').classList.remove('hidden');
    }

    // ─── Global Controls (called from HTML onclick) ───────────────────────
    window.dxFilterSpec = (btn, spec) => {
        dxSpecFilter = spec;
        document.querySelectorAll('.dx-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        // Also sync the specialty dropdown
        const dd = document.getElementById('specialtyFilter');
        if (dd) {
            dd.value = spec.toLowerCase().replace(' ', '') === 'generalmedicine' ? 'general' : spec.toLowerCase();
            window.doctorsDirectory.currentFilters.specialty = dd.value;
        }
        window.doctorsDirectory.renderDoctors();
        window.doctorsDirectory.updateResultsCount();
    };

    window.dxSort = (mode) => {
        dxSortMode = mode;
        window.doctorsDirectory.renderDoctors();
    };

    window.dxToggleAvail = (el) => {
        dxAvailOnly = !dxAvailOnly;
        el.classList.toggle('on', dxAvailOnly);
        window.doctorsDirectory.renderDoctors();
        window.doctorsDirectory.updateResultsCount();
    };

    window.dxToggleFav = (el) => {
        dxFavOnly = !dxFavOnly;
        el.classList.toggle('on', dxFavOnly);
        window.doctorsDirectory.renderDoctors();
        window.doctorsDirectory.updateResultsCount();
    };

    // ─── Helper ───────────────────────────────────────────────────────────
    function setTxt(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }
})();
