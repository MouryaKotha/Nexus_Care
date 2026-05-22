import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
    const genAI = new GoogleGenerativeAI('AIzaSyD7OuKR5M159BMsrzMpUX-zNIlA1Nb6wUw');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('hello');
        console.log('SUCCESS:', result.response.text());
    } catch (err) {
        console.error('ERROR 1.5-flash:', err.message);
    }
}
test();
