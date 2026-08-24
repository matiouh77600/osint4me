let tools = [];
let tutorials = [];

const toolsGrid =
    document.getElementById("toolsGrid");

const tutorialsGrid =
    document.getElementById("tutorialsGrid");

const categoriesGrid =
    document.getElementById("categoriesGrid");

const searchInput =
    document.getElementById("search");

const resultCount =
    document.getElementById("resultCount");


const categoryIcons = {

    "Search Engines":
        "fa-solid fa-magnifying-glass",

    "People":
        "fa-solid fa-user",

    "Emails":
        "fa-solid fa-envelope",

    "Social Networks":
        "fa-solid fa-share-nodes",

    "Images":
        "fa-solid fa-image",

    "Geolocation":
        "fa-solid fa-location-dot",

    "Maps":
        "fa-solid fa-map",

    "Phone Numbers":
        "fa-solid fa-phone",

    "Domains":
        "fa-solid fa-globe",

    "Cyber":
        "fa-solid fa-shield-halved",

    "News":
        "fa-solid fa-newspaper",

    "Archives":
        "fa-solid fa-box-archive",

    "Tutorials":
        "fa-solid fa-book",

    "Utilities":
        "fa-solid fa-toolbox"

};


async function loadData() {

    try {

        const toolsResponse =
            await fetch("data/tools.json");

        const tutorialsResponse =
            await fetch("data/tutorials.json");

        tools =
            await toolsResponse.json();

        tutorials =
            await tutorialsResponse.json();

        renderCategories();
        renderTools(tools);
        renderTutorials();

    } catch (error) {

        console.error(error);

        toolsGrid.innerHTML = `
            <div class="empty">
                Unable to load resources.
            </div>
        `;
    }
}


function renderCategories() {

    const categories =
        [...new Set(
            tools.map(tool => tool.category)
        )];

    categoriesGrid.innerHTML =
        categories.map(category => {

            const count =
                tools.filter(
                    tool => tool.category === category
                ).length;

            const icon =
                categoryIcons[category] ||
                "fa-solid fa-folder";

            return `

                <article
                    class="category-card"
                    data-category="${escapeHtml(category)}"
                >

                    <div class="category-icon">
                        <i class="${icon}"></i>
                    </div>

                    <h3>
                        ${escapeHtml(category)}
                    </h3>

                    <p>
                        ${count} resource${count > 1 ? "s" : ""}
                    </p>

                </article>

            `;

        }).join("");


    document
        .querySelectorAll(".category-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const category =
                        card.dataset.category;

                    searchInput.value = "";

                    renderTools(
                        tools.filter(
                            tool =>
                                tool.category === category
                        )
                    );

                    document
                        .getElementById("tools")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        });
}


function renderTools(list) {

    resultCount.textContent =
        `${list.length} resource${list.length > 1 ? "s" : ""}`;


    if (!list.length) {

        toolsGrid.innerHTML = `

            <div class="empty">

                <i class="fa-solid fa-magnifying-glass"></i>

                <br><br>

                No resources found.

            </div>

        `;

        return;
    }


    toolsGrid.innerHTML =

        list.map(tool => `

            <a
                class="tool-card"
                href="${safeUrl(tool.url)}"
                target="_blank"
                rel="noopener noreferrer"
            >

                <div class="tool-icon">

                    <i class="${escapeHtml(
                        tool.icon ||
                        "fa-solid fa-link"
                    )}"></i>

                </div>

                <div class="tool-content">

                    <h3>
                        ${escapeHtml(tool.name)}
                    </h3>

                    <p>
                        ${escapeHtml(tool.description)}
                    </p>

                    <span class="tool-category">
                        ${escapeHtml(tool.category)}
                    </span>

                </div>

                <div class="tool-open">

                    <i class="fa-solid fa-arrow-up-right-from-square"></i>

                </div>

            </a>

        `).join("");
}


function renderTutorials() {

    tutorialsGrid.innerHTML =

        tutorials.map(tutorial => `

            <a
                class="tutorial-card"
                href="${safeUrl(tutorial.url)}"
                ${tutorial.url !== "#"
                    ? 'target="_blank" rel="noopener noreferrer"'
                    : ""}
            >

                <span class="tutorial-tag">

                    ${escapeHtml(
                        tutorial.category
                    )}

                </span>

                <h3>
                    ${escapeHtml(
                        tutorial.title
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        tutorial.description
                    )}
                </p>

                <div class="tutorial-meta">

                    <span>
                        <i class="fa-regular fa-clock"></i>
                        ${escapeHtml(
                            tutorial.duration
                        )}
                    </span>

                    <span>
                        <i class="fa-solid fa-book-open"></i>
                        Tutorial
                    </span>

                </div>

            </a>

        `).join("");
}


searchInput.addEventListener(
    "input",
    event => {

        const query =
            event.target.value
                .toLowerCase()
                .trim();


        if (!query) {

            renderTools(tools);

            return;
        }


        const filtered =
            tools.filter(tool =>

                tool.name
                    .toLowerCase()
                    .includes(query)

                ||

                tool.description
                    .toLowerCase()
                    .includes(query)

                ||

                tool.category
                    .toLowerCase()
                    .includes(query)

            );


        renderTools(filtered);

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            (event.ctrlKey || event.metaKey)
            &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            searchInput.focus();

        }

    }
);


function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function safeUrl(value) {

    if (!value) return "#";

    try {

        const url =
            new URL(value, window.location.href);

        if (
            url.protocol === "http:" ||
            url.protocol === "https:"
        ) {

            return url.href;

        }

    } catch {}

    return "#";
}


loadData();
