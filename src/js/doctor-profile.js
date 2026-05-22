// Doctor Profile JavaScript Functionality

/**
 * Doctor Profile Page - Displays detailed doctor information and handles interactions
 */
class DoctorProfile {
    constructor() {
        this.doctor = null;
        this.init();
    }

    init() {
        this.loadDoctorData();
        this.setupEventListeners();
    }

    /**
     * Load doctor data from sessionStorage or use sample data
     */
    loadDoctorData() {
        const storedDoctor = sessionStorage.getItem('selectedDoctor');

        if (storedDoctor) {
            this.doctor = JSON.parse(storedDoctor);
        } else {
            // Default doctor data if none selected
            this.doctor = {
                id: 1,
                name: 'Dr. Ananya Sharma',
                specialty: 'Cardiology',
                location: 'Main Campus',
                image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
                rating: 4.8,
                reviewCount: 127,
                experience: 15,
                education: 'AIIMS Delhi',
                phone: '(555) 123-4567',
                email: 'ananya.sharma@medicare.com',
                bio: 'Dr. Ananya Sharma is a board-certified cardiologist with over 15 years of experience in treating complex cardiac conditions. She completed her medical degree at AIIMS Delhi and her cardiology fellowship at Tata Memorial Hospital. Dr. Sharma is known for her compassionate patient care and expertise in interventional cardiology, particularly in treating coronary artery disease and heart failure.',
                availability: 'available',
                languages: ['English', 'Hindi'],
                services: ['Cardiac Catheterization', 'Echocardiogram', 'Stress Testing', 'Heart Disease Prevention'],
                education_details: [
                    { degree: 'Doctor of Medicine (MD)', institution: 'AIIMS Delhi', year: '2009' },
                    { degree: 'Cardiology Fellowship', institution: 'Tata Memorial Hospital', year: '2012-2015' },
                    { degree: 'Internal Medicine Residency', institution: 'Maulana Azad Medical College', year: '2009-2012' },
                    { degree: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)', institution: 'AIIMS Delhi', year: '2005' }
                ],
                certifications: [
                    'Indian Board of Cardiology',
                    'Medical Council of India',
                    'Advanced Cardiac Life Support (ACLS)',
                    'Nuclear Cardiology Certification'
                ],
                awards: [
                    { title: 'Top Doctor Award', description: 'Recognized as one of the top cardiologists in the region by Medical Excellence Magazine', year: '2023' },
                    { title: 'Patient Choice Award', description: 'Honored for exceptional patient care and satisfaction scores', year: '2022' },
                    { title: 'Research Excellence Award', description: 'Published groundbreaking research on minimally invasive cardiac procedures', year: '2021' }
                ],
                office_hours: [
                    { day: 'Monday', hours: '8:00 AM - 5:00 PM', closed: false },
                    { day: 'Tuesday', hours: '8:00 AM - 5:00 PM', closed: false },
                    { day: 'Wednesday', hours: '8:00 AM - 3:00 PM', closed: false },
                    { day: 'Thursday', hours: '8:00 AM - 5:00 PM', closed: false },
                    { day: 'Friday', hours: '8:00 AM - 4:00 PM', closed: false },
                    { day: 'Saturday', hours: 'Closed', closed: true },
                    { day: 'Sunday', hours: 'Closed', closed: true }
                ],
                insurance_accepted: [
                    'LIC Health Insurance', 'Apollo Munich', 'Star Health', 'United India Insurance', 'Medicare', 'Medicaid', 'HDFC ERGO'
                ]
            };
        }
        this.renderDoctorProfile();
    }

    renderDoctorProfile() {
        this.renderHeader();
        this.renderAbout();
        this.renderEducation();
        this.renderSpecialties();
        this.renderAwards();
        this.renderContactInfo();
        this.renderOfficeHours();
        this.renderInsuranceAccepted();
        this.updatePageTitle();

        // Re-apply translations for dynamically rendered content
        if (window.applyTranslations) window.applyTranslations();
    }

    renderHeader() {
        const headerContainer = document.getElementById('doctorHeader');
        if (!headerContainer) return;
        const headerHTML = `
            <div class="doctor-header-content">
                <img src="${this.doctor.image}" alt="${this.doctor.name}" class="doctor-photo" onerror="this.src='https://via.placeholder.com/150x150?text=Dr'">
                <div class="doctor-basic-info">
                    <h1>${this.doctor.name}</h1>
                    <p class="doctor-title">${this.doctor.specialty}</p>
                    <div class="doctor-meta">
                        <div class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            ${this.doctor.location}
                        </div>
                        <div class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/></svg>
                            ${this.doctor.experience} years experience
                        </div>
                        <div class="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                            ${this.doctor.education}
                        </div>
                    </div>
                    <div class="doctor-rating">
                        <div class="rating-stars">
                            ${this.generateStarRating(this.doctor.rating)}
                        </div>
                        <span class="rating-info">${this.doctor.rating} out of 5 (${this.doctor.reviewCount} reviews)</span>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="btn btn-primary btn-large" id="headerBookAppointmentBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        Book Appointment
                    </button>
                    <button class="btn btn-secondary" id="sendMessageBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Send Message
                    </button>
                </div>
            </div>
        `;
        headerContainer.innerHTML = headerHTML;
    }

    renderAbout() {
        const aboutContainer = document.getElementById('doctorAbout');
        if (!aboutContainer) return;
        aboutContainer.innerHTML = `
            <p>${this.doctor.bio}</p>
            <div class="languages-spoken">
                <h4>Languages Spoken:</h4>
                <div class="language-tags">
                    ${this.doctor.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
                </div>
            </div>
        `;
    }

    renderEducation() {
        const educationContainer = document.getElementById('doctorEducation');
        if (!educationContainer) return;
        const educationHTML = this.doctor.education_details.map(edu => `
            <div class="education-item">
                <div class="education-degree">${edu.degree}</div>
                <div class="education-institution">${edu.institution}</div>
                <div class="education-year">${edu.year}</div>
            </div>
        `).join('');
        educationContainer.innerHTML = educationHTML;

        if (this.doctor.certifications && this.doctor.certifications.length > 0) {
            const certificationsHTML = `
                <div class="certifications-section">
                    <h4>Board Certifications & Credentials:</h4>
                    <ul class="certifications-list">
                        ${this.doctor.certifications.map(cert => `<li>${cert}</li>`).join('')}
                    </ul>
                </div>
            `;
            educationContainer.innerHTML += certificationsHTML;
        }
    }

    renderSpecialties() {
        const specialtiesContainer = document.getElementById('doctorSpecialties');
        if (!specialtiesContainer) return;
        const specialtiesHTML = this.doctor.services.map(service => `
            <div class="specialty-item">${service}</div>
        `).join('');
        specialtiesContainer.innerHTML = specialtiesHTML;
    }

    renderAwards() {
        const awardsContainer = document.getElementById('doctorAwards');
        if (!awardsContainer) return;
        const awardsHTML = this.doctor.awards.map(award => `
            <div class="award-item">
                <div class="award-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                </div>
                <div class="award-info">
                    <div class="award-title">${award.title} (${award.year})</div>
                    <div class="award-description">${award.description}</div>
                </div>
            </div>
        `).join('');
        awardsContainer.innerHTML = awardsHTML;
    }

    renderContactInfo() {
        const contactContainer = document.getElementById('doctorContact');
        if (!contactContainer) return;
        const contactHTML = `
            <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div class="contact-details">
                    <span class="contact-label">Phone</span>
                    <a href="tel:${this.doctor.phone}" class="contact-value">${this.doctor.phone}</a>
                </div>
            </div>
            <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <div class="contact-details">
                    <span class="contact-label">Email</span>
                    <a href="mailto:${this.doctor.email}" class="contact-value">${this.doctor.email}</a>
                </div>
            </div>
            <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div class="contact-details">
                    <span class="contact-label">Location</span>
                    <span class="contact-value">${this.doctor.location}</span>
                </div>
            </div>
        `;
        contactContainer.innerHTML = contactHTML;
    }

    renderOfficeHours() {
        const hoursContainer = document.getElementById('doctorHours');
        if (!hoursContainer) return;
        const hoursHTML = this.doctor.office_hours.map(day => `
            <div class="hours-day">
                <span class="day-name">${day.day}</span>
                <span class="day-hours ${day.closed ? 'closed' : ''}">${day.hours}</span>
            </div>
        `).join('');
        hoursContainer.innerHTML = hoursHTML;
    }

    renderInsuranceAccepted() {
        const insuranceContainer = document.getElementById('doctorInsurance');
        if (!insuranceContainer) return;
        const insuranceHTML = this.doctor.insurance_accepted.map(insurance => `
            <div class="insurance-item">${insurance}</div>
        `).join('');
        insuranceContainer.innerHTML = insuranceHTML;
    }

    updatePageTitle() {
        document.title = `${this.doctor.name} - Nexus Care`;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += `<svg class="star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
        }
        if (hasHalfStar) {
            starsHTML += `<svg class="star" viewBox="0 0 24 24" fill="currentColor"><defs><linearGradient id="half-fill-profile"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="url(#half-fill-profile)"/></svg>`;
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += `<svg class="star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
        }
        return starsHTML;
    }

    setupEventListeners() {
        document.getElementById('bookAppointmentBtn')?.addEventListener('click', () => this.bookAppointment());
        document.getElementById('headerBookAppointmentBtn')?.addEventListener('click', () => this.bookAppointment());
        document.getElementById('sendMessageBtn')?.addEventListener('click', () => this.sendMessage());
    }

    bookAppointment() {
        window.location.href = 'appointment.html';
    }

    sendMessage() {
        alert('Message functionality will be available in the patient portal.');
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    window.doctorProfile = new DoctorProfile();
});
