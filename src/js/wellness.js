/**
 * Nexus Care — Wellness Mentor Engine
 * v2.0 - Personal Health Guide (Rule-based, Offline-first)
 */

class WellnessMentor {
    constructor() {
        this.STORAGE_KEY_LOGS = 'nexus_wellness_logs';
        this.STORAGE_KEY_HABITS = 'nexus_wellness_habits';

        this.logs = JSON.parse(localStorage.getItem(this.STORAGE_KEY_LOGS)) || [];
        this.habits = JSON.parse(localStorage.getItem(this.STORAGE_KEY_HABITS)) || {
            walk: false,
            meditation: false,
            water: false,
            sleep: false,
            junkfood: false
        };

        this.habitList = [
            { id: 'walk', name: '🚶 10 Min Walk' },
            { id: 'meditation', name: '🧘 5 Min Meditation' },
            { id: 'water', name: '💧 8 Glasses of Water' },
            { id: 'sleep', name: '😴 Early Sleep (Before 11PM)' },
            { id: 'junkfood', name: '🥗 No Junk Food Today' }
        ];

        this.conditions = [
            {
                id: 'diabetes',
                icon: '🩸',
                title: 'Diabetes Care Tips',
                diet: 'Focus on low-GI foods, lean proteins, and non-starchy vegetables. Monitor carbs closely.',
                lifestyle: 'Check blood sugar daily. Ensure consistent meal times and regular light exercise.',
                warnings: 'Unusual thirst, frequent urination, blurred vision, or chronic fatigue.',
                consult: 'If fasting blood sugar is consistently >130 mg/dL or you experience dizziness.'
            },
            {
                id: 'bp',
                icon: '🫀',
                title: 'Blood Pressure Management',
                diet: 'DASH diet: reduce sodium (<1500mg/day), increase potassium-rich foods (bananas, spinach).',
                lifestyle: '30 mins of moderate aerobic exercise daily. Limit alcohol and manage stress.',
                warnings: 'Severe headaches, chest pain, difficulty breathing, or irregular heartbeat.',
                consult: 'If BP reads consistently >140/90 mmHg.'
            },
            {
                id: 'heart',
                icon: '❤️',
                title: 'Heart Health Advice',
                diet: 'Mediterranean diet: olive oil, nuts, fish, whole grains. Limit saturated & trans fats.',
                lifestyle: 'Maintain healthy weight, quit smoking, manage stress through relaxation.',
                warnings: 'Chest discomfort, shortness of breath, pain in neck/jaw/back.',
                consult: 'Immediate consultation if you experience chest pain or sudden weakness.'
            },
            {
                id: 'asthma',
                icon: '🫁',
                title: 'Asthma Management',
                diet: 'Maintain a balanced diet rich in Vitamins C and E to reduce airway inflammation.',
                lifestyle: 'Identify and avoid triggers (dust, pollen, cold air). Keep inhaler accessible.',
                warnings: 'Frequent coughing, wheezing, shortness of breath, chest tightness.',
                consult: 'If you need rescue inhaler more than twice a week or if symptoms wake you at night.'
            },
            {
                id: 'immunity',
                icon: '🛡️',
                title: 'General Immunity Building',
                diet: 'Rich in antioxidants, Vitamin C (citrus), Vitamin D, and Zinc. Stay hydrated.',
                lifestyle: '7-8 hours of quality sleep, regular moderate exercise, managing chronic stress.',
                warnings: 'Frequent colds, chronic fatigue, slow wound healing.',
                consult: 'If you experience recurrent infections or persistent unexplained fatigue.'
            }
        ];

        this.relaxations = [
            { id: '478', icon: '🌬️', title: '4-7-8 Breathing', desc: 'Inhale for 4s, hold for 7s, exhale for 8s. Great for sleep.' },
            { id: 'stress', icon: '💆', title: 'Quick Stress Relief', desc: 'Progressive muscle relaxation. Tense and release from toes to head.' },
            { id: 'posture', icon: '🪑', title: 'Posture Reset', desc: 'Roll shoulders back, tuck chin slightly, elongate spine.' },
            { id: 'eyes', icon: '👀', title: '20-20-20 Eye Rule', desc: 'Every 20 mins, look 20 feet away for 20 seconds.' }
        ];

        this.init();
    }

    init() {
        this.setupForm();
        this.renderHabits();
        this.renderConditions();
        this.renderRelaxation();
        this.updateHeroDashboard();
    }

    // ─── Setup Form Interactions ────────────────────────────
    setupForm() {
        // Mood buttons
        const moodBtns = document.querySelectorAll('.mood-btn');
        const moodInput = document.getElementById('entry-mood');
        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                moodBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                moodInput.value = btn.dataset.val;
            });
        });

        // Energy buttons
        const energyBtns = document.querySelectorAll('.energy-btn');
        const energyInput = document.getElementById('entry-energy');
        energyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                energyBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                energyInput.value = btn.dataset.val;
            });
        });

        // Water slider
        const waterSlider = document.getElementById('entry-water');
        const waterVal = document.getElementById('water-val');
        if (waterSlider && waterVal) {
            waterSlider.addEventListener('input', (e) => {
                waterVal.textContent = `${e.target.value} glasses`;
            });
        }

        // Form Submit
        const form = document.getElementById('wm-checkin-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCheckIn();
            });
        }
    }

    // ─── Save Daily Check-In ────────────────────────────────
    saveCheckIn() {
        const mood = document.getElementById('entry-mood').value;
        const sleep = parseFloat(document.getElementById('entry-sleep').value);
        const water = parseInt(document.getElementById('entry-water').value);
        const exercise = parseInt(document.getElementById('entry-exercise').value);
        const energy = parseInt(document.getElementById('entry-energy').value);

        if (!mood || isNaN(sleep) || isNaN(water) || isNaN(exercise) || isNaN(energy)) {
            alert("Please fill all fields.");
            return;
        }

        const log = {
            date: new Date().toISOString(),
            mood, sleep, water, exercise, energy
        };

        this.logs.unshift(log); // Add to beginning
        // Keep only last 30 logs
        if (this.logs.length > 30) this.logs.pop();

        localStorage.setItem(this.STORAGE_KEY_LOGS, JSON.stringify(this.logs));

        // Reset form
        document.getElementById('wm-checkin-form').reset();
        document.querySelectorAll('.mood-btn, .energy-btn').forEach(b => b.classList.remove('selected'));
        document.getElementById('entry-mood').value = '';
        document.getElementById('entry-energy').value = '';
        document.getElementById('water-val').textContent = '0 glasses';

        // Update UI
        this.updateHeroDashboard();

        // Show success
        const btn = document.querySelector('#wm-checkin-form button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = '✅ Saved!';
        btn.classList.replace('btn-primary', 'bg-green-500');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.replace('bg-green-500', 'btn-primary');
        }, 2000);

        // Attempt backend sync
        this.syncBackend(log);
    }

    // ─── Render Habits ──────────────────────────────────────
    renderHabits() {
        const list = document.getElementById('wm-habit-list');
        if (!list) return;

        list.innerHTML = '';
        let completedCount = 0;

        this.habitList.forEach(habit => {
            const isDone = this.habits[habit.id];
            if (isDone) completedCount++;

            const el = document.createElement('div');
            el.className = `habit-item ${isDone ? 'done' : ''}`;
            el.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="habit-checkbox"></div>
                    <span class="habit-name font-semibold text-slate-700">${habit.name}</span>
                </div>
            `;

            el.addEventListener('click', () => {
                this.habits[habit.id] = !this.habits[habit.id];
                localStorage.setItem(this.STORAGE_KEY_HABITS, JSON.stringify(this.habits));
                this.renderHabits();
                this.updateHeroDashboard(); // Score depends on habits
            });

            list.appendChild(el);
        });

        // Update progress badge
        const pct = Math.round((completedCount / this.habitList.length) * 100);
        document.getElementById('wm-habit-percent').textContent = pct;
    }

    // ─── Render Conditions Accordion ────────────────────────
    renderConditions() {
        const acc = document.getElementById('wm-conditions-accordion');
        if (!acc) return;

        acc.innerHTML = this.conditions.map((cond, idx) => `
            <div class="acc-item" id="cond-${cond.id}">
                <div class="acc-header" onclick="document.getElementById('cond-${cond.id}').classList.toggle('open')">
                    <span class="flex items-center gap-2">${cond.icon} ${cond.title}</span>
                    <svg class="w-5 h-5 acc-icon text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <div class="acc-content">
                    <div class="acc-body">
                        <h4>🥗 Diet Tips</h4>
                        <p>${cond.diet}</p>
                        <h4>🏃 Lifestyle Advice</h4>
                        <p>${cond.lifestyle}</p>
                        <h4>⚠️ Warning Signs</h4>
                        <p>${cond.warnings}</p>
                        <h4>👨‍⚕️ When to Consult</h4>
                        <p class="text-red-600 font-semibold">${cond.consult}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ─── Render Relaxation Cards ────────────────────────────
    renderRelaxation() {
        const grid = document.getElementById('wm-relaxation-grid');
        if (!grid) return;

        grid.innerHTML = this.relaxations.map(r => `
            <div class="relax-card" onclick="alert('Starting ${r.title} guide...\\n(Interactive guide coming soon)')">
                <div class="relax-icon">${r.icon}</div>
                <div class="relax-title">${r.title}</div>
                <div class="relax-desc">${r.desc}</div>
            </div>
        `).join('');
    }

    // ─── Calculate Score & Generate Tips ────────────────────
    updateHeroDashboard() {
        const scoreCircle = document.getElementById('wm-score-circle');
        const scoreVal = document.getElementById('wm-score-val');
        const scoreStatus = document.getElementById('wm-score-status');
        const tipsList = document.getElementById('wm-personal-tips');

        if (!this.logs.length) return;

        const latest = this.logs[0];
        let score = 0;
        let tips = [];

        // 1. Sleep Evaluation (Max 30pts)
        if (latest.sleep >= 7 && latest.sleep <= 9) {
            score += 30;
        } else if (latest.sleep >= 5) {
            score += 15;
            tips.push('Aim for 7-8 hours of sleep for optimal recovery. Try the 4-7-8 breathing technique before bed.');
        } else {
            score += 5;
            tips.push('Your sleep is dangerously low. Please prioritize rest tonight and avoid screen time 1 hour before bed.');
        }

        // 2. Water Intake (Max 25pts)
        if (latest.water >= 8) {
            score += 25;
        } else if (latest.water >= 4) {
            score += 10;
            tips.push('You are slightly dehydrated. Drink a glass of water right now to boost your energy.');
        } else {
            tips.push('Severe dehydration detected. Please drink water immediately to avoid headaches and fatigue.');
        }

        // 3. Exercise (Max 25pts)
        if (latest.exercise >= 30) {
            score += 25;
        } else if (latest.exercise >= 15) {
            score += 15;
        } else {
            tips.push('Try to fit in a 10-minute walk today to improve circulation and mood.');
        }

        // 4. Mood & Energy (Max 10pts)
        if (latest.mood === 'Happy' || latest.mood === 'Neutral') score += 5;
        if (latest.mood === 'Stressed') tips.push('You indicated feeling stressed. Try our Quick Stress Relief progressive relaxation cycle.');
        if (latest.energy >= 4) score += 5;
        if (latest.energy <= 2) tips.push('Low energy detected. Have a light, balanced snack and ensure you are hydrated.');

        // 5. Habits (Max 10pts)
        const completedHabits = Object.values(this.habits).filter(Boolean).length;
        score += (completedHabits / 5) * 10;

        score = Math.round(score);

        // Update Score UI
        requestAnimationFrame(() => {
            scoreVal.textContent = Math.round(score);
            scoreCircle.style.background = `conic-gradient(${this.getScoreColor(score)} ${score}%, #cbd5e1 0)`;

            if (score >= 80) {
                scoreStatus.textContent = "Excellent Wellness";
                scoreStatus.className = "text-xl font-bold mt-4 text-green-600";
                if (tips.length === 0) tips.push('You are doing great! Keep up the excellent habits.');
            } else if (score >= 50) {
                scoreStatus.textContent = "Moderate Wellness";
                scoreStatus.className = "text-xl font-bold mt-4 text-yellow-600";
            } else {
                scoreStatus.textContent = "Low Wellness";
                scoreStatus.className = "text-xl font-bold mt-4 text-red-600";
            }
        });

        // Update Tips UI
        if (tips.length > 0) {
            tipsList.innerHTML = tips.map(t => `<li class="tip-item">${t}</li>`).join('');
        }
    }

    getScoreColor(score) {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 50) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    }

    // ─── Backend Sync (Modular Extension) ───────────────────
    async syncBackend(logData) {
        try {
            await fetch('/api/wellness/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.authStore ? `Bearer ${window.authStore.token}` : ''
                },
                body: JSON.stringify(logData)
            });
        } catch (error) {
            console.info("Wellness Mentor: Backend offline, data saved locally.");
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.wellnessMentor = new WellnessMentor();
});
