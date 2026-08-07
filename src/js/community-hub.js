class CommunityHub {
    constructor() {
        this.posts = [];
        this.apiBase = '/api/community';
        this.init();
    }

    init() {
        this.fetchPosts();
        this.setupFilters();
        this.setupForm();
    }

    async fetchPosts() {
        try {
            const apiBase = window.API_BASE_URL || 'http://localhost:5005';
            const res = await fetch(`${apiBase}${this.apiBase}/discussions`);
            const data = await res.json();
            if (data.success && data.discussions.length > 0) {
                this.posts = data.discussions;
            } else {
                this.setFallbackPosts();
            }
            this.renderPosts();
        } catch (error) {
            this.setFallbackPosts();
            this.renderPosts();
        }
    }

    setFallbackPosts() {
        this.posts = [
            { id: 1, author: "Sarah Mitchell", initials: "SM", type: "health", category: "Recovery Story", title: "How I managed my recovery", content: "Stay positive and stay consistent! Mindfulness and light exercise helped me tremendously during the first 6 months. Remember to take it one day at a time.", likes: 24, comments: 12, time: "2 hours ago" },
            { id: 2, author: "Rahul Kotha", initials: "RK", type: "blood", category: "Blood Donation", title: "10th time donor!", content: "Join the mission to save lives. It's painless and makes a huge difference. I just completed my 10th donation at the city hospital!", likes: 56, comments: 5, time: "5 hours ago" },
            { id: 3, author: "Emma Watson", initials: "EW", type: "tips", category: "Tips & Tricks", title: "Hydration is Key", content: "Drinking enough water is often overlooked but it's vital for recovery and general wellness. Aim for 8 glasses a day!", likes: 42, comments: 8, time: "1 day ago" }
        ];
    }

    renderPosts(filter = 'all') {
        const container = document.getElementById('postsContainer');
        if (!container) return;

        const filtered = filter === 'all' ? this.posts : this.posts.filter(p => p.type === filter);

        container.innerHTML = filtered.map(post => `
            <div class="forum-post animate-fade-in shadow-xl shadow-rose-900/5 mb-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold">
                            ${post.initials || '??'}
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-900">${post.title}</h4>
                            <p class="text-xs text-slate-500">${post.author} • ${post.time}</p>
                        </div>
                    </div>
                    <span class="tag tag-${post.type}">${post.category}</span>
                </div>
                <p class="text-slate-600 text-sm mb-4">${post.content}</p>
                <div class="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <div class="flex gap-4">
                        <span>❤️ ${post.likes}</span>
                        <span>💬 ${post.comments}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active', 'bg-rose-50', 'text-rose-600'));
                btn.classList.add('active', 'bg-rose-50', 'text-rose-600');
                this.renderPosts(btn.dataset.filter);
            });
        });
    }

    showFlashcard(title, message, type = 'success') {
        const existing = document.getElementById('community-flashcard');
        if (existing) existing.remove();

        const flashcard = document.createElement('div');
        flashcard.id = 'community-flashcard';
        flashcard.className = `fixed top-24 right-6 p-4 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] flex items-start gap-4 z-[100] min-w-[300px] max-w-sm bg-white border ${type === 'success' ? 'border-green-200' : 'border-red-200'}`;
        
        const iconHtml = type === 'success' 
            ? `<div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0">✓</div>`
            : `<div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0">✕</div>`;

        flashcard.innerHTML = `
            ${iconHtml}
            <div class="flex-1">
                <h4 class="font-bold text-slate-900">${title}</h4>
                <p class="text-sm text-slate-500 mt-1">${message}</p>
            </div>
            <button class="text-slate-400 hover:text-slate-600 font-bold px-2" onclick="this.parentElement.remove()">&times;</button>
        `;

        document.body.appendChild(flashcard);

        flashcard.style.opacity = '0';
        flashcard.style.transform = 'translateY(-10px) translateX(20px)';
        
        requestAnimationFrame(() => {
            flashcard.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            flashcard.style.opacity = '1';
            flashcard.style.transform = 'translateY(0) translateX(0)';
        });

        setTimeout(() => {
            if (document.getElementById('community-flashcard') === flashcard) {
                flashcard.style.opacity = '0';
                flashcard.style.transform = 'translateY(-10px) translateX(20px)';
                setTimeout(() => flashcard.remove(), 300);
            }
        }, 3500);
    }

    setupForm() {
        const modal = document.getElementById('discussionModal');
        const openBtn = document.getElementById('startDiscussionBtn');
        const closeBtn = document.getElementById('closeDiscussion');
        const form = document.getElementById('discussionForm');

        if (openBtn) openBtn.onclick = () => modal.classList.remove('hidden');
        if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');

        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                
                const title = document.getElementById('postTitle').value;
                const select = document.getElementById('postCategory');
                const type = select.value;
                const category = select.options[select.selectedIndex].text;
                const content = document.getElementById('postContent').value;
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Posting...';
                submitBtn.disabled = true;

                try {
                    const token = window.authStore?.token || localStorage.getItem('nexus_token') || '';
                    const headers = { 'Content-Type': 'application/json' };
                    if (token) headers['Authorization'] = `Bearer ${token}`;
                    const apiBase = window.API_BASE_URL || 'http://localhost:5005';

                    const res = await fetch(`${apiBase}${this.apiBase}/discussions`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ title, category, type, content })
                    });
                    
                    const data = await res.json();
                    
                    if (res.ok && data.success) {
                        this.posts.unshift({
                            id: Date.now(),
                            author: window.authStore ? window.authStore.getUser()?.name || "Current User" : "Current User",
                            initials: "ME",
                            type: type,
                            category: category,
                            title: title,
                            content: content,
                            likes: 0,
                            comments: 0,
                            time: "Just now"
                        });
                        this.renderPosts(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
                        form.reset();
                        modal.classList.add('hidden');
                        this.showFlashcard("Post Published Successfully", "Your post is now visible in the Community Hub.", "success");
                    } else {
                        this.showFlashcard("Unable to Publish Post", data.message || "Please try again.", "error");
                    }
                } catch (err) {
                    this.showFlashcard("Unable to Publish Post", "Please try again.", "error");
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            };
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CommunityHub();
});
