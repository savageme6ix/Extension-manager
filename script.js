const extensionss = fetch("data.json")
    .then(response=>{
        if(!response.ok){
            throw new Error (`Http error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data=>{
        console.log(data)
    })    .catch(error=>{
        console.error('There was a problem', error)
    })