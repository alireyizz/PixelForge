/* =========================================================
   PIXELFORGE
   Main Application
   ========================================================= */

"use strict";

const PixelForgeApp = (() => {

    /* =====================================================
       GAME CATALOG
       ===================================================== */

    const games = [];


    /* =====================================================
       UPDATES
       ===================================================== */

    const updates = [];


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
                localStorage.getItem(
                    "pixelforge_reduced_motion"
                ) === "true"
        }
    };


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    const $ = (selector, parent = document) => {
        return parent.querySelector(selector);
    };


    const $$ = (selector, parent = document) => {
        return Array.from(
            parent.querySelectorAll(selector)
        );
    };


    /* =====================================================
       SAFE TEXT
       ===================================================== */

    function setText(selector, value) {

        const element = $(selector);

        if (!element) {
            return;
        }

        element.textContent = value ?? "";
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
       LOADING SCREEN
       ===================================================== */

    function startLoading() {

        const screen = $("#loadingScreen");

        if (!screen) {
            return Promise.resolve();
        }

        const progress =
            $("#loadingProgress");

        const status =
            $("#loadingStatus");

        const percent =
            $("#loadingPercent");

        const messages = [
            "Initializing PixelForge...",
            "Loading game library...",
            "Preparing interface...",
            "Loading preferences...",
            "Almost ready..."
        ];

        return new Promise((resolve) => {

            let value = 0;

            let messageIndex = 0;

            const interval =
                setInterval(() => {

                    value +=
                        Math.floor(
                            Math.random() * 12
                        ) + 8;

                    if (value > 100) {
                        value = 100;
                    }

                    if (progress) {
                        progress.style.width =
                            `${value}%`;
                    }

                    if (percent) {
                        percent.textContent =
                            `${value}%`;
                    }

                    const newMessageIndex =
                        Math.min(
                            Math.floor(value / 20),
                            messages.length - 1
                        );

                    if (
                        newMessageIndex !==
                        messageIndex
                    ) {

                        messageIndex =
                            newMessageIndex;
                    }

                    if (status) {

                        status.textContent =
                            messages[messageIndex];
                    }

                    if (value >= 100) {

                        clearInterval(interval);

                        setTimeout(() => {

                            hideLoadingScreen();

                            resolve();

                        }, 250);
                    }

                }, 100);
        });
    }


    function hideLoadingScreen() {

        const screen =
            $("#loadingScreen");

        if (!screen) {
            return;
        }

        screen.classList.add("loaded");

        screen.style.opacity = "0";

        screen.style.visibility =
            "hidden";

        screen.style.pointerEvents =
            "none";

        setTimeout(() => {

            screen.style.display =
                "none";

        }, 600);
    }


    /* =====================================================
       NAVIGATION
       ===================================================== */

    function navigate(view) {

        if (!view) {
            return;
        }

        const target =
            $(`#view-${view}`);

        if (!target) {
            return;
        }

        state.currentView =
            view;


        $$("[data-view-panel]")
            .forEach((panel) => {

                panel.classList.remove(
                    "active"
                );
            });


        target.classList.add(
            "active"
        );


        $$("[data-view]")
            .forEach((item) => {

                item.classList.toggle(
                    "active",
                    item.dataset.view === view
                );
            });


        const root =
            $("#viewRoot");

        if (root) {

            root.dataset.currentView =
                view;
        }


        const breadcrumb =
            $("#breadcrumbCurrent");

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
            behavior:
                state.settings.reducedMotion
                    ? "auto"
                    : "smooth"
        });
    }


    /* =====================================================
       SIDEBAR
       ===================================================== */

    function openSidebar() {

        const sidebar =
            $(".sidebar");

        if (sidebar) {

            sidebar.classList.add(
                "is-open"
            );
        }

        const backdrop =
            $("#globalBackdrop");

        if (backdrop) {

            backdrop.classList.add(
                "active"
            );
        }
    }


    function closeSidebar() {

        const sidebar =
            $(".sidebar");

        if (sidebar) {

            sidebar.classList.remove(
                "is-open"
            );
        }

        const backdrop =
            $("#globalBackdrop");

        if (backdrop) {

            backdrop.classList.remove(
                "active"
            );
        }
    }


    /* =====================================================
       PROFILE MENU
       ===================================================== */

    function toggleProfileMenu() {

        const menu =
            $("#profileMenu");

        if (!menu) {
            return;
        }

        const isOpen =
            menu.classList.toggle("open");

        const button =
            $("#profileButton");

        if (button) {

            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }

        menu.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );
    }


    function closeProfileMenu() {

        const menu =
            $("#profileMenu");

        if (menu) {

            menu.classList.remove(
                "open"
            );

            menu.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        const button =
            $("#profileButton");

        if (button) {

            button.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    function openNotifications() {

        const panel =
            $("#notificationPanel");

        if (!panel) {
            return;
        }

        panel.classList.add(
            "open"
        );

        panel.setAttribute(
            "aria-hidden",
            "false"
        );

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

        const panel =
            $("#notificationPanel");

        if (!panel) {
            return;
        }

        panel.classList.remove(
            "open"
        );

        panel.setAttribute(
            "aria-hidden",
            "true"
        );

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

        const panel =
            $("#notificationPanel");

        if (!panel) {
            return;
        }

        if (
            panel.classList.contains(
                "open"
            )
        ) {

            closeNotifications();

        } else {

            openNotifications();
        }
    }


    /* =====================================================
       MODALS
       ===================================================== */

    function openModal(id) {

        const modal =
            $(`#${id}`);

        if (!modal) {
            return;
        }

        modal.classList.add(
            "open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";
    }


    function closeModal(modalOrId) {

        let modal = null;

        if (
            typeof modalOrId ===
            "string"
        ) {

            modal =
                $(`#${modalOrId}`);

        } else {

            modal =
                modalOrId;
        }

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (
            !$$(".modal.open").length
        ) {

            document.body.style.overflow =
                "";
        }
    }


    function closeAllModals() {

        $$(".modal.open")
            .forEach((modal) => {

                closeModal(modal);
            });
    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function openSearch() {

        openModal(
            "searchModal"
        );

        const input =
            $("#globalSearch");

        if (input) {

            setTimeout(() => {

                input.focus();

                input.select();

            }, 100);
        }

        renderSearchResults("");
    }


    function renderSearchResults(query = "") {

        const container =
            $("#searchResults");

        if (!container) {
            return;
        }

        const search =
            query
                .trim()
                .toLowerCase();


        const results =
            games.filter((game) => {

                if (!search) {
                    return true;
                }

                const text = [
                    game.title,
                    game.type,
                    game.category,
                    game.platform,
                    ...(game.genres || [])
                ]
                    .join(" ")
                    .toLowerCase();

                return text.includes(
                    search
                );
            });


        container.innerHTML = "";


        const noResults =
            $("#searchNoResults");

        if (noResults) {

            noResults.hidden =
                results.length !== 0;
        }


        results.forEach((game) => {

            const item =
                document.createElement(
                    "button"
                );

            item.type =
                "button";

            item.className =
                "search-result";

            item.dataset.gameId =
                game.id;

            item.innerHTML = `
                <div class="search-result-icon">
                    ${escapeHTML(game.icon || "PF")}
                </div>

                <div class="search-result-info">

                    <strong>
                        ${escapeHTML(game.title)}
                    </strong>

                    <span>
                        ${escapeHTML(game.type || "")}
                        •
                        ${escapeHTML(game.category || "")}
                        •
                        ${escapeHTML(game.platform || "")}
                    </span>

                </div>

                <span class="search-result-arrow">
                    ›
                </span>
            `;

            container.appendChild(
                item
            );
        });
    }


    /* =====================================================
       GAME FILTERING
       ===================================================== */

    function getFilteredGames() {

        let result =
            [...games];


        if (
            state.currentFilter !==
            "all"
        ) {

            const filter =
                state.currentFilter
                    .toLowerCase();


            if (filter === "featured") {

                result =
                    result.filter(
                        (game) =>
                            Boolean(
                                game.featured
                            )
                    );

            } else {

                result =
                    result.filter((game) => {

                        const type =
                            (
                                game.type ||
                                ""
                            )
                                .toLowerCase();

                        const normalizedType =
                            type === "app"
                                ? "application"
                                : type;


                        return (
                            (
                                game.platform ||
                                ""
                            )
                                .toLowerCase() ===
                            filter ||

                            normalizedType ===
                            filter ||

                            (
                                game.category ||
                                ""
                            )
                                .toLowerCase() ===
                            filter ||

                            (
                                game.genres || []
                            ).some(
                                (genre) =>
                                    String(
                                        genre
                                    )
                                        .toLowerCase() ===
                                    filter
                            )
                        );
                    });
            }
        }


        switch (
            state.currentSort
        ) {

            case "newest":

                result.sort(
                    (a, b) =>
                        new Date(
                            b.releaseDate || 0
                        ) -
                        new Date(
                            a.releaseDate || 0
                        )
                );

                break;


            case "name":

                result.sort(
                    (a, b) =>
                        String(
                            a.title || ""
                        ).localeCompare(
                            String(
                                b.title || ""
                            )
                        )
                );

                break;


            case "featured":

            default:

                result.sort(
                    (a, b) =>
                        Number(
                            Boolean(
                                b.featured
                            )
                        ) -
                        Number(
                            Boolean(
                                a.featured
                            )
                        )
                );

                break;
        }


        return result;
    }


    /* =====================================================
       EMPTY STATE
       ===================================================== */

    function createEmptyState(
        title = "Nothing here yet",
        description =
            "Games and applications will appear here when they are added."
    ) {

        const element =
            document.createElement(
                "div"
            );

        element.className =
            "empty-state";

        element.innerHTML = `
            <div class="empty-icon">
                ✦
            </div>

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(description)}
            </p>
        `;

        return element;
    }


    /* =====================================================
       GAME CARD
       ===================================================== */

    function renderGameCard(game) {

        const template =
            $("#gameCardTemplate");


        if (!template) {

            return createFallbackCard(
                game
            );
        }


        const clone =
            template.content.cloneNode(
                true
            );


        const card =
            clone.querySelector(
                ".game-card"
            );


        if (!card) {
            return clone;
        }


        card.dataset.gameId =
            game.id || "";

        card.dataset.platform =
            game.platform || "";

        card.dataset.category =
            game.category || "";

        card.dataset.type =
            game.type || "";


        const title =
            card.querySelector(
                "[data-game-title], .game-card-title"
            );

        if (title) {

            title.textContent =
                game.title || "Untitled";
        }


        const category =
            card.querySelector(
                "[data-game-category], .game-card-category"
            );

        if (category) {

            category.textContent =
                `${game.type || "Game"} • ${game.category || "Other"}`;
        }


        const description =
            card.querySelector(
                "[data-game-description], .game-card-description"
            );

        if (description) {

            description.textContent =
                game.description || "";
        }


        const version =
            card.querySelector(
                "[data-game-version], .game-card-version"
            );

        if (version) {

            version.textContent =
                `v${game.version || "1.0.0"}`;
        }


        const logo =
            card.querySelector(
                "[data-game-logo], .game-card-logo"
            );

        if (logo) {

            logo.textContent =
                game.icon || "PF";
        }


        const type =
            card.querySelector(
                "[data-game-type], .game-card-type"
            );

        if (type) {

            type.textContent =
                game.type || "GAME";
        }


        const cover =
            card.querySelector(
                "[data-game-cover], .game-card-cover"
            );

        if (
            cover &&
            game.cover
        ) {

            cover.style.backgroundImage =
                `url("${String(game.cover).replace(/"/g, '\\"')}")`;

            cover.classList.add(
                "has-custom-cover"
            );
        }


        const likeButton =
            card.querySelector(
                '[data-action="game-like"], [data-action="like-game"]'
            );

        if (likeButton) {

            likeButton.dataset.gameId =
                game.id || "";

            const liked =
                state.likedGames.includes(
                    game.id
                );

            likeButton.classList.toggle(
                "liked",
                liked
            );

            likeButton.setAttribute(
                "aria-pressed",
                String(liked)
            );

            const icon =
                likeButton.querySelector(
                    "span"
                );

            if (icon) {

                icon.textContent =
                    liked ? "♥" : "♡";
            }

            const count =
                likeButton.querySelector(
                    "[data-like-count]"
                );

            if (count) {

                count.textContent =
                    liked ? "1" : "0";
            }
        }


        const detailsButton =
            card.querySelector(
                '[data-action="open-game-details"]'
            );

        if (detailsButton) {

            detailsButton.dataset.gameId =
                game.id || "";
        }


        const downloadButton =
            card.querySelector(
                '[data-action="open-download"]'
            );

        if (downloadButton) {

            downloadButton.dataset.gameId =
                game.id || "";
        }


        return clone;
    }


    function createFallbackCard(game) {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.innerHTML = `
            <article
                class="game-card"
                data-game-id="${escapeHTML(game.id || "")}"
                data-platform="${escapeHTML(game.platform || "")}"
                data-category="${escapeHTML(game.category || "")}"
                data-type="${escapeHTML(game.type || "")}"
            >

                <div class="game-card-cover">

                    <div class="game-card-cover-content">

                        <span class="game-card-type">
                            ${escapeHTML(game.type || "Game")}
                        </span>

                        <div class="game-card-logo">
                            ${escapeHTML(game.icon || "PF")}
                        </div>

                    </div>

                    <button
                        class="game-like-button"
                        type="button"
                        data-action="game-like"
                        data-game-id="${escapeHTML(game.id || "")}"
                        aria-label="Like project"
                        aria-pressed="false"
                    >
                        <span>♡</span>

                        <span
                            class="game-like-count"
                            data-like-count
                        >
                            0
                        </span>
                    </button>

                </div>


                <div class="game-card-content">

                    <div class="game-card-title-row">

                        <div>

                            <h3 class="game-card-title">
                                ${escapeHTML(game.title || "Untitled")}
                            </h3>

                            <span class="game-card-category">
                                ${escapeHTML(game.type || "Game")}
                                •
                                ${escapeHTML(game.category || "Other")}
                            </span>

                        </div>

                        <span class="game-card-version">
                            v${escapeHTML(game.version || "1.0.0")}
                        </span>

                    </div>


                    <p class="game-card-description">
                        ${escapeHTML(game.description || "")}
                    </p>


                    <div class="game-card-footer">

                        <button
                            class="card-details-button"
                            type="button"
                            data-action="open-game-details"
                            data-game-id="${escapeHTML(game.id || "")}"
                        >
                            Details
                        </button>

                        <button
                            class="card-download-button"
                            type="button"
                            data-action="open-download"
                            data-game-id="${escapeHTML(game.id || "")}"
                        >
                            <span>↓</span>
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

    function renderGameContainer(
        selector,
        list,
        emptyTitle =
            "No games yet",
        emptyDescription =
            "Games and applications will appear here when they are added to PixelForge."
    ) {

        const container =
            $(selector);

        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (!list.length) {

            container.appendChild(
                createEmptyState(
                    emptyTitle,
                    emptyDescription
                )
            );

            return;
        }


        list.forEach((game) => {

            const card =
                renderGameCard(game);

            container.appendChild(
                card
            );
        });
    }


    /* =====================================================
       RENDER ALL GAMES
       ===================================================== */

    function renderGames() {

        const filtered =
            getFilteredGames();


        const dashboardGames =
            games
                .filter(
                    (game) =>
                        game.featured
                )
                .slice(0, 3);


        const featuredGames =
            games.filter(
                (game) =>
                    game.featured
            );


        renderGameContainer(
            "#dashboardGames",
            dashboardGames,
            "PixelForge is empty",
            "There are no games or applications yet. Add your first project and it will appear here."
        );


        renderGameContainer(
            "#libraryGames",
            filtered,
            "Library is empty",
            "Your games and applications will appear here after you add them."
        );


        renderGameContainer(
            "#featuredGames",
            featuredGames,
            "No featured projects",
            "Featured projects will appear here when you add and feature them."
        );


        renderGameContainer(
            "#featuredPageGames",
            featuredGames,
            "No featured projects",
            "Featured projects will appear here when you add and feature them."
        );


        updateGameStats();
    }


    /* =====================================================
       GET GAME
       ===================================================== */

    function getGame(id) {

        return (
            games.find(
                (game) =>
                    game.id === id
            ) || null
        );
    }


    /* =====================================================
       GAME DETAILS
       ===================================================== */

    function openGameDetails(id) {

        const game =
            getGame(id);

        if (!game) {

            showToast(
                "This game does not exist.",
                "error"
            );

            return;
        }


        state.selectedGame =
            game;


        setText(
            "#gameDetailsTitle",
            game.title
        );


        setText(
            "#gameDetailsBadge",
            `${game.type || "Game"} • ${game.category || "Other"}`
        );


        setText(
            "#gameDetailsDescription",
            game.description
        );


        setText(
            "#gameDetailsVersion",
            `v${game.version || "1.0.0"}`
        );


        setText(
            "#gameDetailsPlatform",
            game.platform || "-"
        );


        setText(
            "#gameDetailsGenre",
            (
                game.genres || []
            ).join(", ") ||
            game.category ||
            "-"
        );


        setText(
            "#gameDetailsMeta",
            `${game.status || "Released"}${game.releaseDate ? ` • ${game.releaseDate}` : ""}`
        );


        const icon =
            $("#gameDetailsIcon") ||
            $(".details-cover-icon");

        if (icon) {

            icon.textContent =
                game.icon || "PF";
        }


        const cover =
            $("#gameDetailsCover");

        if (
            cover &&
            game.cover
        ) {

            cover.style.backgroundImage =
                `url("${String(game.cover).replace(/"/g, '\\"')}")`;

            cover.classList.add(
                "has-custom-cover"
            );
        }


        const features =
            $("#gameDetailsFeatures");

        if (features) {

            features.innerHTML = "";


            (
                game.features || []
            ).forEach((feature) => {

                const tag =
                    document.createElement(
                        "span"
                    );

                tag.className =
                    "feature-tag";

                tag.textContent =
                    feature;

                features.appendChild(
                    tag
                );
            });
        }


        updateDetailsLikeButton();

        openModal(
            "gameDetailsModal"
        );
    }


    function updateDetailsLikeButton() {

        const button =
            $(
                '#gameDetailsModal [data-action="game-like"], #gameDetailsModal [data-action="like-game"]'
            );

        if (!button || !state.selectedGame) {
            return;
        }


        const liked =
            state.likedGames.includes(
                state.selectedGame.id
            );


        button.dataset.gameId =
            state.selectedGame.id;


        button.classList.toggle(
            "liked",
            liked
        );


        button.setAttribute(
            "aria-pressed",
            String(liked)
        );


        const text =
            button.querySelector(
                ".details-like-text"
            );


        if (text) {

            text.textContent =
                liked ? "Liked" : "Like";
        }


        const icon =
            button.querySelector(
                "span"
            );


        if (icon) {

            icon.textContent =
                liked ? "♥" : "♡";
        }
    }


    /* =====================================================
       DOWNLOAD
       ===================================================== */

    function openDownload(id) {

        const game =
            getGame(id);

        if (!game) {

            showToast(
                "This game does not exist.",
                "error"
            );

            return;
        }


        state.selectedGame =
            game;


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
            `v${game.version || "1.0.0"}`
        );


        setText(
            "#downloadFileName",
            game.fileName || "Download"
        );


        setText(
            "#downloadFileSize",
            game.fileSize || "Unknown"
        );


        setText(
            "#downloadGameIcon",
            game.icon || "PF"
        );


        const button =
            $('[data-action="confirm-download"]');

        if (button) {

            button.dataset.downloadUrl =
                game.downloadUrl || "";
        }


        openModal(
            "downloadModal"
        );
    }


    function confirmDownload() {

        const game =
            state.selectedGame;


        if (!game) {

            showToast(
                "No game selected.",
                "error"
            );

            return;
        }


        let url =
            game.downloadUrl || "";


        const button =
            $('[data-action="confirm-download"]');


        if (
            button &&
            button.dataset.downloadUrl
        ) {

            url =
                button.dataset.downloadUrl;
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
            String(
                state.downloads
            )
        );


        updateGameStats();


        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );


        closeModal(
            "downloadModal"
        );


        showToast(
            `${game.title} download started.`,
            "success"
        );
    }


    /* =====================================================
       LIKE SYSTEM
       ===================================================== */

    function toggleLike(id) {

        if (!id) {
            return;
        }


        const index =
            state.likedGames.indexOf(
                id
            );


        if (index === -1) {

            state.likedGames.push(
                id
            );

            showToast(
                "Added to favorites.",
                "success"
            );

        } else {

            state.likedGames.splice(
                index,
                1
            );

            showToast(
                "Removed from favorites.",
                "success"
            );
        }


        localStorage.setItem(
            "pixelforge_likes",
            JSON.stringify(
                state.likedGames
            )
        );


        renderGames();

        updateDetailsLikeButton();
    }


    /* =====================================================
       STATS
       ===================================================== */

    function updateGameStats() {

        const gameCount =
            games.filter(
                (game) =>
                    String(
                        game.type || ""
                    ).toLowerCase() ===
                    "game"
            ).length;


        const appCount =
            games.filter(
                (game) =>
                    ["app", "application"].includes(
                        String(
                            game.type || ""
                        ).toLowerCase()
                    )
            ).length;


        const featuredCount =
            games.filter(
                (game) =>
                    Boolean(
                        game.featured
                    )
            ).length;


        const gameStats =
            $("#gameCount");


        const appStats =
            $("#appCount");


        const featuredStats =
            $("#featuredCount");


        const downloadStats =
            $("#downloadCount");


        if (gameStats) {

            gameStats.textContent =
                gameCount;
        }


        if (appStats) {

            appStats.textContent =
                appCount;
        }


        if (featuredStats) {

            featuredStats.textContent =
                featuredCount;
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


        containers.forEach(
            (selector) => {

                const container =
                    $(selector);

                if (!container) {
                    return;
                }


                container.innerHTML =
                    "";


                if (!updates.length) {

                    container.appendChild(
                        createEmptyState(
                            "No updates yet",
                            "New PixelForge updates will appear here."
                        )
                    );

                    return;
                }


                updates.forEach(
                    (update) => {

                        const template =
                            $("#updateItemTemplate");


                        if (template) {

                            const clone =
                                template.content.cloneNode(
                                    true
                                );


                            const item =
                                clone.querySelector(
                                    ".update-item"
                                );


                            if (item) {

                                const type =
                                    item.querySelector(
                                        "[data-update-type], .update-type"
                                    );

                                const title =
                                    item.querySelector(
                                        "[data-update-title], h3"
                                    );

                                const description =
                                    item.querySelector(
                                        "[data-update-description], p"
                                    );

                                const date =
                                    item.querySelector(
                                        "[data-update-date], time"
                                    );

                                const icon =
                                    item.querySelector(
                                        "[data-update-icon], .update-icon"
                                    );


                                if (type) {
                                    type.textContent =
                                        update.type || "UPDATE";
                                }


                                if (title) {
                                    title.textContent =
                                        update.title || "";
                                }


                                if (description) {
                                    description.textContent =
                                        update.description || "";
                                }


                                if (date) {
                                    date.textContent =
                                        update.date || "";
                                }


                                if (icon) {
                                    icon.textContent =
                                        update.icon || "+";
                                }
                            }


                            container.appendChild(
                                clone
                            );

                        } else {

                            const item =
                                document.createElement(
                                    "div"
                                );


                            item.className =
                                "update-item";


                            item.innerHTML = `
                                <div class="update-icon">
                                    ${escapeHTML(update.icon || "•")}
                                </div>

                                <div class="update-content">

                                    <div class="update-top">

                                        <span class="update-type">
                                            ${escapeHTML(update.type || "UPDATE")}
                                        </span>

                                        <time>
                                            ${escapeHTML(update.date || "")}
                                        </time>

                                    </div>

                                    <h3>
                                        ${escapeHTML(update.title || "")}
                                    </h3>

                                    <p>
                                        ${escapeHTML(update.description || "")}
                                    </p>

                                </div>
                            `;


                            container.appendChild(
                                item
                            );
                        }
                    }
                );
            }
        );
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


        const notifications = [];


        container.innerHTML =
            "";


        if (!notifications.length) {

            container.appendChild(
                createEmptyState(
                    "No notifications",
                    "You are all caught up."
                )
            );

            return;
        }


        notifications.forEach(
            (notification) => {

                const template =
                    $("#notificationTemplate");


                if (template) {

                    const clone =
                        template.content.cloneNode(
                            true
                        );


                    const item =
                        clone.querySelector(
                            ".notification-item"
                        );


                    if (item) {

                        const icon =
                            item.querySelector(
                                "[data-notification-icon], .notification-icon"
                            );

                        const title =
                            item.querySelector(
                                "[data-notification-title], strong"
                            );

                        const text =
                            item.querySelector(
                                "[data-notification-message], p"
                            );

                        const time =
                            item.querySelector(
                                "[data-notification-date], time"
                            );


                        if (icon) {
                            icon.textContent =
                                notification.icon || "✦";
                        }


                        if (title) {
                            title.textContent =
                                notification.title || "";
                        }


                        if (text) {
                            text.textContent =
                                notification.text || "";
                        }


                        if (time) {
                            time.textContent =
                                notification.time || "";
                        }
                    }


                    container.appendChild(
                        clone
                    );

                } else {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "notification-item";


                    item.innerHTML = `
                        <div class="notification-icon">
                            ${escapeHTML(notification.icon || "•")}
                        </div>

                        <div class="notification-content">

                            <strong>
                                ${escapeHTML(notification.title || "")}
                            </strong>

                            <p>
                                ${escapeHTML(notification.text || "")}
                            </p>

                            <time>
                                ${escapeHTML(notification.time || "")}
                            </time>

                        </div>
                    `;


                    container.appendChild(
                        item
                    );
                }
            }
        );
    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    function applySettings() {

        const root =
            document.documentElement;


        let theme =
            state.settings.theme;


        if (
            theme === "system"
        ) {

            theme =
                window.matchMedia(
                    "(prefers-color-scheme: light)"
                ).matches
                    ? "light"
                    : "dark";
        }


        root.dataset.theme =
            theme;


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


        const reducedMotion =
            $("#reducedMotionToggle");


        if (reducedMotion) {

            reducedMotion.checked =
                state.settings.reducedMotion;
        }


        $$("[data-accent]")
            .forEach((button) => {

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
            String(
                state.settings.reducedMotion
            )
        );


        applySettings();
    }


    function changeAccent(accent) {

        if (
            !accent ||
            ![
                "violet",
                "blue",
                "green"
            ].includes(accent)
        ) {
            return;
        }


        if (
            state.settings.accent ===
            accent
        ) {
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


    /* =====================================================
       CATEGORY
       ===================================================== */

    function selectCategory(category) {

        state.currentFilter =
            category || "all";


        $$("[data-filter]")
            .forEach((button) => {

                button.classList.toggle(
                    "active",
                    button.dataset.filter ===
                    state.currentFilter
                );
            });


        navigate(
            "library"
        );


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

    function showToast(
        message,
        type = "info"
    ) {

        let container =
            $("#toastContainer");


        if (!container) {

            container =
                document.createElement(
                    "div"
                );


            container.id =
                "toastContainer";


            container.className =
                "toast-container";


            document.body.appendChild(
                container
            );
        }


        const toast =
            document.createElement(
                "div"
            );


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


        container.appendChild(
            toast
        );


        setTimeout(() => {

            toast.classList.add(
                "removing"
            );


            setTimeout(() => {

                toast.remove();

            }, 250);

        }, 3000);
    }


    /* =====================================================
       ACTION HANDLER
       ===================================================== */

    function handleAction(
        action,
        element
    ) {

        switch (action) {

            case "go-home":

                navigate(
                    "dashboard"
                );

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

                openModal(
                    "settingsModal"
                );

                break;


            case "open-about":

                navigate(
                    "about"
                );

                break;


            case "open-profile":

                toggleProfileMenu();

                break;


            case "close-modal":

                closeModal(
                    element.closest(
                        ".modal"
                    )
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

                if (
                    state.selectedGame
                ) {

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


            case "game-like":

                toggleLike(
                    element.dataset.gameId
                );

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
       EVENTS
       ===================================================== */

    function setupEvents() {

        document.addEventListener(
            "click",
            (event) => {

                /* -----------------------------------------
                   ACCENT BUTTON
                   Only actual accent buttons trigger this.
                   ----------------------------------------- */

                const accentElement =
                    event.target.closest(
                        "[data-accent]"
                    );


                if (accentElement) {

                    event.preventDefault();

                    event.stopPropagation();

                    changeAccent(
                        accentElement.dataset.accent
                    );

                    return;
                }


                /* -----------------------------------------
                   ACTION
                   ----------------------------------------- */

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


                /* -----------------------------------------
                   VIEW
                   ----------------------------------------- */

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


                /* -----------------------------------------
                   VIEW TARGET
                   ----------------------------------------- */

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


                /* -----------------------------------------
                   SEARCH RESULT
                   ----------------------------------------- */

                const searchResult =
                    event.target.closest(
                        ".search-result"
                    );


                if (searchResult) {

                    const id =
                        searchResult.dataset.gameId;


                    closeModal(
                        "searchModal"
                    );


                    openGameDetails(
                        id
                    );


                    return;
                }


                /* -----------------------------------------
                   CATEGORY
                   ----------------------------------------- */

                const category =
                    event.target.closest(
                        "[data-category]"
                    );


                if (category) {

                    event.preventDefault();

                    selectCategory(
                        category.dataset.category
                    );


                    return;
                }


                /* -----------------------------------------
                   FILTER
                   ----------------------------------------- */

                const filter =
                    event.target.closest(
                        "[data-filter]"
                    );


                if (filter) {

                    event.preventDefault();

                    selectCategory(
                        filter.dataset.filter
                    );


                    return;
                }


                /* -----------------------------------------
                   MODAL BACKDROP
                   ----------------------------------------- */

                if (
                    event.target.matches(
                        ".modal-backdrop"
                    )
                ) {

                    closeModal(
                        event.target.closest(
                            ".modal"
                        )
                    );
                }
            }
        );


        /* ---------------------------------------------
           PROFILE OUTSIDE CLICK
           --------------------------------------------- */

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
                    !profile.contains(
                        event.target
                    )
                ) {

                    closeProfileMenu();
                }
            }
        );


        /* ---------------------------------------------
           KEYBOARD
           --------------------------------------------- */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    (
                        event.ctrlKey ||
                        event.metaKey
                    ) &&
                    event.key.toLowerCase() ===
                    "k"
                ) {

                    event.preventDefault();

                    openSearch();

                    return;
                }


                if (
                    event.key ===
                    "Escape"
                ) {

                    if (
                        $$(".modal.open")
                            .length
                    ) {

                        closeAllModals();

                        return;
                    }


                    closeNotifications();

                    closeProfileMenu();

                    closeSidebar();
                }
            }
        );


        /* ---------------------------------------------
           SEARCH
           --------------------------------------------- */

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


        /* ---------------------------------------------
           SORT
           --------------------------------------------- */

        const sort =
            $("#gameSort");


        if (sort) {

            sort.addEventListener(
                "change",
                () => {

                    changeSort(
                        sort.value
                    );
                }
            );
        }


        /* ---------------------------------------------
           THEME
           --------------------------------------------- */

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


        /* ---------------------------------------------
           REDUCED MOTION
           --------------------------------------------- */

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
    }


    /* =====================================================
       INITIALIZATION
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

            hideLoadingScreen();
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
   GLOBAL
   ========================================================= */

window.PixelForgeApp =
    PixelForgeApp;


/* =========================================================
   START
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            PixelForgeApp.init();

        },
        {
            once: true
        }
    );

} else {

    PixelForgeApp.init();
}
