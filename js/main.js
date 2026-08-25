document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // 1. TRADUCTIONS
    // ============================================================
    const translations = {
        en: {
            'nav.home': 'Tools',
            'nav.ai': 'AI',
            'nav.suggest': 'Suggest',
            'nav.admin': 'Admin',
            'nav.contact': 'Contact',
            'search.placeholder': 'Search tools...',
            'home.title': 'OSINT Tools',
            'home.subtitle': 'Browse by category',
            'ai.title': 'Artificial Intelligence',
            'ai.subtitle': 'AI tools by role',
            'suggest.title': 'Suggest a change',
            'suggest.subtitle': 'Propose new tools or report broken links',
            'suggest.type': 'Type',
            'suggest.type_new': '➕ New tool',
            'suggest.type_broken': '🔗 Broken link',
            'suggest.type_update': '📝 Update',
            'suggest.category': 'Category',
            'suggest.category_choose': 'Choose...',
            'suggest.name': 'Tool name',
            'suggest.url': 'URL',
            'suggest.message': 'Message',
            'suggest.submit': 'Submit',
            'admin.title': 'Administration',
            'admin.subtitle': 'Manage tools.json',
            'admin.refresh': 'Reload',
            'admin.export': 'Export',
            'admin.import': 'Import',
            'admin.save': 'Save',
            'admin.total': 'Total',
            'admin.categories': 'Categories',
            'footer.updated': 'Updated',
            'no_ai': 'No AI tools found. Add some in data/tools.json.',
            'suggest_success': '✅ Thank you! Your suggestion has been recorded.',
            'suggest_error': '❌ Please fill in all required fields.',
            'admin_success': '✅ Data saved successfully!',
            'admin_error': '❌ Invalid JSON format.'
        },
        fr: {
            'nav.home': 'Outils',
            'nav.ai': 'IA',
            'nav.suggest': 'Suggérer',
            'nav.admin': 'Admin',
            'nav.contact': 'Contact',
            'search.placeholder': 'Rechercher un outil...',
            'home.title': 'Outils OSINT',
            'home.subtitle': 'Parcourir par catégorie',
            'ai.title': 'Intelligence Artificielle',
            'ai.subtitle': 'Outils IA par rôle',
            'suggest.title': 'Suggérer une modification',
            'suggest.subtitle': 'Proposer un nouvel outil ou signaler un lien mort',
            'suggest.type': 'Type',
            'suggest.type_new': '➕ Nouvel outil',
            'suggest.type_broken': '🔗 Lien mort',
            'suggest.type_update': '📝 Mettre à jour',
            'suggest.category': 'Catégorie',
            'suggest.category_choose': 'Choisir...',
            'suggest.name': "Nom de l'outil",
            'suggest.url': 'URL',
            'suggest.message': 'Message',
            'suggest.submit': 'Envoyer',
            'admin.title': 'Administration',
            'admin.subtitle': 'Gérer tools.json',
            'admin.refresh': 'Recharger',
            'admin.export': 'Exporter',
            'admin.import': 'Importer',
            'admin.save': 'Sauvegarder',
            'admin.total': 'Total',
            'admin.categories': 'Catégories',
            'footer.updated': 'Mis à jour le',
            'no_ai': 'Aucun outil IA trouvé. Ajoutez-en dans data/tools.json.',
            'suggest_success': '✅ Merci ! Votre suggestion a été enregistrée.',
            'suggest_error': '❌ Veuillez remplir tous les champs obligatoires.',
            'admin_success': '✅ Données sauvegardées avec succès !',
            'admin_error': '❌ Format JSON invalide.'
        }
    };

    let currentLang = 'en';
    let toolsData = [];
    const DATA_URL = './data/tools.json'; // Modifié pour correspondre à ton chemin

    // ============================================================
    // 2. DOM ELEMENTS
    // ============================================================
    const container = document.getElementById('categories-container');
    const aiContainer = document.getElementById('ai-container');
    const suggestForm = document.getElementById('suggest-form');
    const suggestFeedback = document.getElementById('suggest-feedback');
    const adminEditor = document.getElementById('admin-editor');
    const adminFeedback = document.getElementById('admin-feedback');
    const adminTotal = document.getElementById('admin-total');
    const adminCategories = document.getElementById('admin-categories');
    const searchInput = document.getElementById('searchInput');

    // ============================================================
    // 3. VISITOR COUNTER
    // ============================================================
    function updateVisitorCount() {
        let count = parseInt(localStorage.getItem('osint4me_visitors') || '0') + 1;
        localStorage.setItem('osint4me_visitors', count.toString());
        document.getElementById('visitor-count').textContent = count;
    }
    updateVisitorCount();

    // ============================================================
    // 4. NAVIGATION
    // ============================================================
    const navBtns = document.querySelectorAll('.nav-btn');
    const pages = {
        home: document.getElementById('page-home'),
        ai: document.getElementById('page-ai'),
        suggest: document.getElementById('page-suggest'),
        admin: document.getElementById('page-admin')
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            Object.keys(pages).forEach(key => {
                pages[key].classList.toggle('active', key === page);
            });
            // Focus sur la recherche si page home
            if (page === 'home') setTimeout(() => searchInput.focus(), 100);
        });
    });

    // ============================================================
    // 5. LANGUAGE
    // ============================================================
    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
        if (window.toolsData) {
            renderCategories(window.toolsData);
            renderAI(window.toolsData);
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // ============================================================
    // 6. LOAD DATA
    // ============================================================
    async function loadTools() {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error('File not found');
            toolsData = await response.json();
            window.toolsData = toolsData;
            document.getElementById('tools-count').textContent = toolsData.length;
            renderCategories(toolsData);
            renderAI(toolsData);
            populateSuggestCategories(toolsData);
            populateAdmin(toolsData);
            document.getElementById('update-date').textContent =
                new Date().toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });
        } catch (error) {
            container.innerHTML = `<p style="color:#ef4444;text-align:center;padding:40px 0;">❌ Error loading data.</p>`;
        }
    }

    // ============================================================
    // 7. FAVICON HELPER
    // ============================================================
    function getFaviconHtml(url, name) {
        if (!url) return '';
        try {
            const domain = new URL(url).hostname;
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
            return `<img src="${faviconUrl}" alt="${name}" class="favicon" loading="lazy" onerror="this.style.display='none'" />`;
        } catch {
            return '';
        }
    }

    // ============================================================
    // 8. RENDER CATEGORIES (avec favicons)
    // ============================================================
    function groupByCategory(tools) {
        const groups = {};
        tools.forEach(tool => {
            const cat = tool.category || 'Other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(tool);
        });
        return groups;
    }

    // ============================================================
// 8. RENDER CATEGORIES (avec favicons ET descriptions)
// ============================================================
function renderCategories(tools) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const groups = groupByCategory(tools);
    const sorted = Object.keys(groups).sort();
    container.innerHTML = '';
    let totalDisplayed = 0;

    sorted.forEach((cat, index) => {
        let items = groups[cat];
        if (searchTerm) {
            items = items.filter(t =>
                t.name.toLowerCase().includes(searchTerm) ||
                (t.description && t.description.toLowerCase().includes(searchTerm))
            );
        }
        if (items.length === 0) return;
        totalDisplayed += items.length;

        const block = document.createElement('div');
        block.className = 'category-block';

        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <span class="cat-name">${cat} <span class="badge">${items.length}</span></span>
            <span class="arrow ${index === 0 && !searchTerm ? 'open' : ''}">▼</span>
        `;

        const list = document.createElement('div');
        list.className = `tool-list ${index === 0 && !searchTerm ? 'open' : ''}`;

        items.forEach(tool => {
            const item = document.createElement('div');
            item.className = 'tool-item';
            
            const faviconHtml = getFaviconHtml(tool.url, tool.name);
            
            // AJOUT DE LA DESCRIPTION
            const description = tool.description ? `<div class="tool-description">${tool.description}</div>` : '';
            
            // Affichage des tags si présents
            let tagsHtml = '';
            if (tool.tags && tool.tags.length > 0) {
                tagsHtml = `<div class="tool-tags">${tool.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>`;
            }
            
            // Badge "Approuvé" si trusted
            const trustedBadge = tool.trusted ? `<span class="trusted-badge"><i class="fas fa-check-circle"></i> Approuvé</span>` : '';
            
            item.innerHTML = `
                <div class="tool-info">
                    <div class="tool-header">
                        <span class="name">${faviconHtml} ${tool.name}</span>
                        ${trustedBadge}
                    </div>
                    ${description}
                    ${tagsHtml}
                </div>
                <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="go-link">Go</a>
            `;
            list.appendChild(item);
        });

        header.addEventListener('click', () => {
            const isOpen = list.classList.contains('open');
            list.classList.toggle('open');
            header.querySelector('.arrow').classList.toggle('open');
        });

        block.appendChild(header);
        block.appendChild(list);
        container.appendChild(block);
    });

    document.getElementById('tools-count').textContent = totalDisplayed;
}

          
        // Mise à jour du compteur
        document.getElementById('tools-count').textContent = totalDisplayed;
    }

    // ============================================================
    // 9. RENDER AI
    // ============================================================
    function renderAI(tools) {
        const aiTools = tools.filter(t =>
            t.category && (t.category.toLowerCase().includes('ia') ||
                t.category.toLowerCase().includes('intelligence') ||
                t.category.toLowerCase().includes('artificielle') ||
                t.category.toLowerCase().includes('ai'))
        );

        if (aiTools.length === 0) {
            aiContainer.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:40px 0;">${translations[currentLang].no_ai}</p>`;
            return;
        }

        const roles = {
            'Conversational': ['chat', 'conversation', 'assistant', 'gpt', 'claude', 'gemini', 'copilot'],
            'Image': ['image', 'vision', 'stable diffusion', 'midjourney', 'dall-e', 'flux', 'leonardo'],
            'Video': ['video', 'sora', 'runway', 'pika', 'gen-2', 'animated'],
            'Audio': ['audio', 'music', 'speech', 'voice', 'vocal', 'son'],
            'Data Analysis': ['analyse', 'data', 'insight', 'prediction', 'tableau'],
            'Code & Dev': ['code', 'dev', 'script', 'programming', 'programmation'],
            'Other AI': []
        };

        const roleIcons = {
            'Conversational': '💬',
            'Image': '🎨',
            'Video': '🎬',
            'Audio': '🎵',
            'Data Analysis': '📊',
            'Code & Dev': '💻',
            'Other AI': '🤖'
        };

        const grouped = {};
        aiTools.forEach(tool => {
            const lower = (tool.name + ' ' + (tool.description || '')).toLowerCase();
            let assigned = false;
            for (const [role, keywords] of Object.entries(roles)) {
                if (keywords.some(k => lower.includes(k))) {
                    if (!grouped[role]) grouped[role] = [];
                    grouped[role].push(tool);
                    assigned = true;
                    break;
                }
            }
            if (!assigned) {
                if (!grouped['Other AI']) grouped['Other AI'] = [];
                grouped['Other AI'].push(tool);
            }
        });

        aiContainer.innerHTML = '';
        for (const [role, items] of Object.entries(grouped)) {
            const section = document.createElement('div');
            section.style.marginBottom = '20px';
            section.innerHTML = `<div class="ai-section-title">${roleIcons[role] || '🤖'} ${role} (${items.length})</div>`;
            const grid = document.createElement('div');
            grid.className = 'ai-grid';
            items.forEach(tool => {
                const card = document.createElement('div');
                card.className = 'ai-card';
                card.innerHTML = `
                    <div class="ai-icon">${roleIcons[role] || '🤖'}</div>
                    <h3>${tool.name}</h3>
                    <div class="ai-role">${role}</div>
                    ${tool.description ? `<div class="ai-desc">${tool.description}</div>` : ''}
                    <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="go-link">Go</a>
                `;
                grid.appendChild(card);
            });
            section.appendChild(grid);
            aiContainer.appendChild(section);
        }
    }

    // ============================================================
    // 10. SEARCH
    // ============================================================
    searchInput.addEventListener('input', () => {
        if (window.toolsData) renderCategories(window.toolsData);
    });

    // ============================================================
    // 11. SUGGEST FORM
    // ============================================================
    function populateSuggestCategories(tools) {
        const select = document.getElementById('suggest-category');
        const cats = [...new Set(tools.map(t => t.category))].sort();
        cats.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            select.appendChild(opt);
        });
    }

    suggestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = document.getElementById('suggest-message').value.trim();
        if (!message) {
            suggestFeedback.className = 'error';
            suggestFeedback.textContent = translations[currentLang].suggest_error;
            suggestFeedback.style.display = 'block';
            return;
        }
        suggestFeedback.className = 'success';
        suggestFeedback.textContent = translations[currentLang].suggest_success;
        suggestFeedback.style.display = 'block';
        suggestForm.reset();
        setTimeout(() => suggestFeedback.style.display = 'none', 5000);
    });

    // ============================================================
    // 12. ADMIN
    // ============================================================
    function populateAdmin(tools) {
        adminTotal.textContent = tools.length;
        const cats = [...new Set(tools.map(t => t.category))].filter(Boolean);
        adminCategories.textContent = cats.length;
        adminEditor.value = JSON.stringify(tools, null, 2);
    }

    document.getElementById('admin-refresh').addEventListener('click', async () => {
        await loadTools();
        adminFeedback.className = 'success';
        adminFeedback.textContent = translations[currentLang].admin_success;
        adminFeedback.style.display = 'block';
        setTimeout(() => adminFeedback.style.display = 'none', 3000);
    });

    document.getElementById('admin-export').addEventListener('click', () => {
        const blob = new Blob([adminEditor.value], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tools_export.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('admin-import').addEventListener('click', () => {
        document.getElementById('admin-file-input').click();
    });

    document.getElementById('admin-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                adminEditor.value = JSON.stringify(data, null, 2);
                adminFeedback.className = 'success';
                adminFeedback.textContent = '✅ File loaded.';
                adminFeedback.style.display = 'block';
                setTimeout(() => adminFeedback.style.display = 'none', 3000);
            } catch {
                adminFeedback.className = 'error';
                adminFeedback.textContent = '❌ Invalid JSON.';
                adminFeedback.style.display = 'block';
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    document.getElementById('admin-save').addEventListener('click', () => {
        try {
            const data = JSON.parse(adminEditor.value);
            adminFeedback.className = 'success';
            adminFeedback.textContent = translations[currentLang].admin_success;
            adminFeedback.style.display = 'block';
            const blob = new Blob([adminEditor.value], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tools_updated.json';
            a.click();
            URL.revokeObjectURL(url);
            setTimeout(() => adminFeedback.style.display = 'none', 4000);
        } catch {
            adminFeedback.className = 'error';
            adminFeedback.textContent = translations[currentLang].admin_error;
            adminFeedback.style.display = 'block';
        }
    });

    // ============================================================
    // 13. START
    // ============================================================
    setLanguage('en');
    loadTools();
});
