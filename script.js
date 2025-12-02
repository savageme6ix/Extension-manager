// let gridHtml = ``;
// const extensionss = fetch("data.json")
//     .then(response=>{
//         if(!response.ok){
//             throw new Error (`Http error! status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data=>{
//         console.log(data)
//         data.forEach((extension)=>{
//             console.log(extension.name)
//           const main = document.querySelector(".grid-container")
//           main.innerHTML = gridHtml+= `
//           <div>
//           <span>${extension.name}</span>
//           <img src= ${extension.logo}>
//           <figcaption>${extension.description}</figcaption>
//           </div>
//           `
//         })
//     })    .catch(error=>{
//         console.error('There was a problem', error)
//     })