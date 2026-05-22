document.addEventListener('DOMContentLoaded', () => {
    const selectedDoctor = JSON.parse(sessionStorage.getItem('selectedDoctor') || '{}');
    const doctorId = selectedDoctor.id || '1'; // Default to 1 if not set
    const doctorName = selectedDoctor.name || 'Dr. Ananya Sharma';

    initReviews(doctorId, doctorName);
});

async function initReviews(doctorId, doctorName) {
    const user = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    const addReviewSection = document.getElementById('addReviewSection');
    const loginToReview = document.getElementById('loginToReview');

    if (user) {
        addReviewSection.classList.remove('hidden');
        loginToReview.classList.add('hidden');
        setupReviewForm(doctorId, doctorName, user);
    }

    fetchReviews(doctorId);
}

async function fetchReviews(doctorId) {
    const container = document.getElementById('reviewsContainer');
    try {
        const res = await fetch(`/api/reviews/${doctorId}`);
        const reviews = await res.json();

        if (reviews.length === 0) {
            container.innerHTML = '<p class="text-gray-500 italic">No reviews yet. Be the first to review!</p>';
            return;
        }

        container.innerHTML = reviews.map(rev => `
            <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100 transition hover:shadow-md">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            ${rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p class="font-bold text-gray-900">${rev.userName}</p>
                            <p class="text-xs text-gray-400">${new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="flex text-yellow-400">
                        ${Array(rev.rating).fill('<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>').join('')}
                    </div>
                </div>
                <p class="text-gray-700 leading-relaxed">${rev.comment}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error('Fetch reviews error:', err);
        container.innerHTML = '<p class="text-red-500">Failed to load reviews.</p>';
    }
}

function setupReviewForm(doctorId, doctorName, user) {
    const form = document.getElementById('reviewForm');
    const stars = document.querySelectorAll('.star-btn');
    const ratingInput = document.getElementById('ratingValue');

    stars.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-value');
            ratingInput.value = val;

            // Highlight stars
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= parseInt(val)) {
                    s.classList.remove('text-gray-300');
                    s.classList.add('text-yellow-400');
                } else {
                    s.classList.add('text-gray-300');
                    s.classList.remove('text-yellow-400');
                }
            });
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const comment = document.getElementById('reviewComment').value;
        const rating = ratingInput.value;

        if (rating === '0') {
            alert('Please select a rating');
            return;
        }

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ doctorId: String(doctorId), doctorName, rating, comment })
            });

            if (res.ok) {
                alert('Review submitted successfully!');
                form.reset();
                stars.forEach(s => {
                    s.classList.add('text-gray-300');
                    s.classList.remove('text-yellow-400');
                });
                ratingInput.value = '0';
                fetchReviews(doctorId);
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to submit review');
            }
        } catch (err) {
            console.error('Submit review error:', err);
            alert('An error occurred. Please try again.');
        }
    });
}
