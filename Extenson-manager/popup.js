const pageName = window.location.pathname.split('/').pop().toLowerCase();

// Define the page flags based on the exact filename, or empty/root path for index.
const activepage = pageName === "active.html";
const inactivepage = pageName === "inactive.html";
const mainpage = pageName === "index.html" || pageName === "";

(function applyThemeOnLoad() {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
})();

const main = document.querySelector(".grid-container");

function createExtensionCard(extension, id, isActive) {
    const circleClass = isActive ? "circle active" : "circle";

    return `
     <div class="ex-container" data-id="${id}">
        <div class="wrap">
            <img src="${extension.logo}">
            <div class="mini">
                <span class="name">${extension.name}</span>
                <figcaption class="cap">${extension.description}</figcaption>
                <div class="footer">
                    <button class="remove">Remove</button>
                    <button class="toggle"><div class="${circleClass}"></div></button>
                </div>
            </div> 
        </div>
     </div>
    `;
}

/* -----------------------------------------
    Load REAL browser extensions
-------------------------------------------- */

chrome.management.getAll((extensions) => {
    let gridHtml = "";

    extensions.forEach((extension) => {
        // Skip irrelevant items
        if (extension.type !== "extension") return;

        // Skip your own extension
        if (extension.id === chrome.runtime.id) return;

        const extensionId = extension.id;
        const isActive = extension.enabled;

        // Filter logic
        let shouldRender = false;

        if (mainpage) {
            shouldRender = true;
        } else if (activepage && isActive) {
            shouldRender = true;
        } else if (inactivepage && !isActive) {
            shouldRender = true;
        }

        if (shouldRender) {
            gridHtml += createExtensionCard(
                {
                    logo: extension.icons?.[0]?.url || "assets/images/default.png",
                    name: extension.name,
                    description: extension.description || "No description available"
                },
                extensionId,
                isActive
            );
        }
    });

    main.innerHTML = gridHtml;
    setupEventListeners();
    setupSearchFeature(data);
});

/* ------------------------------------- */
function setupSearchFeature(allExtensions) {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".ex-container");

        // Loop through all cards
        cards.forEach(card => {
            const name = card.querySelector(".name").textContent.toLowerCase();
            const desc = card.querySelector(".cap").textContent.toLowerCase();

            // Match name or description
            const matches = name.includes(value) || desc.includes(value);

            card.style.display = matches ? "flex" : "none";
        });
    });
}

function highlightCurrentFilter() {
    const pagePath = window.location.pathname.split('/').pop().toLowerCase();
    
    const btnAll = document.querySelector(".filter-btn");
    const btnActive = document.querySelector(".filter-btnA");
    const btnInactive = document.querySelector(".filter-btnB");

    if (pagePath === "active.html") {
        if (btnActive) btnActive.classList.add('orange');
    } else if (pagePath === "inactive.html") {
        if (btnInactive) btnInactive.classList.add('orange');
    } else if (pagePath === "index.html" || pagePath === "") {
        if (btnAll) btnAll.classList.add('orange');
    }
}

function toggleTheme() {
    const body = document.body;

    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.removeItem('theme');
    }
}

function setupEventListeners() {

    const themeToggleButton = document.querySelector(".theme-toggle");
    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", toggleTheme);
    }

    if (document.querySelector(".filter-btnA")) {
        document.querySelector(".filter-btnA").addEventListener("click", () => {
            window.location.href = "active.html";
        });
    }

    if (document.querySelector(".filter-btnB")) {
        document.querySelector(".filter-btnB").addEventListener("click", () => {
            window.location.href = "inactive.html";
        });
    }

    if (document.querySelector(".filter-btn")) {
        document.querySelector(".filter-btn").addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    /* -----------------------------------------
        Real toggle enable/disable
    -------------------------------------------- */
    const toggleButtons = document.querySelectorAll(".toggle");
    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const circle = this.querySelector(".circle");
            const container = this.closest(".ex-container");
            const extensionId = container.dataset.id;

            circle.classList.toggle("active");

            const enable = circle.classList.contains("active");

            chrome.management.setEnabled(extensionId, enable);
        });
    });

    /* -----------------------------------------
        Real uninstall
    -------------------------------------------- */
    const removeButtons = document.querySelectorAll(".remove");
    removeButtons.forEach(button => {
        button.addEventListener("click", function () {
            const element = this.closest(".ex-container");
            const extensionId = element.dataset.id;

            chrome.management.uninstall(extensionId, { showConfirmDialog: true }, () => {
                element.remove();
            });
        });
    });

    highlightCurrentFilter();
}
