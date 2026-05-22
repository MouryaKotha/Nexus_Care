/**
 * Nexus Global Navigation Logic
 * Auto-scaffolds sidebar on any page that loads this script.
 */

class NexusNavigation {
    constructor() {
        this.modules = [
            { id: 'dashboard', label: 'Dashboard', url: 'dashboard.html', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', group: 'main' },
            { id: 'appointment', label: 'Book Appointment', url: 'appointment.html', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', group: 'main' },
            { id: 'pharmacy', label: 'Pharmacy', url: 'pharmacy.html', icon: 'M3 12h18M3 6h18M3 18h18', group: 'main' },
            { id: 'blood', label: 'Blood Donation', url: 'blooddonar.html', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', group: 'main' },
            { id: 'mentor', label: 'AI Mentor', url: 'ai-mentor.html', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', group: 'main' },
            { id: 'symptoms', label: 'AI Symptoms', url: 'aisymtom.html', icon: 'M22 12h-4l-3 9L9 3l-3 9H2', group: 'main' },
            { id: 'translate', label: 'MediTranslate', url: 'meditranslate.html', icon: 'M5 8l6 6 6-6', group: 'main' },
            { id: 'reminder', label: 'Reminder', url: 'reminder.html', icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', group: 'main' },
            { id: 'family', label: 'Family Ecosystem', url: 'family-sync.html', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', group: 'main' },
            { id: 'blog', label: 'Health Blog', url: 'blog.html', icon: 'M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l4 4v10a2 2 0 0 1-2 2z M14 4v4h4', group: 'secondary' },
            { id: 'wellness', label: 'Wellness Mentor', url: 'wellness-mentor.html', icon: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z', group: 'secondary' },
            { id: 'vault', label: 'Health Vault', url: 'health-vault.html', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', group: 'secondary' },
            { id: 'community', label: 'Community Hub', url: 'community-hub.html', icon: 'M12 15l-3-3h6l-3 3z M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z', group: 'secondary' }
        ];

        this.init();
    }

    init() {
        this.ensureScaffold();
        this.renderSidebar();
        this.setupEventListeners();
    }

    ensureScaffold() {
        const body = document.body;

        // Add with-sidebar class to body so navigation.css rules apply
        body.classList.add('with-sidebar');

        // Create sidebar element if it doesn't exist
        let sidebar = document.getElementById('sidebar');
        if (!sidebar) {
            sidebar = document.createElement('aside');
            sidebar.id = 'sidebar';
            sidebar.className = 'sidebar';
            body.insertBefore(sidebar, body.firstChild);
        }

        // Create Mobile Overlay
        let overlay = document.getElementById('sidebarOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'sidebarOverlay';
            overlay.className = 'sidebar-overlay';
            body.insertBefore(overlay, body.firstChild);
        }

        // Validate Main Wrapper
        let main = document.getElementById('mainContent');
        if (!main) {
            main = document.querySelector('main');
            if (main) {
                main.id = 'mainContent';
            } else {
                main = document.createElement('main');
                main.id = 'mainContent';
                // Move everything else into main
                Array.from(body.children).forEach(child => {
                    if (child !== sidebar && child !== overlay && child.tagName !== 'SCRIPT') {
                        main.appendChild(child);
                    }
                });
                body.insertBefore(main, Array.from(body.children).find(c => c.tagName === 'SCRIPT'));
            }
        }
    }

    renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        let html = `
            <div class="sidebar-header">
                <button class="sidebar-toggle" id="sidebarToggle" title="Toggle Sidebar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div class="nav-logo">
                    <span class="logo-text">Nexus Modules</span>
                </div>
            </div>
            <nav class="sidebar-nav">
        `;

        let currentGroup = 'main';

        this.modules.forEach(mod => {
            if (mod.group !== currentGroup) {
                html += `<div class="sidebar-divider"></div>`;
                currentGroup = mod.group;
            }

            const isActive = currentPath === mod.url;
            html += `
                <a href="${mod.url}" class="sidebar-link ${isActive ? 'active' : ''}">
                    <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="${mod.icon}" /></svg>
                    <span class="sidebar-label">${mod.label}</span>
                </a>
            `;
        });

        html += `</nav>`;
        sidebar.innerHTML = html;
    }

    setupEventListeners() {
        const toggleSidebarBtn = document.getElementById('sidebarToggle');
        const overlay = document.getElementById('sidebarOverlay');

        const toggleSidebar = () => {
            if (window.innerWidth <= 1024) {
                document.body.classList.toggle('sidebar-mobile-open');
                overlay.classList.toggle('active');
            } else {
                const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
                sessionStorage.setItem('nexus_sidebar_collapsed', isCollapsed ? '1' : '0');
            }
        };

        if (toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', toggleSidebar);

        // Bind Navbar to AuthStore
        window.addEventListener('authStateChanged', () => this.updateNavbar());
        this.updateNavbar();

        setTimeout(() => {
            const navbarToggle = document.querySelector('.navbar .sidebar-toggle, #sidebarToggleGlobal');
            if (navbarToggle) navbarToggle.addEventListener('click', toggleSidebar);
        }, 100);

        if (overlay) {
            overlay.addEventListener('click', () => {
                document.body.classList.remove('sidebar-mobile-open');
                overlay.classList.remove('active');
            });
        }

        if (window.innerWidth > 1024 && sessionStorage.getItem('nexus_sidebar_collapsed') === '1') {
            document.body.classList.add('sidebar-collapsed');
        }
    }

    updateNavbar() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        const isAuthenticated = window.authStore && window.authStore.isAuthenticated();
        const user = window.authStore ? window.authStore.getUser() : null;

        if (isAuthenticated && user) {
            const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`;
            navActions.innerHTML = `
                <div class="flex items-center gap-4">
                    <!-- Notifications -->
                    <div class="relative group" id="notificationBellContainer">
                        <button class="p-2 text-gray-500 hover:text-blue-600 transition rounded-xl hover:bg-blue-50 flex items-center justify-center relative">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                            <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>

                    <!-- Animated Profile Dropdown -->
                    <div class="relative group" id="profileDropdownContainer">
                        <button class="flex items-center gap-2 p-1 pr-3 bg-white rounded-full border border-slate-200 hover:border-blue-300 transition shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-100">
                            <div class="relative">
                                <img src="${avatarUrl}" alt="${user.name}" class="w-9 h-9 rounded-full object-cover border border-white shadow-sm">
                                <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div class="hidden md:flex flex-col text-left">
                                <span class="text-sm font-bold text-gray-900 leading-tight">${user.name}</span>
                                <span class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">${user.role}</span>
                            </div>
                            <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div class="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 origin-top-right z-[100]">
                            <div class="p-4 bg-gradient-to-br from-blue-600 to-blue-500 text-white">
                                <p class="text-xs text-blue-100 font-medium mb-0.5">Signed in as</p>
                                <p class="text-sm font-bold truncate">${user.email}</p>
                            </div>
                            <div class="p-2 space-y-1">
                                <a href="dashboard.html" class="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> Dashboard</a>
                                <a href="profile.html" class="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> My Profile</a>
                                <a href="appointment.html" class="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> Appointments</a>
                            </div>
                            <div class="h-px bg-slate-100 mx-3 my-1"></div>
                            <div class="p-2 space-y-1">
                                <a href="settings.html" class="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-700 rounded-xl hover:bg-slate-50 transition"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> Settings</a>
                                <button onclick="window.authStore.logout()" class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> Sign Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            navActions.innerHTML = `
                <a href="login.html" class="text-gray-600 hover:text-blue-600 font-bold transition text-sm">Log in</a>
                <a href="login.html?mode=signup" class="btn px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all">Join Free</a>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.nexusNav = new NexusNavigation();
});
