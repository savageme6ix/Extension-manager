let gridHtml = ``;
let mainpage = document.querySelector(".filter-btnA");
let activepage = window.location.pathname.includes("active.html");
let inactivepage = window.location.pathname.includes("inactive.html");
let active = JSON.parse(localStorage.getItem('activeE')) || [];
let inactive = JSON.parse(localStorage.getItem('inactiveE')) || [];
const extensionss = fetch("data.json")
    .then(response=>{
        if(!response.ok){
            throw new Error (`Http error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data=>{
        const main = document.querySelector(".grid-container")
        data.forEach((extension, index)=>{   
            const extensionId = `ext-${index}`
            if(mainpage){
               gridHtml+= `
          <div class="ex-container" data-id = "${extensionId}">
            <div class="wrap">
            <img src = "${extension.logo}">
            <div class="mini">
            <span class="name">${extension.name}</span>
            <figcaption class="cap">${extension.description}</figcaption>
            <div class="footer">
                <button class = "remove">Remove</button>
                <button class="toggle"><div class="circle"></div></button>
            </div>
        </div> 
        </div>
        </div>
          `
            }else if(activepage){
                if (active.includes(extensionId)){
               
                 gridHtml+= `
          <div class="ex-container" data-id="${extensionId}">
            <div class="wrap">
            <img src = "${extension.logo}">
            <div class="mini">
            <span class="name">${extension.name}</span>
            <figcaption class="cap">${extension.description}</figcaption>
            <div class="footer">
                <button class = "remove">Remove</button>
                <button class="toggle"><div class="circle"></div></button>
            </div>
        </div> 
        </div>
        </div>
          `
           }
            }else if(inactivepage){
                if (inactive.includes(extensionId)){
               
                 gridHtml+= `
          <div class="ex-container" data-id="${extensionId}">
            <div class="wrap">
            <img src = "${extension.logo}">
            <div class="mini">
            <span class="name">${extension.name}</span>
            <figcaption class="cap">${extension.description}</figcaption>
            <div class="footer">
                <button class = "remove">Remove</button>
                <button class="toggle"><div class="circle"></div></button>
            </div>
        </div> 
        </div>
        </div>
          `
           }
            }
           
        })
       main.innerHTML = gridHtml
       

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

       const toggleButtons = document.querySelectorAll(".toggle");
       toggleButtons.forEach(button=>{
        button.addEventListener("click", function() {
                const circle = this.querySelector(".circle");
                const container = this.closest(".ex-container")
                const extensionId = container.dataset.id
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


        console.log(active)
       const removeButtons = document.querySelectorAll(".remove");
       removeButtons.forEach(button=>{
        button.addEventListener("click", function(){
            const element = this.closest(".ex-container");
            element.remove();
        })
       })
       
    })    .catch(error=>{
        console.error('There was a problem', error)
    });

