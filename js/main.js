document.addEventListener('DOMContentLoaded', () => {
    let toolsData = [];
    const grid = document.getElementById('toolsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterGroup = document.getElementById('categoryFilters');
    const noResults = document.getElementById('noResults');
    const stats = document.getElementById('resultsStats');

    // Couleurs par catégorie (pour les cartes)
    const categoryColors = {
        'Email temporaire': 'var(--color-email)',
        'Téléphone & SMS': 'var(--color-phone)',
        'Assistant IA': 'var(--color-ai)',
        'Développement': 'var(--color-dev)',
        'Général': 'var(--color-general)'
    };

    async function loadTools() {
        try {
            const response = await fetch('data/tools.json');
            if (!response.ok) throw new Error('Erreur de chargement');
            toolsData = await response.json();
            
            toolsData = toolsData.map(tool => ({
                ...tool,
                category: tool.category || 'Général',
                description: tool.description || ''
            }));

            populateFilters();
            applyFilters();
        } catch (error) {
            grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#f87171;">
                ⚠️ Erreur : impossible de charger les outils.
            </p>`;
        }
    }

    function populateFilters() {
        const categories = [...new Set(toolsData.map(t => t.category))].sort();
        
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.textContent = '📌 Tous';
        allBtn.dataset.category = 'all';
        filterGroup.appendChild(allBtn);

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = cat;
            btn.dataset.category = cat;
            filterGroup.appendChild(btn);
        });
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeFilter = document.querySelector('.filter-btn.active');
        const selectedCategory = activeFilter ? activeFilter.dataset.category : 'all';

        const filtered = toolsData.filter(tool => {
            const matchSearch = tool.name.toLowerCase().includes(searchTerm) ||
                               tool.description.toLowerCase().includes(searchTerm);
            const matchCategory = selectedCategory === 'all' || tool.category === selectedCategory;
            return matchSearch && matchCategory;
        });

        displayTools(filtered);
        stats.textContent = `📊 ${filtered.length} outil${filtered.length > 1 ? 's' : ''} affiché${filtered.length > 1 ? 's' : ''} sur ${toolsData.length}`;
    }

    function displayTools(tools) {
        grid.innerHTML = '';
        noResults.style.display = 'none';

        if (tools.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        tools.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.dataset.category = tool.category; // Pour le CSS

            card.innerHTML = `
                <h3>${tool.name}</h3>
                <span class="category-badge">${tool.category}</span>
                ${tool.description ? `<p class="description">${tool.description}</p>` : ''}
                <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-link">
                    🔗 Visiter
                </a>
            `;
            grid.appendChild(card);
        });
    }

    // Événements
    searchInput.addEventListener('input', applyFilters);
    filterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
    });

    loadTools();
});
