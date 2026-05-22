document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
});

async function loadArticles() {
    const grid = document.getElementById('blogGrid');
    try {
        const res = await fetch('/api/blog');
        const articles = await res.json();

        if (!Array.isArray(articles) || articles.length === 0) {
            // Sample articles if DB is empty
            const sampleArticles = [
                {
                    title: '10 Secrets to Improving Your Sleep Quality',
                    category: 'Wellness',
                    image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=600',
                    readTime: '4 min',
                    author: 'Dr. Sarah Mitchell'
                },
                {
                    title: 'The Role of Gut Health in Mental Well-being',
                    category: 'Nutrition',
                    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
                    readTime: '6 min',
                    author: 'Dr. Michael Chen'
                },
                {
                    title: 'Managing Stress: Practical Techniques for Daily Life',
                    category: 'Mental Health',
                    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
                    readTime: '5 min',
                    author: 'Dr. Emily Rodriguez'
                }
            ];
            grid.innerHTML = sampleArticles.map(a => renderArticleCard(a)).join('');
            return;
        }

        grid.innerHTML = articles.map(a => renderArticleCard(a)).join('');
    } catch (err) {
        console.error('Articles load error:', err);
    }
}

function renderArticleCard(a) {
    return `
        <div class="blog-card flex flex-col">
            <div class="relative h-64 overflow-hidden">
                <img src="${a.image}" class="w-full h-full object-cover">
                <span class="absolute top-4 left-4 category-badge px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">${a.category}</span>
            </div>
            <div class="p-8 flex-1 flex flex-col">
                <div class="flex items-center gap-3 mb-4 text-xs font-bold text-gray-400">
                    <span>${a.readTime} Read</span>
                    <span>•</span>
                    <span>${a.author || 'Nexus Team'}</span>
                </div>
                <h3 class="text-2xl font-black text-gray-900 mb-4 leading-tight hover:text-blue-600 transition cursor-pointer">${a.title}</h3>
                <div class="mt-auto pt-6 flex items-center justify-between border-t border-gray-100">
                    <button class="text-blue-600 font-black text-sm hover:translate-x-2 transition inline-flex items-center gap-2">
                        Read Story
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}
