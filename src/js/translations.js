class LanguageManager {
    constructor() {
        this.translations = {};
        this.currentLang = this.detectLanguage();
        this.ttsEnabled = false;
        this.largeTextEnabled = localStorage.getItem('nexus-care-large-text') === 'true';
        this.init();
    }

    detectLanguage() {
        const savedLang = localStorage.getItem('nexus-care-lang');
        if (savedLang) return savedLang;

        // Auto-detect browser language on first visit
        const browserLang = navigator.language || navigator.userLanguage || "en";
        if (browserLang.startsWith('te')) return 'te';
        if (browserLang.startsWith('hi')) return 'hi';
        return 'en';
    }

    async init() {
        if (this.largeTextEnabled) {
            document.body.classList.add('large-text-mode');
        }

        await this.loadTranslations(this.currentLang);

        const setupUI = () => {
            this.applyTranslations();
            this.setupModernDropdown();
            this.setupAccessibilityHUD();
            this.attachTTSListeners();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupUI);
        } else {
            setupUI();
        }
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`public/lang/${lang}.json`);
            if (!response.ok) throw new Error("Translation file not found.");
            this.translations = await response.json();

            this.currentLang = lang;
            localStorage.setItem('nexus-care-lang', lang);
            this.applyTranslations();
            this.updateDropdownUI();
        } catch (error) {
            console.error("Error loading translations:", error);
            // Fallback gracefully (don't break the page)
        }
    }

    setLanguage(lang) {
        if (this.currentLang !== lang) {
            this.loadTranslations(lang);
        }
    }

    applyTranslations() {
        if (!this.translations || Object.keys(this.translations).length === 0) return;

        const elements = document.querySelectorAll('[data-i18n], [data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n') || el.getAttribute('data-translate');
            if (this.translations[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.getAttribute('placeholder')) {
                        el.setAttribute('placeholder', this.translations[key]);
                    } else if (el.type === 'button' || el.type === 'submit') {
                        el.value = this.translations[key];
                    }
                } else {
                    el.textContent = this.translations[key];
                }
            }
        });

        // Update font for specific languages
        if (this.currentLang === 'te' || this.currentLang === 'hi') {
            document.body.classList.add('non-latin-font');
        } else {
            document.body.classList.remove('non-latin-font');
        }
    }

    setupModernDropdown() {
        const containers = document.querySelectorAll('.nav-actions');

        containers.forEach(container => {
            // Remove any existing standard select
            const oldSelect = container.querySelector('.lang-selector');
            if (oldSelect && oldSelect.tagName === 'SELECT') {
                oldSelect.remove();
            }

            if (container.querySelector('.modern-lang-dropdown')) return;

            const dropdownHtml = `
                <div class="modern-lang-dropdown" style="position: relative; display: inline-block;">
                    <button class="lang-dropdown-btn glassmorphic" style="display: flex; items: center; gap: 8px; padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid rgba(30, 136, 229, 0.3); background: rgba(255,255,255,0.7); cursor: pointer; font-weight: 500;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span class="current-lang-text">${this.getLangName(this.currentLang)}</span>
                        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
                    </button>
                    <div class="lang-dropdown-content" style="position: absolute; top: 110%; right: 0; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; opacity: 0; pointer-events: none; transform: translateY(-10px); transition: all 0.3s ease; z-index: 100; min-width: 120px;">
                        <button class="lang-option" data-value="en" style="width: 100%; text-align: left; padding: 0.75rem 1rem; border: none; background: none; cursor: pointer; font-weight: 500; transition: background 0.2s;">English</button>
                        <button class="lang-option" data-value="te" style="width: 100%; text-align: left; padding: 0.75rem 1rem; border: none; background: none; cursor: pointer; font-weight: 500; transition: background 0.2s;">తెలుగు</button>
                        <button class="lang-option" data-value="hi" style="width: 100%; text-align: left; padding: 0.75rem 1rem; border: none; background: none; cursor: pointer; font-weight: 500; transition: background 0.2s;">हिन्दी</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('afterbegin', dropdownHtml);

            const dropdownWrapper = container.querySelector('.modern-lang-dropdown');
            const btn = dropdownWrapper.querySelector('.lang-dropdown-btn');
            const content = dropdownWrapper.querySelector('.lang-dropdown-content');
            const options = dropdownWrapper.querySelectorAll('.lang-option');

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = content.style.opacity === '1';
                if (isOpen) {
                    content.style.opacity = '0';
                    content.style.pointerEvents = 'none';
                    content.style.transform = 'translateY(-10px)';
                    btn.querySelector('.chevron').style.transform = 'rotate(0deg)';
                } else {
                    document.querySelectorAll('.lang-dropdown-content').forEach(c => {
                        c.style.opacity = '0';
                        c.style.pointerEvents = 'none';
                        c.style.transform = 'translateY(-10px)';
                    });
                    content.style.opacity = '1';
                    content.style.pointerEvents = 'auto';
                    content.style.transform = 'translateY(0)';
                    btn.querySelector('.chevron').style.transform = 'rotate(180deg)';
                }
            });

            options.forEach(opt => {
                opt.addEventListener('mouseenter', () => opt.style.background = '#f0f4f8');
                opt.addEventListener('mouseleave', () => opt.style.background = 'none');
                opt.addEventListener('click', (e) => {
                    const selectedLang = e.target.getAttribute('data-value');
                    this.setLanguage(selectedLang);
                    content.style.opacity = '0';
                    content.style.pointerEvents = 'none';
                    content.style.transform = 'translateY(-10px)';
                    btn.querySelector('.chevron').style.transform = 'rotate(0deg)';
                });
            });

            document.addEventListener('click', () => {
                content.style.opacity = '0';
                content.style.pointerEvents = 'none';
                content.style.transform = 'translateY(-10px)';
                btn.querySelector('.chevron').style.transform = 'rotate(0deg)';
            });
        });
    }

    updateDropdownUI() {
        document.querySelectorAll('.current-lang-text').forEach(el => {
            el.textContent = this.getLangName(this.currentLang);
        });
    }

    getLangName(langCode) {
        if (langCode === 'te') return 'తెలుగు';
        if (langCode === 'hi') return 'हिन्दी';
        return 'English';
    }

    setupAccessibilityHUD() {
        if (document.getElementById('access-hud')) return;

        const hudHtml = `
            <div id="access-hud" class="glassmorphic" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; padding: 10px; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                <button id="btn-toggle-tts" title="Voice Read-Out Mode" style="width: 45px; height: 45px; border-radius: 50%; border: none; background: ${this.ttsEnabled ? '#1E88E5' : 'white'}; color: ${this.ttsEnabled ? 'white' : '#1E88E5'}; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
                <button id="btn-toggle-large-text" title="Large Text Mode" style="width: 45px; height: 45px; border-radius: 50%; border: none; background: ${this.largeTextEnabled ? '#1E88E5' : 'white'}; color: ${this.largeTextEnabled ? 'white' : '#1E88E5'}; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-weight: bold; font-size: 18px; display: flex; align-items: center; justify-content: center;">
                    A+
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', hudHtml);

        document.getElementById('btn-toggle-tts').addEventListener('click', (e) => {
            this.ttsEnabled = !this.ttsEnabled;
            e.currentTarget.style.background = this.ttsEnabled ? '#1E88E5' : 'white';
            e.currentTarget.style.color = this.ttsEnabled ? 'white' : '#1E88E5';

            if (this.ttsEnabled) {
                this.speak(this.translations['mt_analyzing'] || "Read aloud mode enabled.");
            } else {
                window.speechSynthesis.cancel();
            }
        });

        document.getElementById('btn-toggle-large-text').addEventListener('click', (e) => {
            this.largeTextEnabled = !this.largeTextEnabled;
            localStorage.setItem('nexus-care-large-text', this.largeTextEnabled);
            e.currentTarget.style.background = this.largeTextEnabled ? '#1E88E5' : 'white';
            e.currentTarget.style.color = this.largeTextEnabled ? 'white' : '#1E88E5';

            if (this.largeTextEnabled) {
                document.body.classList.add('large-text-mode');
            } else {
                document.body.classList.remove('large-text-mode');
            }
        });
    }

    attachTTSListeners() {
        document.addEventListener('click', (e) => {
            if (!this.ttsEnabled) return;

            // Check if clicked element or parent has translation
            const target = e.target.closest('[data-i18n], [data-translate]');
            if (target) {
                const key = target.getAttribute('data-i18n') || target.getAttribute('data-translate');
                if (this.translations[key]) {
                    this.speak(this.translations[key]);
                } else if (target.textContent) {
                    this.speak(target.textContent);
                }
            }
        });
    }

    speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // Stop current speaking

        const utterance = new SpeechSynthesisUtterance(text);

        let targetLangCode = "en-US";
        if (this.currentLang === 'te') targetLangCode = "te-IN";
        if (this.currentLang === 'hi') targetLangCode = "hi-IN";

        utterance.lang = targetLangCode;

        // Find best voice
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(this.currentLang)) || voices[0];
        if (voice) utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
    }
}

// Initialize the language manager and expose it globally
window.languageManager = new LanguageManager();
window.applyTranslations = () => window.languageManager.applyTranslations();
