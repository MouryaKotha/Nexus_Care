document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    const productsTab = document.getElementById('productsTab');
    const prescriptionsTab = document.getElementById('prescriptionsTab');
    const productsSection = document.getElementById('productsSection');
    const prescriptionsSection = document.getElementById('prescriptionsSection');

    productsTab.addEventListener('click', () => {
        productsTab.classList.add('active');
        productsTab.classList.remove('text-gray-500');
        prescriptionsTab.classList.remove('active');
        prescriptionsTab.classList.add('text-gray-500');
        productsSection.classList.remove('hidden');
        prescriptionsSection.classList.add('hidden');
    });

    prescriptionsTab.addEventListener('click', () => {
        prescriptionsTab.classList.add('active');
        prescriptionsTab.classList.remove('text-gray-500');
        productsTab.classList.remove('active');
        productsTab.classList.add('text-gray-500');
        prescriptionsSection.classList.remove('hidden');
        productsSection.classList.add('hidden');

        loadPrescriptions();
    });

    fetchProducts();
    initFilters();
});

let allProducts = [];

async function fetchProducts() {
    const grid = document.getElementById('productsGrid');
    try {
        const res = await fetch('/api/pharmacy/products');
        allProducts = await res.json();

        if (!Array.isArray(allProducts) || allProducts.length === 0) {
            // Sample products if DB is empty
            allProducts = [
                { name: 'Paracetamol 500mg', price: 45, category: 'Medicine', description: 'Pain relief and fever reduction.', image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { name: 'Vitamin C Complex', price: 299, category: 'Wellness', description: 'Immunity booster with antioxidants.', image: 'https://images.pexels.com/photos/3652103/pexels-photo-3652103.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { name: 'Digital Thermometer', price: 450, category: 'Equipment', description: 'Fast and accurate body temperature reading.', image: 'https://images.pexels.com/photos/5858823/pexels-photo-5858823.jpeg?auto=compress&cs=tinysrgb&w=400' },
                { name: 'First Aid Kit', price: 999, category: 'First Aid', description: 'Complete emergency medical essentials.', image: 'https://images.pexels.com/photos/6520194/pexels-photo-6520194.jpeg?auto=compress&cs=tinysrgb&w=400' }
            ];
        }

        renderProducts(allProducts);
        renderTrending(allProducts);
        renderEmergency(allProducts);
        renderRecommendations(allProducts);
    } catch (err) {
        console.error('Products load error:', err);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (products.length === 0) {
        grid.innerHTML = '<p class="text-gray-400 italic col-span-full text-center py-10">No products found matching your criteria.</p>';
        return;
    }
    grid.innerHTML = products.map(p => renderProductCard(p)).join('');
}

function initFilters() {
    const searchInput = document.getElementById('productSearch');
    const categoryBtns = document.querySelectorAll('.category-btn');

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term)
        );
        renderProducts(filtered);
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            // UI Toggle
            categoryBtns.forEach(b => {
                b.classList.remove('active', 'bg-blue-600', 'text-white');
                b.classList.add('bg-white', 'text-gray-600');
            });
            btn.classList.add('active', 'bg-blue-600', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-600');

            if (category === 'All') {
                renderProducts(allProducts);
            } else {
                const filtered = allProducts.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}

function renderTrending(products) {
    const container = document.getElementById('trendingList');
    const trending = products.slice(0, 3);
    container.innerHTML = trending.map((p, i) => `
        <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-sm transition">
            <span class="text-2xl font-black text-blue-200">0${i + 1}</span>
            <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src="${p.image}" class="w-full h-full object-cover">
            </div>
            <div class="flex-grow">
                <h4 class="font-bold text-gray-900">${p.name}</h4>
                <p class="text-xs text-gray-500">${p.category}</p>
            </div>
            <span class="font-bold text-gray-900">₹${p.price}</span>
        </div>
    `).join('');
}

function renderEmergency(products) {
    const container = document.getElementById('emergencyGrid');
    const emergency = products.filter(p => p.category === 'Medicine' || p.category === 'First Aid').slice(0, 4);
    container.innerHTML = emergency.map(p => `
        <div class="bg-white p-3 rounded-xl border border-red-100 flex flex-col items-center text-center">
            <h4 class="text-sm font-bold text-gray-900 mb-1 line-clamp-1">${p.name}</h4>
            <span class="text-xs font-black text-red-600 mb-2">₹${p.price}</span>
            <button class="w-full py-2 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition">QUICK BUY</button>
        </div>
    `).join('');
}

function renderRecommendations(products) {
    const container = document.getElementById('recommendedContainer');
    const grid = document.getElementById('recommendedGrid');
    const user = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;

    if (!user) return;

    container.classList.remove('hidden');
    // Simple mock recommendation logic: suggest Wellness products to random users
    const recommended = products.filter(p => p.category === 'Wellness').slice(0, 4);
    grid.innerHTML = recommended.map(p => renderProductCard(p)).join('');
}

function renderProductCard(p) {
    return `
        <div class="pharmacy-card group cursor-pointer" onclick="showProductDetails('${p._id || p.name}')">
            <div class="relative h-48 overflow-hidden">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">${p.category}</span>
            </div>
            <div class="p-5">
                <h3 class="text-xl font-bold text-gray-900 mb-2">${p.name}</h3>
                <p class="text-gray-500 text-sm mb-4 line-clamp-2">${p.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-black text-gray-900">₹${p.price}</span>
                    <div class="flex gap-2">
                        <button class="px-4 py-2 bg-blue-100 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition" onclick='event.stopPropagation(); addToCart(${JSON.stringify(p)})'>
                            + Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let cart = JSON.parse(localStorage.getItem('nexus-cart')) || [];

function updateCartUI() {
    localStorage.setItem('nexus-cart', JSON.stringify(cart));
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
    }
    renderCartDrawer();
}

function addToCart(product, quantity = 1) {
    const existing = cart.find(item => item.id === (product._id || product.name));

    // Interaction Check
    if (product.name === 'Ibuprofen' && cart.some(i => i.name === 'Aspirin') ||
        product.name === 'Aspirin' && cart.some(i => i.name === 'Ibuprofen')) {
        alert('⚠️ DRUG INTERACTION WARNING: Aspirin and Ibuprofen may interact and increase bleeding risk. Please consult a doctor.');
        return;
    }

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product._id || product.name,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    updateCartUI();
    showToast(`${product.name} added to cart!`);
}

function buyNow(id) {
    const product = allProducts.find(p => (p._id || p.name) === id);
    if (!product) return;

    const user = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    if (!user) {
        alert('Please login to purchase items instantly.');
        window.location.href = 'login.html';
        return;
    }

    addToCart(product);
    toggleCart(true);
}

function renderCartDrawer() {
    const container = document.getElementById('cartItemsList');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-10"><p class="text-gray-400 italic mb-4">Your cart is empty.</p><button onclick="toggleCart(false)" class="text-blue-600 font-bold">Start Shopping</button></div>';
        document.getElementById('cartTotal').textContent = '₹0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.quantity;
        return `
            <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-4 group">
                <img src="${item.image}" class="w-16 h-16 object-cover rounded-xl shadow-sm">
                <div class="flex-grow">
                    <h4 class="font-bold text-gray-900">${item.name}</h4>
                    <p class="text-sm text-blue-600 font-black">₹${item.price}</p>
                    <div class="flex items-center gap-3 mt-2">
                        <button onclick="changeQty(${index}, -1)" class="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-sm hover:border-blue-500 transition">-</button>
                        <span class="text-xs font-black w-4 text-center">${item.quantity}</span>
                        <button onclick="changeQty(${index}, 1)" class="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-sm hover:border-blue-500 transition">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" class="p-2 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
            </div>
        `;
    }).join('');

    document.getElementById('cartTotal').textContent = `₹${total}`;
}

function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl z-[100] shadow-2xl animate-bounce flex items-center gap-3';
    toast.innerHTML = `<svg class="text-green-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

function toggleCart(show) {
    const drawer = document.getElementById('cartDrawer');
    if (show) {
        drawer.classList.remove('translate-x-full');
        renderCartDrawer();
    } else {
        drawer.classList.add('translate-x-full');
    }
}

async function handleCheckout() {
    const user = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    if (!user) {
        alert('Please login to complete your purchase.');
        window.location.href = 'login.html';
        return;
    }

    const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    try {
        const res = await fetch('/api/pharmacy/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.authStore ? `Bearer ${window.authStore.token}` : `Bearer ${user.token}`
            },
            body: JSON.stringify({ items: cart, totalPrice: total })
        });

        if (res.ok) {
            alert('🎉 Order successfully placed! You can track it in your dashboard.');
            cart = [];
            updateCartUI();
            toggleCart(false);
        }
    } catch (err) {
        alert('Order failed. Please check your internet connection.');
    }
}

function showProductDetails(id) {
    const product = allProducts.find(p => (p._id || p.name) === id);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');

    content.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8">
            <div class="w-full md:w-1/2">
                <div class="rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                    <img src="${product.image}" class="w-full h-auto">
                </div>
            </div>
            <div class="w-full md:w-1/2">
                <span class="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-full uppercase mb-4">${product.category}</span>
                <h2 class="text-3xl font-black text-gray-900 mb-2">${product.name}</h2>
                <p class="text-2xl font-black text-blue-600 mb-6">₹${product.price}</p>
                <div class="space-y-4 mb-8">
                    <div>
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
                        <p class="text-gray-600 text-sm leading-relaxed">${product.description}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dosage</p>
                            <p class="text-sm font-bold text-gray-900">${product.dosage || 'Consult Physician'}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Manufacturer</p>
                            <p class="text-sm font-bold text-gray-900">${product.manufacturer || 'Generic'}</p>
                        </div>
                    </div>
                </div>
                <div class="flex gap-4">
                    <button class="flex-grow py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
                    <button class="flex-grow py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition" onclick="buyNow('${product._id || product.name}')">Buy Now</button>
                </div>
            </div>
        </div>
        
        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-10">
            <div>
                <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    Side Effects
                </h4>
                <p class="text-sm text-gray-600">${product.sideEffects || 'No common side effects reported.'}</p>
            </div>
            <div>
                <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Precautions
                </h4>
                <p class="text-sm text-gray-600">${product.precautions || 'Consult a doctor before use.'}</p>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

// Modal closing logic
document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('productModal').classList.add('hidden');
});

// Scanner Logic
document.getElementById('prescriptionUpload')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    alert('🔍 AI Scanning Prescription...\nDetected:\n- Doctor: Dr. Sharma\n- Medicine: Amoxicillin 500mg\n- Dosage: 1 cap, 3x daily\n\nLinking to Pharmacy...');

    // Switch to products and filter for the medicine
    document.getElementById('productsTab').click();
    document.getElementById('productSearch').value = 'Amoxicillin';
    document.getElementById('productSearch').dispatchEvent(new Event('input'));
});

async function loadPrescriptions() {
    const user = typeof getLoggedInUser === 'function' ? getLoggedInUser() : null;
    const list = document.getElementById('prescriptionsList');
    const prompt = document.getElementById('loginPrompt');

    if (!user) {
        list.classList.add('hidden');
        prompt.classList.remove('hidden');
        return;
    }

    list.classList.remove('hidden');
    prompt.classList.add('hidden');

    try {
        const res = await fetch('/api/pharmacy/prescriptions', {
            headers: { 'Authorization': window.authStore ? `Bearer ${window.authStore.token}` : `Bearer ${user.token}` }
        });
        const prescriptions = await res.json();

        if (prescriptions.length === 0) {
            list.innerHTML = `
                <div class="col-span-full text-center p-12 bg-white rounded-[2rem] border border-slate-100">
                    <p class="text-gray-400 italic">No prescriptions found. Once your doctor issues a digital prescription, it will appear here.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = prescriptions.map(pr => `
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition duration-500"></div>
                <div class="relative z-10">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Prescribed By</p>
                            <h3 class="text-xl font-black text-gray-900">${pr.doctorName}</h3>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                            <p class="font-bold text-gray-900">${new Date(pr.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div class="space-y-4 mb-6">
                        ${pr.medicines.map(m => `
                            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <div>
                                    <p class="font-bold text-gray-900">${m.name}</p>
                                    <p class="text-xs text-gray-500">${m.dosage} - ${m.frequency}</p>
                                </div>
                                <span class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">${m.duration}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button class="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition shadow-lg shadow-gray-200">Reorder All Meds</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Prescriptions load error:', err);
    }
}
