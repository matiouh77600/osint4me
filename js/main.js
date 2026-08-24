document.addEventListener('DOMContentLoaded', () => {
    let toolsData = [];

    // Fonction pour charger les données (depuis votre fichier JSON)
    async function loadTools() {
        try {
            // Assurez-vous que le chemin est correct
            const response = await fetch('data/tools.json');
            toolsData = await response.json();
            // Ajouter une catégorie par défaut si absente
            toolsData = toolsData.map(t => ({ ...t, category: t.category || 'Général' }));
            displayTools(toolsData);
            populateFilters(toolsData);
        } catch (error) {
            console.error('Erreur de chargement des données:', error);
            document.getElementById('toolsGrid').innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#f85149;">Erreur : Impossible de charger les outils.</p>';
        }
    }

    // Afficher les outils dans la grille
    function displayTools(tools) {
        const grid = document.getElementById('toolsGrid');
        const noResults = document.getElementById('noResults');
        grid.innerHTML = '';

        if (tools.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        tools.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.innerHTML = `
                <h3>${tool.name}</h3>
                <span class="category">${tool.category}</span><br>
                <a href="${tool.url}" target="_blank" rel="noopener noreferrer">Visiter</a>
            `;
            grid.appendChild(card);
        });
    }

    // Générer les filtres de catégorie
    function populateFilters(tools) {
        const categories = [...new Set(tools.map(t => t.category))].sort();
        const filterGroup = document.getElementById('categoryFilters');
        // Ajouter un bouton "Tous"
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.textContent = 'Tous';
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

    // Fonction de recherche et filtrage
    function filterTools() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active');
        const selectedCategory = activeFilter ? activeFilter.dataset.category : 'all';

        const filtered = toolsData.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        displayTools(filtered);
    }

    // Écouteurs d'événements
    document.getElementById('searchInput').addEventListener('input', filterTools);
    document.getElementById('categoryFilters').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterTools();
        }
    });

    // Chargement initial
    loadTools();
});
