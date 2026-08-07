document.addEventListener('DOMContentLoaded', async () => {
    // Wait slightly to allow AuthStore to hydrate if needed
    setTimeout(() => initDashboard(), 50);
});

async function initDashboard() {
    const user = window.authStore ? window.authStore.getUser() : window.checkAuthState();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize Dashboard UI
    const userNameStr = user.firstName || (user.name ? user.name.split(' ')[0] : (user.email ? user.email.split('@')[0] : 'User'));
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${userNameStr}`;
    const initialChar = user.firstName ? user.firstName.charAt(0) : (user.name ? user.name.charAt(0) : (user.email ? user.email.charAt(0) : 'U'));
    document.getElementById('userInitial').textContent = initialChar.toUpperCase();

    // Set Profile details
    document.getElementById('creationDate').textContent = new Date(user.createdAt || Date.now()).toLocaleDateString();
    document.getElementById('lastLoginDate').textContent = new Date(user.lastLogin || Date.now()).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

    // Role-based Conditional Rendering
    if (user.role === 'doctor') {
        renderDoctorDashboard(user);
    } else {
        renderPatientDashboard(user);
    }
}

async function renderPatientDashboard(user) {
    // Refill Reminder Mock for Patient
    const remindersList = document.getElementById('remindersList');
    if (remindersList && !remindersList.hasChildNodes()) {
        const refillDiv = document.createElement('div');
        refillDiv.className = 'flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl mt-4';
        refillDiv.innerHTML = `
            <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M12 7v5l3 3"/></svg>
            </div>
            <div>
                <p class="font-bold text-blue-900">Refill Reminder</p>
                <p class="text-sm text-blue-700">You're running low on Paracetamol. Consider reordering.</p>
            </div>
        `;
        remindersList.appendChild(refillDiv);
    }

    fetchDashboardData(user);
    fetchUserStats(user);
    fetchUserActivity(user);
}

async function renderDoctorDashboard(user) {
    // Change metrics labels for Doctor
    const apptCard = document.querySelector('.bg-blue-500 p.text-blue-100');
    if (apptCard) apptCard.textContent = "Today's Consultations";
    
    const presCard = document.querySelector('.bg-teal-500 p.text-teal-100');
    if (presCard) presCard.textContent = "Pending Reports";
    
    // Switch the charts/activity to Doctor relevant data
    const chartTitle = document.querySelector('#activityChart').parentElement.previousElementSibling.querySelector('h3');
    if (chartTitle) chartTitle.textContent = "Weekly Patient Flow";
    
    const activityTitle = document.querySelector('#recentActivity').previousElementSibling.querySelector('h3');
    if (activityTitle) activityTitle.textContent = "Recent Patient Activity";

    // Fetch same APIs but the backend protect middleware will return Doctor's data
    fetchDashboardData(user);
    fetchUserStats(user);
    fetchUserActivity(user);
}

async function fetchDashboardData(user) {
    try {
        const token = window.authStore ? window.authStore.token : null;
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch appointments
        const apptRes = await fetch(`/api/appointments`, { headers });
        const appts = await apptRes.json();

        if (Array.isArray(appts)) {
            document.getElementById('appointmentCount').textContent = appts.length;
        }

        // Fetch prescriptions (fallback safely if route missing)
        try {
            const presRes = await fetch(`/api/pharmacy/prescriptions`, { headers });
            if (presRes.ok) {
                const prescriptions = await presRes.json();
                if (Array.isArray(prescriptions)) {
                    document.getElementById('prescriptionCount').textContent = prescriptions.length;
                }
            }
        } catch(e) {}

    } catch (err) {
        console.error('Dashboard data fetch error:', err);
    }
}

async function fetchUserStats(user) {
    try {
        const token = window.authStore ? window.authStore.token : null;
        const res = await fetch(`/api/users/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await res.json();

        const displayStats = Array.isArray(stats) && stats.length > 0 ? stats : [
            { week: 1, activityScore: 40 },
            { week: 2, activityScore: 58 },
            { week: 3, activityScore: 70 },
            { week: 4, activityScore: 75 }
        ];

        renderStatsChart(displayStats);
    } catch (err) {
        console.error('Stats error:', err);
    }
}

function renderStatsChart(stats) {
    const ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: stats.map(s => `Week ${s.week}`),
            datasets: [{
                label: 'Activity Score',
                data: stats.map(s => s.activityScore),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#2563eb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { callback: value => value + '%' } }
            }
        }
    });
}

async function fetchUserActivity(user) {
    try {
        const token = window.authStore ? window.authStore.token : null;
        const res = await fetch(`/api/users/activity`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const activities = await res.json();

        const container = document.getElementById('recentActivity');
        if (Array.isArray(activities) && activities.length > 0) {
            container.innerHTML = activities.map(act => `
                <div class="flex gap-4 group relative pb-6 last:pb-0">
                    <div class="absolute left-6 top-8 bottom-0 w-px bg-slate-100 group-last:hidden"></div>
                    <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0 z-10 transition group-hover:bg-blue-600 group-hover:text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">${act.action}</p>
                        <p class="text-sm text-gray-500 mb-1">${act.description}</p>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${new Date(act.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Activity fetch error:', err);
    }
}
