const fs = require('fs');
const files = [
    'appointment.html', 'pharmacy.html', 'health-vault.html', 
    'family-sync.html', 'doctor-profile.html', 'reminder.html', 
    'meditranslate.html', 'wellness-mentor.html', 'community-hub.html', 
    'ai-mentor.html', 'aisymtom.html', 'doctors.html', 'blog.html'
];

const guardScript = `    <script>
        if (!localStorage.getItem('nexus_token')) {
            window.location.href = 'login.html';
        }
    </script>
`;

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('nexus_token')) {
            // Insert guardScript after the tailwind script
            content = content.replace('<script src="https://cdn.tailwindcss.com"></script>', 
                                      '<script src="https://cdn.tailwindcss.com"></script>\n' + guardScript);
            fs.writeFileSync(file, content);
            console.log('Updated ' + file);
        }
    }
});
