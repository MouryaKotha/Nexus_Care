// === Data and State Management ===
let state = {
    user: {
        id: '1',
        name: 'John Patient',
        email: 'patient@example.com',
        role: 'patient'
    },
    doctors: [
        {
            id: '1',
            name: 'Dr. Ananya Sharma',
            specialty: 'Cardiology',
            experience: '15 years',
            rating: 4.8,
            image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 150,
            description: 'Specialized in heart diseases and cardiovascular surgery with over 15 years of experience.',
            education: 'MD from AIIMS Delhi',
            languages: ['English', 'Hindi'],
            email: 'ananya.sharma@healthcare.com',
            education_certifications: 'MD Cardiology - AIIMS Delhi, Fellowship in Interventional Cardiology - Cleveland Clinic, Board Certified in Cardiovascular Disease.',
            specialties_services: 'Heart Failure Management, Coronary Angioplasty, Echocardiography, Preventative Cardiology.',
            awards_recognition: 'Best Cardiologist Award 2023 - Medical Council of India, Excellence in Patient Care - AIIMS.',
            contact_phone: '+91 98765 43210',
            office_hours: 'Mon-Fri: 9:00 AM - 5:00 PM, Sat: 10:00 AM - 1:00 PM',
            insurance_accepted: 'BlueCross BlueShield, UnitedHealthcare, Aetna, Cigna.'
        },
        {
            id: '2',
            name: 'Dr. Rajesh Kumar',
            specialty: 'Neurology',
            experience: '12 years',
            rating: 4.9,
            image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: false,
            consultationFee: 180,
            description: 'Expert in treating neurological disorders and brain-related conditions.',
            education: 'MD from NIMHANS Bangalore',
            languages: ['English', 'Hindi', 'Kannada'],
            email: 'rajesh.kumar@healthcare.com',
            education_certifications: 'MD Neurology - NIMHANS, PhD in Neuroscience - University of Oxford, Certified Stroke Specialist.',
            specialties_services: 'Stroke Treatment, Epilepsy Management, Parkinson\'s Disease, Neuro-rehabilitation.',
            awards_recognition: 'Research Excellence Award - Indian Academy of Neurology, Young Scientist Award - NIMHANS.',
            contact_phone: '+91 98765 43211',
            office_hours: 'Mon-Thu: 10:00 AM - 6:00 PM, Sat: 9:00 AM - 12:00 PM',
            insurance_accepted: 'Medicare, Medicaid, Humana, Kaiser Permanente.'
        },
        {
            id: '3',
            name: 'Dr. Priya Patel',
            specialty: 'Pediatrics',
            experience: '10 years',
            rating: 4.7,
            image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 120,
            description: 'Dedicated to providing comprehensive healthcare for children and adolescents.',
            education: 'MD from CMC Vellore',
            languages: ['English', 'Gujarati', 'Hindi'],
            email: 'priya.patel@healthcare.com',
            education_certifications: 'MD Pediatrics - CMC Vellore, Fellowship in Neonatology - Boston Children\'s Hospital.',
            specialties_services: 'Newborn Care, Pediatric Immunization, Growth & Development Monitoring, Adolescent Health.',
            awards_recognition: 'Pediatrician of the Year 2022, Compassionate Care Award - CMC.',
            contact_phone: '+91 98765 43212',
            office_hours: 'Mon-Sat: 8:00 AM - 2:00 PM',
            insurance_accepted: 'All Major PPO/HMO Plans, Tricare, CHIP.'
        },
        {
            id: '4',
            name: 'Dr. Vikram Singh',
            specialty: 'Dermatology',
            experience: '8 years',
            rating: 4.6,
            image: 'https://images.pexels.com/photos/6749814/pexels-photo-6749814.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 130,
            description: 'Specialist in skin conditions, cosmetic dermatology, and skin cancer treatment.',
            education: 'MD from PGIMER Chandigarh',
            languages: ['English', 'Punjabi', 'Hindi'],
            email: 'vikram.singh@healthcare.com',
            education_certifications: 'MD Dermatology - PGIMER, Diploma in Aesthetic Medicine - American Academy of Aesthetic Medicine.',
            specialties_services: 'Acne Treatment, Laser Skin Resurfacing, Skin Cancer Screening, Botox & Fillers.',
            awards_recognition: 'Rising Star in Dermatology 2021, Top Skin Specialist in Chandigarh.',
            contact_phone: '+91 98765 43213',
            office_hours: 'Tue-Sun: 11:00 AM - 7:00 PM',
            insurance_accepted: 'Aetna, Cigna, WellCare, Molina Healthcare.'
        },
        {
            id: '5',
            name: 'Dr. Kavita Reddy',
            specialty: 'Oncology',
            experience: '14 years',
            rating: 4.8,
            image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 200,
            description: 'Specialist in breast cancer and advanced immunotherapy treatments.',
            education: 'MD from Tata Memorial Hospital',
            languages: ['English', 'Telugu', 'Hindi'],
            email: 'kavita.reddy@healthcare.com',
            education_certifications: 'MD Medical Oncology - Tata Memorial, Fellowship in Immuno-Oncology - MD Anderson Cancer Center.',
            specialties_services: 'Chemotherapy, Targeted Therapy, Immunotherapy, Cancer Genetic Counseling.',
            awards_recognition: 'National Cancer Research Award, Distinguished Alumni - Tata Memorial.',
            contact_phone: '+91 98765 43214',
            office_hours: 'Mon-Fri: 9:00 AM - 4:00 PM',
            insurance_accepted: 'BlueCross, UnitedHealthcare, Medicare Advantage.'
        },
        {
            id: '6',
            name: 'Dr. Arjun Mehra',
            specialty: 'General Medicine',
            experience: '22 years',
            rating: 4.6,
            image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 100,
            description: 'Extensive experience in internal medicine and chronic disease management.',
            education: 'MD from Maulana Azad Medical College',
            languages: ['English', 'Hindi'],
            email: 'arjun.mehra@healthcare.com',
            education_certifications: 'MD Internal Medicine - MAMC, Diploma in Geriatric Medicine.',
            specialties_services: 'Chronic Disease Management (Diabetes, Hypertension), Preventive Health Check-ups, Infectious Diseases.',
            awards_recognition: 'Lifetime Achievement Award in Community Medicine, Best Physician - MAMC.',
            contact_phone: '+91 98765 43215',
            office_hours: 'Mon-Sat: 10:00 AM - 1:00 PM & 4:00 PM - 7:00 PM',
            insurance_accepted: 'All Government Health Schemes, Star Health, Apollo Munich.'
        },
        {
            id: '7',
            name: 'Dr. Sunita Rao',
            specialty: 'Psychology',
            experience: '9 years',
            rating: 4.7,
            image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 110,
            description: 'Expert in clinical psychology and behavioral therapy.',
            education: 'PhD from IHBAS Delhi',
            languages: ['English', 'Hindi', 'Kannada'],
            email: 'sunita.rao@healthcare.com',
            education_certifications: 'PhD Clinical Psychology - IHBAS, M.Phil in Medical & Social Psychology, Certified CBT Therapist.',
            specialties_services: 'Anxiety & Depression Counseling, Cognitive Behavioral Therapy, Marriage Counseling, Child Psychology.',
            awards_recognition: 'Excellence in Mental Health Communication, Best Researcher - IHBAS.',
            contact_phone: '+91 98765 43216',
            office_hours: 'Mon-Fri: 11:00 AM - 6:00 PM',
            insurance_accepted: 'Magellan Health, Beacon Health Options, Optum.'
        },
        {
            id: '8',
            name: 'Dr. Amit Shah',
            specialty: 'Nephrology',
            experience: '16 years',
            rating: 4.9,
            image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 170,
            description: 'Specialized in renal transplant and chronic kidney diseases.',
            education: 'MD from AIIMS Delhi',
            languages: ['English', 'Hindi', 'Gujarati'],
            email: 'amit.shah@healthcare.com',
            education_certifications: 'MD Nephrology - AIIMS Delhi, Fellowship in Renal Transplant Medicine - University of Toronto.',
            specialties_services: 'Hemodialysis, Peritoneal Dialysis, Kidney Transplant Evaluation, Glomerular Diseases.',
            awards_recognition: 'Sushruta Award for Excellence in Nephrology, Best Doctor Award - Gujarat Medical Council.',
            contact_phone: '+91 98765 43217',
            office_hours: 'Mon, Wed, Fri: 9:00 AM - 3:00 PM',
            insurance_accepted: 'Medicare, Medicaid, BlueCross, Aetna.'
        },
        {
            id: '9',
            name: 'Dr. Meera Nambiar',
            specialty: 'Endocrinology',
            experience: '11 years',
            rating: 4.8,
            image: 'https://images.pexels.com/photos/5452296/pexels-photo-5452296.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 140,
            description: 'Expert in diabetes management and thyroid disorders.',
            education: 'MD from Madras Medical College',
            languages: ['English', 'Malayalam', 'Hindi'],
            email: 'meera.nambiar@healthcare.com',
            education_certifications: 'MD Endocrinology - Madras Medical College, Board Certified in Endocrinology, Diabetes & Metabolism.',
            specialties_services: 'Diabetes Type 1 & 2 Management, Thyroid Disorder Treatment, PCOS Management, Pituitary Disorders.',
            awards_recognition: 'Outstanding Endocrinologist Award - South India, Best Clinical Research - MMC.',
            contact_phone: '+91 98765 43218',
            office_hours: 'Mon-Sat: 10:00 AM - 5:00 PM',
            insurance_accepted: 'Cigna, UnitedHealthcare, Humana, Kaiser.'
        },
        {
            id: '10',
            name: 'Dr. Rahul Gupta',
            specialty: 'Pulmonology',
            experience: '13 years',
            rating: 4.7,
            image: 'https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 150,
            description: 'Specialist in respiratory diseases and critical care.',
            education: 'MD from KGMU Lucknow',
            languages: ['English', 'Hindi'],
            email: 'rahul.gupta@healthcare.com',
            education_certifications: 'MD Pulmonology - KGMU, Fellowship in Critical Care Medicine.',
            specialties_services: 'Asthma & COPD Management, Sleep Apnea Treatment, Bronchoscopy, Pulmonary Function Testing.',
            awards_recognition: 'Chest Physician Excellence Award, Top Pulmonologist in Uttar Pradesh.',
            contact_phone: '+91 98765 43219',
            office_hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
            insurance_accepted: 'Tricare, WellCare, Medicare, Aetna.'
        },
        {
            id: '11',
            name: 'Dr. Deepa Iyer',
            specialty: 'Gastroenterology',
            experience: '10 years',
            rating: 4.8,
            image: 'https://images.pexels.com/photos/5215016/pexels-photo-5215016.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 160,
            description: 'Expert in digestive system disorders and liver diseases.',
            education: 'MD from JIPMER Puducherry',
            languages: ['English', 'Tamil', 'Hindi'],
            email: 'deepa.iyer@healthcare.com',
            education_certifications: 'MD Gastroenterology - JIPMER, Fellowship in Advanced Endoscopy.',
            specialties_services: 'Endoscopy, Colonoscopy, Liver Disease Management, GERD Treatment.',
            awards_recognition: 'Gastroenterologist of the Year 2023, JIPMER Merit Award.',
            contact_phone: '+91 98765 43220',
            office_hours: 'Mon-Sat: 11:00 AM - 4:00 PM',
            insurance_accepted: 'All Major Insurance Carriers, Government Schemes.'
        },
        {
            id: '12',
            name: 'Dr. Sanjay Deshmukh',
            specialty: 'Rheumatology',
            experience: '15 years',
            rating: 4.9,
            image: 'https://images.pexels.com/photos/6749817/pexels-photo-6749817.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 175,
            description: 'Specialized in autoimmune diseases and joint inflammatory conditions.',
            education: 'MD from GSMC Mumbai',
            languages: ['English', 'Marathi', 'Hindi'],
            email: 'sanjay.deshmukh@healthcare.com',
            education_certifications: 'MD Rheumatology - GSMC, PhD in Immunology - University of Sydney.',
            specialties_services: 'Rheumatoid Arthritis, Lupus Treatment, Osteoarthritis, Gout Management.',
            awards_recognition: 'Excellence in Rheumatology Award - Maharashtra, Global Health Research Fellow.',
            contact_phone: '+91 98765 43221',
            office_hours: 'Tue-Sat: 10:00 AM - 6:00 PM',
            insurance_accepted: 'BlueCross BlueShield, UnitedHealthcare, Medicare, Aetna.'
        },
        {
            id: '13',
            name: 'Dr. Anita Joshi',
            specialty: 'Gynecology',
            experience: '18 years',
            rating: 4.9,
            image: 'https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 140,
            description: 'Expert in maternal-fetal medicine and reproductive health.',
            education: 'MD from Lady Hardinge Medical College',
            languages: ['English', 'Hindi'],
            email: 'anita.joshi@healthcare.com'
        },
        {
            id: '14',
            name: 'Dr. Manoj Tiwari',
            specialty: 'Orthopedics',
            experience: '20 years',
            rating: 4.7,
            image: 'https://images.pexels.com/photos/6749780/pexels-photo-6749780.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 190,
            description: 'Specialized in joint replacement and trauma surgery.',
            education: 'MS from BHU Varanasi',
            languages: ['English', 'Hindi', 'Bhojpuri'],
            email: 'manoj.tiwari@healthcare.com'
        },
        {
            id: '15',
            name: 'Dr. Swati Mishra',
            specialty: 'Psychiatry',
            experience: '12 years',
            rating: 4.8,
            image: 'https://images.pexels.com/photos/5215021/pexels-photo-5215021.jpeg?auto=compress&cs=tinysrgb&w=300',
            available: true,
            consultationFee: 130,
            description: 'Expert in mental health, stress management, and clinical psychiatry.',
            education: 'MD from AIIMS Delhi',
            languages: ['English', 'Hindi'],
            email: 'swati.mishra@healthcare.com'
        }
    ],
    prescriptions: [
        {
            id: 'p1',
            patientId: '1',
            doctorId: '1',
            doctorName: 'Dr. Ananya Sharma',
            patientName: 'John Patient',
            medications: [{ name: 'Aspirin', dosage: '81mg', frequency: 'Daily', duration: 'Ongoing' }],
            diagnosis: 'Hypertension',
            instructions: 'Take with food and water.',
            date: '2025-08-20',
            status: 'active'
        },
        {
            id: 'p2',
            patientId: '1',
            doctorId: '3',
            doctorName: 'Dr. Emily Rodriguez',
            patientName: 'John Patient',
            medications: [{ name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice a day', duration: '7 days' }],
            diagnosis: 'Ear Infection',
            instructions: 'Complete the full course of antibiotics.',
            date: '2025-08-18',
            status: 'completed'
        }
    ],
    currentCall: null,
    // Add payment state
    paymentStatus: 'unpaid' // can be 'unpaid' or 'paid'
};

// ======== Rendering functions ========
function renderHeader() {
    const headerEl = document.getElementById('header');
    headerEl.innerHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12z" />
                </svg>
                <a href="index.html">
                    <span class="logo-text">Nexus Care</span>
                </a>
            </div>
            <ul class="nav-menu">
                <li><a href="index.html" class="nav-link" data-i18n="nav_home">Home</a></li>
                <li><a href="doctors.html" class="nav-link" data-i18n="nav_doctors">Find a Doctor</a></li>
                <li><a href="appointment.html" class="nav-link" data-i18n="nav_appointment">Book Appointment</a></li>
                <li><a href="onlinetelemedince.html" class="nav-link active" data-i18n="nav_telemedicine">Online Telemedicine</a></li>
                <li><a href="ai-mentor.html" class="nav-link" data-i18n="nav_ai_mentor">AI Mentor</a></li>
                <li><a href="aisymtom.html" class="nav-link" data-i18n="nav_ai_symptoms">AI Symptoms</a></li>
                <li><a href="meditranslate.html" class="nav-link" data-i18n="nav_meditranslate">MediTranslate</a></li>
                <li><a href="reminder.html" class="nav-link" data-i18n="nav_reminder">Reminder</a></li>
            </ul>
            <div class="nav-actions">
                <a href="emergency.html" class="btn btn-outline" data-i18n="nav_emergency">Emergency</a>
            </div>
            <button class="mobile-menu-toggle" id="mobileMenuToggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>
    `;
}

function renderDoctorList() {
    const specialties = [...new Set(state.doctors.map(d => d.specialty))];

    const doctorsHtml = state.doctors.map(doctor => `
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 doctor-card-horizontal">
            <div class="relative">
                <img src="${doctor.image}" alt="${doctor.name}" class="w-full h-64 object-cover" />
                <div class="absolute top-4 right-4">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${doctor.available ? 'Available' : 'Busy'}
                    </span>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-xl font-bold text-gray-900">${doctor.name}</h3>
                    <div class="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-yellow-400 fill-current"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <span class="text-sm font-medium text-gray-700">${doctor.rating}</span>
                    </div>
                </div>
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin mr-2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span class="text-sm">${doctor.specialty}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock mr-2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <span class="text-sm">${doctor.experience} experience</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign mr-2"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        <span class="text-sm">$${doctor.consultationFee} consultation</span>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-6 line-clamp-2">
                    ${doctor.description}
                </p>
                <a href="#" onclick="navigate('/doctor/${doctor.id}')" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-center block">
                    View Profile
                </a>
            </div>
        </div>
    `).join('');

    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Doctor</h1>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">Connect with experienced healthcare professionals for online consultations</p>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <div class="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input type="text" placeholder="Search doctors by name or specialty..." class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <select class="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">All Specialties</option>
                            ${specialties.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                        <label class="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-xl">
                            <input type="checkbox" class="text-blue-600 focus:ring-blue-500" />
                            <span class="text-sm font-medium text-gray-700">Available Only</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="container-horizontal-scroll">
                ${doctorsHtml}
            </div>
        </div>
    `;
}

function renderDoctorProfile(id) {
    const doctor = state.doctors.find(d => d.id === id);
    if (!doctor) return `<div class="text-center">Doctor not found.</div>`;

    // Conditional rendering based on payment status
    const buttons = state.paymentStatus === 'paid' ?
        `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onclick="startPhoneCall('${doctor.id}')" class="flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${doctor.available ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800' : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Phone Call</span>
            </button>
            <button onclick="handleGoogleMeet()" class="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" class="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                <span>Google Meet</span>
            </button>
            <button onclick="showBookingModal()" class="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" class="lucide lucide-message-circle"><path d="M7.9 20A9.9 9.9 0 0 1 4 15.11a9.09 9.09 0 0 1 0-7.22A9.9 9.9 0 0 1 15.11 4c1.66 0 3.24.3 4.67.84a.55.55 0 0 1 .37.4c.15.52.22 1.05.22 1.62V9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7.5a.5.5 0 0 1 .5-.5c.86 0 1.69.1 2.47.33l-1.3-1.3a1 1 0 0 0-1.4 1.4Z"/></svg>
                <span>Book Consultation</span>
            </button>
        </div>` :
        `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onclick="simulatePayment('${doctor.id}')" class="flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" class="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                <span>Pay Now - $${doctor.consultationFee}</span>
            </button>
        </div>
        `

    return `
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <a href="#" onclick="navigate('/')" class="text-blue-600 hover:text-blue-700 mb-6 flex items-center space-x-2">
                <span>← Back to Doctors</span>
            </a>
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div class="md:flex">
                    <div class="md:w-1/3">
                        <img src="${doctor.image}" alt="${doctor.name}" class="w-full h-96 md:h-full object-cover" />
                    </div>
                    <div class="md:w-2/3 p-8">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                <h1 class="text-3xl font-bold text-gray-900 mb-2">${doctor.name}</h1>
                                <p class="text-xl text-blue-600 font-semibold mb-4">${doctor.specialty}</p>
                                <div class="flex items-center space-x-4 mb-4">
                                    <div class="flex items-center space-x-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" class="lucide lucide-star text-yellow-400 fill-current"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/><path /></svg>
                                        <span class="text-lg font-medium">${doctor.rating}</span>
                                    </div>
                                    <div class="flex items-center space-x-2 text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                        <span>${doctor.experience}</span>
                                    </div>
                                    <div class="flex items-center space-x-2 text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" class="lucide lucide-dollar-sign"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                        <span>$${doctor.consultationFee}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="inline-block px-4 py-2 rounded-full text-sm font-medium ${doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                    ${doctor.available ? 'Available Now' : 'Currently Busy'}
                                </span>
                            </div>
                        </div>
                        <div class="mb-8">
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">About</h3>
                            <p class="text-gray-600 leading-relaxed">${doctor.description}</p>
                        </div>

                        ${doctor.education_certifications ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pt-8 border-t border-gray-100">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-blue-600"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                                    Education & Certifications
                                </h3>
                                <p class="text-gray-600 text-sm leading-relaxed">${doctor.education_certifications}</p>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-blue-600"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                                    Specialties & Services
                                </h3>
                                <p class="text-gray-600 text-sm leading-relaxed">${doctor.specialties_services}</p>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-blue-600"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                                    Awards & Recognition
                                </h3>
                                <p class="text-gray-600 text-sm leading-relaxed">${doctor.awards_recognition}</p>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-blue-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                    Contact & Hours
                                </h3>
                                <div class="space-y-2">
                                    <p class="text-gray-600 text-sm"><strong>Phone:</strong> ${doctor.contact_phone}</p>
                                    <p class="text-gray-600 text-sm"><strong>Office Hours:</strong> ${doctor.office_hours}</p>
                                </div>
                            </div>
                            <div class="md:col-span-2">
                                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-blue-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    Insurance Accepted
                                </h3>
                                <p class="text-gray-600 text-sm">${doctor.insurance_accepted}</p>
                            </div>
                        </div>
                        ` : ''}
                        
                        ${buttons}

                        ${!doctor.available && state.paymentStatus === 'paid' ? `<div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p class="text-sm text-yellow-800"><strong>Doctor is currently unavailable.</strong> You can call 818484488 for immediate assistance or book a consultation for later.</p></div>` : ''}
                    </div>
                </div>
            </div>
            <div id="booking-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <h3 class="text-xl font-bold mb-4">Book Consultation</h3>
                    
                    <form id="booking-form" class="space-y-4">
                        <input type="hidden" id="booking-doctor-id" value="${doctor.id}">
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Consultation Mode</label>
                            <select id="consultation-mode" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onchange="toggleConsultationFields()">
                                <option value="audio">Normal Audio Call</option>
                                <option value="meet">Google Meet</option>
                                <option value="skype">Skype</option>
                            </select>
                        </div>

                        <div id="mode-audio-info" class="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                            Phone consultation will be initiated at scheduled time.
                        </div>

                        <div id="mode-meet-field" class="hidden">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Google Meet Link</label>
                            <input type="url" id="meet-link" placeholder="https://meet.google.com/..." class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div id="mode-skype-field" class="hidden">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Skype ID</label>
                            <input type="text" id="skype-id" placeholder="live:.cid.xxxx" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                            <input type="datetime-local" id="booking-time" required class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div class="flex space-x-3 pt-4">
                            <button type="button" onclick="submitBooking()" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-bold">Confirm Booking</button>
                            <button type="button" onclick="hideBookingModal()" class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function renderPrescriptionManager() {
    const prescriptionHtml = state.prescriptions.map(p => `
        <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900">Prescription for ${p.patientName}</h3>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${p.status}
                </span>
            </div>
            <p class="text-sm text-gray-600 mb-2"><strong>Diagnosis:</strong> ${p.diagnosis}</p>
            <p class="text-sm text-gray-600 mb-4"><strong>Prescribed by:</strong> ${p.doctorName}</p>
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-gray-800 mb-2">Medications:</h4>
                <ul class="space-y-2">
                    ${p.medications.map(m => `
                        <li>
                            <p class="text-sm text-gray-700"><strong>${m.name}</strong> - ${m.dosage}, ${m.frequency} for ${m.duration}</p>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <p class="text-sm text-gray-600 mb-4"><strong>Instructions:</strong> ${p.instructions}</p>
            <p class="text-xs text-gray-500 text-right">Date: ${p.date}</p>
        </div>
    `).join('');

    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Your Prescriptions</h1>
                <p class="text-gray-600">View and manage your digital prescriptions.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${prescriptionHtml}
            </div>
            ${state.prescriptions.length === 0 ? `<p class="text-center text-gray-500">No prescriptions found.</p>` : ''}
        </div>
    `;
}

function renderVideoCall(call) {
    if (!call) return '';
    return `
        <div class="fixed inset-0 bg-gray-900 text-white flex flex-col p-4">
            <div class="flex-grow flex items-center justify-center relative">
                <div class="w-full max-w-4xl h-full max-h-96 rounded-xl bg-gray-800 shadow-xl overflow-hidden relative">
                    <img src="${call.doctor.image}" alt="Doctor" class="w-full h-full object-cover opacity-70" />
                    <div class="absolute bottom-4 right-4 bg-gray-900 bg-opacity-70 rounded-full px-4 py-2 flex items-center space-x-2">
                        <span class="relative flex h-3 w-3">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span class="text-sm font-medium">In Call</span>
                    </div>
                </div>
                <div class="absolute top-4 right-4 w-32 h-24 bg-gray-600 rounded-lg shadow-lg overflow-hidden border-2 border-white">
                    <img src="https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Patient" class="w-full h-full object-cover" />
                </div>
            </div>
            <div class="flex justify-center items-center py-6">
                <button onclick="endVideoCall()" class="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition-colors">
                    End Call
                </button>
            </div>
        </div>
    `;
}

// ======== App functions ========

function startPhoneCall(doctorId) {
    const doctor = state.doctors.find(d => d.id === doctorId);
    if (doctor) {
        // Here we initiate the phone call
        window.open(`tel:8184844888`, '_self');
    }
}

// New function to handle the payment logic
function simulatePayment(doctorId) {
    // In a real application, this would integrate with a payment gateway.
    // For this example, we just simulate a successful payment.
    console.log(`Simulating payment for doctor ${doctorId}...`);
    alert(`Payment successful for Dr. ${state.doctors.find(d => d.id === doctorId).name}!`);
    state.paymentStatus = 'paid';
    renderApp();
}

function toggleAvailability(doctorId) {
    state.doctors = state.doctors.map(d => d.id === doctorId ? { ...d, available: !d.available } : d);
    navigate('/admin');
}

function switchRole(role) {
    state.user.role = role;
    if (role === 'admin') {
        state.user.id = '2';
        state.user.name = 'Dr. Admin';
        state.user.email = 'admin@example.com';
    } else {
        state.user.id = '1';
        state.user.name = 'John Patient';
        state.user.email = 'patient@example.com';
    }
    navigate('/');
}

function handleGoogleMeet() {
    window.open('https://meet.google.com/drt-nudr-zhj', '_blank');
}

function endVideoCall() {
    state.currentCall = null;
    renderApp();
}

function showBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.remove('hidden');
}

function hideBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.add('hidden');
}


window.navigate = (path) => {
    window.history.pushState({}, '', path);
    renderApp();
};

function toggleConsultationFields() {
    const mode = document.getElementById('consultation-mode').value;
    const audioInfo = document.getElementById('mode-audio-info');
    const meetField = document.getElementById('mode-meet-field');
    const skypeField = document.getElementById('mode-skype-field');

    if (audioInfo) audioInfo.classList.toggle('hidden', mode !== 'audio');
    if (meetField) meetField.classList.toggle('hidden', mode !== 'meet');
    if (skypeField) skypeField.classList.toggle('hidden', mode !== 'skype');
}

async function submitBooking() {
    const doctorId = document.getElementById('booking-doctor-id').value;
    const mode = document.getElementById('consultation-mode').value;
    const time = document.getElementById('booking-time').value;
    const meetLink = document.getElementById('meet-link').value;
    const skypeId = document.getElementById('skype-id').value;

    if (!time) {
        alert('Please select a date and time.');
        return;
    }

    if (mode === 'meet' && !meetLink) {
        alert('Please provide a Google Meet link.');
        return;
    }

    if (mode === 'skype' && !skypeId) {
        alert('Please provide your Skype ID.');
        return;
    }

    const bookingData = {
        doctorId,
        patientId: state.user.id,
        mode,
        time,
        meetLink: mode === 'meet' ? meetLink : null,
        skypeId: mode === 'skype' ? skypeId : null
    };

    try {
        const response = await fetch('/api/consultation/book-consultation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            alert('Booking successful!');
            hideBookingModal();
            // Redirect to Google Meet if mode is meet
            if (mode === 'meet') {
                const finalLink = meetLink || 'https://meet.google.com/drt-nudr-zhj';
                window.open(finalLink, '_blank');
            }
        } else {
            alert('Failed to book. Please try again.');
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('Connection error. Is the backend running?');
    }
}

// ======== Router & renderer ========

function renderApp() {
    renderHeader();
    const appContainer = document.getElementById('app-container');
    const path = window.location.pathname;

    if (state.currentCall) {
        appContainer.innerHTML = renderVideoCall(state.currentCall);
    } else if (path.startsWith('/doctor/')) {
        const id = path.split('/')[2];
        appContainer.innerHTML = renderDoctorProfile(id);
    } else if (path === '/admin') {
        appContainer.innerHTML = renderAdminDashboard();
    } else if (path === '/prescriptions') {
        appContainer.innerHTML = renderPrescriptionManager();
    } else {
        appContainer.innerHTML = renderDoctorList();
    }

    // Re-apply translations for dynamically rendered content
    if (window.applyTranslations) window.applyTranslations();
}

// ========== Admin Dashboard function ==========
function renderAdminDashboard() {
    if (state.user.role !== 'admin') {
        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
                <p class="text-gray-600">You must be an admin to view this page.</p>
            </div>
        `;
    }

    const doctorsHtml = state.doctors.map(doctor => `
        <div key="${doctor.id}" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div class="flex items-center space-x-4">
                <img src="${doctor.image}" alt="${doctor.name}" class="w-12 h-12 rounded-full object-cover"/>
                <div>
                    <h4 class="font-medium text-gray-900">${doctor.name}</h4>
                    <p class="text-sm text-gray-500">${doctor.specialty}</p>
                </div>
            </div>
            <button onclick="toggleAvailability('${doctor.id}')" class="px-4 py-2 rounded-lg font-medium transition-colors ${doctor.available ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}">
                ${doctor.available ? 'Available' : 'Unavailable'}
            </button>
        </div>
    `).join('');

    const stats = [
        { label: 'Total Patients', value: '156', color: 'bg-blue-500', change: '+12%', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
        { label: "Today's Consultations", value: '24', color: 'bg-green-500', change: '+8%', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" class="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>` },
        { label: 'Active Chats', value: '8', color: 'bg-yellow-500', change: '+3%', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" class="lucide lucide-message-circle"><path d="M7.9 20A9.9 9.9 0 0 1 4 15.11a9.09 9.09 0 0 1 0-7.22A9.9 9.9 0 0 1 15.11 4c1.66 0 3.24.3 4.67.84a.55.55 0 0 1 .37.4c.15.52.22 1.05.22 1.62V9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7.5a.5.5 0 0 1 .5-.5c.86 0 1.69.1 2.47.33l-1.3-1.3a1 1 0 0 0-1.4 1.4Z"/></svg>` },
        { label: 'Prescriptions', value: '43', color: 'bg-purple-500', change: '+15%', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>` }
    ];

    const statsHtml = stats.map(stat => `
        <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <div class="${stat.color} p-3 rounded-lg">${stat.icon}</div>
                <div class="flex items-center space-x-1 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" class="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    <span class="text-sm font-medium">${stat.change}</span>
                </div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-1">${stat.value}</h3>
            <p class="text-gray-600">${stat.label}</p>
        </div>
    `).join('');

    return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-4">Doctor Dashboard</h1>
                <p class="text-gray-600">Welcome back, ${state.user.name}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                ${statsHtml}
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Availability Status</h3>
                <div class="space-y-4">
                    ${doctorsHtml}
                </div>
            </div>
        </div>
    `;
}

// Initial render and popstate listener
window.onload = () => {
    renderApp();
};

window.onpopstate = () => {
    renderApp();
};
