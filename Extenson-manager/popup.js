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

let active = JSON.parse(localStorage.getItem('activeE')) || [];
let inactive = JSON.parse(localStorage.getItem('inactiveE')) || [];

const main = document.querySelector(".grid-container")

function createExtensionCard(extension, id, isActive){
    const circleClass = isActive ? "circle active" : "circle";

    return `
     <div class="ex-container" data-id = "${id}">
            <div class="wrap">
            <img src = "${extension.logo}">
            <div class="mini">
            <span class="name">${extension.name}</span>
            <figcaption class="cap">${extension.description}</figcaption>
            <div class="footer">
                <button class = "remove">Remove</button>
                <button class="toggle"><div class="${circleClass}"></div></button>
            </div>
        </div> 
        </div>
        </div>
    `

}
chrome.management.getAll((extensions) => {
    let gridHtml = "";

    extensions.forEach((extension, index) => {
        // Ignore themes & your own extension
        if (extension.type !== "extension" || extension.id === chrome.runtime.id) {
            return;
        }

        const extensionId = extension.id;
        const isActive = extension.enabled;

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
                    logo: extension.icons?.[0]?.url || "default.png",
                    name: extension.name,
                    description: extension.description || "No description",
                },
                extensionId,
                isActive
            );
        }
    });

    main.innerHTML = gridHtml;
    setupEventListeners();
});


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

// Function to handle the theme toggle logic
function toggleTheme() {
    const body = document.body;

    // 1. Toggle the 'light-mode' class on the body
    body.classList.toggle('light-mode');

    // 2. Save the new state to localStorage
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.removeItem('theme'); // Removes the preference to default to dark mode
    }

}

function setupEventListeners(){

    const themeToggleButton = document.querySelector(".theme-toggle");
    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", toggleTheme);
    }

       if(document.querySelector(".filter-btnA")){
        document.querySelector(".filter-btnA").addEventListener("click", ()=>{
            window.location.href = "active.html"
        })
       }

       if(document.querySelector(".filter-btnB")){
        document.querySelector(".filter-btnB").addEventListener("click", ()=>{
            window.location.href = "inactive.html"
        })
       }

       if(document.querySelector(".filter-btn")){
        document.querySelector(".filter-btn").addEventListener("click", ()=>{
            window.location.href = "index.html"
        })
       }

       const toggleButtons = document.querySelectorAll(".toggle");
       toggleButtons.forEach(button=>{
        button.addEventListener("click", function() {
                const circle = this.querySelector(".circle");
                const container = this.closest(".ex-container")
                const extensionId = container.dataset.id;

                circle.classList.toggle("active");

                if (circle.classList.contains("active")) {
                    // Add to active
                    if (!active.includes(extensionId)) {
                        active.push(extensionId);
                    }
                    // Remove from inactive
                    inactive = inactive.filter(id => id !== extensionId);
                } else {
                    // Add to inactive
                    if (!inactive.includes(extensionId)) {
                        inactive.push(extensionId);
                    }
                    // Remove from active
                    active = active.filter(id => id !== extensionId);
                }
                localStorage.setItem('activeE', JSON.stringify(active));
                localStorage.setItem('inactiveE', JSON.stringify(inactive))  
            });
       });

       const removeButtons = document.querySelectorAll(".remove");
       removeButtons.forEach(button=>{
        button.addEventListener("click", function(){
            const element = this.closest(".ex-container");
            const extensionId = element.dataset.id;

            /*Remove this ID from BOTH arrays*/
            active = active.filter(id => id !== extensionId);
            inactive = inactive.filter(id => id !== extensionId);

            localStorage.setItem('activeE', JSON.stringify(active));
            localStorage.setItem('inactiveE', JSON.stringify(inactive));

            element.remove();
        })
       })
       highlightCurrentFilter();
    }