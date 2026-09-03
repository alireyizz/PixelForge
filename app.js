/* =========================================================
   PIXELFORGE
   Main Application
   ========================================================= */

"use strict";


/* =========================================================
   DEFAULT PROJECTS
   ========================================================= */

const defaultProjects = [

    {
        id: 1,
        name: "Pixel Shooter",
        language: "Python",
        description: "Pygame ile geliştirilmiş hızlı tempolu 2D uzay shooter oyunu.",
        price: 0,
        rating: 4.8,
        reviews: 124,
        creator: "CodeMaster",
        icon: "🚀",
        downloads: 1840,
        featured: true
    },

    {
        id: 2,
        name: "Portfolio Pro",
        language: "HTML",
        description: "Modern ve responsive kişisel portfolio web sitesi şablonu.",
        price: 49,
        rating: 4.9,
        reviews: 87,
        creator: "WebForge",
        icon: "💼",
        downloads: 920,
        featured: true
    },

    {
        id: 3,
        name: "Neon UI Kit",
        language: "CSS",
        description: "Cyberpunk tarzında 50+ hazır CSS komponenti.",
        price: 29,
        rating: 4.7,
        reviews: 63,
        creator: "DarkPixel",
        icon: "🎨",
        downloads: 650,
        featured: true
    },

    {
        id: 4,
        name: "Browser RPG",
        language: "JavaScript",
        description: "Canvas tabanlı mini RPG oyun motoru ve örnek oyun.",
        price: 79,
        rating: 5.0,
        reviews: 41,
        creator: "JSWizard",
        icon: "⚔️",
        downloads: 430,
        featured: true
    },

    {
        id: 5,
        name: "Tetris Classic",
        language: "Python",
        description: "Klasik Tetris deneyimini Pygame ile yeniden oluştur.",
        price: 0,
        rating: 4.6,
        reviews: 201,
        creator: "RetroDev",
        icon: "🧱",
        downloads: 3200,
        featured: false
    },

    {
        id: 6,
        name: "Landing Page",
        language: "HTML",
        description: "Ürün ve startup siteleri için modern landing page.",
        price: 15,
        rating: 4.5,
        reviews: 32,
        creator: "DesignLab",
        icon: "🌐",
        downloads: 340,
        featured: false
    },

    {
        id: 7,
        name: "Particle Engine",
        language: "JavaScript",
        description: "Web için hafif ve performanslı parçacık efekt sistemi.",
        price: 35,
        rating: 4.9,
        reviews: 54,
        creator: "PixelDev",
        icon: "✨",
        downloads: 710,
        featured: false
    },

    {
        id: 8,
        name: "Calculator Pro",
        language: "HTML",
        description: "Modern tasarımlı gelişmiş JavaScript hesap makinesi.",
        price: 0,
        rating: 4.4,
        reviews: 76,
        creator: "SimpleCode",
        icon: "🧮",
        downloads: 1100,
        featured: false
    }

];


/* =========================================================
   APP STATE
   ========================================================= */

let projects = [];

let currentFilter = "all";

let searchTerm = "";

let favorites = JSON.parse(
    localStorage.getItem("pixelforge_favorites") || "[]"
);


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadProjects();

    setupSearch();

    setupFilters();

    setupSort();

    setupTheme();

    renderProjects();

});


/* =========================================================
   LOAD PROJECTS
   ========================================================= */

function loadProjects() {

    const savedProjects = localStorage.getItem(
        "pixelforge_projects"
    );

    if (savedProjects) {

        try {

            projects = JSON.parse(savedProjects);

        } catch (error) {

            console.error(
                "Project data could not be loaded:",
                error
            );

            projects = [...defaultProjects];

        }

    } else {

        projects = [...defaultProjects];

    }

    updateProjectCount();
}


/* =========================================================
   SAVE PROJECTS
   ========================================================= */

function saveProjects() {

    localStorage.setItem(
        "pixelforge_projects",
        JSON.stringify(projects)
    );

}


/* =========================================================
   PROJECT COUNT
   ========================================================= */

function updateProjectCount() {

    const element = document.getElementById(
        "projectCount"
    );

    if (element) {

        element.textContent = projects.length;

    }

}


/* =========================================================
   RENDER PROJECTS
   ========================================================= */

function renderProjects() {

    const grid = document.getElementById(
        "projectsGrid"
    );

    const emptyState = document.getElementById(
        "emptyState"
    );

    if (!grid) return;


    let filtered = [...projects];


    /* FILTER */

    if (currentFilter !== "all") {

        if (currentFilter === "free") {

            filtered = filtered.filter(
                project => Number(project.price) === 0
            );

        } else {

            filtered = filtered.filter(
                project =>
                    project.language === currentFilter
            );

        }

    }


    /* SEARCH */

    if (searchTerm.trim() !== "") {

        const term = searchTerm
            .toLowerCase()
            .trim();

        filtered = filtered.filter(project =>

            project.name
                .toLowerCase()
                .includes(term)

            ||

            project.description
                .toLowerCase()
                .includes(term)

            ||

            project.creator
                .toLowerCase()
                .includes(term)

            ||

            project.language
                .toLowerCase()
                .includes(term)

        );

    }


    /* SORT */

    const sortValue =
        document.getElementById("sortSelect")?.value ||
        "default";


    if (sortValue === "rating") {

        filtered.sort(
            (a, b) => b.rating - a.rating
        );

    }

    else if (sortValue === "price-low") {

        filtered.sort(
            (a, b) => a.price - b.price
        );

    }

    else if (sortValue === "price-high") {

        filtered.sort(
            (a, b) => b.price - a.price
        );

    }

    else if (sortValue === "newest") {

        filtered.sort(
            (a, b) => b.id - a.id
        );

    }


    /* EMPTY */

    if (filtered.length === 0) {

        grid.innerHTML = "";

        emptyState.classList.add("show");

        return;

    }

    emptyState.classList.remove("show");


    /* HTML */

    grid.innerHTML = filtered
        .map(createProjectCard)
        .join("");

}


/* =========================================================
   CREATE PROJECT CARD
   ========================================================= */

function createProjectCard(project) {

    const isFavorite =
        favorites.includes(project.id);

    const price =
        Number(project.price);


    const priceHTML =
        price === 0
            ? `<span class="price free">Ücretsiz</span>`
            : `<span class="price">${formatPrice(price)}</span>`;


    return `

        <article
            class="project-card"
            onclick="openProject(${project.id})"
        >

            <div class="project-cover">
                ${project.icon || getLanguageIcon(project.language)}
            </div>


            <div class="project-info">

                <div class="project-top">

                    <h3 class="project-title">
                        ${escapeHTML(project.name)}
                    </h3>

                    <span class="language-badge">
                        ${escapeHTML(project.language)}
                    </span>

                </div>


                <p class="project-description">
                    ${escapeHTML(project.description)}
                </p>


                <div class="project-meta">

                    <span class="rating">
                        ★ ${project.rating}
                        <span style="color:var(--text-muted)">
                            (${project.reviews})
                        </span>
                    </span>

                    ${priceHTML}

                </div>


                <div class="project-bottom">

                    <span class="creator">
                        by
                        <strong>
                            ${escapeHTML(project.creator)}
                        </strong>
                    </span>


                    <div class="project-actions">

                        <button
                            class="small-button favorite ${
                                isFavorite ? "active" : ""
                            }"
                            onclick="toggleFavorite(
                                event,
                                ${project.id}
                            )"
                            title="Favorilere ekle"
                        >
                            ${isFavorite ? "♥" : "♡"}
                        </button>

                    </div>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   OPEN PROJECT
   ========================================================= */

function openProject(id) {

    const project =
        projects.find(
            item => item.id === id
        );

    if (!project) return;


    const modal =
        document.getElementById(
            "projectModal"
        );

    const content =
        document.getElementById(
            "projectModalContent"
        );


    const price =
        Number(project.price);


    content.innerHTML = `

        <div class="project-detail-cover">
            ${project.icon || getLanguageIcon(project.language)}
        </div>


        <span class="section-label">
            ${escapeHTML(project.language)}
        </span>


        <h2 class="detail-title">
            ${escapeHTML(project.name)}
        </h2>


        <div class="rating">
            ★ ${project.rating}
            <span style="color:var(--text-muted)">
                ${project.reviews} değerlendirme
            </span>
        </div>


        <p class="detail-description">
            ${escapeHTML(project.description)}
        </p>


        <div class="detail-row">

            <span>Geliştirici</span>

            <strong>
                ${escapeHTML(project.creator)}
            </strong>

        </div>


        <div class="detail-row">

            <span>İndirme</span>

            <strong>
                ${formatNumber(project.downloads)}
            </strong>

        </div>


        <div class="detail-row">

            <span>Fiyat</span>

            <strong class="detail-price">
                ${
                    price === 0
                        ? "Ücretsiz"
                        : formatPrice(price)
                }
            </strong>

        </div>


        <button
            class="buy-button"
            onclick="buyProject(${project.id})"
        >

            ${
                price === 0
                    ? "Projeyi Al"
                    : `Satın Al • ${formatPrice(price)}`
            }

        </button>

    `;


    modal.classList.add("show");

}


/* =========================================================
   CLOSE PROJECT
   ========================================================= */

function closeProjectModal() {

    document
        .getElementById("projectModal")
        .classList.remove("show");

}


/* =========================================================
   BUY PROJECT
   ========================================================= */

function buyProject(id) {

    const project =
        projects.find(
            item => item.id === id
        );

    if (!project) return;


    if (Number(project.price) === 0) {

        showNotification(
            "Proje indirilmeye hazır! 🚀"
        );

        return;

    }


    showNotification(
        "Ödeme sistemi yakında geliyor 💳"
    );

}


/* =========================================================
   FAVORITE
   ========================================================= */

function toggleFavorite(event, id) {

    event.stopPropagation();


    const index =
        favorites.indexOf(id);


    if (index === -1) {

        favorites.push(id);

        showNotification(
            "Favorilere eklendi ♥"
        );

    } else {

        favorites.splice(index, 1);

        showNotification(
            "Favorilerden kaldırıldı."
        );

    }


    localStorage.setItem(
        "pixelforge_favorites",
        JSON.stringify(favorites)
    );


    renderProjects();

}


/* =========================================================
   UPLOAD MODAL
   ========================================================= */

function openUploadModal() {

    document
        .getElementById("uploadModal")
        .classList.add("show");

}


function closeUploadModal() {

    document
        .getElementById("uploadModal")
        .classList.remove("show");

}


/* =========================================================
   PROJECT FORM
   ========================================================= */

document
    .getElementById("projectForm")
    ?.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("projectName")
                    .value
                    .trim();


            const language =
                document
                    .getElementById("projectLanguage")
                    .value;


            const price =
                Number(
                    document
                        .getElementById("projectPrice")
                        .value
                );


            const description =
                document
                    .getElementById("projectDescription")
                    .value
                    .trim();


            const file =
                document
                    .getElementById("projectFile")
                    .files[0];


            if (!name || !description) {

                showNotification(
                    "Lütfen gerekli alanları doldur."
                );

                return;

            }


            const newProject = {

                id:
                    Date.now(),

                name,

                language,

                description,

                price:
                    price >= 0
                        ? price
                        : 0,

                rating:
                    0,

                reviews:
                    0,

                creator:
                    "Sen",

                icon:
                    getLanguageIcon(language),

                downloads:
                    0,

                featured:
                    false,

                fileName:
                    file
                        ? file.name
                        : null

            };


            projects.unshift(
                newProject
            );


            saveProjects();

            updateProjectCount();

            renderProjects();

            closeUploadModal();


            this.reset();


            showNotification(
                "Projen PixelForge'a eklendi! 🚀"
            );


            scrollToProjects();

        }
    );


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        event => {

            searchTerm =
                event.target.value;

            renderProjects();

        }
    );

}


/* =========================================================
   FILTERS
   ========================================================= */

function setupFilters() {

    const filters =
        document.querySelectorAll(
            ".filter"
        );


    filters.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filters.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderProjects();

            }
        );

    });

}


/* =========================================================
   FILTER PROJECTS
   ========================================================= */

function filterProjects(language) {

    currentFilter =
        language;


    document
        .querySelectorAll(".filter")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === language
            );

        });


    renderProjects();

    scrollToProjects();

}


/* =========================================================
   SHOW ALL
   ========================================================= */

function showAllProjects() {

    currentFilter = "all";

    searchTerm = "";


    const input =
        document.getElementById(
            "searchInput"
        );


    if (input) {

        input.value = "";

    }


    document
        .querySelectorAll(".filter")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === "all"
            );

        });


    renderProjects();

}


/* =========================================================
   SORT
   ========================================================= */

function setupSort() {

    const select =
        document.getElementById(
            "sortSelect"
        );


    if (!select) return;


    select.addEventListener(
        "change",
        renderProjects
    );

}


/* =========================================================
   SCROLL
   ========================================================= */

function scrollToProjects() {

    document
        .getElementById("featured")
        ?.scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   HOME
   ========================================================= */

function showHome() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   THEME
   ========================================================= */

function setupTheme() {

    const button =
        document.getElementById(
            "themeButton"
        );


    const savedTheme =
        localStorage.getItem(
            "pixelforge_theme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light"
        );

        button.textContent = "☾";

    }


    button.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light"
            );


            const light =
                document.body.classList.contains(
                    "light"
                );


            localStorage.setItem(
                "pixelforge_theme",
                light
                    ? "light"
                    : "dark"
            );


            button.textContent =
                light
                    ? "☾"
                    : "☀";

        }
    );

}


/* =========================================================
   NOTIFICATION
   ========================================================= */

let toastTimeout;


function showNotification(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const messageElement =
        document.getElementById(
            "toastMessage"
        );


    messageElement.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* =========================================================
   LANGUAGE ICON
   ========================================================= */

function getLanguageIcon(language) {

    const icons = {

        Python: "🐍",

        HTML: "🌐",

        CSS: "🎨",

        JavaScript: "⚡"

    };


    return icons[language] || "📦";

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(price) {

    return `${Number(price).toFixed(2)} ₺`;

}


/* =========================================================
   NUMBER
   ========================================================= */

function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString("tr-TR");

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal-overlay"
            )
        ) {

            event.target.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeUploadModal();

            closeProjectModal();

        }

    }
);
