/* =========================================================
   PIXELFORGE
   Main Application
   ========================================================= */

"use strict";

const PixelForgeApp = (() => {

    /* =====================================================
       GAME DATA
       ===================================================== */

    const games = [
        {
            id: "agar-evolution",
            title: "Agar Evolution",
            type: "Game",
            platform: "Windows",
            category: "Action",
            genres: ["Action", "Arcade", "Multiplayer"],
            version: "1.0.0",
            description:
                "Grow, survive and dominate the arena. Collect food, defeat opponents and become the largest cell.",
            features: [
                "Large open arena",
                "AI opponents",
                "Mass system",
                "Smooth movement",
                "High FPS gameplay"
            ],
            fileName: "AgarEvolution.zip",
            fileSize: "45 MB",
            releaseDate: "2026-09-01",
            featured: true,
            status: "Released",
            icon: "AE",
            color: "violet",
            downloadUrl: ""
        },

        {
            id: "dragon-egg-rng",
            title: "Dragon Egg RNG",
            type: "Game",
            platform: "Windows",
            category: "RNG",
            genres: ["RNG", "Fantasy", "Casual"],
            version: "1.0.0",
            description:
                "Open mysterious dragon eggs and discover creatures ranging from common dragons to incredibly rare legends.",
            features: [
                "Dragon collection",
                "RNG system",
                "Rare eggs",
                "Inventory system",
                "Luck mechanics"
            ],
            fileName: "DragonEggRNG.zip",
            fileSize: "72 MB",
            releaseDate: "2026-08-30",
            featured: true,
            status: "Released",
            icon: "DE",
            color: "blue",
            downloadUrl: ""
        },

        {
            id: "mmxi",
            title: "MMXI",
            type: "Game",
            platform: "Windows",
            category: "Survival",
            genres: ["Survival", "Mystery", "Action"],
            version: "1.0.0",
            description:
                "A tense murder mystery survival experience where every player has a role and nobody is completely safe.",
            features: [
                "Murder mystery",
                "Multiple roles",
                "Round system",
                "Survival gameplay",
                "Atmospheric maps"
            ],
            fileName: "MMXI.zip",
            fileSize: "110 MB",
            releaseDate: "2026-08-28",
            featured: true,
            status: "Released",
            icon: "XI",
            color: "red",
            downloadUrl: ""
        },

        {
            id: "pixel-tools",
            title: "Pixel Tools",
            type: "App",
            platform: "Windows",
            category: "Utility",
            genres: ["Utility", "Tools", "Productivity"],
            version: "1.0.0",
            description:
                "A collection of lightweight utilities designed for developers and creators.",
            features: [
                "Developer tools",
                "Fast startup",
                "Simple interface",
                "Lightweight",
                "Offline support"
            ],
            fileName: "PixelTools.zip",
            fileSize: "18 MB",
            releaseDate: "2026-08-25",
            featured: false,
            status: "Released",
            icon: "PT",
            color: "green",
            downloadUrl: ""
        }
    ];


    /* =====================================================
       UPDATES
       ===================================================== */

    const updates = [
        {
            type: "UPDATE",
            title: "PixelForge has launched",
            description:
                "Welcome to PixelForge. The platform is now ready for games and applications.",
            date: "Sep 2, 2026",
            icon: "🚀"
        },

        {
            type: "NEW",
            title: "Agar Evolution added",
            description:
                "Agar Evolution is now available in the PixelForge library.",
            date: "Sep 1, 2026",
            icon: "🎮"
        },

        {
            type: "NEW",
            title: "Dragon Egg RNG added",
            description:
                "The first RNG title has arrived on PixelForge.",
            date: "Aug 30, 2026",
            icon: "🐉"
        },

        {
            type: "NEW",
            title: "MMXI added",
            description:
                "MMXI has joined the PixelForge game collection.",
            date: "Aug 28, 2026",
            icon: "🕵️"
        }
    ];


    /* =====================================================
       STATE
       ===================================================== */

    const state = {
        currentView: "dashboard",
        selectedGame: null,
        currentFilter: "all",
        currentSort: "featured",
        likedGames: JSON.parse(
            localStorage.getItem("pixelforge_likes") || "[]"
        ),
        downloads: Number(
            localStorage.getItem("pixelforge_downloads") || "0"
        ),
        settings: {
            theme:
                localStorage.getItem("pixelforge_theme") || "dark",

            accent:
                localStorage.getItem("pixelforge_accent") || "violet",

            reducedMotion:
                localStorage.getItem("pixelforge_reduced_motion") === "true"
        }
    };


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));


    /* =====================================================
       SAFE TEXT
       ===================================================== */

    function setText(selector, value) {
        const element = $(selector);

        if (element) {
            element.textContent = value ?? "";
        }
    }


    /* =====================================================
       LOADING SCREEN
       ===================================================== */

    function startLoading() {
        const screen = $("#loadingScreen");
        const progress = $("#loadingProgress");
        const status = $("#loadingStatus");
        const percent = $("#loadingPercent");

        if (!screen) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {

            let value = 0;

            const messages = [
                "Initializing PixelForge...",
                "Loading game library...",
                "Preparing interface...",
                "Loading preferences...",
                "Almost ready..."
            ];

            let messageIndex = 0;

            const interval = setInterval(() => {

                value += Math.floor(Math.random() * 13) + 7;

                if (value >= 100) {
                    value = 100;
                }

                if (progress) {
                    progress.style.width = `${value}%`;
                }

                if (percent) {
                    percent.textContent = `${value}%`;
                }

                if (status) {
                    const index = Math.min(
                        Math.floor(value / 20),
                        messages.length - 1
                    );

                    if (index !== messageIndex) {
                        messageIndex = index;
                    }

                    status.textContent = messages[messageIndex];
                }

                if (value >= 100) {

                    clearInterval(interval);

                    setTimeout(() => {

                        screen.classList.add("loaded");

                        screen.style.opacity = "0";
                        screen.style.visibility = "hidden";
                        screen.style.pointerEvents = "none";

                        setTimeout(() => {
                            screen.style.display = "none";
                            resolve();
                        }, 550);

                    }, 180);
                }

            }, 100);

        });
    }


    /* =====================================================
       NAVIGATION
       ===================================================== */

    function navigate(view) {

        if (!view) {
            return;
        }

        const target = $(`#view-${view}`);

        if (!target) {
            return;
        }

        state.currentView = view;

        $$("[data-view-panel]").forEach((panel) => {
            panel.classList.remove("active");
        });

        target.classList.add("active");

        $$("[data-view]").forEach((item) => {

            const itemView = item.dataset.view;

            item.classList.toggle(
                "active",
                itemView === view
            );
        });

        const root = $("#viewRoot");

        if (root) {
            root.dataset.currentView = view;
        }

        const breadcrumb = $("#breadcrumbCurrent");

        if (breadcrumb) {

            const names = {
                dashboard: "Dashboard",
                library: "Library",
                updates: "Updates",
                featured: "Featured",
                categories: "Categories",
                about: "About"
            };

            breadcrumb.textContent =
                names[view] || "Dashboard";
        }

        closeSidebar();
        closeNotifications();
        closeProfileMenu();

        window.scrollTo({
            top: 0,
            behavior: state.settings.reducedMotion
                ? "auto"
                : "smooth"
        });
    }


    /* =====================================================
       SIDEBAR
       ===================================================== */

    function openSidebar() {

        const sidebar = $(".sidebar");

        if (sidebar) {
            sidebar.classList.add("is-open");
        }

        const backdrop = $("#globalBackdrop");

        if (backdrop) {
            backdrop.classList.add("active");
        }
    }


    function closeSidebar() {

        const sidebar = $(".sidebar");

        if (sidebar) {
            sidebar.classList.remove("is-open");
        }

        const backdrop = $("#globalBackdrop");

        if (backdrop) {
            backdrop.classList.remove("active");
        }
    }


    /* =====================================================
       PROFILE
       ===================================================== */

    function toggleProfileMenu() {

        const menu = $("#profileMenu");

        if (!menu) {
            return;
        }

        menu.classList.toggle("open");
    }


    function closeProfileMenu() {

        const menu = $("#profileMenu");

        if (menu) {
            menu.classList.remove("open");
        }
    }


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    function openNotifications() {

        const panel = $("#notificationPanel");

        if (!panel) {
            return;
        }

        panel.classList.add("open");

        panel.setAttribute("aria-hidden", "false");

        const button =
            $('[data-action="toggle-notifications"]');

        if (button) {
            button.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }


    function closeNotifications() {

        const panel = $("#notificationPanel");

        if (!panel) {
            return;
        }

        panel.classList.remove("open");

        panel.setAttribute("aria-hidden", "true");

        const button =
            $('[data-action="toggle-notifications"]');

        if (button) {
            button.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    function toggleNotifications() {

        const panel = $("#notificationPanel");

        if (!panel) {
            return;
        }

        if (panel.classList.contains("open")) {
            closeNotifications();
        } else {
            openNotifications();
        }
    }


    /* =====================================================
       MODALS
       ===================================================== */

    function openModal(id) {

        const modal = $(`#${id}`);

        if (!modal) {
            return;
        }

        modal.classList.add("open");

        modal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    }


    function closeModal(modalOrId) {

        let modal = null;

        if (typeof modalOrId === "string") {
            modal = $(`#${modalOrId}`);
        } else {
            modal = modalOrId;
        }

        if (!modal) {
            return;
        }

        modal.classList.remove("open");

        modal.setAttribute("aria-hidden", "true");

        if (!$$(".modal.open").length) {
            document.body.style.overflow = "";
        }
    }


    function closeAllModals() {

        $$(".modal.open").forEach((modal) => {
            closeModal(modal);
        });
    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function openSearch() {

        openModal("searchModal");

        const input = $("#globalSearch");

        if (input) {
            setTimeout(() => {
                input.focus();
                input.select();
            }, 100);
        }

        renderSearchResults("");
    }


    function renderSearchResults(query = "") {

        const container = $("#searchResults");

        if (!container) {
            return;
        }

        const search = query
            .trim()
            .toLowerCase();

        const results = games.filter((game) => {

            if (!search) {
                return true;
            }

            const text = [
                game.title,
                game.type,
                game.category,
                game.platform,
                ...game.genres
            ]
                .join(" ")
                .toLowerCase();

            return text.includes(search);
        });

        container.innerHTML = "";

        const noResults = $("#searchNoResults");

        if (noResults) {
            noResults.style.display =
                results.length ? "none" : "";
        }

        results.forEach((game) => {

            const item =
                document.createElement("button");

            item.className = "search-result";

            item.dataset.gameId = game.id;

            item.innerHTML = `
                <div class="search-result-icon">
                    ${game.icon}
                </div>

                <div class="search-result-info">
                    <strong>${escapeHTML(game.title)}</strong>
                    <span>
                        ${escapeHTML(game.type)}
                        •
                        ${escapeHTML(game.category)}
                        •
                        ${escapeHTML(game.platform)}
                    </span>
                </div>

                <span class="search-result-arrow">›</span>
            `;

            container.appendChild(item);
        });
    }


    /* =====================================================
       GAME FILTERING
       ===================================================== */

    function getFilteredGames() {

        let result = [...games];

        if (state.currentFilter !== "all") {

            const filter =
                state.currentFilter.toLowerCase();

            result = result.filter((game) => {

                return (
                    game.platform.toLowerCase() === filter ||
                    game.type.toLowerCase() === filter ||
                    game.category.toLowerCase() === filter ||
                    game.genres.some(
                        (genre) =>
                            genre.toLowerCase() === filter
                    )
                );
            });
        }

        switch (state.currentSort) {

            case "newest":
                result.sort(
                    (a, b) =>
                        new Date(b.releaseDate) -
                        new Date(a.releaseDate)
                );
                break;

            case "name":
                result.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
                break;

            case "featured":
            default:
                result.sort((a, b) =>
                    Number(b.featured) -
                    Number(a.featured)
                );
                break;
        }

        return result;
    }


    /* =====================================================
       GAME CARD
       ===================================================== */

    function renderGameCard(game) {

        const template = $("#gameCardTemplate");

        if (!template) {
            return createFallbackCard(game);
        }

        const clone =
            template.content.cloneNode(true);

        const card =
            clone.querySelector(".game-card");

        if (!card) {
            return clone;
        }

        card.dataset.gameId = game.id;
        card.dataset.platform = game.platform;
        card.dataset.category = game.category;
        card.dataset.type = game.type;

        const title =
            card.querySelector(".game-card-title");

        if (title) {
            title.textContent = game.title;
        }

        const category =
            card.querySelector(".game-card-category");

        if (category) {
            category.textContent =
                `${game.type} • ${game.category}`;
        }

        const description =
            card.querySelector(".game-card-description");

        if (description) {
            description.textContent =
                game.description;
        }

        const version =
            card.querySelector(".game-card-version");

        if (version) {
            version.textContent =
                `v${game.version}`;
        }

        const logo =
            card.querySelector(".game-card-logo");

        if (logo) {
            logo.textContent = game.icon;
        }

        const cover =
            card.querySelector(".game-card-cover");

        if (cover) {

            const backgrounds = {
                violet:
                    "radial-gradient(circle at 30% 20%, rgba(167,139,250,.25), transparent 25%), linear-gradient(135deg,#4c1d95,#111827 65%,#090a0f)",

                blue:
                    "radial-gradient(circle at 30% 20%, rgba(96,165,250,.25), transparent 25%), linear-gradient(135deg,#1e3a8a,#111827 65%,#090a0f)",

                red:
                    "radial-gradient(circle at 30% 20%, rgba(248,113,113,.25), transparent 25%), linear-gradient(135deg,#7f1d1d,#111827 65%,#090a0f)",

                green:
                    "radial-gradient(circle at 30% 20%, rgba(74,222,128,.25), transparent 25%), linear-gradient(135deg,#14532d,#111827 65%,#090a0f)"
            };

            cover.style.background =
                backgrounds[game.color] ||
                backgrounds.violet;
        }

        const likeButton =
            card.querySelector(
                '[data-action="like-game"]'
            );

        if (likeButton) {

            const liked =
                state.likedGames.includes(game.id);

            likeButton.classList.toggle(
                "liked",
                liked
            );

            likeButton.setAttribute(
                "aria-pressed",
                String(liked)
            );

            const count =
                likeButton.querySelector(
                    "[data-like-count]"
                );

            if (count) {
                count.textContent =
                    liked ? "♥" : "♡";
            }
        }

        return clone;
    }


    function createFallbackCard(game) {

        const wrapper =
            document.createElement("div");

        wrapper.innerHTML = `
            <article class="game-card"
                data-game-id="${game.id}"
                data-platform="${game.platform}"
                data-category="${game.category}">

                <div class="game-card-cover">
                    <div class="game-card-cover-content">
                        <span class="game-card-type">
                            ${escapeHTML(game.type)}
                        </span>

                        <div class="game-card-logo">
                            ${escapeHTML(game.icon)}
                        </div>
                    </div>
                </div>

                <div class="game-card-content">

                    <div class="game-card-title-row">
                        <div>
                            <h3 class="game-card-title">
                                ${escapeHTML(game.title)}
                            </h3>

                            <span class="game-card-category">
                                ${escapeHTML(game.category)}
                            </span>
                        </div>

                        <span class="game-card-version">
                            v${escapeHTML(game.version)}
                        </span>
                    </div>

                    <p class="game-card-description">
                        ${escapeHTML(game.description)}
                    </p>

                    <div class="game-card-footer">

                        <button
                            class="card-details-button"
                            data-action="open-game-details"
                            data-game-id="${game.id}">
                            Details
                        </button>

                        <button
                            class="card-download-button"
                            data-action="open-download"
                            data-game-id="${game.id}">
                            Download
                        </button>

                    </div>
                </div>
            </article>
        `;

        return wrapper.firstElementChild;
    }


    /* =====================================================
       RENDER GAME CONTAINER
       ===================================================== */

    function renderGameContainer(selector, list) {

        const container = $(selector);

        if (!container) {
            return;
        }

        container.innerHTML = "";

        list.forEach((game) => {

            const card = renderGameCard(game);

            container.appendChild(card);
        });

        if (!list.length) {

            const empty =
                document.createElement("div");

            empty.className = "empty-state";

            empty.innerHTML = `
                <div class="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>
                    Try another category or search filter.
                </p>
            `;

            container.appendChild(empty);
        }
    }


    /* =====================================================
       RENDER ALL GAMES
       ===================================================== */

    function renderGames() {

        const filtered = getFilteredGames();

        const dashboard =
            games
                .filter((game) => game.featured)
                .slice(0, 3);

        const featured =
            games
                .filter((game) => game.featured);

        renderGameContainer(
            "#dashboardGames",
            dashboard
        );

        renderGameContainer(
            "#libraryGames",
            filtered
        );

        renderGameContainer(
            "#featuredGames",
            featured
        );

        updateGameStats();
    }


    /* =====================================================
       GAME DETAILS
       ===================================================== */

    function getGame(id) {

        return games.find(
            (game) => game.id === id
        ) || null;
    }


    function openGameDetails(id) {

        const game = getGame(id);

        if (!game) {
            return;
        }

        state.selectedGame = game;

        setText(
            "#gameDetailsTitle",
            game.title
        );

        setText(
            "#gameDetailsBadge",
            `${game.type} • ${game.category}`
        );

        setText(
            "#gameDetailsDescription",
            game.description
        );

        setText(
            "#gameDetailsVersion",
            `v${game.version}`
        );

        setText(
            "#gameDetailsPlatform",
            game.platform
        );

        setText(
            "#gameDetailsGenre",
            game.genres.join(", ")
        );

        setText(
            "#gameDetailsMeta",
            `${game.status} • ${game.releaseDate}`
        );

        const cover =
            $("#gameDetailsCover");

        if (cover) {

            const colors = {
                violet:
                    "radial-gradient(circle at 50% 35%, rgba(167,139,250,.3), transparent 30%), linear-gradient(135deg,#4c1d95,#111827 65%,#090a0f)",

                blue:
                    "radial-gradient(circle at 50% 35%, rgba(96,165,250,.3), transparent 30%), linear-gradient(135deg,#1e3a8a,#111827 65%,#090a0f)",

                red:
                    "radial-gradient(circle at 50% 35%, rgba(248,113,113,.3), transparent 30%), linear-gradient(135deg,#7f1d1d,#111827 65%,#090a0f)",

                green:
                    "radial-gradient(circle at 50% 35%, rgba(74,222,128,.3), transparent 30%), linear-gradient(135deg,#14532d,#111827 65%,#090a0f)"
            };

            cover.style.background =
                colors[game.color] ||
                colors.violet;
        }

        const features =
            $("#gameDetailsFeatures");

        if (features) {

            features.innerHTML = "";

            game.features.forEach((feature) => {

                const tag =
                    document.createElement("span");

                tag.className = "feature-tag";

                tag.textContent = feature;

                features.appendChild(tag);
            });
        }

        const icon =
            $("#gameDetailsIcon");

        if (icon) {
            icon.textContent = game.icon;
        }

        openModal("gameDetailsModal");
    }


    /* =====================================================
       DOWNLOAD MODAL
       ===================================================== */

    function openDownload(id) {

        const game = getGame(id);

        if (!game) {
            return;
        }

        state.selectedGame = game;

        setText(
            "#downloadTitle",
            `Download ${game.title}`
        );

        setText(
            "#downloadGameName",
            game.title
        );

        setText(
            "#downloadGameVersion",
            `v${game.version}`
        );

        setText(
            "#downloadFileName",
            game.fileName
        );

        setText(
            "#downloadFileSize",
            game.fileSize
        );

        setText(
            "#downloadGameIcon",
            game.icon
        );

        openModal("downloadModal");
    }


    function confirmDownload() {

        const game = state.selectedGame;

        if (!game) {
            showToast(
                "No game selected.",
                "error"
            );

            return;
        }

        let url = game.downloadUrl;

        const downloadButton =
            $('[data-action="confirm-download"]');

        if (
            downloadButton &&
            downloadButton.dataset.downloadUrl
        ) {
            url =
                downloadButton.dataset.downloadUrl;
        }

        if (!url) {

            showToast(
                `${game.title} için henüz indirme bağlantısı eklenmedi.`,
                "error"
            );

            return;
        }

        state.downloads++;

        localStorage.setItem(
            "pixelforge_downloads",
            String(state.downloads)
        );

        updateGameStats();

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

        closeModal("downloadModal");

        showToast(
            `${game.title} download started.`,
            "success"
        );
    }


    /* =====================================================
       LIKE SYSTEM
       ===================================================== */

    function toggleLike(id) {

        const index =
            state.likedGames.indexOf(id);

        if (index === -1) {

            state.likedGames.push(id);

            showToast(
                "Added to your favorites.",
                "success"
            );

        } else {

            state.likedGames.splice(index, 1);

            showToast(
                "Removed from your favorites.",
                "success"
            );
        }

        localStorage.setItem(
            "pixelforge_likes",
            JSON.stringify(state.likedGames)
        );

        renderGames();
    }


    /* =====================================================
       STATS
       ===================================================== */

    function updateGameStats() {

        const gameCount =
            games.filter(
                (game) => game.type === "Game"
            ).length;

        const appCount =
            games.filter(
                (game) => game.type === "App"
            ).length;

        const total =
            games.length;

        const gameStats =
            $("#gameCount");

        const appStats =
            $("#appCount");

        const totalStats =
            $("#totalCount");

        const downloadStats =
            $("#downloadCount");

        if (gameStats) {
            gameStats.textContent = gameCount;
        }

        if (appStats) {
            appStats.textContent = appCount;
        }

        if (totalStats) {
            totalStats.textContent = total;
        }

        if (downloadStats) {
            downloadStats.textContent =
                state.downloads;
        }
    }


    /* =====================================================
       UPDATES
       ===================================================== */

    function renderUpdates() {

        const containers = [
            "#dashboardUpdates",
            "#updatesTimeline"
        ];

        containers.forEach((selector) => {

            const container = $(selector);

            if (!container) {
                return;
            }

            container.innerHTML = "";

            updates.forEach((update) => {

                const template =
                    $("#updateItemTemplate");

                if (template) {

                    const clone =
                        template.content.cloneNode(true);

                    const item =
                        clone.querySelector(".update-item");

                    if (item) {

                        const type =
                            item.querySelector(".update-type");

                        const title =
                            item.querySelector("h3");

                        const description =
                            item.querySelector("p");

                        const date =
                            item.querySelector("time");

                        const icon =
                            item.querySelector(".update-icon");

                        if (type) {
                            type.textContent =
                                update.type;
                        }

                        if (title) {
                            title.textContent =
                                update.title;
                        }

                        if (description) {
                            description.textContent =
                                update.description;
                        }

                        if (date) {
                            date.textContent =
                                update.date;
                        }

                        if (icon) {
                            icon.textContent =
                                update.icon;
                        }
                    }

                    container.appendChild(clone);

                } else {

                    const item =
                        document.createElement("div");

                    item.className =
                        "update-item";

                    item.innerHTML = `
                        <div class="update-icon">
                            ${update.icon}
                        </div>

                        <div class="update-content">
                            <div class="update-top">
                                <span class="update-type">
                                    ${escapeHTML(update.type)}
                                </span>

                                <time>
                                    ${escapeHTML(update.date)}
                                </time>
                            </div>

                            <h3>
                                ${escapeHTML(update.title)}
                            </h3>

                            <p>
                                ${escapeHTML(update.description)}
                            </p>
                        </div>
                    `;

                    container.appendChild(item);
                }
            });
        });
    }


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    function renderNotifications() {

        const container =
            $("#notificationList");

        if (!container) {
            return;
        }

        const notifications = [
            {
                icon: "🚀",
                title: "Welcome to PixelForge",
                text: "The platform is now online.",
                time: "Just now"
            },

            {
                icon: "🎮",
                title: "New games available",
                text: "Check out the latest PixelForge releases.",
                time: "Today"
            },

            {
                icon: "⚡",
                title: "PixelForge is growing",
                text: "More games and applications are coming soon.",
                time: "Today"
            }
        ];

        container.innerHTML = "";

        notifications.forEach((notification) => {

            const template =
                $("#notificationTemplate");

            if (template) {

                const clone =
                    template.content.cloneNode(true);

                const item =
                    clone.querySelector(".notification-item");

                if (item) {

                    const icon =
                        item.querySelector(".notification-icon");

                    const title =
                        item.querySelector("strong");

                    const text =
                        item.querySelector("p");

                    const time =
                        item.querySelector("time");

                    if (icon) {
                        icon.textContent =
                            notification.icon;
                    }

                    if (title) {
                        title.textContent =
                            notification.title;
                    }

                    if (text) {
                        text.textContent =
                            notification.text;
                    }

                    if (time) {
                        time.textContent =
                            notification.time;
                    }
                }

                container.appendChild(clone);

            } else {

                const item =
                    document.createElement("div");

                item.className =
                    "notification-item";

                item.innerHTML = `
                    <div class="notification-icon">
                        ${notification.icon}
                    </div>

                    <div class="notification-content">
                        <strong>
                            ${escapeHTML(notification.title)}
                        </strong>

                        <p>
                            ${escapeHTML(notification.text)}
                        </p>

                        <time>
                            ${escapeHTML(notification.time)}
                        </time>
                    </div>
                `;

                container.appendChild(item);
            }
        });
    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    function applySettings() {

        const root =
            document.documentElement;

        let theme =
            state.settings.theme;

        if (theme === "system") {

            theme =
                window.matchMedia(
                    "(prefers-color-scheme: light)"
                ).matches
                    ? "light"
                    : "dark";
        }

        root.dataset.theme = theme;

        root.dataset.accent =
            state.settings.accent;

        root.classList.toggle(
            "reduced-motion",
            state.settings.reducedMotion
        );

        const themeSelect =
            $("#themeSelect");

        if (themeSelect) {
            themeSelect.value =
                state.settings.theme;
        }

        const reduced =
            $("#reducedMotionToggle");

        if (reduced) {
            reduced.checked =
                state.settings.reducedMotion;
        }

        $$("[data-accent]").forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.accent ===
                state.settings.accent
            );
        });
    }


    function saveSettings() {

        localStorage.setItem(
            "pixelforge_theme",
            state.settings.theme
        );

        localStorage.setItem(
            "pixelforge_accent",
            state.settings.accent
        );

        localStorage.setItem(
            "pixelforge_reduced_motion",
            String(state.settings.reducedMotion)
        );

        applySettings();
    }


    /* =====================================================
       CATEGORIES
       ===================================================== */

    function selectCategory(category) {

        state.currentFilter =
            category || "all";

        $$("[data-filter]").forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.filter ===
                state.currentFilter
            );
        });

        navigate("library");

        renderGames();
    }


    /* =====================================================
       SORT
       ===================================================== */

    function changeSort(value) {

        state.currentSort =
            value || "featured";

        renderGames();
    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message, type = "info") {

        let container =
            $("#toastContainer");

        if (!container) {

            container =
                document.createElement("div");

            container.id =
                "toastContainer";

            container.className =
                "toast-container";

            document.body.appendChild(container);
        }

        const toast =
            document.createElement("div");

        toast.className =
            `toast ${type}`;

        const icon =
            type === "success"
                ? "✓"
                : type === "error"
                    ? "!"
                    : "i";

        toast.innerHTML = `
            <span class="toast-icon">
                ${icon}
            </span>

            <span>
                ${escapeHTML(message)}
            </span>
        `;

        container.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("removing");

            setTimeout(() => {
                toast.remove();
            }, 250);

        }, 3000);
    }


    /* =====================================================
       HTML ESCAPE
       ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       EVENT HANDLER
       ===================================================== */

    function handleAction(action, element) {

        switch (action) {

            case "go-home":
                navigate("dashboard");
                break;


            case "open-sidebar":
                openSidebar();
                break;


            case "close-sidebar":
                closeSidebar();
                break;


            case "open-search":
                openSearch();
                break;


            case "toggle-notifications":
                toggleNotifications();
                break;


            case "close-notifications":
                closeNotifications();
                break;


            case "open-settings":
                openModal("settingsModal");
                break;


            case "open-about":
                navigate("about");
                break;


            case "open-profile":
                toggleProfileMenu();
                break;


            case "close-modal":
                closeModal(
                    element.closest(".modal")
                );
                break;


            case "open-game-details":
                openGameDetails(
                    element.dataset.gameId
                );
                break;


            case "open-download":
                openDownload(
                    element.dataset.gameId
                );
                break;


            case "open-download-from-details":

                if (state.selectedGame) {

                    closeModal(
                        "gameDetailsModal"
                    );

                    openDownload(
                        state.selectedGame.id
                    );
                }

                break;


            case "confirm-download":
                confirmDownload();
                break;


            case "like-game":
                toggleLike(
                    element.dataset.gameId
                );
                break;


            case "game-menu":
                showToast(
                    "Game menu coming soon.",
                    "info"
                );
                break;


            default:
                break;
        }
    }


    /* =====================================================
       EVENT LISTENERS
       ===================================================== */

    function setupEvents() {

        document.addEventListener(
            "click",
            (event) => {

                const actionElement =
                    event.target.closest(
                        "[data-action]"
                    );

                if (actionElement) {

                    event.preventDefault();

                    handleAction(
                        actionElement.dataset.action,
                        actionElement
                    );

                    return;
                }

                const viewElement =
                    event.target.closest(
                        "[data-view]"
                    );

                if (viewElement) {

                    event.preventDefault();

                    navigate(
                        viewElement.dataset.view
                    );

                    return;
                }

                const viewTarget =
                    event.target.closest(
                        "[data-view-target]"
                    );

                if (viewTarget) {

                    event.preventDefault();

                    navigate(
                        viewTarget.dataset.viewTarget
                    );

                    return;
                }

                const gameResult =
                    event.target.closest(
                        ".search-result"
                    );

                if (gameResult) {

                    const id =
                        gameResult.dataset.gameId;

                    closeModal("searchModal");

                    openGameDetails(id);

                    return;
                }

                const category =
                    event.target.closest(
                        "[data-category]"
                    );

                if (category) {

                    selectCategory(
                        category.dataset.category
                    );

                    return;
                }

                if (
                    event.target.matches(
                        ".modal-backdrop"
                    )
                ) {

                    closeModal(
                        event.target.closest(".modal")
                    );
                }
            }
        );


        document.addEventListener(
            "click",
            (event) => {

                const profile =
                    $(".profile-wrapper");

                const menu =
                    $("#profileMenu");

                if (
                    profile &&
                    menu &&
                    !profile.contains(event.target)
                ) {
                    closeProfileMenu();
                }
            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key.toLowerCase() === "k"
                ) {

                    event.preventDefault();

                    openSearch();

                    return;
                }

                if (event.key === "Escape") {

                    const search =
                        $("#searchModal");

                    if (
                        search &&
                        search.classList.contains("open")
                    ) {
                        closeModal(search);
                        return;
                    }

                    if ($$(".modal.open").length) {
                        closeAllModals();
                        return;
                    }

                    closeNotifications();
                    closeProfileMenu();
                    closeSidebar();
                }
            }
        );


        const searchInput =
            $("#globalSearch");

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                () => {
                    renderSearchResults(
                        searchInput.value
                    );
                }
            );
        }


        const sort =
            $("#gameSort");

        if (sort) {

            sort.addEventListener(
                "change",
                () => {
                    changeSort(sort.value);
                }
            );
        }


        const theme =
            $("#themeSelect");

        if (theme) {

            theme.addEventListener(
                "change",
                () => {

                    state.settings.theme =
                        theme.value;

                    saveSettings();
                }
            );
        }


        const reducedMotion =
            $("#reducedMotionToggle");

        if (reducedMotion) {

            reducedMotion.addEventListener(
                "change",
                () => {

                    state.settings.reducedMotion =
                        reducedMotion.checked;

                    saveSettings();
                }
            );
        }


        $$("[data-accent]").forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const accent =
                            button.dataset.accent;

                        if (!accent) {
                            return;
                        }

                        state.settings.accent =
                            accent;

                        saveSettings();

                        showToast(
                            `Accent changed to ${accent}.`,
                            "success"
                        );
                    }
                );
            }
        );


        $$("[data-filter]").forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        selectCategory(
                            button.dataset.filter
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       INIT
       ===================================================== */

    async function init() {

        try {

            applySettings();

            setupEvents();

            renderGames();

            renderUpdates();

            renderNotifications();

            updateGameStats();

            await startLoading();

        } catch (error) {

            console.error(
                "PixelForge initialization error:",
                error
            );

            showToast(
                "PixelForge loaded with some minor issues.",
                "error"
            );

        } finally {

            const loading =
                $("#loadingScreen");

            if (loading) {

                loading.classList.add("loaded");

                loading.style.opacity = "0";
                loading.style.visibility = "hidden";
                loading.style.pointerEvents = "none";

                setTimeout(() => {
                    loading.style.display = "none";
                }, 600);
            }
        }
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    return {
        init,
        games,
        updates,
        state,
        navigate,
        openGameDetails,
        openDownload,
        showToast
    };

})();


/* =========================================================
   START PIXELFORGE
   ========================================================= */

window.PixelForgeApp = PixelForgeApp;

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {
            PixelForgeApp.init();
        },
        { once: true }
    );

} else {

    PixelForgeApp.init();
}
