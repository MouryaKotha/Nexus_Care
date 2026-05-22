document.addEventListener('DOMContentLoaded', () => {
    const user = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    if (user) {
        fetchNotifications(user);
        // Poll for notifications every 30 seconds
        setInterval(() => fetchNotifications(user), 30000);
    }
});

async function fetchNotifications(user) {
    const badge = document.getElementById('notificationBadge');
    const list = document.getElementById('notificationList');
    if (!badge || !list) return;

    try {
        const res = await fetch('/api/notifications', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const notifications = await res.json();

        if (!Array.isArray(notifications) || notifications.length === 0) {
            list.innerHTML = '<p class="p-8 text-center text-gray-400 italic text-sm">No new notifications</p>';
            badge.classList.add('hidden');
            return;
        }

        const unreadCount = notifications.filter(n => !n.read).length;
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }

        list.innerHTML = notifications.map(n => `
            <div class="p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer ${n.read ? 'opacity-60' : ''}" onclick="markNotificationRead('${n._id}')">
                <div class="flex gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        ${getNotificationIcon(n.type)}
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-900 mb-0.5">${n.title}</p>
                        <p class="text-xs text-gray-500 leading-relaxed mb-2">${n.message}</p>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Fetch notifications error:', err);
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'Appointment':
            return '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
        case 'Prescription':
            return '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>';
        case 'Health':
            return '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>';
        default:
            return '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
    }
}

async function markNotificationRead(id) {
    const user = getLoggedInUser();
    if (!user) return;

    try {
        await fetch(`/api/notifications/${id}/read`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        fetchNotifications(user);
    } catch (err) {
        console.error('Mark read error:', err);
    }
}
