window.API_BASE_URL = (() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return window.location.port === '5005' ? '' : 'http://localhost:5005';
    }
    if (window.location.protocol === 'file:') {
        return 'http://localhost:5005';
    }
    return ''; // Production relative paths
})();

class AuthStore {
    constructor() {
        this.isLoading = true;
        this.user = JSON.parse(localStorage.getItem('nexus_user') || 'null');
        this.token = localStorage.getItem('nexus_token') || null;
        this.refreshToken = localStorage.getItem('nexus_refresh_token') || null;
        
        window.addEventListener('storage', (e) => {
            if (e.key === 'nexus_user' || e.key === 'nexus_token') {
                this.syncFromStorage();
            }
        });

        // Auto-hydrate and validate on load
        if (this.token) {
            this.initSession();
        } else {
            this.isLoading = false;
        }
    }

    async initSession() {
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/auth/profile`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            if (res.ok) {
                const freshUser = await res.json();
                // Merge tokens and fresh data
                this.setSession({ ...freshUser, token: this.token, refreshToken: this.refreshToken });
            } else {
                // Token genuinely invalid or expired
                this.logout();
            }
        } catch (err) {
            // Network error. Do NOT logout user! Rely on existing cached session.
            console.warn('Network error during session validation. Retaining cached session.', err);
        } finally {
            this.isLoading = false;
            this.notify();
        }
    }

    syncFromStorage() {
        this.user = JSON.parse(localStorage.getItem('nexus_user') || 'null');
        this.token = localStorage.getItem('nexus_token') || null;
        this.refreshToken = localStorage.getItem('nexus_refresh_token') || null;
        this.notify();
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getUser() {
        return this.user;
    }

    setSession(data) {
        this.user = {
            _id: data._id,
            firstName: data.firstName,
            lastName: data.lastName,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            email: data.email,
            role: data.role,
            avatar: data.avatar
        };
        this.token = data.token;
        this.refreshToken = data.refreshToken;

        localStorage.setItem('nexus_user', JSON.stringify(this.user));
        localStorage.setItem('nexus_token', this.token);
        if (this.refreshToken) {
            localStorage.setItem('nexus_refresh_token', this.refreshToken);
        }

        this.notify();
    }

    async logout() {
        if (this.token) {
            try {
                await fetch(`${window.API_BASE_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });
            } catch (err) {}
        }
        this.user = null;
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('nexus_user');
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_refresh_token');
        this.notify();
        window.location.href = 'index.html';
    }

    notify() {
        window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { isAuthenticated: this.isAuthenticated(), user: this.user }
        }));
    }
}

window.authStore = new AuthStore();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorBox = document.getElementById('authError');
    const API_URL = `${window.API_BASE_URL}/api/auth`;

    const showError = (msg) => {
        if(errorBox) {
            errorBox.textContent = msg;
            errorBox.classList.remove('hidden');
        } else {
            alert(msg);
        }
    };

    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            // UI Loading state
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Signing in...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if(res.ok) {
                    window.authStore.setSession(data);
                    window.location.href = 'dashboard.html';
                } else {
                    showError(data.message || 'Login failed');
                }
            } catch (err) {
                showError('Network error. Is backend running?');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    if(registerForm) {
        // existing register logic
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Gather all possible fields
            const payload = {
                firstName: document.getElementById('regFirstName')?.value,
                lastName: document.getElementById('regLastName')?.value || '',
                email: document.getElementById('regEmail')?.value.trim(),
                password: document.getElementById('regPassword')?.value.trim(),
                role: document.getElementById('regRole')?.value || 'patient',
                phoneNumber: document.getElementById('regPhone')?.value,
                gender: document.getElementById('regGender')?.value,
                dateOfBirth: document.getElementById('regDob')?.value,
                bloodGroup: document.getElementById('regBloodGroup')?.value,
            };

            if (payload.password !== document.getElementById('regConfirmPassword')?.value) {
                return showError("Passwords do not match");
            }

            const btn = registerForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Creating Account...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                
                if(res.ok) {
                    window.authStore.setSession(data);
                    window.location.href = 'dashboard.html';
                } else {
                    showError(data.message || 'Registration failed');
                }
            } catch (err) {
                showError('Network error. Is backend running?');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value.trim();
            const newPassword = document.getElementById('resetNewPassword').value.trim();
            
            const errBox = document.getElementById('resetError');
            const successBox = document.getElementById('resetSuccess');
            const btn = resetPasswordForm.querySelector('button[type="submit"]');
            
            errBox.classList.add('hidden');
            successBox.classList.add('hidden');
            
            if (newPassword.length < 8) {
                errBox.textContent = "Password must be at least 8 characters.";
                errBox.classList.remove('hidden');
                return;
            }

            const originalText = btn.innerHTML;
            btn.innerHTML = 'Resetting...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_URL}/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, newPassword })
                });
                const data = await res.json();
                
                if (res.ok) {
                    successBox.textContent = "Password reset successfully! You can now log in.";
                    successBox.classList.remove('hidden');
                    resetPasswordForm.reset();
                    // Close modal after 3 seconds
                    setTimeout(() => {
                        document.getElementById('forgotPasswordModal').classList.add('hidden');
                        successBox.classList.add('hidden');
                    }, 3000);
                } else {
                    errBox.textContent = data.message || 'Failed to reset password';
                    errBox.classList.remove('hidden');
                }
            } catch (err) {
                errBox.textContent = 'Network error. Backend not reachable.';
                errBox.classList.remove('hidden');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }
});

// Backward compatibility helpers
window.checkAuthState = () => window.authStore.getUser();
window.logout = () => window.authStore.logout();
