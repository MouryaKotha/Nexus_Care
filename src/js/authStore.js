/**
 * AuthStore: Centralized Authentication State Manager
 * Emits 'authStateChanged' event globally when auth state updates.
 */
class AuthStore {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('nexus_user') || 'null');
        this.token = localStorage.getItem('nexus_token') || null;
        this.refreshToken = localStorage.getItem('nexus_refresh_token') || null;
        
        // Listen to storage events to sync across tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'nexus_user' || e.key === 'nexus_token') {
                this.syncFromStorage();
            }
        });
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
            name: `${data.firstName} ${data.lastName}`.trim(),
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
        // Optional: call backend to revoke refresh token
        if (this.token) {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });
            } catch (err) {
                console.warn('Backend logout failed', err);
            }
        }

        this.user = null;
        this.token = null;
        this.refreshToken = null;
        
        localStorage.removeItem('nexus_user');
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_refresh_token');
        
        this.notify();
        window.location.href = 'login.html';
    }

    notify() {
        const event = new CustomEvent('authStateChanged', {
            detail: { isAuthenticated: this.isAuthenticated(), user: this.user }
        });
        window.dispatchEvent(event);
    }
}

// Global Singleton
window.authStore = new AuthStore();
