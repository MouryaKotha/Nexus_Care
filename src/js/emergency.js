const setupEmergency = () => {
    const findBtn = document.getElementById('findHospitalsBtn');
    const mapContainer = document.getElementById('mapContainer');
    const mapLoader = document.getElementById('mapLoader');
    const mapIframeWrapper = document.getElementById('mapIframeWrapper');

    if (!findBtn) return;

    findBtn.addEventListener('click', () => {
        // Show map container and loader
        mapContainer.style.display = 'block';
        mapIframeWrapper.innerHTML = '';
        mapLoader.style.display = 'block';
        mapLoader.textContent = 'Requesting location access...';

        if (!navigator.geolocation) {
            mapLoader.textContent = 'Geolocation is not supported by your browser.';
            mapLoader.style.color = '#e74c3c';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                mapLoader.style.display = 'none';

                // Use Google Maps iframe search query targeting hospitals near user
                const iframeHtml = `
                    <iframe 
                        width="100%" 
                        height="400" 
                        frameborder="0" 
                        style="border:0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" 
                        src="https://maps.google.com/maps?q=hospitals+near+${lat},${lon}&z=13&output=embed" 
                        allowfullscreen>
                    </iframe>
                `;
                mapIframeWrapper.innerHTML = iframeHtml;
            },
            (error) => {
                mapLoader.style.color = '#e74c3c';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        mapLoader.textContent = "Location access denied. Please enable location permissions in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mapLoader.textContent = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        mapLoader.textContent = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        mapLoader.textContent = "An unknown error occurred.";
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEmergency);
} else {
    setupEmergency();
}
