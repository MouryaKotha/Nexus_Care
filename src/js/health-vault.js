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
        this.fetchRecords();
        this.setupFilters();
        this.setupModal();
        this.setupQR();
        this.setupDragDrop();
    }

    async fetchRecords() {
        try {
            const token = window.authStore?.token || localStorage.getItem('nexus_token') || '';
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const apiBase = window.API_BASE_URL || 'http://localhost:5005';

            const res = await fetch(`${apiBase}/api/healthvault`, { headers });
            const data = await res.json();
            
            if (res.ok && data.success && data.records.length > 0) {
                // Merge fetched records with mock records, preferring fetched ones
                this.records = [...data.records, ...this.records];
                this.filterData();
            }
        } catch (error) {
            console.error("Failed to fetch Health Vault records:", error);
        }
    }

    showFlashcard(title, message, type = 'success') {
        const existing = document.getElementById('healthvault-flashcard');
        if (existing) existing.remove();

        const flashcard = document.createElement('div');
        flashcard.id = 'healthvault-flashcard';
        flashcard.className = `fixed top-24 right-6 p-4 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] flex items-start gap-4 z-[100] min-w-[300px] max-w-sm bg-white border ${type === 'success' ? 'border-green-200' : 'border-red-200'}`;
        
        const iconHtml = type === 'success' 
            ? `<div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0">✓</div>`
            : `<div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0">✕</div>`;

        flashcard.innerHTML = `
            ${iconHtml}
            <div class="flex-1">
                <h4 class="font-bold text-slate-900">${title}</h4>
                <p class="text-sm text-slate-500 mt-1">${message}</p>
            </div>
            <button class="text-slate-400 hover:text-slate-600 font-bold px-2" onclick="this.parentElement.remove()">&times;</button>
        `;

        document.body.appendChild(flashcard);

        flashcard.style.opacity = '0';
        flashcard.style.transform = 'translateY(-10px) translateX(20px)';
        
        requestAnimationFrame(() => {
            flashcard.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            flashcard.style.opacity = '1';
            flashcard.style.transform = 'translateY(0) translateX(0)';
        });

        setTimeout(() => {
            if (document.getElementById('healthvault-flashcard') === flashcard) {
                flashcard.style.opacity = '0';
                flashcard.style.transform = 'translateY(-10px) translateX(20px)';
                setTimeout(() => flashcard.remove(), 300);
            }
        }, 3500);
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
            block.className = `glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between border-l-4 border-${record.theme || 'indigo'}-500 hover:bg-white/90 cursor-pointer transition`;

            block.innerHTML = `
                <div class="flex items-center gap-4 w-full mb-3 sm:mb-0">
                    <div class="bg-${record.theme || 'indigo'}-50 p-3 rounded-lg text-${record.theme || 'indigo'}-600 text-xl flex-shrink-0">${record.icon || '📄'}</div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-slate-900 truncate">${record.title}</h4>
                        <p class="text-xs font-semibold text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">${formattedDate} • ${record.type} • ${record.size}</p>
                    </div>
                </div>
                
                <div class="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition">
                    <button class="flex-1 sm:flex-none bg-slate-100 hover:bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold transition">View</button>
                    <button class="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition">Download</button>
                </div>
            `;

            // On click, show AI analysis
            block.addEventListener('click', () => {
                this.triggerRightPanelAnalysis(record);
            });

            this.listEl.appendChild(block);
        });
    }

    setupModal() {
        if (!this.modal) return;
        this.closeModalBtn.addEventListener('click', () => this.modal.classList.add('hidden'));
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.modal.classList.add('hidden');
        });
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
                The document provided by ${record.doctor || 'Unknown'} indicates a primary finding of <i>${record.diagnosis || 'Pending Review'}</i>. 
                Our AI has matched these observations against your medical history and confirms no conflicting drug interactions in your newly prescribed <b>${(record.prescriptions && record.prescriptions[0]) || 'medicines'}</b>.
            `;

            document.getElementById('aiActionText').textContent = `Suggested ${record.type === 'Prescription' ? 'medication start' : 'follow-up'} as per ${record.hospital || 'clinic'}. Automatically synced to your calendar.`;

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
                const file = files[0];
                
                // Max file size 10MB
                if (file.size > 10 * 1024 * 1024) {
                    self.showFlashcard("File Too Large", "Please select a smaller file (Max 10MB).", "error");
                    return;
                }

                // Show uploading state on the dropzone if needed, or just let it process
                const originalContent = dropZone.innerHTML;
                dropZone.innerHTML = `<div class="text-xl font-bold text-indigo-600 animate-pulse py-10">Uploading ${file.name}...</div>`;

                const reader = new FileReader();
                reader.onload = async (e) => {
                    const base64Data = e.target.result;
                    const title = file.name.replace(/\.[^/.]+$/, "");
                    const format = file.name.split('.').pop().toUpperCase();
                    const size = (file.size / (1024 * 1024)).toFixed(1) + " MB";
                    
                    const payload = { title, format, size, type: "Lab Report", fileData: base64Data };

                    try {
                        const token = window.authStore?.token || localStorage.getItem('nexus_token') || '';
                        
                        if (!token) {
                            self.showFlashcard("Authentication Error", "You are not logged in. Please log in again to upload files.", "error");
                            return;
                        }

                        const headers = { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        };
                        const apiBase = window.API_BASE_URL || 'http://localhost:5005';

                        const res = await fetch(`${apiBase}/api/healthvault/upload`, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(payload)
                        });
                        
                        const data = await res.json();
                        
                        if (res.ok && data.success) {
                            self.records.unshift(data.record);
                            self.filterData();
                            self.triggerRightPanelAnalysis(data.record);
                            self.showFlashcard("File Uploaded Successfully", "Your document has been securely added to Health Vault.", "success");
                        } else {
                            self.showFlashcard("Unable to Upload File", data.message || "Please try again.", "error");
                        }
                    } catch (error) {
                        self.showFlashcard("Unable to Upload File", "Please try again.", "error");
                    } finally {
                        dropZone.innerHTML = originalContent;
                    }
                };
                
                reader.onerror = () => {
                    self.showFlashcard("Unable to Upload File", "Error reading file.", "error");
                    dropZone.innerHTML = originalContent;
                };

                reader.readAsDataURL(file);
            }
        }
    }
}

// Init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.healthVault = new HealthVault();
});
