document.addEventListener('DOMContentLoaded', () => {
    initArticle();
});

function initArticle() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    const article = CURATED_ARTICLES.find(a => a.id === id);

    if (!article) {
        renderError();
        return;
    }

    renderArticle(article);
    setupScrollProgress();
    setupSaveButton(id);
    setupShareButton(article);
}

function renderError() {
    const container = document.getElementById('articleContainer');
    container.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center p-10">
            <h1 class="text-4xl font-black text-gray-900 mb-4">Article Not Found</h1>
            <p class="text-gray-500 mb-8 text-lg">The article you are looking for does not exist or has been removed.</p>
            <button onclick="window.location.href='blog.html'" class="px-8 py-4 bg-blue-600 text-white font-black rounded-full hover:bg-blue-700 transition">
                &larr; Back to Health Blog
            </button>
        </div>
    `;
}

function renderArticle(article) {
    const container = document.getElementById('articleContainer');
    
    // Generate Sections
    const sectionsHtml = article.content.sections.map(sec => `
        <h2>${sec.heading}</h2>
        <p>${sec.body}</p>
    `).join('');

    // Generate Key Takeaways
    const takeawaysHtml = article.keyTakeaways.map(t => `
        <li class="flex items-start gap-3 mb-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-gray-800 font-medium">${t}</span>
        </li>
    `).join('');

    // Generate Related Articles
    let relatedHtml = '';
    if (article.relatedArticles && article.relatedArticles.length > 0) {
        const related = article.relatedArticles.map(rid => CURATED_ARTICLES.find(a => a.id === rid)).filter(Boolean);
        relatedHtml = related.map(a => `
            <div class="blog-card flex flex-col h-full cursor-pointer" onclick="window.location.href='article.html?id=${a.id}'">
                <div class="relative h-48 overflow-hidden flex-shrink-0">
                    <img src="${a.image}" class="w-full h-full object-cover transform hover:scale-105 transition duration-500">
                    <span class="absolute top-4 left-4 category-badge px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">${a.category}</span>
                </div>
                <div class="p-6 flex-1 flex flex-col">
                    <h4 class="text-lg font-black text-gray-900 mb-2 leading-tight hover:text-blue-600 transition">${a.title}</h4>
                    <div class="mt-auto pt-4 flex items-center text-xs font-bold text-gray-400">
                        <span>${a.readTime}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    container.innerHTML = `
        <!-- Top Navigation -->
        <div class="container mx-auto px-6 pt-10 pb-6 max-w-4xl flex items-center justify-between">
            <button onclick="window.location.href='blog.html'" class="text-gray-500 hover:text-blue-600 font-bold transition flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Health Blog
            </button>
            <div class="flex gap-4">
                <button id="shareBtn" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                </button>
                <button id="saveBtn" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-red-500 transition shadow-sm">
                    <svg id="saveIcon" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                </button>
            </div>
        </div>

        <!-- Hero Section -->
        <div class="container mx-auto px-6 max-w-4xl">
            <span class="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full mb-6">${article.category}</span>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">${article.title}</h1>
            <p class="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">${article.summary}</p>
            
            <div class="flex items-center gap-4 mb-10 pb-10 border-b border-gray-200">
                <div class="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl">NC</div>
                <div>
                    <p class="font-bold text-gray-900 text-lg">${article.author}</p>
                    <p class="text-gray-500 text-sm font-medium">${article.date} &bull; ${article.readTime}</p>
                </div>
            </div>
        </div>

        <!-- Hero Image -->
        <div class="container mx-auto px-6 max-w-5xl mb-16">
            <div class="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-xl">
                <img src="${article.image}" class="w-full h-full object-cover">
            </div>
        </div>

        <!-- Article Body -->
        <div class="container mx-auto px-6 max-w-3xl article-content pb-20">
            <p class="text-xl text-gray-800 leading-relaxed font-medium mb-10">${article.content.introduction}</p>

            <!-- Key Takeaways Box -->
            <div class="bg-blue-50 border border-blue-100 rounded-3xl p-8 mb-12 shadow-sm">
                <h3 class="text-xl font-black text-blue-900 mb-6 uppercase tracking-wider flex items-center gap-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Key Takeaways
                </h3>
                <ul class="space-y-2">
                    ${takeawaysHtml}
                </ul>
            </div>

            ${sectionsHtml}

            <!-- Quick Summary -->
            <div class="mt-16 bg-slate-100 rounded-3xl p-8 border-l-4 border-blue-600">
                <h3 class="text-lg font-black text-gray-900 mb-3 uppercase tracking-wider">Quick Summary</h3>
                <p class="text-gray-700 m-0! leading-relaxed">${article.quickSummary}</p>
            </div>
            
            <div class="mt-16 text-center text-sm text-gray-400 font-medium pb-8 border-b border-gray-200">
                Health information provided by Nexus Care is for educational purposes and should not replace professional medical advice.
            </div>
        </div>

        <!-- Related Stories -->
        ${relatedHtml ? `
        <div class="bg-white py-20 border-t border-gray-100">
            <div class="container mx-auto px-6 max-w-5xl">
                <h2 class="text-3xl font-black text-gray-900 mb-10">Related Stories</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${relatedHtml}
                </div>
            </div>
        </div>
        ` : ''}
    `;
}

function setupScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

function setupSaveButton(id) {
    const saveBtn = document.getElementById('saveBtn');
    const saveIcon = document.getElementById('saveIcon');
    if (!saveBtn) return;

    let savedArticles = JSON.parse(localStorage.getItem('nexus_saved_articles') || '[]');
    let isSaved = savedArticles.includes(id);

    const updateUI = () => {
        if (isSaved) {
            saveIcon.setAttribute('fill', 'currentColor');
            saveBtn.classList.add('text-red-500');
        } else {
            saveIcon.setAttribute('fill', 'none');
            saveBtn.classList.remove('text-red-500');
        }
    };

    updateUI();

    saveBtn.addEventListener('click', () => {
        if (isSaved) {
            savedArticles = savedArticles.filter(aid => aid !== id);
        } else {
            savedArticles.push(id);
        }
        localStorage.setItem('nexus_saved_articles', JSON.stringify(savedArticles));
        isSaved = !isSaved;
        updateUI();
    });
}

function setupShareButton(article) {
    const shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.summary,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert("Article link copied to clipboard!");
            });
        }
    });
}
