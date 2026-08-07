import fs from 'fs';
import path from 'path';

(async () => {
    try {
        // 1. Login to get a fresh token
        const loginRes = await fetch('http://localhost:5005/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@nexuscare.com', password: 'password123' })
        });
        
        const loginData = await loginRes.json();
        console.log("Login Status:", loginRes.status);
        console.log("Login Token:", loginData.token);
        
        if (!loginData.token) {
            console.log("Failed to login");
            process.exit(1);
        }

        // 2. Hit Health Vault Upload Endpoint
        const uploadRes = await fetch('http://localhost:5005/api/healthvault/upload', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({
                title: "Test",
                type: "Lab Report",
                format: "PDF",
                size: "1 MB",
                fileData: "base64..."
            })
        });
        
        const uploadData = await uploadRes.json();
        console.log("Upload Status:", uploadRes.status);
        console.log("Upload Response:", uploadData);
        
    } catch (e) {
        console.error("Test Error:", e);
    }
    process.exit(0);
})();
