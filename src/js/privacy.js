class PrivacyManager {
    constructor() {
        this.modal = document.getElementById('confirmationModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.confirmBtn = document.getElementById('confirmDeleteBtn');
        this.currentAction = null;
        this.toastContainer = document.getElementById('toast-container');
        
        // Toggles
        this.analyticsToggle = document.getElementById('analyticsToggle');
        this.speechToggle = document.getElementById('speechToggle');
        
        this.deletionConfigs = {
            'ai-mentor': {
                title: 'Delete AI Mentor Data?',
                body: 'This will permanently delete your stored AI Mentor conversations and speech metrics. Raw audio is never stored.',
                endpoint: '/api/privacy/ai-mentor'
            },
            'health-vault': {
                title: 'Delete Health Vault Data?',
                body: 'This will permanently delete your uploaded medical records and metadata.',
                endpoint: '/api/privacy/health-vault'
            },
            'community': {
                title: 'Delete Community Data?',
                body: 'This will remove your posts and interactions from the community hub.',
                endpoint: '/api/privacy/community'
            },
            'all': {
                title: 'Delete all personal data?',
                body: 'This action permanently removes your stored Nexus Care data and cannot be undone.',
                endpoint: '/api/privacy/all',
                btnText: 'Delete Everything'
            }
        };

        // Bind events
        this.confirmBtn.addEventListener('click', () => this.executeDeletion());
        if (this.analyticsToggle) {
            this.analyticsToggle.addEventListener('change', () => this.updateSettings());
        }
        if (this.speechToggle) {
            this.speechToggle.addEventListener('change', () => this.updateSettings());
        }
    }

    async loadSettings() {
        try {
            const token = window.authStore?.token;
            if (!token) return;
            
            const apiUrl = (window.API_BASE_URL || '') + '/api/privacy/settings';
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const settings = await response.json();
                if (this.analyticsToggle) this.analyticsToggle.checked = settings.analyticsEnabled;
                if (this.speechToggle) this.speechToggle.checked = settings.speechDataEnabled;
            }
        } catch (error) {
            console.error('Failed to load privacy settings', error);
        }
    }

    async updateSettings() {
        try {
            const token = window.authStore?.token;
            if (!token) return;

            const apiUrl = (window.API_BASE_URL || '') + '/api/privacy/settings';
            await fetch(apiUrl, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    analyticsEnabled: this.analyticsToggle?.checked ?? true,
                    speechDataEnabled: this.speechToggle?.checked ?? true
                })
            });
            this.showToast('Privacy settings updated', 'success');
        } catch (error) {
            this.showToast('Failed to update settings', 'error');
        }
    }

    confirmDeletion(type) {
        const config = this.deletionConfigs[type];
        if (!config) return;

        this.currentAction = type;
        this.modalTitle.textContent = config.title;
        this.modalBody.textContent = config.body;
        this.confirmBtn.textContent = config.btnText || 'Delete Data';
        
        this.modal.classList.add('active');
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.currentAction = null;
    }

    async executeDeletion() {
        if (!this.currentAction) return;
        
        const config = this.deletionConfigs[this.currentAction];
        this.confirmBtn.disabled = true;
        this.confirmBtn.textContent = 'Deleting...';

        try {
            const token = window.authStore?.token;
            if (!token) throw new Error('Unauthorized');

            const apiUrl = (window.API_BASE_URL || '') + config.endpoint;
            
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.showToast('Your data has been deleted successfully.', 'success');
            } else {
                this.showToast('Unable to delete your data right now. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Deletion error:', error);
            this.showToast('Unable to delete your data right now. Please try again.', 'error');
        } finally {
            this.confirmBtn.disabled = false;
            this.closeModal();
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Wait for auth verification
    setTimeout(() => {
        const user = window.authStore?.getUser();
        if (!user) {
            window.location.href = 'login.html';
        } else {
            window.privacyManager = new PrivacyManager();
            window.privacyManager.loadSettings();
        }
    }, 100);
});
