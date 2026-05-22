/**
 * Appointment Booking System - Handles multi-step form, calendar, and validation
 */

class AppointmentBooking {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.availableTimes = [];
        this.selectedDate = null;
        this.selectedTime = null;
        this.calendar = null;

        // New: Initialize confirmation number
        this.appointmentNumberCounter = 0;
        this.lastAppointmentDate = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCalendar();
        this.setupFormValidation();
        this.updateProgressIndicator();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Insurance checkbox toggle
        const hasInsuranceCheckbox = document.getElementById('hasInsurance');
        if (hasInsuranceCheckbox) {
            hasInsuranceCheckbox.addEventListener('change', () => {
                this.toggleInsuranceFields();
            });
        }

        // Form submission
        const form = document.getElementById('appointmentForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Time slot selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-slot')) {
                this.selectTimeSlot(e.target);
            }
        });
    }

    /**
     * Navigate to next step
     */
    async nextStep(currentStepNum) {
        if (this.validateCurrentStep(currentStepNum)) {
            this.saveCurrentStepData(currentStepNum);

            // This is the crucial step where the data is submitted.
            // It will only run when moving from Step 3 to the final confirmation page.
            if (currentStepNum === 3) {
                // Show a loading state to the user
                this.setLoadingState(true);

                // Wait for the submission to complete
                await this.submitAppointmentData();

                // Hide the loading state and proceed to the next step
                this.setLoadingState(false);
            }

            if (currentStepNum < this.totalSteps) {
                this.showStep(currentStepNum + 1);
                this.currentStep = currentStepNum + 1;
                this.updateProgressIndicator();

                if (currentStepNum + 1 === 4) {
                    this.displayConfirmation();
                }
            }
        }
    }

    /**
     * Sends the form data to the Google Apps Script web app and local modular backend.
     */
    async submitAppointmentData() {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbxL8zJH6K3g84XM2RZ-yT73Oe8Oo5Nvsjtua3BDsUhFwJuXVAlIdaK4smGDx1S7iHk0yA/exec';
        const localBackendUrl = '/api/appointments/book';

        try {
            // Log for debugging
            console.log('Final Form Data:', this.formData);

            // 1. Submit to Google Sheets (Updated URL and format)
            const sheetsData = {
                name: `${this.formData.firstName} ${this.formData.lastName}`,
                email: this.formData.email,
                doctor: this.formData.department || 'General Medicine',
                date: this.formData.selectedDate,
                time: this.formData.selectedTime,
                symptoms: this.formData.reasonForVisit
            };

            fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sheetsData),
            }).catch(err => console.error('Google Sheets submission failed:', err));

            // 2. Submit to local MongoDB Backend (New)
            const backendData = {
                name: `${this.formData.firstName} ${this.formData.lastName}`,
                email: this.formData.email,
                doctor: this.formData.department || 'General Medicine',
                date: this.formData.selectedDate,
                time: this.formData.selectedTime,
                symptoms: this.formData.reasonForVisit
            };

            const response = await fetch(localBackendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.authStore ? `Bearer ${window.authStore.token}` : ''
                },
                body: JSON.stringify(backendData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Appointment saved to MongoDB:', data);
            } else {
                console.error('Failed to save to MongoDB:', await response.text());
                // We proceed anyway since the local backend might not be running in all environments
            }

            console.log('Form data submission processes initiated.');

        } catch (error) {
            console.error('Error submitting form data:', error);
            this.showNotification('Failed to save appointment details locally. Please try again.', 'warning');
        }
    }

    /**
     * Toggles a loading state on the form to provide user feedback.
     */
    setLoadingState(isLoading) {
        const formElement = document.getElementById('appointmentForm');
        if (isLoading) {
            formElement.classList.add('loading');
        } else {
            formElement.classList.remove('loading');
        }
    }

    /**
     * Navigate to previous step
     */
    prevStep(currentStepNum) {
        if (currentStepNum > 1) {
            this.showStep(currentStepNum - 1);
            this.currentStep = currentStepNum - 1;
            this.updateProgressIndicator();
        }
    }

    /**
     * Show specific step
     */
    showStep(stepNumber) {
        // Hide all steps
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(step => step.classList.remove('active'));

        // Show target step
        const targetStep = document.getElementById(`step${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
    }

    /**
     * Update progress indicator
     */
    updateProgressIndicator() {
        const progressSteps = document.querySelectorAll('.progress-step');

        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;

            step.classList.remove('active', 'completed');

            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    /**
     * Validate current step
     */
    validateCurrentStep(stepNumber) {
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        // Clear previous errors
        this.clearStepErrors(currentStepElement);

        // Validate required fields
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
                this.showFieldError(field, this.getFieldErrorMessage(field));
            }
        });

        // Step-specific validation
        switch (stepNumber) {
            case 1:
                // validatePersonalInfo handles extra date of birth logic
                isValid = this.validatePersonalInfo() && isValid;
                break;
            case 2:
                isValid = this.validateInsuranceInfo() && isValid;
                break;
            case 3:
                isValid = this.validateAppointmentDetails() && isValid;
                break;
        }

        return isValid;
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const fieldName = field.id;

        if (field.required && !value) {
            return false;
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return false;
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^\(?[\d\s\-\(\)]+\)?$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get error message for field
     */
    getFieldErrorMessage(field) {
        const fieldName = field.id;
        const type = field.type;

        if (!field.value.trim()) {
            return 'This field is required.';
        }

        switch (type) {
            case 'email':
                return 'Please enter a valid email address.';
            case 'tel':
                return 'Please enter a valid phone number.';
            case 'date':
                if (fieldName === 'dateOfBirth') {
                    // Specific message for date of birth
                    return 'Please enter a valid past or present date.';
                } else {
                    // Default message for other date fields (e.g., future dates)
                    return 'Please select a future date.';
                }
            default:
                return 'Please enter a valid value.';
        }
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');

        formGroup.classList.add('error');

        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
    }

    /**
     * Clear errors for a step
     */
    clearStepErrors(stepElement) {
        const formGroups = stepElement.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
            const errorDiv = group.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
        });
    }

    /**
     * Validate personal information step, including date of birth.
     */
    validatePersonalInfo() {
        let isValid = true;

        const dobField = document.getElementById('dateOfBirth');
        if (dobField && dobField.value) {
            const dob = new Date(dobField.value);
            const today = new Date();

            // Check if the date of birth is in the future
            if (dob > today) {
                this.showFieldError(dobField, 'Please select a past or present date of birth.');
                isValid = false;
            }
            // Check for a reasonable age range
            else {
                const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
                if (age < 0 || age > 150) {
                    this.showFieldError(dobField, 'Please enter a valid date of birth.');
                    isValid = false;
                }
            }
        }

        return isValid;
    }

    /**
     * Validate insurance information step
     */
    validateInsuranceInfo() {
        const hasInsurance = document.getElementById('hasInsurance').checked;

        if (hasInsurance) {
            const requiredInsuranceFields = [
                'insuranceProvider',
                'policyNumber',
                'subscriberName'
            ];

            let isValid = true;
            requiredInsuranceFields.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (field && !field.value.trim()) {
                    this.showFieldError(field, 'This field is required when you have insurance.');
                    isValid = false;
                }
            });

            return isValid;
        }

        return true;
    }

    /**
     * Validate appointment details step
     */
    validateAppointmentDetails() {
        let isValid = true;

        // Check if date and time are selected
        if (!this.selectedDate) {
            this.showNotification('Please select an appointment date.', 'error');
            isValid = false;
        }

        if (!this.selectedTime) {
            this.showNotification('Please select an appointment time.', 'error');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Save current step data
     */
    saveCurrentStepData(stepNumber) {
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        const formFields = currentStepElement.querySelectorAll('input, select, textarea');

        formFields.forEach(field => {
            if (field.type === 'checkbox') {
                this.formData[field.name] = field.checked;
            } else {
                this.formData[field.name] = field.value;
            }
        });

        // Save selected date and time
        if (stepNumber === 3) {
            this.formData.selectedDate = this.selectedDate;
            this.formData.selectedTime = this.selectedTime;
        }
    }

    /**
     * Toggle insurance fields visibility
     */
    toggleInsuranceFields() {
        const hasInsurance = document.getElementById('hasInsurance').checked;
        const insuranceFields = document.getElementById('insuranceFields');

        if (insuranceFields) {
            if (hasInsurance) {
                insuranceFields.style.display = 'block';
                insuranceFields.classList.add('active');
            } else {
                insuranceFields.style.display = 'none';
                insuranceFields.classList.remove('active');

                // Clear insurance field values
                const fields = insuranceFields.querySelectorAll('input, select');
                fields.forEach(field => field.value = '');
            }
        }
    }

    /**
     * Initialize calendar
     */
    initializeCalendar() {
        this.calendar = new AppointmentCalendar('appointmentCalendar', {
            onDateSelect: (date) => this.handleDateSelection(date),
            minDate: new Date(),
            maxDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
        });
    }

    /**
     * Handle date selection
     */
    handleDateSelection(date) {
        this.selectedDate = date;
        this.selectedTime = null; // Reset selected time

        // Load available time slots
        this.loadAvailableTimeSlots(date);
    }

    /**
     * Load available time slots for selected date
     */
    loadAvailableTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer) return;

        // Show loading state
        timeSlotsContainer.innerHTML = '<div class="loading-state"><div class="loader"></div><p>Loading available times...</p></div>';

        // Simulate API call delay
        setTimeout(() => {
            const timeSlots = this.generateTimeSlots(date);
            this.renderTimeSlots(timeSlots);
        }, 800);
    }

    /**
     * Generate time slots for a given date
     */
    generateTimeSlots(date) {
        const slots = [];
        const dayOfWeek = date.getDay();

        // Weekend has different hours
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const startHour = isWeekend ? 9 : 8;
        const endHour = isWeekend ? 14 : 17;

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                // Simulate some unavailable slots
                const isAvailable = Math.random() > 0.3;

                slots.push({
                    time: time,
                    available: isAvailable,
                    formatted: this.formatTime(hour, minute)
                });
            }
        }

        return slots;
    }

    /**
     * Format time for display
     */
    formatTime(hour, minute) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');

        return `${displayHour}:${displayMinute} ${period}`;
    }

    /**
     * Render time slots
     */
    renderTimeSlots(slots) {
        const timeSlotsContainer = document.getElementById('timeSlots');

        if (slots.length === 0) {
            timeSlotsContainer.innerHTML = '<p class="no-slots">No available appointments for this date. Please select another date.</p>';
            return;
        }

        const slotsHTML = slots.map(slot => `
            <button type="button" 
                    class="time-slot ${slot.available ? '' : 'unavailable'}" 
                    data-time="${slot.time}"
                    ${!slot.available ? 'disabled' : ''}>
                ${slot.formatted}
            </button>
        `).join('');

        timeSlotsContainer.innerHTML = slotsHTML;
    }

    /**
     * Select time slot
     */
    selectTimeSlot(slotElement) {
        if (slotElement.disabled) return;

        // Remove selection from other slots
        const allSlots = document.querySelectorAll('.time-slot');
        allSlots.forEach(slot => slot.classList.remove('selected'));

        // Select current slot
        slotElement.classList.add('selected');
        this.selectedTime = slotElement.dataset.time;
    }

    /**
     * Display confirmation details
     */
    displayConfirmation() {
        const confirmationDetails = document.getElementById('confirmationDetails');
        if (!confirmationDetails) return;

        const appointmentDate = new Date(this.selectedDate);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const timeSlot = this.selectedTime;
        const [hour, minute] = timeSlot.split(':');
        const formattedTime = this.formatTime(parseInt(hour), parseInt(minute));

        const confirmationHTML = `
            <div class="detail-row">
                <span class="detail-label">Patient Name:</span>
                <span class="detail-value">${this.formData.firstName} ${this.formData.lastName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${this.formData.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${this.formData.phone}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${formattedTime}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Type:</span>
                <span class="detail-value">${this.formData.appointmentType || 'General Consultation'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Department:</span>
                <span class="detail-value">${this.formData.department || 'General Medicine'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Reason:</span>
                <span class="detail-value">${this.formData.reasonForVisit}</span>
            </div>
        `;

        confirmationDetails.innerHTML = confirmationHTML;

        // Generate confirmation number
        const confirmationNumber = this.generateConfirmationNumber();
        this.formData.confirmationNumber = confirmationNumber;

        // Add confirmation number to display
        const confirmationNumberDisplay = document.getElementById('confirmationNumberDisplay');
        if (confirmationNumberDisplay) {
            confirmationNumberDisplay.textContent = `Confirmation #: ${confirmationNumber}`;
        }
    }

    /**
     * Generate a new sequential appointment number for the day.
     * Resets to 1 if the date is different from the last appointment.
     */
    generateConfirmationNumber() {
        const today = new Date().toDateString();

        if (this.lastAppointmentDate !== today) {
            // New day, reset the counter
            this.appointmentNumberCounter = 1;
            this.lastAppointmentDate = today;
        } else {
            // Same day, increment the counter
            this.appointmentNumberCounter++;
        }

        return this.appointmentNumberCounter;
    }

    /**
     * Handle form submission
     */
    handleFormSubmission() {
        // This would typically send data to a server
        console.log('Appointment booked:', this.formData);

        // Show success message
        this.showNotification('Appointment booked successfully!', 'success');
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const formFields = document.querySelectorAll('input, select, textarea');

        formFields.forEach(field => {
            // Real-time validation on blur
            field.addEventListener('blur', () => {
                this.validateFieldRealTime(field);
            });

            // Clear error on input
            field.addEventListener('input', () => {
                const formGroup = field.closest('.form-group');
                if (formGroup.classList.contains('error')) {
                    formGroup.classList.remove('error');
                    const errorDiv = formGroup.querySelector('.error-message');
                    if (errorDiv) {
                        errorDiv.classList.remove('show');
                    }
                }
            });
        });
    }

    /**
     * Real-time field validation
     */
    validateFieldRealTime(field) {
        const formGroup = field.closest('.form-group');

        if (field.value.trim() && this.validateField(field)) {
            formGroup.classList.add('success');
            formGroup.classList.remove('error');
        }
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

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
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
}

/**
 * Simple Calendar Component for Appointment Booking
 */
class AppointmentCalendar {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            onDateSelect: options.onDateSelect || (() => { }),
            minDate: options.minDate || new Date(),
            maxDate: options.maxDate || null,
            ...options
        };

        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.selectedDate = null;

        if (this.container) {
            this.render();
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="calendar-header">
                <button type="button" class="calendar-nav-btn" id="prevMonth">&lt;</button>
                <span class="calendar-month" id="currentMonth">${this.getMonthName(this.currentMonth)} ${this.currentYear}</span>
                <button type="button" class="calendar-nav-btn" id="nextMonth">&gt;</button>
            </div>
            <div class="calendar-grid" id="calendarGrid">
                ${this.generateCalendarGrid()}
            </div>
        `;

        this.setupCalendarEventListeners();
    }

    setupCalendarEventListeners() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousMonth();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextMonth();
            });
        }

        // Date selection
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-day') && !e.target.classList.contains('disabled')) {
                this.selectDate(e.target);
            }
        });
    }

    generateCalendarGrid() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let html = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        // Add calendar days
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 41); // 6 weeks

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const isCurrentMonth = date.getMonth() === this.currentMonth;
            const isToday = this.isToday(date);
            const isDisabled = this.isDateDisabled(date);
            const isSelected = this.isDateSelected(date);

            const classes = ['calendar-day'];
            if (!isCurrentMonth) classes.push('other-month');
            if (isToday) classes.push('today');
            if (isDisabled) classes.push('disabled');
            if (isSelected) classes.push('selected');

            html += `<div class="${classes.join(' ')}" data-date="${date.toISOString().split('T')[0]}">${date.getDate()}</div>`;
        }

        return html;
    }

    selectDate(dayElement) {
        // Remove previous selection
        const previousSelected = this.container.querySelector('.calendar-day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Select new date
        dayElement.classList.add('selected');
        const dateString = dayElement.getAttribute('data-date');
        this.selectedDate = new Date(dateString);

        // Trigger callback
        this.options.onDateSelect(this.selectedDate);
    }

    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.updateCalendar();
    }

    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.updateCalendar();
    }

    updateCalendar() {
        document.getElementById('currentMonth').textContent = `${this.getMonthName(this.currentMonth)} ${this.currentYear}`;
        document.getElementById('calendarGrid').innerHTML = this.generateCalendarGrid();
    }

    getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isDateDisabled(date) {
        if (this.options.minDate && date < this.options.minDate) {
            return true;
        }
        if (this.options.maxDate && date > this.options.maxDate) {
            return true;
        }
        return false;
    }

    isDateSelected(date) {
        return this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
    }
}

// Global functions for button onclick handlers
function nextStep(step) {
    if (window.appointmentBooking) {
        window.appointmentBooking.nextStep(step);
    }
}

function prevStep(step) {
    if (window.appointmentBooking) {
        window.appointmentBooking.prevStep(step);
    }
}

function toggleInsuranceFields() {
    if (window.appointmentBooking) {
        window.appointmentBooking.toggleInsuranceFields();
    }
}

function printConfirmation() {
    window.print();
}

// Initialize appointment booking when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.appointmentBooking = new AppointmentBooking();
});
