let gridHtml = ``;
const extensionss = fetch("data.json")
    .then(response=>{
        if(!response.ok){
            throw new Error (`Http error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data=>{
        console.log(data)
        data.forEach((extension)=>{
            console.log(extension.name)
          const main = document.querySelector(".grid-container")
          main.innerHTML = gridHtml+= `
          <div class="ex-container">
            <div class="wrap">
            <img src = "${extension.logo}">
            <div class="mini">
            <span class="name">${extension.name}</span>
            <figcaption class="cap">${extension.description}</figcaption>
        </div> 
        </div>
        </div>
          `
        })
    })    .catch(error=>{
        console.error('There was a problem', error)
    })