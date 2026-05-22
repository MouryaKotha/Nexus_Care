// Doctors Directory JavaScript Functionality

/**
 * Doctors Directory - Handles search, filtering, and doctor display
 */

class DoctorsDirectory {
    constructor() {
        this.doctors = [];
        this.filteredDoctors = [];
        this.currentView = 'grid';
        this.currentFilters = {
            search: '',
            specialty: '',
            location: ''
        };

        this.init();
    }

    init() {
        this.loadDoctors();
        this.setupEventListeners();
        this.setupViewToggle();
        this.parseUrlParameters();
    }

    /**
     * Load doctors data (simulated API call)
     */
    loadDoctors() {
        // Show loading state
        this.showLoadingState();

        // Simulate API delay
        setTimeout(() => {
            this.doctors = this.generateSampleDoctors();
            this.filteredDoctors = [...this.doctors];
            this.renderDoctors();
            this.updateResultsCount();
        }, 1000);
    }

    /**
     * Generate sample doctor data
     */
    generateSampleDoctors() {
        return [
            {
                id: 1,
                name: 'Dr. Ananya Sharma',
                specialty: 'Cardiology',
                location: 'Main Campus',
                image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.8,
                reviewCount: 127,
                experience: 15,
                education: 'AIIMS Delhi',
                phone: '(555) 123-4567',
                email: 'ananya.sharma@medicare.com',
                bio: 'Dr. Sharma is a board-certified cardiologist with over 15 years of experience in treating complex cardiac conditions.',
                availability: 'available',
                languages: ['English', 'Hindi'],
                services: ['Cardiac Catheterization', 'Echocardiogram', 'Stress Testing'],
                education_details: [
                    { degree: 'Doctor of Medicine (MD)', institution: 'AIIMS Delhi', year: '2009' },
                    { degree: 'Cardiology Fellowship', institution: 'Tata Memorial Hospital', year: '2012-2015' },
                    { degree: 'Internal Medicine Residency', institution: 'Maulana Azad Medical College', year: '2009-2012' }
                ],
                certifications: ['Indian Board of Cardiology', 'Medical Council of India', 'ACLS Certified'],
                awards: [
                    { title: 'Top Doctor Award', description: 'Recognized for excellence in cardiology', year: '2023' },
                    { title: 'Patient Choice Award', description: 'Voted by patients for compassionate care', year: '2022' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Wednesday', hours: '9:00 AM - 1:00 PM', closed: false },
                    { day: 'Thursday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Friday', hours: '9:00 AM - 4:00 PM', closed: false }
                ],
                insurance_accepted: ['LIC Health', 'Apollo Munich', 'Star Health', 'HDFC ERGO']
            },
            {
                id: 2,
                name: 'Dr. Rajesh Kumar',
                specialty: 'Pediatrics',
                location: 'North Branch',
                image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.9,
                reviewCount: 89,
                experience: 12,
                education: 'NIMHANS Bangalore',
                phone: '(555) 123-4568',
                email: 'rajesh.kumar@medicare.com',
                bio: 'Dr. Kumar specializes in pediatric care with a focus on child development and preventive medicine.',
                availability: 'available',
                languages: ['English', 'Hindi', 'Kannada'],
                services: ['Well-child visits', 'Immunizations', 'Developmental assessments'],
                education_details: [
                    { degree: 'MD Pediatrics', institution: 'NIMHANS Bangalore', year: '2012' },
                    { degree: 'MBBS', institution: 'Bangalore Medical College', year: '2008' }
                ],
                certifications: ['Indian Academy of Pediatrics', 'PALS Certified'],
                awards: [
                    { title: 'Best Pediatrician', description: 'Annual Health Excellence Awards', year: '2021' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '10:00 AM - 6:00 PM', closed: false },
                    { day: 'Tuesday', hours: '10:00 AM - 6:00 PM', closed: false },
                    { day: 'Wednesday', hours: '10:00 AM - 6:00 PM', closed: false },
                    { day: 'Thursday', hours: '10:00 AM - 6:00 PM', closed: false },
                    { day: 'Friday', hours: '10:00 AM - 6:00 PM', closed: false }
                ],
                insurance_accepted: ['Star Health', 'Max Bupa', 'Reliance General']
            },
            {
                id: 3,
                name: 'Dr. Priya Patel',
                specialty: 'Orthopedics',
                location: 'South Branch',
                image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.7,
                reviewCount: 156,
                experience: 18,
                education: 'CMC Vellore',
                phone: '(555) 123-4569',
                email: 'priya.patel@medicare.com',
                bio: 'Dr. Patel is an orthopedic surgeon specializing in sports medicine and joint replacement.',
                availability: 'unavailable',
                languages: ['English', 'Gujarati', 'Hindi'],
                services: ['Joint Replacement', 'Sports Medicine', 'Arthroscopy'],
                education_details: [
                    { degree: 'MS Orthopedics', institution: 'CMC Vellore', year: '2006' },
                    { degree: 'Fellowship in Sports Medicine', institution: 'Sydney, Australia', year: '2008' }
                ],
                certifications: ['Indian Orthopedic Association', 'Board of Sports Medicine'],
                awards: [
                    { title: 'Excellence in Surgery', description: 'Surgical Society Honor', year: '2019' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Friday', hours: '9:00 AM - 5:00 PM', closed: false }
                ],
                insurance_accepted: ['Apollo Munich', 'United India Insurance', 'Niva Bupa']
            },
            {
                id: 4,
                name: 'Dr. Vikram Singh',
                specialty: 'Neurology',
                location: 'Main Campus',
                image: 'https://images.pexels.com/photos/6749814/pexels-photo-6749814.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.9,
                reviewCount: 203,
                experience: 20,
                education: 'PGIMER Chandigarh',
                phone: '(555) 123-4570',
                email: 'james.wilson@medicare.com',
                bio: 'Dr. Singh is a neurologist with expertise in treating stroke, epilepsy, and movement disorders.',
                availability: 'available',
                languages: ['English', 'Punjabi', 'Hindi'],
                services: ['Stroke Treatment', 'Epilepsy Management', 'EEG Testing'],
                education_details: [
                    { degree: 'DM Neurology', institution: 'PGIMER Chandigarh', year: '2004' },
                    { degree: 'MD Medicine', institution: 'AIIMS Delhi', year: '2001' }
                ],
                certifications: ['Indian Academy of Neurology', 'World Stroke Organization'],
                awards: [
                    { title: 'Stroke Researcher of the Year', description: 'Neurology Research Institute', year: '2020' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '8:00 AM - 4:00 PM', closed: false },
                    { day: 'Tuesday', hours: '8:00 AM - 4:00 PM', closed: false },
                    { day: 'Thursday', hours: '8:00 AM - 4:00 PM', closed: false },
                    { day: 'Friday', hours: '8:00 AM - 4:00 PM', closed: false }
                ],
                insurance_accepted: ['HDFC ERGO', 'Tata AIG', 'Star Health']
            },
            {
                id: 5,
                name: 'Dr. Kavita Reddy',
                specialty: 'Oncology',
                location: 'East Clinic',
                image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.8,
                reviewCount: 98,
                experience: 14,
                education: 'Tata Memorial Hospital',
                phone: '(555) 123-4571',
                email: 'kavita.reddy@medicare.com',
                bio: 'Dr. Reddy is an oncologist specializing in breast cancer and immunotherapy treatments.',
                availability: 'available',
                languages: ['English', 'Telugu', 'Hindi'],
                services: ['Chemotherapy', 'Immunotherapy', 'Cancer Screening'],
                education_details: [
                    { degree: 'DM Oncology', institution: 'Tata Memorial Hospital', year: '2010' },
                    { degree: 'MD Medicine', institution: 'Osmania Medical College', year: '2007' }
                ],
                certifications: ['Indian Society of Oncology', 'ESMO Certified'],
                awards: [
                    { title: 'Service Excellence', description: 'Hospital Merit Award', year: '2022' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Wednesday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Thursday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Friday', hours: '9:00 AM - 5:00 PM', closed: false }
                ],
                insurance_accepted: ['LIC Health', 'Religare Health', 'Star Health']
            },
            {
                id: 6,
                name: 'Dr. Arjun Mehra',
                specialty: 'General Medicine',
                location: 'Main Campus',
                image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.6,
                reviewCount: 175,
                experience: 22,
                education: 'Maulana Azad Medical College',
                phone: '(555) 123-4572',
                email: 'arjun.mehra@medicare.com',
                bio: 'Dr. Mehra is a primary care physician with extensive experience in internal medicine.',
                availability: 'available',
                languages: ['English', 'Hindi'],
                services: ['Annual Physicals', 'Chronic Disease Management', 'Preventive Care'],
                education_details: [
                    { degree: 'MD Internal Medicine', institution: 'MAMC Delhi', year: '2002' },
                    { degree: 'MBBS', institution: 'MAMC Delhi', year: '1998' }
                ],
                certifications: ['Indian Medical Association', 'Board of Internal Medicine'],
                awards: [
                    { title: 'Lifetime achievement', description: 'Medical Association Honor', year: '2023' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '8:00 AM - 12:00 PM', closed: false },
                    { day: 'Tuesday', hours: '8:00 AM - 12:00 PM', closed: false },
                    { day: 'Wednesday', hours: '8:00 AM - 12:00 PM', closed: false },
                    { day: 'Thursday', hours: '8:00 AM - 12:00 PM', closed: false },
                    { day: 'Friday', hours: '8:00 AM - 12:00 PM', closed: false }
                ],
                insurance_accepted: ['All Major Insurances']
            },
            {
                id: 7,
                name: 'Dr. Sunita Rao',
                specialty: 'Psychology',
                location: 'East Clinic',
                image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.7,
                reviewCount: 112,
                experience: 9,
                education: 'PhD from IHBAS Delhi',
                phone: '(555) 123-4573',
                email: 'sunita.rao@medicare.com',
                bio: 'Dr. Rao is an expert in clinical psychology and behavioral therapy.',
                availability: 'available',
                languages: ['English', 'Hindi', 'Kannada'],
                services: ['Cognitive Behavioral Therapy', 'Family Counseling', 'Stress Management'],
                education_details: [
                    { degree: 'PhD Clinical Psychology', institution: 'IHBAS Delhi', year: '2015' },
                    { degree: 'M.Phil Psychology', institution: 'NIMHANS', year: '2012' }
                ],
                certifications: ['Rehabilitation Council of India', 'Clinical Psychologist License'],
                awards: [
                    { title: 'Compassionate Care', description: 'Psychology Association', year: '2021' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '11:00 AM - 7:00 PM', closed: false },
                    { day: 'Wednesday', hours: '11:00 AM - 7:00 PM', closed: false },
                    { day: 'Saturday', hours: '10:00 AM - 2:00 PM', closed: false }
                ],
                insurance_accepted: ['Self-pay Only']
            },
            {
                id: 8,
                name: 'Dr. Amit Shah',
                specialty: 'Nephrology',
                location: 'Main Campus',
                image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.9,
                reviewCount: 145,
                experience: 16,
                education: 'AIIMS Delhi',
                phone: '(555) 123-4574',
                email: 'amit.shah@medicare.com',
                bio: 'Dr. Shah specializes in renal transplant and chronic kidney diseases.',
                availability: 'available',
                languages: ['English', 'Hindi', 'Gujarati'],
                services: ['Dialysis', 'Kidney Biopsy', 'Transplant Care'],
                education_details: [
                    { degree: 'DM Nephrology', institution: 'AIIMS Delhi', year: '2008' },
                    { degree: 'MD Medicine', institution: 'BJ Medical College', year: '2005' }
                ],
                certifications: ['Indian Society of Nephrology', 'American Society of Nephrology'],
                awards: [
                    { title: 'Transplant Pioneer', description: 'National Kidney Foundation', year: '2018' }
                ],
                office_hours: [
                    { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Thursday', hours: '9:00 AM - 5:00 PM', closed: false }
                ],
                insurance_accepted: ['Medicare', 'Medicaid', 'Star Health']
            },
            {
                id: 9,
                name: 'Dr. Meera Nambiar',
                specialty: 'Endocrinology',
                location: 'South Branch',
                image: 'https://images.pexels.com/photos/5452296/pexels-photo-5452296.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.8,
                reviewCount: 96,
                experience: 11,
                education: 'Madras Medical College',
                phone: '(555) 123-4575',
                email: 'meera.nambiar@medicare.com',
                bio: 'Dr. Nambiar is an expert in diabetes management and thyroid disorders.',
                availability: 'available',
                languages: ['English', 'Malayalam', 'Hindi'],
                services: ['Diabetes Care', 'Thyroid Management', 'Hormone Therapy'],
                education_details: [
                    { degree: 'DM Endocrinology', institution: 'Madras Medical College', year: '2013' },
                    { degree: 'MD Medicine', institution: 'CMC Vellore', year: '2010' }
                ],
                certifications: ['Endocrine Society of India', 'Diabetes Educator License'],
                awards: [
                    { title: 'Young Endocrinologist Award', description: 'State Medical Council', year: '2019' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '10:00 AM - 4:00 PM', closed: false },
                    { day: 'Wednesday', hours: '10:00 AM - 4:00 PM', closed: false },
                    { day: 'Friday', hours: '10:00 AM - 4:00 PM', closed: false }
                ],
                insurance_accepted: ['Apollo Munich', 'United India', 'Bajaj Allianz']
            },
            {
                id: 10,
                name: 'Dr. Rahul Gupta',
                specialty: 'Pulmonology',
                location: 'North Branch',
                image: 'https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.7,
                reviewCount: 132,
                experience: 13,
                education: 'KGMU Lucknow',
                phone: '(555) 123-4576',
                email: 'rahul.gupta@medicare.com',
                bio: 'Dr. Gupta is a specialist in respiratory diseases and critical care.',
                availability: 'available',
                languages: ['English', 'Hindi'],
                services: ['Asthma Treatment', 'COPD Management', 'Sleep Study'],
                education_details: [
                    { degree: 'MD Pulmonology', institution: 'KGMU Lucknow', year: '2011' },
                    { degree: 'Fellowship in Critical Care', institution: 'AIIMS Delhi', year: '2013' }
                ],
                certifications: ['Indian Chest Society', 'Critical Care Board'],
                awards: [
                    { title: 'Excellence in Chest Medicine', description: 'National Pulmocon', year: '2022' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Tuesday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Thursday', hours: '9:00 AM - 5:00 PM', closed: false }
                ],
                insurance_accepted: ['Star Health', 'Max Bupa', 'SBI General']
            },
            {
                id: 11,
                name: 'Dr. Deepa Iyer',
                specialty: 'Gastroenterology',
                location: 'East Clinic',
                image: 'https://images.pexels.com/photos/5215016/pexels-photo-5215016.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.8,
                reviewCount: 118,
                experience: 10,
                education: 'JIPMER Puducherry',
                phone: '(555) 123-4577',
                email: 'deepa.iyer@medicare.com',
                bio: 'Dr. Iyer is an expert in digestive system disorders and liver diseases.',
                availability: 'available',
                languages: ['English', 'Tamil', 'Hindi'],
                services: ['Endoscopy', 'Colonoscopy', 'Liver Function Test'],
                education_details: [
                    { degree: 'DM Gastroenterology', institution: 'JIPMER Puducherry', year: '2014' },
                    { degree: 'MD Medicine', institution: 'Madras Medical College', year: '2011' }
                ],
                certifications: ['Indian Society of Gastroenterology', 'Fellow of ISG'],
                awards: [
                    { title: 'Best Physician', description: 'Puducherry Medical Award', year: '2020' }
                ],
                office_hours: [
                    { day: 'Wednesday', hours: '12:00 PM - 8:00 PM', closed: false },
                    { day: 'Friday', hours: '12:00 PM - 8:00 PM', closed: false }
                ],
                insurance_accepted: ['United India', 'New India Assurance', 'Oriental Insurance']
            },
            {
                id: 12,
                name: 'Dr. Sanjay Deshmukh',
                specialty: 'Rheumatology',
                location: 'Main Campus',
                image: 'https://images.pexels.com/photos/6749817/pexels-photo-6749817.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.9,
                reviewCount: 87,
                experience: 15,
                education: 'GSMC Mumbai',
                phone: '(555) 123-4578',
                email: 'sanjay.deshmukh@medicare.com',
                bio: 'Dr. Deshmukh specializes in autoimmune diseases and joint inflammatory conditions.',
                availability: 'available',
                languages: ['English', 'Marathi', 'Hindi'],
                services: ['Arthritis Care', 'Lupus Treatment', 'Infusion Therapy'],
                education_details: [
                    { degree: 'DM Rheumatology', institution: 'KEM Hospital Mumbai', year: '2011' },
                    { degree: 'MD Medicine', institution: 'GSMC Mumbai', year: '2008' }
                ],
                certifications: ['Indian Rheumatology Association', 'Board of Rheumatology'],
                awards: [
                    { title: 'Top Rheumatologist', description: 'Maharashtra Health Forum', year: '2023' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '9:00 AM - 5:00 PM', closed: false },
                    { day: 'Thursday', hours: '9:00 AM - 5:00 PM', closed: false }
                ],
                insurance_accepted: ['HDFC ERGO', 'Reliance General', 'Star Health']
            },
            {
                id: 13,
                name: 'Dr. Anita Joshi',
                specialty: 'Gynecology',
                location: 'West Clinic',
                image: 'https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.9,
                reviewCount: 164,
                experience: 18,
                education: 'Lady Hardinge Medical College',
                phone: '(555) 123-4579',
                email: 'anita.joshi@medicare.com',
                bio: 'Dr. Joshi is an expert in maternal-fetal medicine and reproductive health.',
                availability: 'available',
                languages: ['English', 'Hindi'],
                services: ['Prenatal Care', 'Gyn Surgery', 'Menopause Management'],
                education_details: [
                    { degree: 'MD Obs & Gyn', institution: 'Lady Hardinge MC Delhi', year: '2006' },
                    { degree: 'Fellowship in Fetal Medicine', institution: 'Bangalore', year: '2008' }
                ],
                certifications: ['FOGSI Certified', 'Indian Board of Obs & Gyn'],
                awards: [
                    { title: 'Women Health Excellence', description: 'National Gyn Conference', year: '2021' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '9:00 AM - 4:00 PM', closed: false },
                    { day: 'Tuesday', hours: '10:00 AM - 6:00 PM', closed: false },
                    { day: 'Thursday', hours: '9:00 AM - 4:00 PM', closed: false }
                ],
                insurance_accepted: ['Star Health', 'Apollo Munich', 'Max Life']
            },
            {
                id: 14,
                name: 'Dr. Manoj Tiwari',
                specialty: 'Orthopedics',
                location: 'South Branch',
                image: 'https://images.pexels.com/photos/6749780/pexels-photo-6749780.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.7,
                reviewCount: 192,
                experience: 20,
                education: 'BHU Varanasi',
                phone: '(555) 123-4580',
                email: 'manoj.tiwari@medicare.com',
                bio: 'Dr. Tiwari is specialized in joint replacement and trauma surgery.',
                availability: 'available',
                languages: ['English', 'Hindi', 'Bhojpuri'],
                services: ['Knee Replacement', 'Hip Replacement', 'Fracture Care'],
                education_details: [
                    { degree: 'MS Orthopedics', institution: 'BHU Varanasi', year: '2004' },
                    { degree: 'MBBS', institution: 'IMS BHU', year: '2000' }
                ],
                certifications: ['Indian Orthopedic Association', 'Hip & Knee Surgeon Board'],
                awards: [
                    { title: 'Best Trauma Surgeon', description: 'UP Health Summit', year: '2020' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '10:00 AM - 6:00 PM', closed: false },
                    { day: 'Wednesday', hours: '10:00 AM - 6:00 PM', closed: false },
                    { day: 'Friday', hours: '10:00 AM - 6:00 PM', closed: false }
                ],
                insurance_accepted: ['Oriental Insurance', 'United India', 'Star Health']
            },
            {
                id: 15,
                name: 'Dr. Swati Mishra',
                specialty: 'Psychiatry',
                location: 'North Branch',
                image: 'https://images.pexels.com/photos/5215021/pexels-photo-5215021.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.8,
                reviewCount: 143,
                experience: 12,
                education: 'AIIMS Delhi',
                phone: '(555) 123-4581',
                email: 'swati.mishra@medicare.com',
                bio: 'Dr. Mishra is an expert in mental health, stress management, and clinical psychiatry.',
                availability: 'available',
                languages: ['English', 'Hindi'],
                services: ['Mental Health Assessment', 'Medication Management', 'Psychotherapy'],
                education_details: [
                    { degree: 'MD Psychiatry', institution: 'AIIMS Delhi', year: '2012' },
                    { degree: 'MBBS', institution: 'Lady Hardinge MC', year: '2008' }
                ],
                certifications: ['Indian Psychiatric Society', 'Certified Psychotherapist'],
                awards: [
                    { title: 'Inpatient Care Award', description: 'AIIMS Excellence', year: '2015' }
                ],
                office_hours: [
                    { day: 'Tuesday', hours: '11:00 AM - 7:00 PM', closed: false },
                    { day: 'Thursday', hours: '11:00 AM - 7:00 PM', closed: false },
                    { day: 'Saturday', hours: '9:00 AM - 1:00 PM', closed: false }
                ],
                insurance_accepted: ['Star Health', 'HDFC ERGO', 'Apollo Munich']
            }
        ];
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('doctorSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.handleSearch();
            }, 300));
        }

        // Specialty filter
        const specialtyFilter = document.getElementById('specialtyFilter');
        if (specialtyFilter) {
            specialtyFilter.addEventListener('change', () => {
                this.handleSpecialtyFilter();
            });
        }

        // Location filter
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            locationFilter.addEventListener('change', () => {
                this.handleLocationFilter();
            });
        }

        // Search button
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Doctor card clicks
        document.addEventListener('click', (e) => {
            const doctorCard = e.target.closest('.doctor-card');
            if (doctorCard) {
                const doctorId = doctorCard.dataset.doctorId;
                this.viewDoctorProfile(doctorId);
            }
        });
    }

    /**
     * Setup view toggle functionality
     */
    setupViewToggle() {
        const viewButtons = document.querySelectorAll('.view-btn');

        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);

                // Update button states
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /**
     * Parse URL parameters for initial search
     */
    parseUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);

        const search = urlParams.get('search');
        const specialty = urlParams.get('specialty');

        if (search) {
            const searchInput = document.getElementById('doctorSearchInput');
            if (searchInput) {
                searchInput.value = search;
                this.currentFilters.search = search;
            }
        }

        if (specialty) {
            const specialtyFilter = document.getElementById('specialtyFilter');
            if (specialtyFilter) {
                specialtyFilter.value = specialty;
                this.currentFilters.specialty = specialty;
            }
        }

        // Apply initial filters if any
        if (search || specialty) {
            setTimeout(() => {
                this.applyFilters();
            }, 1100); // After doctors are loaded
        }
    }

    /**
     * Handle search input
     */
    handleSearch() {
        const searchInput = document.getElementById('doctorSearchInput');
        this.currentFilters.search = searchInput.value.toLowerCase().trim();
        this.applyFilters();
    }

    /**
     * Handle specialty filter
     */
    handleSpecialtyFilter() {
        const specialtyFilter = document.getElementById('specialtyFilter');
        this.currentFilters.specialty = specialtyFilter.value;
        this.applyFilters();
    }

    /**
     * Handle location filter
     */
    handleLocationFilter() {
        const locationFilter = document.getElementById('locationFilter');
        this.currentFilters.location = locationFilter.value;
        this.applyFilters();
    }

    /**
     * Apply all filters
     */
    applyFilters() {
        this.filteredDoctors = this.doctors.filter(doctor => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const searchableText = `${doctor.name} ${doctor.specialty} ${doctor.bio}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Specialty filter
            if (this.currentFilters.specialty &&
                doctor.specialty.toLowerCase() !== this.currentFilters.specialty.toLowerCase()) {
                return false;
            }

            // Location filter
            if (this.currentFilters.location &&
                doctor.location.toLowerCase() !== this.currentFilters.location.toLowerCase()) {
                return false;
            }


            return true;
        });

        this.renderDoctors();
        this.updateResultsCount();
    }

    /**
     * Switch between grid and list view
     */
    switchView(view) {
        this.currentView = view;
        const doctorsGrid = document.getElementById('doctorsGrid');

        if (doctorsGrid) {
            doctorsGrid.className = `doctors-grid ${view === 'list' ? 'list-view' : ''}`;
        }
    }

    /**
     * Render doctors list
     */
    renderDoctors() {
        const doctorsGrid = document.getElementById('doctorsGrid');
        const loadingState = document.getElementById('loadingState');
        const noResults = document.getElementById('noResults');

        if (!doctorsGrid) return;

        // Hide loading and no results
        if (loadingState) loadingState.style.display = 'none';
        if (noResults) noResults.style.display = 'none';

        if (this.filteredDoctors.length === 0) {
            doctorsGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        const doctorsHTML = this.filteredDoctors.map(doctor => `
            <div class="doctor-card" data-doctor-id="${doctor.id}">
                <div class="doctor-card-content">
                    <div class="doctor-avatar">
                        <img src="${doctor.image}" alt="Dr. ${doctor.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Dr'">
                    </div>
                    <div class="doctor-info">
                        <h3 class="doctor-name">${doctor.name}</h3>
                        <p class="doctor-specialty">${doctor.specialty}</p>
                        <div class="doctor-location">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            ${doctor.location}
                        </div>
                        <div class="doctor-rating">
                            <div class="rating-stars">
                                ${this.generateStarRating(doctor.rating)}
                            </div>
                            <span class="rating-text">${doctor.rating} (${doctor.reviewCount} reviews)</span>
                        </div>
                        <div class="availability-indicator">
                            <div class="availability-dot ${doctor.availability === 'available' ? '' : 'unavailable'}"></div>
                            <span class="availability-text">
                                ${doctor.availability === 'available' ? 'Available for appointments' : 'Currently unavailable'}
                            </span>
                        </div>
                        <div class="doctor-actions">
                            <button class="btn btn-outline btn-small" onclick="doctorsDirectory.viewDoctorProfile(${doctor.id})">
                                View Profile
                            </button>
                            <button class="btn btn-primary btn-small" onclick="doctorsDirectory.bookAppointment(${doctor.id})" 
                                    ${doctor.availability !== 'available' ? 'disabled' : ''}>
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        doctorsGrid.innerHTML = doctorsHTML;
    }

    /**
     * Generate star rating HTML
     */
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += `
                <svg class="star" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
            `;
        }

        // Half star
        if (hasHalfStar) {
            starsHTML += `
                <svg class="star" viewBox="0 0 24 24" fill="currentColor">
                    <defs>
                        <linearGradient id="half-fill">
                            <stop offset="50%" stop-color="currentColor"/>
                            <stop offset="50%" stop-color="transparent"/>
                        </linearGradient>
                    </defs>
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="url(#half-fill)"/>
                </svg>
            `;
        }

        // Empty stars
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += `
                <svg class="star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
            `;
        }

        return starsHTML;
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const loadingState = document.getElementById('loadingState');
        const doctorsGrid = document.getElementById('doctorsGrid');

        if (loadingState) loadingState.style.display = 'flex';
        if (doctorsGrid) doctorsGrid.innerHTML = '';
    }

    /**
     * Update results count
     */
    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            const count = this.filteredDoctors.length;
            const doctorText = count === 1 ? 'doctor' : 'doctors';
            resultsCount.textContent = `(${count} ${doctorText} found)`;
        }
    }

    /**
     * View doctor profile
     */
    viewDoctorProfile(doctorId) {
        // Store doctor data in sessionStorage for the profile page
        const doctor = this.doctors.find(d => d.id === parseInt(doctorId));
        if (doctor) {
            sessionStorage.setItem('selectedDoctor', JSON.stringify(doctor));
            window.location.href = 'doctor-profile.html';
        }
    }

    /**
     * Book appointment with doctor
     */
    bookAppointment(doctorId) {
        const doctor = this.doctors.find(d => d.id === parseInt(doctorId));
        if (doctor && doctor.availability === 'available') {
            // Store selected doctor for pre-filling appointment form
            sessionStorage.setItem('selectedDoctor', JSON.stringify(doctor));
            window.location.href = 'appointment.html';
        } else {
            this.showNotification('This doctor is currently unavailable for appointments.', 'warning');
        }
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        // Reset filter inputs
        const searchInput = document.getElementById('doctorSearchInput');
        const specialtyFilter = document.getElementById('specialtyFilter');
        const locationFilter = document.getElementById('locationFilter');

        if (searchInput) searchInput.value = '';
        if (specialtyFilter) specialtyFilter.value = '';
        if (locationFilter) locationFilter.value = '';

        // Reset filter state
        this.currentFilters = {
            search: '',
            specialty: '',
            location: ''
        };

        // Show all doctors
        this.filteredDoctors = [...this.doctors];
        this.renderDoctors();
        this.updateResultsCount();
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${this.getNotificationColor(type)};
            color: white;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(notification);
        });

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after 4 seconds
        setTimeout(() => {
            this.closeNotification(notification);
        }, 4000);
    }

    /**
     * Get notification color based on type
     */
    getNotificationColor(type) {
        switch (type) {
            case 'success':
                return 'var(--success-color)';
            case 'error':
                return 'var(--error-color)';
            case 'warning':
                return 'var(--warning-color)';
            default:
                return 'var(--primary-color)';
        }
    }

    /**
     * Close notification
     */
    closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Debounce function for search input
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global functions for button onclick handlers
function clearFilters() {
    if (window.doctorsDirectory) {
        window.doctorsDirectory.clearFilters();
    }
}

// Initialize doctors directory when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.doctorsDirectory = new DoctorsDirectory();
});
document.addEventListener('DOMContentLoaded', () => {
    // Get the specialty from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const specialty = urlParams.get('specialty');

    if (specialty) {
        // Find the corresponding filter option and set it as selected
        const specialtyFilter = document.getElementById('specialtyFilter');
        if (specialtyFilter) {
            specialtyFilter.value = specialty;
            // You would then trigger a function to filter your doctor list
            filterDoctors(specialty);
        }
    }
});
