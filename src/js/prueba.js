(function(){

    const filtros = {
        categoria: '',
        precio: ''
    }
    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');
    //Filtrado
    categoriasSelect.addEventListener('change', e =>{
        filtros.categoria = +e.target.value
    })
    preciosSelect.addEventListener('change', e =>{
        filtros.precio = +e.target.value
    })
    
    const obtenerEquipos = async () => {
        try {
            const url = '/api/equipos'
            const respuesta = await fetch(url)
            const equipos = await respuesta.json()
            console.log(equipos)
            
    
        } catch (error) {
            console.log(error)
        }
    }
    
    obtenerEquipos()
})()