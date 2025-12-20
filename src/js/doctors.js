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
                name: 'Dr. Sarah Johnson',
                specialty: 'Cardiology',
                location: 'Main Campus',
                image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.9,
                reviewCount: 127,
                experience: 15,
                education: 'Harvard Medical School',
                phone: '(555) 123-4567',
                email: 'sarah.johnson@medicare.com',
                bio: 'Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating complex cardiac conditions.',
                availability: 'available',
                languages: ['English', 'Spanish'],
                services: ['Cardiac Catheterization', 'Echocardiogram', 'Stress Testing']
            },
            {
                id: 2,
                name: 'Dr. Michael Chen',
                specialty: 'Pediatrics',
                location: 'North Branch',
                image: 'https://images.pexels.com/photos/612349/pexels-photo-612349.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.8,
                reviewCount: 89,
                experience: 12,
                education: 'Johns Hopkins University',
                phone: '(555) 123-4568',
                email: 'michael.chen@medicare.com',
                bio: 'Dr. Chen specializes in pediatric care with a focus on child development and preventive medicine.',
                availability: 'available',
                languages: ['English', 'Mandarin'],
                services: ['Well-child visits', 'Immunizations', 'Developmental assessments']
            },
            {
                id: 3,
                name: 'Dr. Emily Rodriguez',
                specialty: 'Orthopedics',
                location: 'South Branch',
                image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.7,
                reviewCount: 156,
                experience: 18,
                education: 'Stanford Medical School',
                phone: '(555) 123-4569',
                email: 'emily.rodriguez@medicare.com',
                bio: 'Dr. Rodriguez is an orthopedic surgeon specializing in sports medicine and joint replacement.',
                availability: 'unavailable',
                languages: ['English', 'Spanish'],
                services: ['Joint Replacement', 'Sports Medicine', 'Arthroscopy']
            },
            {
                id: 4,
                name: 'Dr. James Wilson',
                specialty: 'Neurology',
                location: 'Main Campus',
                image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.9,
                reviewCount: 203,
                experience: 20,
                education: 'Mayo Clinic College of Medicine',
                phone: '(555) 123-4570',
                email: 'james.wilson@medicare.com',
                bio: 'Dr. Wilson is a neurologist with expertise in treating stroke, epilepsy, and movement disorders.',
                availability: 'available',
                languages: ['English'],
                services: ['Stroke Treatment', 'Epilepsy Management', 'EEG Testing']
            },
            {
                id: 5,
                name: 'Dr. Lisa Park',
                specialty: 'Oncology',
                location: 'East Clinic',
                image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.8,
                reviewCount: 98,
                experience: 14,
                education: 'University of Pennsylvania',
                phone: '(555) 123-4571',
                email: 'lisa.park@medicare.com',
                bio: 'Dr. Park is an oncologist specializing in breast cancer and immunotherapy treatments.',
                availability: 'available',
                languages: ['English', 'Korean'],
                services: ['Chemotherapy', 'Immunotherapy', 'Cancer Screening']
            },
            {
                id: 6,
                name: 'Dr. Robert Davis',
                specialty: 'General Medicine',
                location: 'Main Campus',
                image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
                rating: 4.6,
                reviewCount: 175,
                experience: 22,
                education: 'University of California, San Francisco',
                phone: '(555) 123-4572',
                email: 'robert.davis@medicare.com',
                bio: 'Dr. Davis is a primary care physician with extensive experience in internal medicine.',
                availability: 'available',
                languages: ['English'],
                services: ['Annual Physicals', 'Chronic Disease Management', 'Preventive Care']
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
                doctor.location.toLowerCase() !== this.currentFilters.location.toLowerCase().replace('-', ' ')) {
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