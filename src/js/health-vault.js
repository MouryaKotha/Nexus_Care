/**
 * Nexus Care — Health Vault Logic Engine
 * v2.0 - Extended Records & Dynamic Summaries
 */

const RECORDS_DB = [
    {
        id: 1,
        title: "Annual Complete Blood Count",
        date: "2024-10-24",
        type: "Lab Report",
        format: "PDF",
        size: "1.2 MB",
        icon: "🩸",
        theme: "indigo",
        doctor: "Dr. Sarah Jenkins",
        hospital: "City Central Path Labs",
        diagnosis: "All parameters within normal limits. Slightly elevated triglycerides.",
        observations: [
            "Hemoglobin: 14.2 g/dL (Normal)",
            "WBC Count: 6,500 /mcL (Normal)",
            "Cholesterol: 180 mg/dL (Normal)",
            "Triglycerides: 160 mg/dL (Borderline High)"
        ],
        prescriptions: ["Omega-3 Supplements 1000mg", "Continue regular diet"],
        nextVisit: "October 2025 (Annual)"
    },
    {
        id: 2,
        title: "Dermatology Consultation",
        date: "2024-09-15",
        type: "Prescription",
        format: "PDF",
        size: "0.8 MB",
        icon: "🩺",
        theme: "blue",
        doctor: "Dr. Marcus Reed",
        hospital: "SkinCare Elite Clinic",
        diagnosis: "Mild Contact Dermatitis on right forearm.",
        observations: [
            "Localized redness and mild swelling.",
            "No signs of deep infection.",
            "Triggered likely by new laundry detergent."
        ],
        prescriptions: ["Hydrocortisone Cream 1% (Apply 2x daily)", "Switch to hypoallergenic detergent"],
        nextVisit: "As Needed"
    },
    {
        id: 3,
        title: "Dental X-Ray (Molar)",
        date: "2024-08-12",
        type: "Scan",
        format: "JPG",
        size: "4.5 MB",
        icon: "🦷",
        theme: "emerald",
        doctor: "Dr. Emily Chen",
        hospital: "Smile Bright Dental",
        diagnosis: "Impacted lower right wisdom tooth pressing on adjacent molar.",
        observations: [
            "Tooth #32 is horizontally impacted.",
            "Surrounding bone structure is stable.",
            "No current abscess or acute infection."
        ],
        prescriptions: ["Ibuprofen 400mg PRN for pain"],
        nextVisit: "Sept 10, 2024 (Extraction Surgery)"
    },
    {
        id: 4,
        title: "Cardiology Stress Test",
        date: "2024-06-05",
        type: "Lab Report",
        format: "PDF",
        size: "2.1 MB",
        icon: "🫀",
        theme: "red",
        doctor: "Dr. Alan Vang",
        hospital: "Heart Institute Memorial",
        diagnosis: "Excellent cardiovascular response to stress. No ischemia detected.",
        observations: [
            "Max Heart Rate achieved: 165 bpm.",
            "Blood pressure response normal.",
            "ECG showed no ST-segment depression."
        ],
        prescriptions: ["Maintain current exercise regimen"],
        nextVisit: "June 2026"
    },
    {
        id: 5,
        title: "Ophthalmology Eye Exam",
        date: "2024-04-20",
        type: "Prescription",
        format: "PDF",
        size: "0.5 MB",
        icon: "👁️",
        theme: "sky",
        doctor: "Dr. Linda Frost",
        hospital: "VisionPlus Care",
        diagnosis: "Mild Myopia progression. Healthy retinas.",
        observations: [
            "Right Eye: -1.75 D",
            "Left Eye: -2.00 D",
            "Intraocular pressure: 15 mmHg (Normal)"
        ],
        prescriptions: ["New Eyeglass Prescription provided", "Use lubricating drops for screen fatigue"],
        nextVisit: "April 2025"
    },
    {
        id: 6,
        title: "Orthopedic MRI - Left Knee",
        date: "2023-11-10",
        type: "Scan",
        format: "JPG",
        size: "15.4 MB",
        icon: "🦴",
        theme: "slate",
        doctor: "Dr. Robert Singh",
        hospital: "Metro Orthopedics",
        diagnosis: "Grade 1 Sprain of Medial Collateral Ligament (MCL).",
        observations: [
            "Mild fluid accumulation around joint.",
            "Menisci remain intact.",
            "ACL/PCL show no tears."
        ],
        prescriptions: ["Rest, Ice, Compression, Elevation (RICE)", "Physical Therapy Referral"],
        nextVisit: "Completed"
    },
    {
        id: 7,
        title: "Flu Vaccination Record",
        date: "2023-10-01",
        type: "Prescription",
        format: "PDF",
        size: "0.4 MB",
        icon: "💉",
        theme: "green",
        doctor: "Nurse Practitioner Jane",
        hospital: "Community Health Hub",
        diagnosis: "Annual Influenza Vaccine Administered (Quadrivalent).",
        observations: [
            "No immediate adverse reactions.",
            "Administered in left deltoid."
        ],
        prescriptions: ["None"],
        nextVisit: "Oct 2024 (Next Season)"
    },
    {
        id: 8,
        title: "Thyroid Panel (TSH, T3, T4)",
        date: "2023-08-15",
        type: "Lab Report",
        format: "PDF",
        size: "1.1 MB",
        icon: "🧪",
        theme: "purple",
        doctor: "Dr. Sarah Jenkins",
        hospital: "City Central Path Labs",
        diagnosis: "Euthyroid state. All markers within clinical range.",
        observations: [
            "TSH: 2.1 mIU/L",
            "Free T4: 1.2 ng/dL",
            "Free T3: 3.1 pg/mL"
        ],
        prescriptions: ["None"],
        nextVisit: "August 2025"
    },
    {
        id: 9,
        title: "Gastroenterology Consult",
        date: "2023-05-22",
        type: "Prescription",
        format: "PDF",
        size: "0.9 MB",
        icon: "🩺",
        theme: "amber",
        doctor: "Dr. Harold Quinn",
        hospital: "Digestive Health Clinic",
        diagnosis: "Acid Reflux / GERD triggered by dietary habits.",
        observations: [
            "Patient reports heartburn after late meals.",
            "No weight loss or severe symptoms.",
            "Physical exam unremarkable."
        ],
        prescriptions: ["Omeprazole 20mg daily for 14 days", "Avoid eating 3 hours before bed"],
        nextVisit: "As Needed"
    },
    {
        id: 10,
        title: "Chest X-Ray (Routine)",
        date: "2023-02-14",
        type: "Scan",
        format: "PNG",
        size: "6.2 MB",
        icon: "🫁",
        theme: "teal",
        doctor: "Dr. Elena Rostova",
        hospital: "General Hospital Imaging",
        diagnosis: "Clear lung fields. Normal cardiac silhouette. No acute cardiopulmonary disease.",
        observations: [
            "No infiltrate, mass, or effusion.",
            "Bony thorax is intact."
        ],
        prescriptions: ["None needed"],
        nextVisit: "N/A"
    }
];

class HealthVault {
    constructor() {
        this.records = [...RECORDS_DB]; // Clone
        this.listEl = document.getElementById('recordsList');
        this.filterTypeEl = document.getElementById('filterType');
        this.filterDateEl = document.getElementById('filterDate');

        // Modal Elements
        this.modal = document.getElementById('recordModal');
        this.modalContent = document.getElementById('recordModalContent');
        this.closeModalBtn = document.getElementById('closeModalBtn');

        this.init();
    }

    init() {
        this.renderRecords();
        this.setupFilters();
        this.setupModal();
        this.setupQR();
        this.setupDragDrop();
    }

    setupFilters() {
        this.filterTypeEl.addEventListener('change', () => this.filterData());
        this.filterDateEl.addEventListener('change', () => this.filterData());
    }

    filterData() {
        const type = this.filterTypeEl.value;
        const sort = this.filterDateEl.value;

        // Filter
        let filtered = this.records;
        if (type !== 'All') {
            filtered = this.records.filter(r => r.type === type);
        }

        // Sort
        filtered.sort((a, b) => {
            const da = new Date(a.date);
            const db = new Date(b.date);
            return sort === 'newest' ? db - da : da - db;
        });

        this.renderRecords(filtered);
    }

    renderRecords(data = this.records) {
        if (!this.listEl) return;

        this.listEl.innerHTML = '';

        if (data.length === 0) {
            this.listEl.innerHTML = `<div class="text-center py-10 text-slate-400">No records found matching your filters.</div>`;
            return;
        }

        data.forEach(record => {
            // Format Date safely
            const formattedDate = new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

            const block = document.createElement('div');
            block.className = `glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between border-l-4 border-${record.theme}-500 hover:bg-white/90 cursor-pointer transition`;

            block.innerHTML = `
                <div class="flex items-center gap-4 w-full mb-3 sm:mb-0">
                    <div class="bg-${record.theme}-50 p-3 rounded-lg text-${record.theme}-600 text-xl flex-shrink-0">${record.icon}</div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-slate-900 truncate">${record.title}</h4>
                        <p class="text-xs font-semibold text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">${formattedDate} • ${record.type} • ${record.size}</p>
                    </div>
                </div>
                <button class="text-${record.theme}-600 font-bold text-sm bg-${record.theme}-50 hover:bg-${record.theme}-100 px-4 py-2 rounded-xl transition whitespace-nowrap view-summary-btn w-full sm:w-auto">View Summary</button>
            `;

            // Setup click events
            block.addEventListener('click', (e) => {
                // Prevent double firing if button clicked vs block clicked
                if (e.target.tagName !== 'BUTTON') {
                    this.openModal(record);
                }
            });
            const btn = block.querySelector('.view-summary-btn');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal(record);
            });

            this.listEl.appendChild(block);
        });
    }

    setupModal() {
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    openModal(record) {
        // Populate Data
        document.getElementById('modalTitle').textContent = record.title;
        document.getElementById('modalSubtitle').textContent = `${new Date(record.date).toLocaleDateString()} • ${record.type}`;
        document.getElementById('modalDoc').textContent = record.doctor;
        document.getElementById('modalHosp').textContent = record.hospital;
        document.getElementById('modalDiag').textContent = record.diagnosis;
        document.getElementById('modalNextVisit').textContent = record.nextVisit;

        // Populate Observations
        document.getElementById('modalObs').innerHTML = record.observations.map(o => `<li>${o}</li>`).join('');

        // Populate Meds
        document.getElementById('modalMeds').innerHTML = record.prescriptions.map(p => `<li>${p}</li>`).join('');

        // Apply dynamic color to header based on record theme
        const headerClasses = ['indigo', 'emerald', 'blue', 'red', 'sky', 'slate', 'green', 'purple', 'amber', 'teal']
            .flatMap(c => [`bg-${c}-600`, `text-${c}-200`]); // Clear old themes just in case logic was expanding
        const header = document.getElementById('modalTitle').parentElement.parentElement;
        header.className = `p-6 text-white flex justify-between items-center bg-${record.theme}-600`;

        // Run mock AI analysis on right panel as well for sync feature
        this.triggerRightPanelAnalysis(record);

        // Show Modal with Animation
        this.modal.classList.remove('hidden');
        // Force reflow
        void this.modal.offsetWidth;
        this.modalContent.classList.remove('scale-95', 'opacity-0');
        this.modalContent.classList.add('scale-100', 'opacity-100');
    }

    closeModal() {
        this.modalContent.classList.remove('scale-100', 'opacity-100');
        this.modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            this.modal.classList.add('hidden');
        }, 300); // Wait for transition
    }

    triggerRightPanelAnalysis(record) {
        document.getElementById('analysisPlaceholder').classList.add('hidden');
        document.getElementById('analysisContent').classList.add('hidden');
        document.getElementById('analysisLoading').classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('analysisLoading').classList.add('hidden');
            document.getElementById('analysisContent').classList.remove('hidden');

            // Format AI body
            document.getElementById('summaryBody').innerHTML = `
                <b>System Review for:</b> ${record.title}<br/><br/>
                The document provided by ${record.doctor} indicates a primary finding of <i>${record.diagnosis}</i>. 
                Our AI has matched these observations against your medical history and confirms no conflicting drug interactions in your newly prescribed <b>${record.prescriptions[0] || 'medicines'}</b>.
            `;

            document.getElementById('aiActionText').textContent = `Suggested ${record.type === 'Prescription' ? 'medication start' : 'follow-up'} as per ${record.hospital}. Automatically synced to your calendar.`;

        }, 800);
    }

    setupQR() {
        const qrBtn = document.getElementById('showQRBtn');
        const qrModal = document.getElementById('qrModal');
        const closeQR = document.getElementById('closeQR');

        qrBtn.addEventListener('click', () => {
            qrModal.classList.remove('hidden');
            document.getElementById('qrcode').innerHTML = "";
            new QRCode(document.getElementById("qrcode"), {
                text: "Emergency Profile: Blood O+, Alergies: Penicillin, Em. Contact: 555-0101",
                width: 200, height: 200, colorDark: "#b91c1c", colorLight: "#ffffff"
            });
        });

        closeQR.addEventListener('click', () => qrModal.classList.add('hidden'));
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) qrModal.classList.add('hidden');
        });
    }

    setupDragDrop() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('active'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('active'), false);
        });

        dropZone.addEventListener('drop', handleDrop, false);
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files), false);

        function handleDrop(e) {
            let dt = e.dataTransfer;
            let files = dt.files;
            handleFiles(files);
        }

        const self = this;
        function handleFiles(files) {
            if (files.length > 0) {
                // Mock adding to records
                const newRec = {
                    id: Date.now(),
                    title: files[0].name.replace(/\.[^/.]+$/, ""), // remove extension
                    date: new Date().toISOString().split('T')[0],
                    type: "Lab Report",
                    format: files[0].name.split('.').pop().toUpperCase(),
                    size: (files[0].size / (1024 * 1024)).toFixed(1) + " MB",
                    icon: "📄",
                    theme: "indigo",
                    doctor: "Unknown",
                    hospital: "Uploaded File",
                    diagnosis: "Pending Medical Review",
                    observations: ["Self uploaded document"],
                    prescriptions: ["Pending"],
                    nextVisit: "- -"
                };

                self.records.unshift(newRec); // add to top
                self.filterData(); // re-render

                // Trigger AI analysis on upload
                self.triggerRightPanelAnalysis(newRec);
            }
        }
    }
}

// Init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.healthVault = new HealthVault();
});
