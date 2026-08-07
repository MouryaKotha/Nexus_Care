document.addEventListener('DOMContentLoaded', () => {
    fetchCognitiveReport();
});

async function fetchCognitiveReport() {
    try {
        const token = window.authStore?.token;
        const response = await fetch('/api/wellness/cognitive', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            renderReport(data);
        } else {
            console.error('Failed to fetch report');
            document.getElementById('loadingState').innerHTML = '<p class="text-red-500">Failed to load report. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingState').innerHTML = '<p class="text-red-500">Network error. Please try again later.</p>';
    }
}

function renderReport(data) {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('reportContent').classList.remove('hidden');

    // 1. Score
    const scoreEl = document.getElementById('wellnessScore');
    scoreEl.textContent = data.score;
    if (data.score >= 85) scoreEl.classList.add('text-green-500');
    else if (data.score >= 70) scoreEl.classList.add('text-orange-500');
    else scoreEl.classList.add('text-red-500');

    // 2. Alerts
    const alertsContainer = document.getElementById('alertsContainer');
    if (data.alerts && data.alerts.length > 0) {
        alertsContainer.innerHTML = data.alerts.map(alert => `
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <div class="flex items-center gap-3">
                    <i class="fas fa-exclamation-circle text-red-500"></i>
                    <p class="text-red-900 font-medium">${alert}</p>
                </div>
            </div>
        `).join('');
    } else {
        alertsContainer.innerHTML = `
            <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                <div class="flex items-center gap-3">
                    <i class="fas fa-check-circle text-green-500"></i>
                    <p class="text-green-900 font-medium">No significant decline detected. Speech patterns are stable.</p>
                </div>
            </div>
        `;
    }

    // 3. Metric Cards
    const cur = data.trends.currentWeek;
    const prev = data.trends.previousWeek;

    document.getElementById('avgWords').textContent = Math.round(cur.avgWords);
    renderTrend('wordsTrend', cur.avgWords, prev.avgWords, false); // false = higher is better

    document.getElementById('avgSentence').textContent = Math.round(cur.avgSentenceLength);
    renderTrend('sentenceTrend', cur.avgSentenceLength, prev.avgSentenceLength, false);

    document.getElementById('avgLatency').textContent = (cur.avgResponseMs / 1000).toFixed(1) + 's';
    renderTrend('latencyTrend', cur.avgResponseMs, prev.avgResponseMs, true); // true = lower is better

    // 4. Chart
    renderChart(data.logs);
}

function renderTrend(elementId, current, previous, lowerIsBetter) {
    const el = document.getElementById(elementId);
    if (!previous || previous === 0) {
        el.textContent = 'No previous data';
        el.className = 'text-sm font-bold pb-1 text-slate-400';
        return;
    }

    const diff = current - previous;
    const percent = Math.round((Math.abs(diff) / previous) * 100);
    
    let isGood = false;
    if (lowerIsBetter) {
        isGood = diff <= 0;
    } else {
        isGood = diff >= 0;
    }

    if (percent === 0) {
        el.textContent = 'Stable';
        el.className = 'text-sm font-bold pb-1 text-slate-500';
    } else {
        const icon = diff > 0 ? '↑' : '↓';
        el.textContent = `${icon} ${percent}%`;
        el.className = `text-sm font-bold pb-1 ${isGood ? 'text-green-500' : 'text-red-500'}`;
    }
}

function renderChart(logs) {
    const ctx = document.getElementById('trendsChart').getContext('2d');
    
    // Group logs by day to simplify chart
    const dailyData = {};
    logs.forEach(log => {
        const date = new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (!dailyData[date]) {
            dailyData[date] = { words: [], latency: [] };
        }
        dailyData[date].words.push(log.totalWords);
        dailyData[date].latency.push(log.responseTimeMs);
    });

    const labels = Object.keys(dailyData);
    const wordAverages = labels.map(date => {
        const arr = dailyData[date].words;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    });
    
    const latencyAverages = labels.map(date => {
        const arr = dailyData[date].latency;
        return (arr.reduce((a, b) => a + b, 0) / arr.length) / 1000; // in seconds
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Avg Words per Response',
                    data: wordAverages,
                    borderColor: '#3b82f6', // blue-500
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Response Latency (s)',
                    data: latencyAverages,
                    borderColor: '#f97316', // orange-500
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Word Count'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Seconds'
                    },
                    grid: {
                        drawOnChartArea: false, 
                    },
                },
            }
        }
    });
}
