const urlBase = 'https://jsonplaceholder.typicode.com/posts'
let post = [];

function getData(){
    fetch(urlBase)
    .then(respuesta  => respuesta.json())
    .then(data => {
        post = data
        mostrarPosteos()
        
    } )
    .catch(error => console.error('no se pudo llamar a post ',error))  
}

getData()

function mostrarPosteos() {

    const lista = document.getElementById('lista')
    lista.innerHTML = ''

    post.forEach(element => {

        const listaElementos = document.createElement('li')
        listaElementos.classList.add('postItem')

        listaElementos.innerHTML= `

            <strong>${element.title}</strong>
            <p>${element.body}</p>
            <button onclick="editar(${element.id})">editar</button>
            <button onclick="borrar(${element.id})">borrar</button>

            <div id="editForm-${element.id}" class="editForm" style="display:none">

                <label for="editarTitulo">Titulo</label>
                <input type="text" id="editarTitulo-${element.id}" value="${element.title}" required>
                <label for="editarComentario">comentario</label>
                <textarea type="text" id="editarComentario-${element.id}" required>e${element.body}</textarea>
                <button onclick="update(${element.id})">modificar</button>


            </div>

        `
        lista.appendChild(listaElementos);

    })

    
}

function postData(){
    const inputTitulo = document.getElementById('inputTitulo').value 
    const inputComentario = document.getElementById('inputComentario').value 

    fetch(urlBase,{
        method: 'POST',
        body: JSON.stringify({
          title: inputTitulo,
          body: inputComentario,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(respuesta => respuesta.json())
      .then(data => {
        post.unshift(data)
        mostrarPosteos()
        document.getElementById('inputTitulo').value = ''
        document.getElementById('inputComentario').value = ''
      })
      .catch(error => console.log('error al crear post :' , error))
}

function editar(id) {

    const editForm = document.getElementById(`editForm-${id}`)
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
    
}

function update(id){

    const editarTitulo = document.getElementById(`editarTitulo-${id}`).value
    const editarBody = document.getElementById(`editarComentario-${id}`).value

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: id,
          title: editarTitulo,
          body: editarBody,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        const index = post.findIndex(ele => ele.id === data.id)
        if (index != -1) {

            post[index] = data
                
        }else{
            alert('no se pudo actualizar')
        }
        mostrarPosteos()
           
    })
    .catch(error => console.log('error al actualizar post :' , error))
}

function borrar(id){
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
    })
    .then(res =>{
        if (res.ok) {

            post = post.filter(ele => ele.id != id)
            mostrarPosteos() 
        }else{
            alert('no se pudo borrar')
        }
    })
    .catch(error=>console.error('error',error))
}