let allTools = [];
let activeCategory = "all";

async function loadTools() {
  try {
    const response = await fetch(
      "./data/tools.json"
    );

    allTools = await response.json();

    renderTools(allTools);

  } catch (error) {
    console.error(
      "Impossible de charger les outils",
      error
    );
  }
}

function renderTools(tools) {

  const container =
    document.getElementById("tools-container");

  if (!container) return;

  if (!tools.length) {

    container.innerHTML = `
      <div class="empty-state">
        Aucun outil trouvé.
      </div>
    `;

    return;
  }

  container.innerHTML =
    tools.map(tool => `

      <article class="tool-card">

        <h3>${escapeHtml(tool.name)}</h3>

        <p>
          ${escapeHtml(
            tool.description ||
            "No description available."
          )}
        </p>

        <div class="tool-meta">

          <span class="category">
            ${escapeHtml(tool.category)}
          </span>

          ${tool.tags.map(tag => `
            <span class="tag">
              ${escapeHtml(tag)}
            </span>
          `).join("")}

        </div>

        <a
          href="${escapeAttribute(tool.url)}"
          target="_blank"
          rel="noopener noreferrer"
          class="tool-link"
        >
          Open tool ↗
        </a>

      </article>

    `).join("");
}

function searchTools(query) {

  const search = query
    .toLowerCase()
    .trim();

  let results = allTools;

  if (activeCategory !== "all") {

    results = results.filter(tool =>
      tool.category === activeCategory
    );
  }

  if (search) {

    results = results.filter(tool => {

      const searchable = [
        tool.name,
        tool.description,
        tool.category,
        tool.subcategory,
        ...(tool.tags || [])
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(search);
    });
  }

  renderTools(results);
}

function setCategory(category) {

  activeCategory = category;

  const searchInput =
    document.getElementById("tool-search");

  searchTools(
    searchInput ? searchInput.value : ""
  );
}

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadTools();

    const search =
      document.getElementById("tool-search");

    if (search) {

      search.addEventListener(
        "input",
        event => {

          searchTools(
            event.target.value
          );

        }
      );
    }

  }
);
