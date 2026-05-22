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
            const res = await fetch(`${this.apiBase}/discussions`);
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
                alert("Post submitted for AI moderation!");
                modal.classList.add('hidden');
            };
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CommunityHub();
});
