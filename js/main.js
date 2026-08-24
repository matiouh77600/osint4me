document.addEventListener('DOMContentLoaded', () => {
    let toolsData = [];
    const grid = document.getElementById('toolsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterGroup = document.getElementById('categoryFilters');
    const noResults = document.getElementById('noResults');
    const stats = document.getElementById('stats');

    async function loadTools() {
        try {
            // CHEMIN CORRECT pour GitHub Pages
            const response = await fetch('/osint4me/data/tools.json');
            
            if (!response.ok) {
                throw new Error('Fichier non trouvé');
            }
            
            toolsData = await response.json();
            console.log('Outils chargés :', toolsData.length);
            
            populateFilters();
            displayTools(toolsData);
        } catch (error) {
            console.error('Erreur :', error);
            grid.innerHTML = '<p style="color:#f87171;">⚠️ Erreur de chargement des données</p>';
        }
    }

    function populateFilters() {
        const categories = [...new Set(toolsData.map(t => t.category))];
        
        // Bouton "Tous"
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.textContent = '📌 Tous';
        allBtn.dataset.category = 'all';
        filterGroup.appendChild(allBtn);

        // Boutons par catégorie
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = cat;
            btn.dataset.category = cat;
            filterGroup.appendChild(btn);
        });

        // Événements pour les filtres
        filterGroup.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                applyFilters();
            }
        });

        // Recherche en direct
        searchInput.addEventListener('input', applyFilters);
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeFilter = document.querySelector('.filter-btn.active');
        const selectedCategory = activeFilter ? activeFilter.dataset.category : 'all';

        const filtered = toolsData.filter(tool => {
            const matchSearch = tool.name.toLowerCase().includes(searchTerm) ||
                               (tool.description && tool.description.toLowerCase().includes(searchTerm));
            const matchCategory = selectedCategory === 'all' || tool.category === selectedCategory;
            return matchSearch && matchCategory;
        });

        displayTools(filtered);
        updateStats(filtered.length);
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
            card.innerHTML = `
                <h3>${tool.name}</h3>
                <span class="category">${tool.category}</span>
                ${tool.description ? `<p class="description">${tool.description}</p>` : ''}
                <a href="${tool.url}" target="_blank" rel="noopener noreferrer">🔗 Visiter</a>
            `;
            grid.appendChild(card);
        });
    }

    function updateStats(count) {
        stats.textContent = `📊 ${count} outil${count > 1 ? 's' : ''} sur ${toolsData.length}`;
    }

    // Lancer le chargement
    loadTools();
});
