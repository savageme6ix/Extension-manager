let gridHtml = ``;
const extensionss = fetch("data.json")
    .then(response=>{
        if(!response.ok){
            throw new Error (`Http error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data=>{
        const main = document.querySelector(".grid-container")
        data.forEach((extension)=>{   
           gridHtml+= `
          <div class="ex-container">
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
           
        })
       main.innerHTML = gridHtml
       
       const toggleButtons = document.querySelectorAll(".toggle");
       toggleButtons.forEach(button=>{
        button.addEventListener("click", function() {
                const circle = this.querySelector(".circle");
                circle.classList.toggle("active");
            });
       });

       const removeButtons = document.querySelectorAll(".remove");
       removeButtons.forEach(button=>{
        button.addEventListener("click", ()=>{
            const element = document.querySelector(".ex-container");
            element.remove();
        })
       })
    })    .catch(error=>{
        console.error('There was a problem', error)
    });

