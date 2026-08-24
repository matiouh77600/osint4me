document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // 1. TRADUCTIONS
    // ============================================================
    const translations = {
        en: {
            'nav.home': 'Home',
            'nav.ai': 'AI',
            'nav.suggest': 'Suggest',
            'nav.admin': 'Admin',
            'nav.contact': 'Contact',
            'home.title': 'OSINT Directory',
            'home.subtitle': 'Browse tools by category',
            'home.visitors': 'visitors',
            'ai.title': 'Artificial Intelligence',
            'ai.subtitle': 'AI tools classified by role',
            'suggest.title': 'Suggest a change',
            'suggest.subtitle': 'Propose a new tool or report a broken link',
            'suggest.type': 'Suggestion type',
            'suggest.type_new': '➕ New tool',
            'suggest.type_broken': '🔗 Broken link',
            'suggest.type_update': '📝 Update tool',
            'suggest.name': 'Tool name',
            'suggest.url': 'URL (if applicable)',
            'suggest.category': 'Category',
            'suggest.category_choose': 'Choose a category...',
            'suggest.message': 'Message / Description',
            'suggest.submit': 'Submit suggestion',
            'admin.title': 'Administration',
            'admin.subtitle': 'Manage tools on the fly',
            'admin.refresh': 'Reload data',
            'admin.export': 'Export JSON',
            'admin.import': 'Import JSON',
            'admin.editor': 'JSON Editor',
            'admin.save': 'Save',
            'admin.total': 'Total tools :',
            'admin.categories': 'Categories :',
            'footer.updated': 'Data updated',
            'no_ai': 'No AI tools found. Add some in data/tools.json.',
            'suggest_success': '✅ Thank you! Your suggestion has been recorded (simulation).',
            'suggest_error': '❌ Please fill in all required fields.',
            'admin_success': '✅ Data saved successfully!',
            'admin_error': '❌ Invalid JSON format. Please check your syntax.'
        },
        fr: {
            'nav.home': 'Accueil',
            'nav.ai': 'IA',
            'nav.suggest': 'Suggérer',
            'nav.admin': 'Admin',
            'nav.contact': 'Contact',
            'home.title': 'Annuaire OSINT',
            'home.subtitle': 'Explorez les outils par catégorie',
            'home.visitors': 'visiteurs',
            'ai.title': 'Intelligence Artificielle',
            'ai.subtitle': 'Outils IA classés par rôle',
            'suggest.title': 'Suggérer une modification',
            'suggest.subtitle': 'Proposez un nouvel outil ou signalez un lien mort',
            'suggest.type': 'Type de suggestion',
            'suggest.type_new': '➕ Nouvel outil',
            'suggest.type_broken': '🔗 Lien mort',
            'suggest.type_update': '📝 Mettre à jour',
            'suggest.name': "Nom de l'outil",
            'suggest.url': 'URL (si applicable)',
            'suggest.category': 'Catégorie',
            'suggest.category_choose': 'Choisir une catégorie...',
            'suggest.message': 'Message / Description',
            'suggest.submit': 'Envoyer la suggestion',
            'admin.title': 'Administration',
            'admin.subtitle': 'Gérez les outils à la volée',
            'admin.refresh': 'Recharger',
            'admin.export': 'Exporter JSON',
            'admin.import': 'Importer JSON',
            'admin.editor': 'Éditeur JSON',
            'admin.save': 'Sauvegarder',
            'admin.total': 'Total outils :',
            'admin.categories': 'Catégories :',
            'footer.updated': 'Données mises à jour le',
            'no_ai': 'Aucun outil IA trouvé. Ajoutez-en dans data/tools.json.',
            'suggest_success': '✅ Merci ! Votre suggestion a été enregistrée (simulation).',
            'suggest_error': '❌ Veuillez remplir tous les champs obligatoires.',
            'admin_success': '✅ Données sauvegardées avec succès !',
            'admin_error': '❌ Format JSON invalide. Vérifiez votre syntaxe.'
        }
    };

    let currentLang = 'en';

    // ============================================================
    // 2. ÉLÉMENTS DOM
    // ============================================================
    const container = document.getElementById('categories-container');
    const aiContainer = document.getElementById('ai-container');
    const suggestForm = document.getElementById('suggest-form');
    const suggestFeedback = document.getElementById('suggest-feedback');
    const adminEditor = document.getElementById('admin-editor');
    const adminFeedback = document.getElementById('admin-feedback');
    const adminTotal = document.getElementById('admin-total');
    const adminCategories = document.getElementById('admin-categories');

    // ============================================================
    // 3. COMPTEUR DE VISITES
    // ============================================================
    function updateVisitorCount() {
        let count = parseInt(localStorage.getItem('osint4me_visitors') || '0');
        count += 1;
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
        });
    });

    // ============================================================
    // 5. LANGUE
    // ============================================================
    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        // Mettre à jour tous les éléments avec data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        // Mettre à jour les placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
        // Recharger l'affichage des catégories pour les labels dynamiques
        if (window.toolsData) {
            renderCategories(window.toolsData);
            renderAI(window.toolsData);
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });

    // ============================================================
    // 6. CHARGEMENT DES DONNÉES
    // ============================================================
    let toolsData = [];
    const DATA_URL = '/osint4me/data/tools.json';

    async function loadTools() {
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error('File not found');
            toolsData = await response.json();
            window.toolsData = toolsData;
            renderCategories(toolsData);
            renderAI(toolsData);
            populateSuggestCategories(toolsData);
            populateAdmin(toolsData);
            document.getElementById('update-date').textContent =
                new Date().toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = `<p style="color:#ef4444;">❌ Error loading data.</p>`;
        }
    }

    // ============================================================
    // 7. AFFICHAGE CATÉGORIES
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

    function renderCategories(tools) {
        const groups = groupByCategory(tools);
        const sorted = Object.keys(groups).sort();
        container.innerHTML = '';

        sorted.forEach((cat, index) => {
            const items = groups[cat];
            const block = document.createElement('div');
            block.className = 'category-block';

            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `
                <h3>${cat} <span class="badge">${items.length}</span></h3>
                <span class="arrow ${index === 0 ? 'open' : ''}">▼</span>
            `;

            const list = document.createElement('div');
            list.className = `tool-list ${index === 0 ? 'open' : ''}`;

            items.forEach(tool => {
                const item = document.createElement('div');
                item.className = 'tool-item';
                item.innerHTML = `
                    <span class="name">${tool.name}</span>
                    ${tool.description ? `<span class="desc">${tool.description}</span>` : ''}
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
    }

    // ============================================================
    // 8. AFFICHAGE IA
    // ============================================================
    function renderAI(tools) {
        const aiTools = tools.filter(t =>
            t.category && (t.category.toLowerCase().includes('ia') ||
                t.category.toLowerCase().includes('intelligence') ||
                t.category.toLowerCase().includes('artificielle'))
        );

        if (aiTools.length === 0) {
            aiContainer.innerHTML = `<p style="color:var(--text-secondary);">${translations[currentLang].no_ai}</p>`;
            return;
        }

        const roles = {
            'Conversational': ['chat', 'conversation', 'assistant', 'gpt', 'claude', 'gemini', 'copilot'],
            'Image': ['image', 'vision', 'stable diffusion', 'midjourney', 'dall-e', 'flux', 'leonardo'],
            'Video': ['vidéo', 'video', 'sora', 'runway', 'pika', 'gen-2', 'animated'],
            'Audio': ['audio', 'musique', 'music', 'speech', 'voice', 'vocal', 'son'],
            'Data Analysis': ['analyse', 'analyse de données', 'data', 'tableau', 'insight', 'prediction'],
            'Code & Dev': ['code', 'programmation', 'dev', 'script', 'copilot', 'cursor', 'windy'],
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
            section.style.marginBottom = '24px';
            section.innerHTML = `<h3 style="color:var(--accent-cyan);margin-bottom:12px;">${roleIcons[role] || '🤖'} ${role} (${items.length})</h3>`;
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
    // 9. FORMULAIRE DE SUGGESTION
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
        const type = document.getElementById('suggest-type').value;
        const name = document.getElementById('suggest-name').value.trim();
        const url = document.getElementById('suggest-url').value.trim();
        const category = document.getElementById('suggest-category').value;
        const message = document.getElementById('suggest-message').value.trim();

        if (!message) {
            suggestFeedback.className = 'error';
            suggestFeedback.textContent = translations[currentLang].suggest_error;
            suggestFeedback.style.display = 'block';
            return;
        }

        // Simulation d'envoi
        suggestFeedback.className = 'success';
        suggestFeedback.textContent = translations[currentLang].suggest_success;
        suggestFeedback.style.display = 'block';
        suggestForm.reset();
        setTimeout(() => {
            suggestFeedback.style.display = 'none';
        }, 6000);
    });

    // ============================================================
    // 10. ADMIN
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
                adminFeedback.textContent = '✅ File loaded successfully.';
                adminFeedback.style.display = 'block';
                setTimeout(() => adminFeedback.style.display = 'none', 3000);
            } catch (err) {
                adminFeedback.className = 'error';
                adminFeedback.textContent = '❌ Invalid JSON file.';
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
            // En production, on enverrait au serveur. Ici on simule.
            // Vous pouvez télécharger le fichier modifié :
            const blob = new Blob([adminEditor.value], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tools_updated.json';
            a.click();
            URL.revokeObjectURL(url);
            setTimeout(() => adminFeedback.style.display = 'none', 4000);
        } catch (err) {
            adminFeedback.className = 'error';
            adminFeedback.textContent = translations[currentLang].admin_error;
            adminFeedback.style.display = 'block';
        }
    });

    // ============================================================
    // 11. LANCEMENT
    // ============================================================
    // Définir la langue par défaut (anglais)
    setLanguage('en');
    loadTools();

});
