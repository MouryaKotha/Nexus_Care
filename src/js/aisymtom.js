document.addEventListener('DOMContentLoaded', () => {
  const analyticsForm = document.getElementById('analytics-form');
  const analyticsResultsDiv = document.getElementById('analytics-results');
  const analyticsText = document.getElementById('analytics-text');
  const symptomForm = document.getElementById('symptom-form');
  const symptomInput = document.getElementById('symptom-input');
  const symptomResultsDiv = document.getElementById('symptom-results');
  const symptomText = document.getElementById('symptom-text');
  const liveHeartRateSpan = document.getElementById('live-heart-rate');
  const liveBloodOxygenSpan = document.getElementById('live-blood-oxygen');
  const alertsBox = document.getElementById('alerts-box');
  const alertMessage = document.getElementById('alert-message');

  // AI Predictive Analytics (simulated)
  analyticsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    analyticsResultsDiv.style.maxHeight = '0';
    analyticsResultsDiv.style.opacity = '0';
    setTimeout(() => {
      analyticsResultsDiv.classList.remove('hidden');
      analyticsResultsDiv.style.maxHeight = '1000px';
      analyticsResultsDiv.style.opacity = '1';
      analyticsText.innerHTML = `<span class="loading-dots">Analyzing data</span>`;
    }, 200);

    const heartRate = analyticsForm.querySelector('#heart-rate').value;
    const sleepHours = analyticsForm.querySelector('#sleep-hours').value;
    const stressLevel = analyticsForm.querySelector('#stress-level').value;

    setTimeout(() => {
      let riskLevel = 'low';
      const hr = parseInt(heartRate);
      const sl = parseFloat(sleepHours);
      const stress = parseInt(stressLevel);

      if (hr > 100 || stress >= 8 || sl < 5) riskLevel = 'high';
      else if (hr > 85 || stress >= 5 || sl < 7) riskLevel = 'medium';

      let advice = '';
      if (riskLevel === 'high') {
        advice = 'Your current data suggests a high risk level. Consider consulting a healthcare professional immediately, improving sleep habits and stress management.';
      } else if (riskLevel === 'medium') {
        advice = 'Some risk factors detected. Focus on consistent sleep patterns, moderate exercise, and stress reduction.';
      } else {
        advice = 'Your vitals look normal. Keep maintaining a healthy lifestyle!';
      }

      analyticsText.innerHTML = `
        Based on your inputs, your health risk level is <strong>${riskLevel.toUpperCase()}</strong>.<br /><br />
        ${advice}
      `;
    }, 2000);
  });

  // ─────── Static Symptom Analysis Engine (no backend required) ───────────
  const symptomDB = [
    { keywords: ['chest pain', 'chest pressure', 'chest tightness', 'heart problem', 'cardiac'], condition: 'Possible Cardiac Event', severity: 'high', icon: '🫀', description: 'Chest pain or tightness can indicate cardiac issues ranging from angina to a heart attack. This requires immediate medical evaluation.', vitals: { hr: '↑ 95–120 bpm', bp: '↑ 140/90+ mmHg', spo2: '↓ <94%' }, recommendations: ['Call emergency services (112/911) immediately', 'Sit or lie down and stay calm', 'Chew aspirin (325mg) if not allergic', 'Avoid any physical exertion', 'Do not drive yourself to hospital'], specialist: 'Cardiologist', urgency: '🚨 Seek Emergency Care Now', uc: '#ef4444' },
    { keywords: ['headache', 'migraine', 'head pain', 'throbbing head', 'head ache'], condition: 'Migraine / Tension Headache', severity: 'medium', icon: '🧠', description: 'Recurring or intense headaches may be migraines or tension-type, triggered by stress, dehydration, or hormonal changes.', vitals: { hr: '70–90 bpm (normal)', bp: 'Slightly elevated', spo2: '97–99%' }, recommendations: ['Rest in a dark, quiet room', 'Apply cold or warm compress to forehead', 'Drink 2–3 glasses of water', 'Avoid bright screens and loud sounds', 'Take ibuprofen/paracetamol if needed'], specialist: 'Neurologist', urgency: '📅 Appointment Within 1–2 Days', uc: '#f59e0b' },
    { keywords: ['fever', 'high temperature', 'chills', 'sweating', 'hot body'], condition: 'Viral / Bacterial Infection', severity: 'medium', icon: '🌡️', description: 'Elevated body temperature with chills indicates your immune system is fighting an infection — flu, COVID-19, or bacterial illness.', vitals: { hr: '80–110 bpm (elevated)', bp: 'Normal to low', spo2: '94–98%' }, recommendations: ['Rest and stay well hydrated', 'Take paracetamol to reduce fever', 'Monitor temperature every 4 hours', 'Isolate to prevent spreading', 'See a doctor if fever exceeds 39.5°C'], specialist: 'General Physician', urgency: '⚕️ Visit Clinic Within 24 Hours', uc: '#f59e0b' },
    { keywords: ['cough', 'sore throat', 'cold', 'runny nose', 'congestion', 'sneezing'], condition: 'Upper Respiratory Infection', severity: 'low', icon: '🫁', description: 'Common cold or upper respiratory tract infection. Usually viral and self-resolving within 7–10 days.', vitals: { hr: '70–80 bpm (normal)', bp: 'Normal', spo2: '97–99%' }, recommendations: ['Rest and sleep 8+ hours', 'Gargle with warm salt water twice daily', 'Use steam inhalation for congestion', 'Stay well hydrated throughout the day', 'Try honey and ginger for sore throat'], specialist: 'General Physician', urgency: '🏠 Monitor at Home; Visit If Worsening', uc: '#10b981' },
    { keywords: ['stomach', 'abdominal pain', 'nausea', 'vomiting', 'diarrhea', 'belly pain'], condition: 'Gastrointestinal Disturbance', severity: 'medium', icon: '🥴', description: 'Stomach pain with nausea or diarrhea suggests gastritis, food poisoning, or IBS. Dehydration is the primary risk.', vitals: { hr: '75–95 bpm (variable)', bp: 'Normal to low', spo2: '97–99%' }, recommendations: ['Follow BRAT diet (Banana, Rice, Applesauce, Toast)', 'Sip oral rehydration solution every 15 minutes', 'Avoid dairy, spicy, and fatty foods', 'Take ORS sachets to prevent dehydration', 'Seek care if pain is severe or blood is present'], specialist: 'Gastroenterologist', urgency: '📅 Visit Clinic Within 24–48 Hours', uc: '#f59e0b' },
    { keywords: ['fatigue', 'tired', 'exhausted', 'weakness', 'no energy', 'lethargy'], condition: 'Chronic Fatigue / Possible Anemia', severity: 'low', icon: '😴', description: 'Persistent fatigue may stem from iron deficiency, thyroid dysfunction, vitamin D deficiency, or poor sleep quality.', vitals: { hr: '60–80 bpm (low-normal)', bp: 'Normal to low', spo2: '97–99%' }, recommendations: ['Get a complete blood count (CBC) test', 'Eat iron-rich foods: spinach, lentils, red meat', 'Take vitamin D and B12 supplements', 'Maintain 7–9 hour sleep schedule', 'Reduce caffeine intake after noon'], specialist: 'General Physician / Hematologist', urgency: '🔬 Schedule Lab Test This Week', uc: '#10b981' },
    { keywords: ['breathless', 'shortness of breath', 'difficulty breathing', 'wheezing', 'asthma'], condition: 'Respiratory Distress', severity: 'high', icon: '😮‍💨', description: 'Difficulty breathing or wheezing may indicate asthma, COPD, or an acute allergic reaction. Oxygen supply to vital organs may be compromised.', vitals: { hr: '↑ 90–120 bpm', bp: 'Variable', spo2: '↓ <95% (critical)' }, recommendations: ['Use prescribed inhaler immediately', 'Sit upright and remain calm', 'Open windows for fresh air flow', 'Avoid all known triggers and allergens', 'Call emergency if no improvement in 10 minutes'], specialist: 'Pulmonologist / Emergency Care', urgency: '🚨 Seek Emergency Care Immediately', uc: '#ef4444' },
    { keywords: ['anxiety', 'panic', 'stress', 'depression', 'sad', 'mental health', 'worry', 'nervous'], condition: 'Anxiety / Mental Health Concern', severity: 'medium', icon: '🧘', description: 'Persistent stress, anxiety, or low mood affects both mental and physical health. Early intervention with therapy and lifestyle changes is highly effective.', vitals: { hr: '75–100 bpm (slightly elevated)', bp: 'Slightly elevated', spo2: '98–99%' }, recommendations: ['Practice 4-7-8 deep breathing technique', '10-minute daily mindfulness meditation', 'Limit social media and news exposure', 'Talk to a trusted friend or counselor', 'Consider professional psychotherapy sessions'], specialist: 'Psychiatrist / Psychologist', urgency: '🧠 Schedule Mental Health Consultation', uc: '#8b5cf6' },
    { keywords: ['rash', 'skin', 'itch', 'itching', 'hives', 'allergy', 'allergic', 'swelling'], condition: 'Allergic Reaction / Skin Condition', severity: 'medium', icon: '🩹', description: 'Skin rashes, itching, or hives may indicate an allergic reaction, eczema, or contact dermatitis. Anaphylaxis is a rare but serious risk.', vitals: { hr: '70–100 bpm', bp: 'Normal', spo2: '97–99%' }, recommendations: ['Identify and avoid the potential allergen', 'Apply hydrocortisone cream for relief', 'Take antihistamine (cetirizine/loratadine)', 'Avoid scratching to prevent infection', 'Seek emergency care if throat swells or breathing changes'], specialist: 'Dermatologist / Allergist', urgency: '📅 Visit Clinic Within 1–2 Days', uc: '#f59e0b' },
    { keywords: ['back pain', 'back ache', 'spine', 'lumbar', 'shoulder pain', 'joint pain', 'knee pain'], condition: 'Musculoskeletal Pain', severity: 'low', icon: '🦴', description: 'Back or joint pain is often caused by muscle strain, poor posture, or early arthritis. Most cases improve with rest and physical therapy.', vitals: { hr: '65–85 bpm (normal)', bp: 'Normal', spo2: '98–99%' }, recommendations: ['Apply ice for first 48 hours, then warm compress', 'Rest and avoid heavy lifting', 'Gentle stretching and mobility exercises', 'Take ibuprofen for pain and inflammation', 'See a physiotherapist if pain persists > 5 days'], specialist: 'Orthopedist / Physiotherapist', urgency: '📅 Schedule Physiotherapy Consultation', uc: '#10b981' },
  ];

  function analyzeSymptoms(text) {
    const lower = text.toLowerCase();
    let best = null, bestScore = 0;
    for (const entry of symptomDB) {
      let score = 0;
      for (const kw of entry.keywords) { if (lower.includes(kw)) score += kw.split(' ').length; }
      if (score > bestScore) { bestScore = score; best = entry; }
    }
    return best || {
      condition: 'General Health Advisory', severity: 'low', icon: '🏥',
      description: 'No specific high-risk condition was identified from your description. However, any persistent or unusual symptoms should be evaluated by a medical professional.',
      vitals: { hr: '60–100 bpm (normal)', bp: 'Normal', spo2: '97–99%' },
      recommendations: ['Stay hydrated and rest well', 'Monitor symptoms for 24–48 hours', 'Keep a symptom diary noting time and severity', 'Visit a General Physician if symptoms persist', 'Avoid self-medicating without a diagnosis'],
      specialist: 'General Physician', urgency: '🏠 Monitor & Consult If Worsening', uc: '#10b981'
    };
  }

  function renderSymptomResult(r, symptoms) {
    const severityLabel = { high: '🔴 High Risk', medium: '🟡 Moderate Risk', low: '🟢 Low Risk' };
    return `
        <div style="font-family:'Inter',sans-serif; padding:0.25rem 0;">
          <!-- Header Card -->
          <div style="display:flex;align-items:center;gap:1rem;padding:1.25rem;background:${r.uc}12;border-left:5px solid ${r.uc};border-radius:12px;margin-bottom:1.25rem;flex-wrap:wrap;">
            <div style="font-size:2.5rem;">${r.icon}</div>
            <div style="flex:1;min-width:160px;">
              <div style="font-size:1.1rem;font-weight:700;color:#111827;">${r.condition}</div>
              <div style="font-size:0.8rem;color:#6b7280;margin-top:0.2rem;">Symptoms entered: <em>"${symptoms.substring(0, 60)}${symptoms.length > 60 ? '...' : ''}"</em></div>
            </div>
            <div style="padding:0.35rem 0.9rem;background:${r.uc}22;border:1.5px solid ${r.uc};border-radius:999px;font-size:0.8rem;font-weight:700;color:${r.uc};white-space:nowrap;">
              ${severityLabel[r.severity] || r.severity}
            </div>
          </div>

          <!-- Description -->
          <p style="color:#374151;line-height:1.7;font-size:0.9rem;background:#f9fafb;padding:1rem;border-radius:10px;border:1px solid #e5e7eb;margin-bottom:1.25rem;">
            ℹ️ &nbsp;${r.description}
          </p>

          <!-- Estimated Vitals -->
          <div style="margin-bottom:1.25rem;">
            <div style="font-weight:700;color:#111827;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.6rem;">📊 Estimated Vital Signs</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.6rem;">
              <div style="background:#eff6ff;padding:0.8rem;border-radius:10px;text-align:center;border:1px solid #dbeafe;">
                <div style="font-size:1.2rem;">❤️</div>
                <div style="font-size:0.68rem;color:#6b7280;margin-top:0.2rem;">Heart Rate</div>
                <div style="font-weight:700;color:#1e40af;font-size:0.78rem;margin-top:0.2rem;">${r.vitals.hr}</div>
              </div>
              <div style="background:#f0fdf4;padding:0.8rem;border-radius:10px;text-align:center;border:1px solid #bbf7d0;">
                <div style="font-size:1.2rem;">🩺</div>
                <div style="font-size:0.68rem;color:#6b7280;margin-top:0.2rem;">Blood Pressure</div>
                <div style="font-weight:700;color:#166534;font-size:0.78rem;margin-top:0.2rem;">${r.vitals.bp}</div>
              </div>
              <div style="background:#fff7ed;padding:0.8rem;border-radius:10px;text-align:center;border:1px solid #fed7aa;">
                <div style="font-size:1.2rem;">🫁</div>
                <div style="font-size:0.68rem;color:#6b7280;margin-top:0.2rem;">SpO₂ Oxygen</div>
                <div style="font-weight:700;color:#9a3412;font-size:0.78rem;margin-top:0.2rem;">${r.vitals.spo2}</div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div style="margin-bottom:1.25rem;">
            <div style="font-weight:700;color:#111827;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.6rem;">💊 Recommended Actions</div>
            <div style="display:flex;flex-direction:column;gap:0.4rem;">
              ${r.recommendations.map((rec, i) => `
              <div style="display:flex;align-items:flex-start;gap:0.65rem;background:#f9fafb;padding:0.65rem 0.9rem;border-radius:8px;border:1px solid #e5e7eb;">
                <div style="min-width:22px;height:22px;background:#1e88e5;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0;">${i + 1}</div>
                <span style="color:#374151;font-size:0.875rem;line-height:1.5;">${rec}</span>
              </div>`).join('')}
            </div>
          </div>

          <!-- Urgency + Specialist -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.65rem;">
            <div style="background:${r.uc}10;border:1.5px solid ${r.uc};border-radius:12px;padding:0.9rem;text-align:center;">
              <div style="font-size:1.2rem;">⏰</div>
              <div style="font-size:0.68rem;color:#6b7280;margin-top:0.2rem;font-weight:600;text-transform:uppercase;">Urgency</div>
              <div style="font-weight:700;color:${r.uc};font-size:0.82rem;margin-top:0.3rem;">${r.urgency}</div>
            </div>
            <div style="background:#f5f3ff;border:1.5px solid #8b5cf6;border-radius:12px;padding:0.9rem;text-align:center;">
              <div style="font-size:1.2rem;">👨‍⚕️</div>
              <div style="font-size:0.68rem;color:#6b7280;margin-top:0.2rem;font-weight:600;text-transform:uppercase;">See a Specialist</div>
              <div style="font-weight:700;color:#7c3aed;font-size:0.82rem;margin-top:0.3rem;">${r.specialist}</div>
            </div>
          </div>

          <p style="margin-top:1rem;font-size:0.72rem;color:#9ca3af;text-align:center;font-style:italic;">
            ⚠️ This is an AI-assisted preliminary assessment only. Always consult a licensed physician for diagnosis and treatment.
          </p>
        </div>`;
  }

  // Symptom Checker — Dynamic AI Backend
  symptomForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const symptoms = symptomInput.value.trim();
    if (!symptoms) { symptomText.innerText = "Please describe your symptoms."; return; }

    symptomResultsDiv.style.maxHeight = '0';
    symptomResultsDiv.style.opacity = '0';
    setTimeout(() => {
      symptomResultsDiv.classList.remove('hidden');
      symptomResultsDiv.style.maxHeight = '2000px';
      symptomResultsDiv.style.opacity = '1';
      symptomText.innerHTML = `<div style="text-align:center;padding:1.5rem;color:#6b7280;">
              <div style="font-size:2rem;margin-bottom:0.5rem;" class="loading-dots">⚙️</div>
              <div style="font-size:0.9rem;font-weight:500;">Analyzing your symptoms securely…</div>
            </div>`;
    }, 150);

    try {
        const token = window.authStore?.token;
        if (!token) {
            symptomText.innerHTML = "<div style='color:red;padding:1rem;'>Please log in to use the AI Symptom Checker.</div>";
            return;
        }

        const lang = localStorage.getItem('nexus-care-lang') || 'en';

        // Note: Use relative URL for Vercel
        const response = await fetch('/api/ai/symptom-check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ symptoms, lang })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Convert simple markdown to HTML
            let htmlText = data.analysis.replace(/\n/g, '<br>');
            htmlText = htmlText.replace(/## (.*?)(<br>|$)/g, '<h3 style="color:#1e40af;margin-top:1rem;margin-bottom:0.5rem;">$1</h3>');
            htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            htmlText = htmlText.replace(/\* (.*?)(<br>|$)/g, '<li style="margin-left:1.5rem;">$1</li>');

            // Emergency Badge Injection
            if (htmlText.includes('EMERGENCY_WARNING:')) {
                htmlText = htmlText.replace('EMERGENCY_WARNING:', '<div style="background:#fee2e2;color:#dc2626;padding:1rem;border-radius:8px;border:1px solid #f87171;font-weight:bold;margin-bottom:1rem;">🚨 EMERGENCY WARNING</div>');
            }

            symptomText.innerHTML = '';
            
            // Typewriter effect
            let i = 0;
            const speed = 5;
            const typeWriter = () => {
                if (i < htmlText.length) {
                    if(htmlText.charAt(i) === '<') {
                        let tag = '';
                        while(htmlText.charAt(i) !== '>' && i < htmlText.length) {
                            tag += htmlText.charAt(i);
                            i++;
                        }
                        tag += '>';
                        symptomText.innerHTML += tag;
                    } else {
                        symptomText.innerHTML += htmlText.charAt(i);
                    }
                    i++;
                    setTimeout(typeWriter, speed);
                }
            };
            typeWriter();

        } else {
            symptomText.innerHTML = `<div style='color:red;padding:1rem;'>Error: ${data.error || 'Failed to analyze.'}</div>`;
        }
    } catch (err) {
        symptomText.innerHTML = `<div style='color:red;padding:1rem;'>Network error. Ensure backend is running.</div>`;
    }
  });

  // Remote Patient Monitoring Simulator
  function updateMonitoringData() {
    const heartRate = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
    const bloodOxygen = Math.floor(Math.random() * (100 - 95 + 1)) + 95;

    liveHeartRateSpan.textContent = heartRate;
    liveBloodOxygenSpan.textContent = bloodOxygen;

    let alertMsg = '';
    if (heartRate > 100) {
      alertMsg += 'Heart rate is elevated. ';
    }
    if (bloodOxygen < 96) {
      alertMsg += 'Blood oxygen is low.';
    }

    if (alertMsg) {
      alertsBox.classList.remove('hidden');
      alertMessage.textContent = `Immediate attention needed! ${alertMsg.trim()}`;
    } else {
      alertsBox.classList.add('hidden');
    }
  }

  setInterval(updateMonitoringData, 3000);
  updateMonitoringData();
});

/* ─── Body Diagram Interaction (non-breaking, standalone) ─────────────────
   Hooks into the existing #symptom-input + #symptom-form to trigger analysis.
   ─────────────────────────────────────────────────────────────────────────── */
(function initBodyDiagram() {
  // Wait for DOM
  document.addEventListener('DOMContentLoaded', run);
  if (document.readyState !== 'loading') run();

  function run() {
    const svg = document.getElementById('body-svg');
    const tooltip = document.getElementById('body-tooltip');
    const placeholder = document.getElementById('panel-placeholder');
    const panelContent = document.getElementById('panel-content');
    const panelTitle = document.getElementById('panel-title');
    const panelSymptoms = document.getElementById('panel-symptoms');
    const symptomInput = document.getElementById('symptom-input');
    const symptomForm = document.getElementById('symptom-form');

    if (!svg || !symptomInput || !symptomForm) return; // page doesn't have diagram

    // ── Body-part → symptoms map ───────────────────────────────────────
    const PART_DATA = {
      'Head': {
        icon: '🧠',
        symptoms: ['Persistent Headache', 'Migraine', 'Dizziness', 'Blurred Vision', 'Memory Issues', 'Head Pressure']
      },
      'Neck': {
        icon: '🦴',
        symptoms: ['Neck Stiffness', 'Sore Throat', 'Swollen Lymph Nodes', 'Neck Pain', 'Difficulty Swallowing']
      },
      'Chest': {
        icon: '🫀',
        symptoms: ['Chest Pain', 'Chest Tightness', 'Shortness of Breath', 'Heart Palpitations', 'Persistent Cough', 'Wheezing']
      },
      'Abdomen': {
        icon: '🥴',
        symptoms: ['Stomach Pain', 'Nausea', 'Vomiting', 'Bloating', 'Diarrhea', 'Loss of Appetite']
      },
      'Left Arm': {
        icon: '💪',
        symptoms: ['Left Arm Pain', 'Arm Weakness', 'Numbness in Left Hand', 'Joint Pain', 'Muscle Cramps']
      },
      'Right Arm': {
        icon: '💪',
        symptoms: ['Right Arm Pain', 'Arm Weakness', 'Numbness in Right Hand', 'Elbow Pain', 'Wrist Pain']
      },
      'Left Leg': {
        icon: '🦵',
        symptoms: ['Left Leg Pain', 'Knee Pain', 'Swollen Left Ankle', 'Muscle Weakness', 'Cramps in Left Calf']
      },
      'Right Leg': {
        icon: '🦵',
        symptoms: ['Right Leg Pain', 'Right Knee Pain', 'Hip Pain', 'Numbness in Right Foot', 'Right Calf Cramps']
      },
    };

    let activePart = null;

    // ── Hover / click logic ────────────────────────────────────────────
    const parts = svg.querySelectorAll('.body-part');
    parts.forEach(el => {
      // Mouse hover
      el.addEventListener('mouseenter', (e) => {
        const part = el.dataset.part;
        showTooltip(el, part);
        showPanel(part);
        highlightPart(el);
      });

      el.addEventListener('mousemove', (e) => {
        positionTooltip(e, tooltip, svg);
      });

      el.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
        // Keep panel open on the last hovered if no active click
        if (!activePart) dehighlight();
      });

      // Click / tap to lock selection
      el.addEventListener('click', (e) => {
        const part = el.dataset.part;
        activePart = part;
        parts.forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        showPanel(part);
      });
    });

    // ── Tooltip positioning ────────────────────────────────────────────
    function showTooltip(el, partName) {
      tooltip.textContent = partName;
      tooltip.classList.remove('hidden');
    }

    function positionTooltip(e, tooltip, parent) {
      const rect = parent.getBoundingClientRect();
      const svgRect = parent.closest('.body-col')?.getBoundingClientRect() || rect;
      tooltip.style.top = (e.clientY - svgRect.top - 35) + 'px';
      tooltip.style.left = (e.clientX - svgRect.left + 12) + 'px';
    }

    // ── Panel ──────────────────────────────────────────────────────────
    function showPanel(partName) {
      const data = PART_DATA[partName];
      if (!data) return;

      placeholder.classList.add('hidden');
      panelContent.classList.remove('hidden');

      panelTitle.innerHTML = `${data.icon} &nbsp;${partName} Symptoms`;

      panelSymptoms.innerHTML = data.symptoms.map(sym => `
                <button class="symptom-chip" data-symptom="${sym}">
                    <span style="font-size:0.9rem;">📍</span> ${sym}
                </button>
            `).join('');

      // Bind chip clicks → auto-submit
      panelSymptoms.querySelectorAll('.symptom-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const sym = chip.dataset.symptom;
          symptomInput.value = sym;
          symptomInput.dispatchEvent(new Event('input'));
          // Scroll to result area
          symptomForm.querySelector('[type="submit"]').scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Trigger analysis
          symptomForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        });
      });
    }

    function highlightPart(el) {
      if (activePart) return; // don't override locked selection
      document.querySelectorAll('.body-part').forEach(p => p.classList.remove('active'));
    }

    function dehighlight() {
      if (!activePart) {
        document.querySelectorAll('.body-part').forEach(p => p.classList.remove('active'));
      }
    }

    // ── Mobile: touch support (same as click) ──────────────────────────
    parts.forEach(el => {
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        el.dispatchEvent(new MouseEvent('click'));
      }, { passive: false });
    });
  }
})();
