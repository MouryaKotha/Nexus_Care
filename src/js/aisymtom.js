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
        advice =
          'Your current data suggests a high risk level. Consider consulting a healthcare professional immediately, improving sleep habits and stress management.';
      } else if (riskLevel === 'medium') {
        advice =
          'Some risk factors detected. Focus on consistent sleep patterns, moderate exercise, and stress reduction.';
      } else {
        advice = 'Your vitals look normal. Keep maintaining a healthy lifestyle!';
      }

      analyticsText.innerHTML = `
        Based on your inputs, your health risk level is <strong>${riskLevel.toUpperCase()}</strong>.<br /><br />
        ${advice}
      `;
    }, 2000);
  });

  // Symptom Checker (using a proxy backend for Gemini API)
  symptomForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    symptomResultsDiv.style.maxHeight = '0';
    symptomResultsDiv.style.opacity = '0';
    setTimeout(() => {
      symptomResultsDiv.classList.remove('hidden');
      symptomResultsDiv.style.maxHeight = '1000px';
      symptomResultsDiv.style.opacity = '1';
      symptomText.innerHTML = `<span class="loading-dots">Analyzing symptoms</span>`;
    }, 200);

    const symptoms = symptomInput.value.trim();
    if (!symptoms) {
      symptomText.innerText = "Please enter your symptoms.";
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/symptom-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      symptomText.innerHTML = data.analysis;

    } catch (error) {
      console.error('Error fetching symptom analysis:', error);
      symptomText.innerHTML = `<p class="text-dangerDark">
        An error occurred while getting the analysis. Please ensure the backend server is running.
      </p>`;
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
