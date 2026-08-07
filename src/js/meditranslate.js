// MediTranslate Frontend Logic - Communicates with the Node.js backend
document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('mt-input');
    const levelSelect = document.getElementById('mt-level');
    const langSelect = document.getElementById('mt-lang');
    const submitBtn = document.getElementById('mt-submit');
    const resultDiv = document.getElementById('mt-result');
    const placeholder = document.getElementById('mt-placeholder');
    const loading = document.getElementById('mt-loading');
    const audioBtn = document.getElementById('mt-audio-btn');
    const visualCard = document.getElementById('mt-visual-card');
    const visualContent = document.getElementById('mt-visual-content');

    let currentSummary = '';
    let isSpeaking = false;

    // AI Configuration - Logic moved to backend for security
    const BACKEND_URL = "/api/meditranslate";

    submitBtn.addEventListener('click', async () => {
        const text = inputArea.value.trim();
        if (!text) {
            alert('Please paste some medical text first.');
            return;
        }

        // Prepare UI
        placeholder.classList.add('hidden');
        resultDiv.innerHTML = '';
        loading.classList.remove('hidden');
        visualCard.classList.add('hidden');
        submitBtn.disabled = true;

        const level = levelSelect.value;
        const lang = langSelect.value;

        try {
            const token = window.authStore?.token;
            if (!token) {
                resultDiv.innerHTML = `<div class="p-6 bg-red-50 border border-red-200 rounded-2xl text-center"><p class="text-red-600 font-bold mb-2">Authentication Required</p><p class="text-gray-600 text-sm">Please log in to use the Medical Translator.</p></div>`;
                loading.classList.add('hidden');
                submitBtn.disabled = false;
                return;
            }

            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text, level, lang }),
            });

            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to simplify document.');
                } else {
                    const errorText = await response.text();
                    console.error("Server returned non-JSON error:", errorText.substring(0, 100));
                    throw new Error(`Server Error (${response.status}): The backend might not be configured correctly.`);
                }
            }

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                renderResponse(data.simplifiedText);
            } else {
                throw new Error("Invalid response from server. It seems like the backend is returning HTML instead of data.");
            }

        } catch (error) {
            console.error('MediTranslate Error:', error);

            let extraInfo = '';
            if (error.message.includes("Unexpected token '<'")) {
                extraInfo = "The server returned HTML instead of JSON. Check if port 5000 is running the backend or something else.";
            }

            resultDiv.innerHTML = `
                <div class="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
                    <p class="text-red-600 font-bold mb-2">Detailed Connection Error</p>
                    <p class="text-gray-600 text-sm mb-2">Please ensure the backend server is running on port 5000.</p>
                    <p class="text-gray-500 text-xs mb-4 italic">${extraInfo}</p>
                    <div class="bg-white p-3 rounded-lg text-xs font-mono text-gray-500 overflow-auto max-h-32 mb-4">
                        ${error.message}
                    </div>
                    <button onclick="location.reload()" class="mt-4 text-sm text-primary hover:underline font-semibold">
                        Try Refreshing the Page
                    </button>
                </div>
            `;
        } finally {
            loading.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    function renderResponse(html) {
        // Parse "Visual Actions" out of the HTML
        const actionMatches = [...html.matchAll(/STEP_ACTION:\s*(.*?)(?=<|$|\n)/g)];
        const cleanHtml = html.replace(/STEP_ACTION:.*?(?=<|$|\n)/g, '');

        resultDiv.innerHTML = cleanHtml;
        currentSummary = resultDiv.innerText;

        if (actionMatches.length > 0) {
            visualContent.innerHTML = '';
            visualCard.classList.remove('hidden');

            const icons = [
                '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>',
                '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
                '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
            ];

            actionMatches.slice(0, 3).forEach((match, index) => {
                const actionText = match[1];
                const card = document.createElement('div');
                card.className = 'visual-action-card';
                card.innerHTML = `
                    <div class="visual-action-icon">
                        ${icons[index]}
                    </div>
                    <p class="font-semibold text-lg">${actionText}</p>
                `;
                visualContent.appendChild(card);
            });
        }
    }

    // Audio Narration
    audioBtn.addEventListener('click', () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            audioBtn.classList.remove('playing');
        } else {
            if (!currentSummary) return;
            const utter = new SpeechSynthesisUtterance(currentSummary);
            utter.lang = langSelect.value;
            utter.onend = () => {
                isSpeaking = false;
                audioBtn.classList.remove('playing');
            };
            window.speechSynthesis.speak(utter);
            isSpeaking = true;
            audioBtn.classList.add('playing');
        }
    });

    function getMockResponse(level, lang) {
        // Return a realistic mock response for demonstration if API is not available
        return `
            <h3>Analysis of Your Medical Document</h3>
            <p>Your document discusses a common health indicator related to heart function. In simple terms, everything is progressing normally.</p>
            <p><strong>Plain Language:</strong> The "complicated" terms used essentially mean your heart is beating at a healthy rhythm and pumping blood effectively to your body.</p>
            <ul>
                <li><strong>Observation:</strong> Regular cardiac rhythm.</li>
                <li><strong>Conclusion:</strong> No immediate cause for concern.</li>
                <li><strong>Recommendation:</strong> Continue current routine.</li>
            </ul>
            <p>STEP_ACTION: Schedule a follow-up visit in 6 months.</p>
            <p>STEP_ACTION: Monitor your blood pressure weekly.</p>
            <p>STEP_ACTION: Maintain your current exercise plan.</p>
        `;
    }

    function getStaticSimplification(input, level = 'adult', lang = 'en') {
        const text = input.toLowerCase();

        const data = {
            hemoglobin: {
                en: {
                    child: { summary: "Your blood is tired. It needs more strength to carry oxygen so you don't feel sleepy.", risk: "Moderate", action: "Eat yummy green veggies and talk to your doctor." },
                    teen: { summary: "Your hemoglobin is low, which means your blood isn't carrying enough oxygen. This is why you feel tired. It's often called anemia.", risk: "Moderate", action: "Consult a doctor and consider iron-rich foods." },
                    student: { summary: "Results indicate a hemoglobin deficiency (<12 g/dL). This reduces oxygen transport capacity, leading to symptoms of iron-deficiency anemia.", risk: "Moderate", action: "Recommend complete blood count (CBC) and iron panel studies." },
                    adult: { summary: "Your hemoglobin level is low. Hemoglobin helps carry oxygen in your blood. Low levels may cause weakness and tiredness. This could indicate anemia.", risk: "Moderate", action: "Consult a doctor and consider iron-rich foods or further testing." }
                },
                te: {
                    child: { summary: "నీ రక్తం కొంచెం అలసిపోయింది. నీకు శక్తిని ఇచ్చేందుకు దానికి మరికొంత బలం కావాలి.", risk: "మధ్యస్థం", action: "ఆకుకూరలు తిను మరియు డాక్టరుగారితో మాట్లాడు." },
                    teen: { summary: "నీ హిమోగ్లోబిన్ తక్కువగా ఉంది, అంటే నీ రక్తం తగినంత ఆక్సిజన్‌ను మోయలేకపోతోంది.", risk: "మధ్యస్థం", action: "డాక్టర్ను సంప్రదించు మరియు ఇనుము అధికంగా ఉండే ఆహారం తీసుకో." },
                    student: { summary: "హిమోగ్లోబిన్ లోపం (<12 g/dL) ఆక్సిజన్ రవాణా సామర్థ్యాన్ని తగ్గిస్తుంది, ఇది రక్తహీనత లక్షణాలకు దారితీస్తుంది.", risk: "మధ్యస్థం", action: "CBC మరియు ఇనుము పరీక్షలు సిఫార్సు చేయబడ్డాయి." },
                    adult: { summary: "మీ హిమోగ్లోబిన్ స్థాయి తక్కువగా ఉంది. హిమోగ్లోబిన్ మీ రక్తంలో ఆక్సిజన్‌ను తీసుకువెళ్లడానికి సహాయపడుతుంది. ఇది రక్తహీనతను సూచిస్తుంది.", risk: "మధ్యస్థం", action: "డాక్టర్ను సంప్రదించండి మరియు ఇనుము అధికంగా ఉండే ఆహారం తీసుకోండి." }
                },
                hi: {
                    child: { summary: "आपके खून को थोड़ी और ताकत चाहिए ताकि आपको नींद न आए।", risk: "मध्यम", action: "हरी सब्जियां खाएं और डॉक्टर से बात करें।" },
                    teen: { summary: "आपका हीमोग्लोबिन कम है, जिसका अर्थ है कि आपका खून पर्याप्त ऑक्सीजन नहीं ले जा रहा है।", risk: "मध्यम", action: "डॉक्टर से सलाह लें और आयरन युक्त भोजन लें।" },
                    student: { summary: "हीमोग्लोबिन की कमी (<12 g/dL) ऑक्सीजन परिवहन क्षमता को कम करती है, जिससे एनीमिया होता है।", risk: "मध्यम", action: "CBC और आयरन प्रोफाइल की सलाह दी जाती है।" },
                    adult: { summary: "आपका हीमोग्लोबिन स्तर कम है। हीमोग्लोबिन आपके रक्त में ऑक्सीजन ले जाने में मदद करता है। यह एनीमिया का संकेत हो सकता है।", risk: "मध्यम", action: "डॉक्टर से सलाह लें और आयरन युक्त भोजन या आगे की जाँच करें।" }
                },
                es: {
                    child: { summary: "Tu sangre está un poco cansada. Necesita más fuerza para llevar oxígeno.", risk: "Moderado", action: "Come vegetales verdes y habla con tu médico." },
                    adult: { summary: "Su nivel de hemoglobina es bajo. La hemoglobina ayuda a transportar oxígeno en la sangre. Esto podría indicar anemia.", risk: "Moderado", action: "Consulte a un médico y considere alimentos ricos en hierro." }
                },
                fr: {
                    child: { summary: "Ton sang est un peu fatigué. Il a besoin de plus de force pour transporter l'oxygène.", risk: "Modéré", action: "Mange des légumes verts et parle à ton docteur." },
                    adult: { summary: "Votre taux d'hémoglobine est bas. L'hémoglobine aide à transporter l'oxygène dans le sang. Cela pourrait indiquer une anémie.", risk: "Modéré", action: "Consultez un médecin et prévoyez des aliments riches en fer." }
                }
            },
            glucose: {
                en: {
                    child: { summary: "You have a bit too much sugar in your body right now. It's like having too many sweets!", risk: "High", action: "Eat healthy snacks and tell an adult." },
                    teen: { summary: "Your blood sugar is high. This can make you feel thirsty or tired and might mean your body isn't handling sugar correctly.", risk: "High", action: "See a doctor to talk about diet and health habits." },
                    student: { summary: "Hyperglycemia (156 mg/dL) identified. This exceeds normal fasting thresholds and indicates insulin resistance or diabetes.", risk: "High", action: "Urgent HbA1c testing and metabolic evaluation required." },
                    adult: { summary: "Your fasting blood sugar is higher than normal. This may indicate high blood sugar or diabetes.", risk: "High", action: "Consult a doctor for further evaluation and lifestyle changes." }
                },
                te: {
                    child: { summary: "నీ శరీరంలో పంచదార ఎక్కువగా ఉంది. అది నీ ఆరోగ్యానికి అంత మంచిది కాదు.", risk: "ఎక్కువ", action: "ఆరోగ్యకరమైన ఆహారం తిను." },
                    adult: { summary: "మీ రక్తంలో చక్కెర స్థాయి సాధారణం కంటే ఎక్కువగా ఉంది. ఇది మధుమేహాన్ని సూచించవచ్చు.", risk: "ఎక్కువ", action: "మరింత పరీక్ష కోసం డాక్టర్ను సంప్రదించండి." }
                }
            },
            cholesterol: {
                en: {
                    child: { summary: "There is some 'sticky stuff' in your blood that needs to be cleared out so your heart stays happy.", risk: "High", action: "Play outside and eat healthy fruits!" },
                    adult: { summary: "Your bad cholesterol (LDL) level is high. High LDL increases the risk of heart disease.", risk: "High", action: "Consider diet changes, exercise, and medical consultation." }
                },
                te: {
                    adult: { summary: "మీ చెడు కొలెస్ట్రాల్ (LDL) స్థాయి ఎక్కువగా ఉంది. ఇది గుండె జబ్బుల ప్రమాదాన్ని పెంచుతుంది.", risk: "ఎక్కువ", action: "ఆహార మార్పులు మరియు వ్యాయామం గురించి డాక్టర్తో చర్చించండి." }
                }
            },
            vitamin_d: {
                en: {
                    child: { summary: "You need more 'sunshine power' to make your bones strong like a superhero!", risk: "Moderate", action: "Play in the sun and take your vitamins." },
                    adult: { summary: "Your Vitamin D level is low. Vitamin D is important for bone health and immunity.", risk: "Moderate", action: "Consider sunlight exposure, supplements, and doctor advice." }
                },
                te: {
                    adult: { summary: "మీ విటమిన్ డి స్థాయి తక్కువగా ఉంది. విటమిన్ డి ఎముకల ఆరోగ్యానికి ముఖ్యమైనది.", risk: "మధ్యస్థం", action: "ఎండలో ఉండటం మరియు మందుల గురించి డాక్టర్ను అడగండి." }
                }
            },
            blood_pressure: {
                en: {
                    child: { summary: "Your heart is pumping a bit too hard today, like a garden hose with too much water pressure.", risk: "Moderate to High", action: "Stay calm and talk to your doctor." },
                    adult: { summary: "Your blood pressure is higher than normal. This means your heart is working harder than it should.", risk: "Moderate to High", action: "Monitor regularly and consult a doctor for treatment options." }
                },
                te: {
                    adult: { summary: "మీ రక్తపోటు సాధారణం కంటే ఎక్కువగా ఉంది. అంటే మీ గుండె కష్టపడి పనిచేస్తోంది.", risk: "మధ్యస్థం నుండి ఎక్కువ", action: "క్రమం తప్పకుండా తనిఖీ చేయండి మరియు డాక్టర్ను సంప్రదించండి." }
                }
            }
        };

        const getLocalData = (key) => {
            const item = data[key];
            if (!item) return null;
            const langData = item[lang] || item['en'];
            return langData[level] || langData['adult'];
        };

        let result = null;
        if (text.includes("hemoglobin")) result = getLocalData('hemoglobin');
        else if (text.includes("blood sugar") || text.includes("glucose")) result = getLocalData('glucose');
        else if (text.includes("ldl cholesterol") || (text.includes("cholesterol") && text.includes("ldl"))) result = getLocalData('cholesterol');
        else if (text.includes("vitamin d")) result = getLocalData('vitamin_d');
        else if (text.includes("blood pressure") || text.includes("hypertension") || text.includes("mmhg")) result = getLocalData('blood_pressure');

        if (result) {
            const riskColor = result.risk.toLowerCase().includes('high') ? 'red' : result.risk.toLowerCase().includes('moderate') ? 'yellow' : 'blue';
            return `
                <div class="space-y-4">
                    <div class="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                        <p class="font-bold text-blue-800 mb-1">Summary:</p>
                        <p class="text-blue-900">${result.summary}</p>
                    </div>
                    <div class="bg-${riskColor}-50 p-4 rounded-xl border-l-4 border-${riskColor}-500">
                        <p class="font-bold text-${riskColor}-800 mb-1">Risk Level:</p>
                        <p class="text-${riskColor}-900 font-bold uppercase">${result.risk}</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                        <p class="font-bold text-green-800 mb-1">Recommended Action:</p>
                        <p class="text-green-900">${result.action}</p>
                    </div>
                </div>
                <p class="hidden">STEP_ACTION: Schedule a follow-up review.</p>
                <p class="hidden">STEP_ACTION: Maintain a health log.</p>
            `;
        }

        return null;
    }
});
