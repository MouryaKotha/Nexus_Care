const url = 'https://openrouter.ai/api/v1/chat/completions';
const key = process.env.OPENROUTER_API_KEY || 'YOUR_API_KEY';

async function testOpenRouter() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemini-1.5-flash',
                messages: [{ role: 'user', content: 'Say hello' }]
            })
        });
        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.error(e);
    }
}

testOpenRouter();
