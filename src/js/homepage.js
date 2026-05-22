// Homepage JavaScript Functionality

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedArticles();
});

async function loadFeaturedArticles() {
    const grid = document.getElementById('featuredArticles');
    if (!grid) return;

    try {
        const res = await fetch('/api/blog');
        let articles = await res.json();

        if (!Array.isArray(articles) || articles.length === 0) {
            articles = [
                { title: 'The Future of AI in Healthcare', category: 'Medical news', image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400', readTime: '5 min' },
                { title: 'Gut Health & Mental Well-being', category: 'Nutrition', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', readTime: '6 min' },
                { title: 'Managing Stress Naturally', category: 'Wellness', image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', readTime: '4 min' }
            ];
        }

        grid.innerHTML = articles.slice(0, 3).map(a => `
            <div class="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 group hover:shadow-2xl transition duration-500">
                <div class="h-56 overflow-hidden">
                    <img src="${a.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                </div>
                <div class="p-8">
                    <span class="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">${a.category}</span>
                    <h3 class="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition decoration-2 underline-offset-4">${a.title}</h3>
                    <div class="flex items-center justify-between pt-6 border-t border-slate-50">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">${a.readTime} Read</span>
                        <a href="blog.html" class="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Featured articles load error:', err);
    }
}

/**
 * Homepage JavaScript - Handles testimonial carousel, mobile menu, and animations
 */

class Homepage {
    constructor() {
        this.init();
    }

    init() {
        this.initCarousel();
        this.initMobileMenu();
        this.initScrollAnimations();
        this.initServiceCards();
        this.setupEventListeners();
    }

    /**
     * Initialize testimonial carousel functionality
     */
    initCarousel() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');

        if (!this.slides.length) return;

        // Auto-play carousel
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);

        // Event listeners for carousel controls
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.pauseAutoPlay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.pauseAutoPlay();
            });
        }

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.pauseAutoPlay();
            });
        });

        // Pause auto-play on hover
        const carousel = document.getElementById('testimonialsCarousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }
    }

    /**
     * Navigate to next slide
     */
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }

    /**
     * Navigate to previous slide
     */
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }

    /**
     * Navigate to specific slide
     */
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    /**
     * Update carousel display
     */
    updateCarousel() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    /**
     * Pause carousel auto-play
     */
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    /**
     * Resume carousel auto-play
     */
    resumeAutoPlay() {
        if (!this.autoPlayInterval) {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
    }

    /**
     * Initialize mobile menu functionality
     */
    initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!mobileMenuToggle || !navMenu) return;

        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');

            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu when window is resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');

        if (navMenu && mobileMenuToggle) {
            navMenu.classList.add('active');
            mobileMenuToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');

        if (navMenu && mobileMenuToggle) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Initialize scroll-based animations
     */
    initScrollAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe sections for animations
        const animatedElements = document.querySelectorAll('.services, .find-doctor, .testimonials');
        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Staggered animation for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Initialize service card interactions
     */
    initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');

        serviceCards.forEach(card => {
            // Add hover effect data
            card.addEventListener('mouseenter', () => {
                card.style.setProperty('--hover-scale', '1.02');
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--hover-scale', '1');
            });

            // Handle service link clicks
            const serviceLink = card.querySelector('.service-link');
            if (serviceLink) {
                serviceLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleServiceClick(card);
                });
            }
        });
    }

    /**
     * Handle service card click
     */
    handleServiceClick(card) {
        const serviceTitle = card.querySelector('.service-title').textContent;

        // Add visual feedback
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Show service details (placeholder functionality)
        this.showNotification(`Learn more about ${serviceTitle}`, 'info');
    }

    /**
     * Setup general event listeners
     */
    setupEventListeners() {
        // Doctor search functionality
        const doctorSearchInput = document.getElementById('doctorSearch');
        const specialtyFilter = document.getElementById('specialtyFilter');

        if (doctorSearchInput) {
            doctorSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleDoctorSearch();
                }
            });
        }

        // Emergency button functionality
        const emergencyBtns = document.querySelectorAll('.btn-outline');
        emergencyBtns.forEach(btn => {
            if (btn.textContent.toLowerCase().includes('emergency')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleEmergencyClick();
                });
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Handle doctor search
     */
    handleDoctorSearch() {
        const searchTerm = document.getElementById('doctorSearch')?.value;
        const specialty = document.getElementById('specialtyFilter')?.value;

        // Store search parameters for doctors page
        const searchParams = new URLSearchParams();
        if (searchTerm) searchParams.set('search', searchTerm);
        if (specialty) searchParams.set('specialty', specialty);

        // Navigate to doctors page with search parameters
        window.location.href = `doctors.html?${searchParams.toString()}`;
    }

    /**
     * Handle emergency button click
     */
    handleEmergencyClick() {
        const emergencyInfo = {
            phone: '(555) 911-0000',
            address: '123 Health St, Medical City, MC 12345'
        };

        this.showEmergencyModal(emergencyInfo);
    }

    /**
     * Show emergency contact modal
     */
    showEmergencyModal(info) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('emergencyModal');
        if (!modal) {
            modal = this.createEmergencyModal(info);
            document.body.appendChild(modal);
        }

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Close modal on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeEmergencyModal();
            }
        });
    }

    /**
     * Create emergency modal HTML
     */
    createEmergencyModal(info) {
        const modal = document.createElement('div');
        modal.id = 'emergencyModal';
        modal.className = 'emergency-modal';
        modal.innerHTML = `
            <div class="emergency-modal-content">
                <div class="emergency-header">
                    <h2>Emergency Contact</h2>
                    <button class="close-modal" onclick="homepage.closeEmergencyModal()">×</button>
                </div>
                <div class="emergency-info">
                    <div class="emergency-item">
                        <h3>Emergency Hotline</h3>
                        <a href="tel:${info.phone}" class="emergency-phone">${info.phone}</a>
                    </div>
                    <div class="emergency-item">
                        <h3>Emergency Department</h3>
                        <p>${info.address}</p>
                    </div>
                    <div class="emergency-notice">
                        <strong>For life-threatening emergencies, call 911 immediately.</strong>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        return modal;
    }

    /**
     * Close emergency modal
     */
    closeEmergencyModal() {
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'info' ? 'var(--primary-color)' : 'var(--success-color)'};
            color: white;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize homepage functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.homepage = new Homepage();
});

// Add CSS for emergency modal and notifications
const additionalStyles = `
    .emergency-modal.active {
        opacity: 1 !important;
    }
    
    .emergency-modal-content {
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        position: relative;
        box-shadow: var(--shadow-xl);
    }
    
    .emergency-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid var(--gray-200);
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: var(--gray-400);
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .close-modal:hover {
        background: var(--gray-100);
        color: var(--gray-600);
    }
    
    .emergency-item {
        margin-bottom: 24px;
    }
    
    .emergency-item h3 {
        color: var(--gray-900);
        margin-bottom: 8px;
    }
    
    .emergency-phone {
        color: var(--primary-color);
        font-size: 24px;
        font-weight: 700;
        text-decoration: none;
    }
    
    .emergency-phone:hover {
        text-decoration: underline;
    }
    
    .emergency-notice {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
        padding: 16px;
        border-radius: 8px;
        text-align: center;
    }
`;

// Inject additional styles
if (!document.getElementById('homepage-styles')) {
    const style = document.createElement('style');
    style.id = 'homepage-styles';
    style.textContent = additionalStyles;
    document.head.appendChild(style);
}
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
