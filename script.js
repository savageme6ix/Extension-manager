let mainpage = window.location.pathname.includes("index.html");
let activepage = window.location.pathname.includes("active.html");
let inactivepage = window.location.pathname.includes("inactive.html");
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
const extensionss = fetch("data.json")
    .then(response=>{
        if(!response.ok){
            throw new Error (`Http error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data=>{
        let gridHtml = ``
        data.forEach((extension, index)=>{   
            const extensionId = `ext-${index}`;
            const isActive = active.includes(extensionId);
            const isInactive = inactive.includes(extensionId);

            let shouldRender = false; /*Logic: show card based on page*/

            if(mainpage){
               shouldRender = true;

            }else if(activepage && isActive){
               shouldRender = true

            }else if(inactivepage && !isActive){
                shouldRender = true
            }
            if(shouldRender){
                gridHtml += createExtensionCard(extension, extensionId, isActive)
            }
           
        });
       main.innerHTML = gridHtml
       
       setupEventListeners();

    })    .catch(error=>{
        console.error('There was a problem', error)
    });

function setupEventListeners(){

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
    }