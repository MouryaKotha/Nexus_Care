/**
 * AI Mentor - Static Healthcare Assistant for Elderly Patients
 * Provides rule-based empathetic responses and health reminders
 */

class AIMentor {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('mentorInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.isTyping = false;
        this.init();
    }

    init() {
        if (!this.chatMessages || !this.userInput) return;

        this.sendBtn.addEventListener('click', () => this.handleUserMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });

        this.micBtn = document.getElementById('micBtn');
        if (this.micBtn) {
            this.micBtn.addEventListener('click', () => this.toggleSpeechRecognition());
        }

        // Initialize Speech Recognition
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (this.SpeechRecognition) {
            this.recognition = new this.SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            
            this.recognition.onstart = () => {
                this.micBtn.classList.add('listening');
                this.userInput.placeholder = "Listening...";
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.userInput.value = transcript;
                this.handleUserMessage(); // Auto-send
            };
            
            this.recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                this.resetMicUI();
            };
            
            this.recognition.onend = () => {
                this.resetMicUI();
            };
        } else {
            if(this.micBtn) this.micBtn.style.display = 'none'; // Hide if not supported
        }

        // Initial welcome message
        setTimeout(() => {
            this.addMessage("Hello there! I'm your Nexus Care AI Mentor. How can I help you improve your health and wellness today?", 'ai');
        }, 500);

        // Setup quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isTyping) return;
                const text = btn.innerText.trim();
                this.userInput.value = text;
                this.handleUserMessage();
            });
        });
    }

    resetMicUI() {
        if(this.micBtn) {
            this.micBtn.classList.remove('listening');
            this.userInput.placeholder = "Type or speak a message here...";
        }
    }

    toggleSpeechRecognition() {
        if (!this.recognition) return;
        
        if (this.micBtn.classList.contains('listening')) {
            this.recognition.stop();
        } else {
            // Set language dynamically
            const lang = localStorage.getItem('nexus-care-lang') || 'en';
            if (lang === 'te') this.recognition.lang = 'te-IN';
            else if (lang === 'hi') this.recognition.lang = 'hi-IN';
            else this.recognition.lang = 'en-US';
            
            this.recognition.start();
        }
    }

    async handleUserMessage() {
        if (this.isTyping) return;
        const text = this.userInput.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.userInput.value = '';
        this.isTyping = true;
        
        const loadingId = this.addLoadingIndicator();

        try {
            const token = localStorage.getItem('nexus_token');
            if (!token) {
                this.removeLoadingIndicator(loadingId);
                this.addMessage("Please log in to use the AI Mentor.", 'ai');
                this.isTyping = false;
                return;
            }

            const lang = localStorage.getItem('nexus-care-lang') || 'en';

            const response = await fetch('/api/ai/mentor', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: text, lang })
            });

            const data = await response.json();
            this.removeLoadingIndicator(loadingId);

            if (response.ok) {
                this.typeMessage(data.reply || data.analysis, 'ai');
            } else {
                this.addMessage(data.message || data.error || "Sorry, I couldn't process that right now.", 'ai');
                this.isTyping = false;
            }
        } catch (error) {
            this.removeLoadingIndicator(loadingId);
            this.addMessage("Network error. Please try again later.", 'ai');
            this.isTyping = false;
        }
    }

    addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        this.chatMessages.appendChild(msgDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        return msgDiv;
    }

    typeMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        this.chatMessages.appendChild(msgDiv);
        
        // Convert markdown basics (bold) to HTML for typing
        let htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        htmlText = htmlText.replace(/\n/g, '<br>');

        let i = 0;
        const speed = 15; // ms per char
        
        const typeWriter = () => {
            if (i < htmlText.length) {
                // simple html tag skipper
                if(htmlText.charAt(i) === '<') {
                    let tag = '';
                    while(htmlText.charAt(i) !== '>' && i < htmlText.length) {
                        tag += htmlText.charAt(i);
                        i++;
                    }
                    tag += '>';
                    msgDiv.innerHTML += tag;
                } else {
                    msgDiv.innerHTML += htmlText.charAt(i);
                }
                i++;
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
                setTimeout(typeWriter, speed);
            } else {
                this.isTyping = false;
            }
        };
        typeWriter();
    }

    addLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = `message ai`;
        msgDiv.innerHTML = `<span class="loading-dots">Thinking</span>`;
        this.chatMessages.appendChild(msgDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        return id;
    }

    removeLoadingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AIMentor();
});
