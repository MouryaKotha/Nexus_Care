import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
    try {
        let pageToken = '';
        const models = [];
        do {
            const url = `https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyD7OuKR5M159BMsrzMpUX-zNIlA1Nb6wUw${pageToken ? '&pageToken=' + pageToken : ''}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.models) {
                models.push(...data.models.map(m => m.name));
            }
            pageToken = data.nextPageToken;
        } while (pageToken);
        
        console.log(models.filter(m => m.includes('gemini')));
    } catch (err) {
        console.error('ERROR:', err.message);
    }
}
test();
