document.addEventListener('DOMContentLoaded', function() {
    const ambulanceCountEl = document.getElementById('ambulance-count');
    const ambulanceEtaEl = document.getElementById('ambulance-eta');
    const bloodStockEl = document.getElementById('blood-stock');
    const micuTextEl = document.getElementById('micu-occupancy-text');
    const micuBarEl = document.getElementById('micu-occupancy-bar');
    const sicuTextEl = document.getElementById('sicu-occupancy-text');
    const sicuBarEl = document.getElementById('sicu-occupancy-bar');

    const bloodTypes = [
        { type: 'A+', status: 'Good' },
        { type: 'O-', status: 'Critical' },
        { type: 'B+', status: 'Good' },
        { type: 'AB-', status: 'Low' }
    ];

    const statuses = ['Good', 'Low', 'Critical'];
    const statusClasses = {
        'Good': 'status-good',
        'Low': 'status-low',
        'Critical': 'status-critical pulse-animation'
    };

    function updateBloodStock() {
        bloodStockEl.innerHTML = '';
        bloodTypes.forEach(blood => {
            const statusClass = statusClasses[blood.status];
            const el = document.createElement('div');
            el.className = `flex justify-between items-center p-2 rounded-md font-semibold text-sm ${statusClass}`;
            el.innerHTML = `<span>${blood.type}</span><span>${blood.status}</span>`;
            bloodStockEl.appendChild(el);
        });
    }

    function updateAmbulanceStatus() {
        const count = Math.floor(Math.random() * 3) + 2; // Random 2-4
        const etaMin = Math.floor(Math.random() * 5) + 8; // Random 8-12
        const etaMax = etaMin + 5;
        ambulanceCountEl.textContent = count;
        ambulanceEtaEl.textContent = `${etaMin}-${etaMax}`;
    }

    function updateIcuOccupancy() {
        const micuOccupancy = Math.floor(Math.random() * 21) + 70; // 70-90%
        const sicuOccupancy = Math.floor(Math.random() * 21) + 65; // 65-85%

        micuTextEl.textContent = `${micuOccupancy}%`;
        micuBarEl.style.width = `${micuOccupancy}%`;
        sicuTextEl.textContent = `${sicuOccupancy}%`;
        sicuBarEl.style.width = `${sicuOccupancy}%`;
    }
     
    function randomizeBloodStatus() {
        // Randomly change the status of one blood type
        const randomIndex = Math.floor(Math.random() * bloodTypes.length);
        const randomStatusIndex = Math.floor(Math.random() * statuses.length);
        bloodTypes[randomIndex].status = statuses[randomStatusIndex];
        updateBloodStock();
    }

    // Initial calls
    updateBloodStock();
    updateAmbulanceStatus();
    updateIcuOccupancy();

    // Set intervals for updates to simulate live data
    setInterval(randomizeBloodStatus, 4000); // Update blood every 4 seconds
    setInterval(updateAmbulanceStatus, 7000); // Update ambulance every 7 seconds
    setInterval(updateIcuOccupancy, 5000); // Update ICU every 5 seconds
});