document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('categories-container');
    const loading = document.getElementById('loading');

    // Chargement des données
    async function loadTools() {
        try {
            const response = await fetch('/osint4me/data/tools.json');
            if (!response.ok) throw new Error('Fichier non trouvé');
            const data = await response.json();
            loading.style.display = 'none';
            renderCategories(data);
        } catch (error) {
            loading.innerHTML = '❌ Erreur de chargement des données. Vérifiez le fichier tools.json.';
            console.error(error);
        }
    }

    // Regrouper par catégorie
    function groupByCategory(tools) {
        const groups = {};
        tools.forEach(tool => {
            const cat = tool.category || 'Autres';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(tool);
        });
        return groups;
    }

    // Afficher les catégories
    function renderCategories(tools) {
        const groups = groupByCategory(tools);
        const sortedCategories = Object.keys(groups).sort();

        // Compter le total
        const total = tools.length;
        document.getElementById('update-date').textContent =
            new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

        // Créer chaque bloc
        sortedCategories.forEach((cat, index) => {
            const items = groups[cat];
            const block = document.createElement('div');
            block.className = 'category-block';

            // En-tête cliquable
            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `
                <span>
                    <h2>${cat}</h2>
                    <span class="badge">${items.length}</span>
                </span>
                <span class="arrow ${index === 0 ? 'open' : ''}">▼</span>
            `;

            // Liste des outils
            const list = document.createElement('div');
            list.className = `tool-list ${index === 0 ? 'open' : ''}`;

            items.forEach(tool => {
                const item = document.createElement('div');
                item.className = 'tool-item';
                item.innerHTML = `
                    <span class="name">${tool.name}</span>
                    ${tool.description ? `<span class="desc">${tool.description}</span>` : ''}
                    <a href="${tool.url}" target="_blank" rel="noopener noreferrer">Visiter</a>
                `;
                list.appendChild(item);
            });

            // Ouvrir/fermer au clic
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

    // Lancer
    loadTools();
});
