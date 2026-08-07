document.addEventListener('DOMContentLoaded', () => {
    initBlog();
});

function initBlog() {
    renderArticles('All Posts');
    renderPopularGuides();
    setupFilters();
    setupSearch();
    setupExploreTopics();
    setRandomHealthTip();
}

function setRandomHealthTip() {
    const tips = [
        "Small consistent habits can support long-term wellbeing.",
        "Try building a consistent sleep and wake schedule instead of changing your sleep timing dramatically.",
        "A 15-minute brisk walk after a meal can help regulate your blood sugar.",
        "Staying hydrated throughout the day helps maintain energy and cognitive focus.",
        "Taking deep breaths during stressful moments signals your nervous system to calm down."
    ];
    const tipEl = document.getElementById('healthTipText');
    if (tipEl) {
        tipEl.textContent = `"${tips[Math.floor(Math.random() * tips.length)]}"`;
    }
}

function setupFilters() {
    const filterContainer = document.getElementById('categoryFilters');
    if (!filterContainer) return;
    
    const filterButtons = filterContainer.querySelectorAll('button');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state styling
            filterButtons.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
                b.classList.add('bg-white', 'text-gray-600', 'border-slate-200');
            });
            btn.classList.remove('bg-white', 'text-gray-600', 'border-slate-200');
            btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
            
            const category = btn.textContent.trim();
            renderArticles(category);
            
            // Clear search when clicking a filter
            const searchInput = document.getElementById('blogSearch');
            if (searchInput) searchInput.value = '';
        });
    });
}

function setupExploreTopics() {
    const topicButtons = document.querySelectorAll('.mt-20 button'); // Explore By Topic buttons
    
    topicButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.textContent.replace(/[^\w\s]/gi, '').trim(); // Remove emojis
            
            // Trigger the corresponding filter button
            const filterContainer = document.getElementById('categoryFilters');
            if (filterContainer) {
                const filterButtons = filterContainer.querySelectorAll('button');
                const targetBtn = Array.from(filterButtons).find(b => b.textContent.trim() === topic);
                if (targetBtn) {
                    targetBtn.click();
                    
                    // Scroll up to the grid smoothly
                    document.getElementById('categoryFilters').scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        // Reset filter buttons visually to 'All Posts' when searching
        const filterContainer = document.getElementById('categoryFilters');
        if (filterContainer) {
            const filterButtons = filterContainer.querySelectorAll('button');
            filterButtons.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
                b.classList.add('bg-white', 'text-gray-600', 'border-slate-200');
            });
            if (filterButtons.length > 0) {
                filterButtons[0].classList.remove('bg-white', 'text-gray-600', 'border-slate-200');
                filterButtons[0].classList.add('bg-blue-600', 'text-white', 'border-blue-600');
            }
        }

        const grid = document.getElementById('blogGrid');
        if (!grid) return;
        
        if (query === '') {
            renderArticles('All Posts');
            return;
        }
        
        const filtered = CURATED_ARTICLES.filter(a => 
            a.title.toLowerCase().includes(query) || 
            a.summary.toLowerCase().includes(query) ||
            a.category.toLowerCase().includes(query)
        );
        
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="col-span-full py-10 text-center text-gray-500 font-medium">No articles found matching your search.</div>';
            return;
        }
        
        grid.innerHTML = filtered.map(a => renderArticleCard(a)).join('');
    });
}

function renderArticles(filterCategory) {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    
    let filtered = CURATED_ARTICLES;
    if (filterCategory !== 'All Posts') {
        filtered = CURATED_ARTICLES.filter(a => a.category === filterCategory);
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-10 text-center text-gray-500 font-medium">No articles found in this category.</div>';
        return;
    }
    
    grid.innerHTML = filtered.map(a => renderArticleCard(a)).join('');
}

function renderPopularGuides() {
    const grid = document.getElementById('popularGuidesGrid');
    if (!grid) return;
    
    // Select first 4 articles for popular guides
    const popular = CURATED_ARTICLES.slice(0, 4);
    
    grid.innerHTML = popular.map(a => `
        <div class="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg transition cursor-pointer flex flex-col h-full" onclick="window.location.href='article.html?id=${a.id}'">
            <span class="text-xs font-black text-blue-600 uppercase tracking-wider mb-2 block">${a.category}</span>
            <h4 class="text-lg font-black text-gray-900 leading-tight mb-3 hover:text-blue-600 transition flex-1">${a.title}</h4>
            <div class="flex items-center text-xs font-bold text-gray-400">
                <span>${a.readTime}</span>
            </div>
        </div>
    `).join('');
}

function renderArticleCard(a) {
    return `
        <div class="blog-card flex flex-col h-full" onclick="window.location.href='article.html?id=${a.id}'" style="cursor: pointer;">
            <div class="relative h-64 overflow-hidden flex-shrink-0">
                <img src="${a.image}" class="w-full h-full object-cover transform hover:scale-105 transition duration-500">
                <span class="absolute top-4 left-4 category-badge px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">${a.category}</span>
            </div>
            <div class="p-8 flex-1 flex flex-col">
                <div class="flex items-center gap-3 mb-4 text-xs font-bold text-gray-400">
                    <span>${a.readTime}</span>
                    <span>•</span>
                    <span>${a.author}</span>
                </div>
                <h3 class="text-xl font-black text-gray-900 mb-3 leading-tight hover:text-blue-600 transition">${a.title}</h3>
                <p class="text-sm text-gray-600 mb-6 flex-1">${a.summary}</p>
                <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button class="text-blue-600 font-black text-sm hover:translate-x-2 transition inline-flex items-center gap-2">
                        Read Story
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}
