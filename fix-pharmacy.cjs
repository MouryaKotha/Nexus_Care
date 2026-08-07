const fs = require('fs');
const file = 'pharmacy.html';

let content = fs.readFileSync(file, 'utf8');

// 1. Add route guard
const guardScript = `    <script>
        if (!localStorage.getItem('nexus_token')) {
            window.location.href = 'login.html';
        }
    </script>
`;
if (!content.includes('nexus_token')) {
    content = content.replace('<script src="https://cdn.tailwindcss.com"></script>', 
                              '<script src="https://cdn.tailwindcss.com"></script>\n' + guardScript);
}

// 2. Add nav-actions
const target = `<div class="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                <button id="productsTab" class="tab-btn active px-6 py-3 rounded-xl font-bold transition">Shop
                    Products</button>
                <button id="prescriptionsTab"
                    class="tab-btn px-6 py-3 rounded-xl font-bold transition text-gray-500 hover:text-blue-600">My
                    Prescriptions</button>
            </div>`;

const replacement = `<div class="flex items-center gap-6">
                ${target}
                <div class="nav-actions"></div>
            </div>`;

if (!content.includes('nav-actions')) {
    content = content.replace(target, replacement);
}

fs.writeFileSync(file, content);
console.log('Fixed pharmacy.html successfully.');
