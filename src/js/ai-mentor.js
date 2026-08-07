/**
 * AI Mentor - Static Healthcare Assistant for Elderly Patients
 * Includes a Siri-like Continuous Voice Mode
 */

class AIMentor {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('mentorInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.isTyping = false;
        
        // Siri UI Elements
        this.siriOrbContainer = document.getElementById('siriOrbContainer');
        this.siriOrbBtn = document.getElementById('siriOrbBtn');
        this.siriStatusText = document.getElementById('siriStatusText');
        
        // Voice State
        this.isContinuousVoiceMode = false;
        this.synth = window.speechSynthesis;
        this.voice = null;

        this.init();
    }

    init() {
        if (!this.chatMessages || !this.userInput) return;

        this.sendBtn.addEventListener('click', () => this.handleUserMessage());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.handleUserMessage();
                }
            }
        });

        // Setup Speech Recognition
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (this.SpeechRecognition) {
            this.recognition = new this.SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                if (this.isContinuousVoiceMode) {
                    this.setSiriState('listening', 'Listening...');
                }
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.userInput.value = transcript;
                this.handleUserMessage(); 
            };
            
            this.recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    alert("Microphone access denied. Please allow microphone permissions to use the voice assistant.");
                    this.stopContinuousMode();
                } else if (this.isContinuousVoiceMode && event.error !== 'aborted') {
                    // Try to restart if it's a minor error (e.g. no-speech)
                    setTimeout(() => {
                        if (this.isContinuousVoiceMode && !this.synth.speaking) {
                            try { this.recognition.start(); } catch(e){}
                        }
                    }, 1000);
                }
            };
            
            this.recognition.onend = () => {
                // If in continuous mode and not currently speaking the response, we should listen again
                if (this.isContinuousVoiceMode && !this.synth.speaking && !this.isTyping) {
                    try { this.recognition.start(); } catch(e){}
                }
            };

            // Setup Siri Orb Click Event
            if (this.siriOrbBtn) {
                this.siriOrbBtn.addEventListener('click', () => this.toggleContinuousMode());
            }

            // Pre-load voices
            this.loadVoices();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
            }

        } else {
            // Hide Siri orb if Speech Recognition is not supported by browser
            if (this.siriOrbContainer) this.siriOrbContainer.style.display = 'none';
        }

        // Scheduled Greetings based on time of day
        setTimeout(() => {
            const hour = new Date().getHours();
            let greeting = "Hello there! I'm your Nexus Care AI Mentor. How can I help you today?";
            
            if (hour >= 5 && hour < 12) {
                greeting = "Good morning! How did you sleep?";
            } else if (hour >= 12 && hour < 17) {
                greeting = "Have you had lunch today?";
            } else if (hour >= 17 && hour < 21) {
                greeting = "Would you like to do today's memory exercise?";
            } else {
                greeting = "Don't forget your evening medicine.";
            }

            this.addMessage(greeting, 'ai');
        }, 500);

        // Setup quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isTyping || this.isContinuousVoiceMode) return;
                // Don't auto-send Cognitive Report or Emergency
                if (btn.innerText.includes('Cognitive') || btn.innerText.includes('Emergency')) return;
                const text = btn.innerText.trim();
                this.handleUserMessage(text);
            });
        });

        // Setup quick prompts
        document.querySelectorAll('.prompt-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                if (this.isTyping || this.isContinuousVoiceMode) return;
                const text = chip.innerText.trim();
                this.handleUserMessage(text);
            });
        });
    }

    loadVoices() {
        const voices = this.synth.getVoices();
        // Try to find a natural English female voice (Google UK/US Female, Samantha, Microsoft Zira, etc.)
        this.voice = voices.find(v => (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google UK English Female')) && v.lang.startsWith('en')) 
                  || voices.find(v => v.lang.startsWith('en')) 
                  || voices[0];
    }

    toggleContinuousMode() {
        if (this.isContinuousVoiceMode) {
            this.stopContinuousMode();
        } else {
            this.startContinuousMode();
        }
    }

    startContinuousMode() {
        this.isContinuousVoiceMode = true;
        this.siriOrbContainer.classList.add('active');
        try {
            this.recognitionStartTime = Date.now();
            this.recognition.start();
        } catch(e) {
            console.log("Recognition already started");
        }
    }

    stopContinuousMode() {
        this.isContinuousVoiceMode = false;
        this.siriOrbContainer.classList.remove('active');
        this.setSiriState('idle', 'Tap to speak');
        this.recognition.stop();
        this.synth.cancel(); // Stop any ongoing speech
    }

    setSiriState(state, text) {
        if (!this.siriOrbContainer) return;
        
        // Remove all states
        this.siriOrbContainer.classList.remove('listening', 'speaking');
        
        if (state !== 'idle') {
            this.siriOrbContainer.classList.add(state);
        }
        
        if (this.siriStatusText) {
            this.siriStatusText.textContent = text;
        }
    }

    speakResponse(text) {
        if (!this.isContinuousVoiceMode) return;
        
        this.setSiriState('speaking', 'Speaking...');
        
        // Strip markdown and HTML tags for speech
        const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\*/g, '').trim();
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (this.voice) utterance.voice = this.voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher pitch often sounds more natural female

        utterance.onend = () => {
            if (this.isContinuousVoiceMode) {
                // Resume listening automatically after speaking finishes
                this.setSiriState('listening', 'Listening...');
                setTimeout(() => {
                    try { 
                        this.recognitionStartTime = Date.now();
                        this.recognition.start(); 
                    } catch(e){}
                }, 300);
            }
        };

        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            if (this.isContinuousVoiceMode) {
                this.setSiriState('listening', 'Listening...');
                setTimeout(() => {
                    try { this.recognition.start(); } catch(e){}
                }, 300);
            }
        };

        this.synth.speak(utterance);
    }

    async handleUserMessage(retryText = null) {
        if (this.isTyping) return;
        const text = retryText || this.userInput.value.trim();
        if (!text) return;

        // If user types manually while in voice mode, pause recognition temporarily
        if (this.isContinuousVoiceMode) {
            this.recognition.stop();
            this.synth.cancel();
            this.setSiriState('idle', 'Processing...');
        }

        // Only add user message to chat if it's a new message (not a retry)
        if (!retryText) {
            this.addMessage(text, 'user');
            this.userInput.value = '';
        }
        
        this.isTyping = true;
        this.sendBtn.disabled = true;
        this.userInput.disabled = true;
        
        const loadingId = this.addLoadingIndicator();

        try {
            const token = window.authStore?.token;
            if (!token) {
                this.removeLoadingIndicator(loadingId);
                const msg = "Your session has expired. Please log in again.";
                this.addMessage(msg, 'ai');
                if (this.isContinuousVoiceMode) this.speakResponse(msg);
                this.enableInput();
                return;
            }

            const lang = 'en'; 

            // Calculate Cognitive Metrics if this was a voice interaction
            let cognitiveMetrics = null;
            if (this.isContinuousVoiceMode) {
                const words = text.split(/\s+/).filter(w => w.length > 0);
                const totalWords = words.length;
                const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
                const avgSentenceLength = sentences.length > 0 ? totalWords / sentences.length : totalWords;
                
                const responseTimeMs = this.recognitionStartTime ? (Date.now() - this.recognitionStartTime) : 2000;

                cognitiveMetrics = {
                    isVoice: true,
                    responseTimeMs,
                    totalWords,
                    avgSentenceLength
                };
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            const apiUrl = (window.API_BASE_URL || '') + '/api/ai/mentor';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: text, lang, cognitiveMetrics }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            this.removeLoadingIndicator(loadingId);

            // Check if response is JSON (safeguard against HTML 500 pages)
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('SERVER_ERROR');
            }

            const data = await response.json();

            if (response.ok) {
                const replyText = data.reply || data.analysis || "I received a blank response. Please try again.";
                this.typeMessage(replyText, 'ai');
                if (this.isContinuousVoiceMode) {
                    this.speakResponse(replyText);
                }
            } else {
                let errorMsg = data.message || data.error || "Mentor AI failed to respond.";
                if (response.status === 401) errorMsg = "Your session has expired. Please log in again.";
                this.addErrorWithRetry(errorMsg, text);
            }
        } catch (error) {
            this.removeLoadingIndicator(loadingId);
            
            let errorMsg = "I couldn't process that message right now. Please try again.";
            if (error.name === 'AbortError') {
                errorMsg = "The response took too long. Please try again.";
            } else if (!navigator.onLine) {
                errorMsg = "You are offline. Please check your internet connection.";
            }

            this.addErrorWithRetry(errorMsg, text);
        }
    }

    enableInput() {
        this.isTyping = false;
        this.sendBtn.disabled = false;
        this.userInput.disabled = false;
        this.userInput.focus();
    }

    addErrorWithRetry(errorMsg, originalText) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ai`;
        
        const errorText = document.createElement('p');
        errorText.style.color = '#ef4444';
        errorText.style.fontWeight = '500';
        errorText.innerText = errorMsg;
        msgDiv.appendChild(errorText);

        const retryBtn = document.createElement('button');
        retryBtn.innerText = 'Retry';
        retryBtn.className = 'mt-3 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition';
        retryBtn.onclick = () => {
            msgDiv.remove();
            this.handleUserMessage(originalText);
        };
        msgDiv.appendChild(retryBtn);

        this.chatMessages.appendChild(msgDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        if (this.isContinuousVoiceMode) this.speakResponse(errorMsg);
        this.enableInput();
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
        
        let htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        htmlText = htmlText.replace(/\n/g, '<br>');

        let i = 0;
        const speed = 15; 
        
        const typeWriter = () => {
            if (i < htmlText.length) {
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
                this.enableInput();
                // Note: auto-resume for voice mode is handled by SpeechSynthesis.onend
            }
        };
        typeWriter();
    }

    addLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = `message ai`;
        msgDiv.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
        this.chatMessages.appendChild(msgDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        return id;
    }

    removeLoadingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIMentor();
});
