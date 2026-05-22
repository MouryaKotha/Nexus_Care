import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyD7OuKR5M159BMsrzMpUX-zNIlA1Nb6wUw');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('ERROR:', err.message);
    }
}
test();
