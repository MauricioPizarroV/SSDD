import {Precio, Categoria, Equipos} from '../models/index.js'


const inicio = async (req, res) =>{
    

    const [ categorias, precios, equipos, ] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Equipos.findAll({
            limit: 4,
            where: {
                categoriaId: 4
            },
            include: [{
                model: Precio,
                as: 'clase'
            }
        ],
        order: [['createdAt', 'DESC']]
        }), 
        Equipos.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [{
                model: Precio,
                as: 'clase'
            }
        ],
        order: [['createdAt', 'DESC']]
        }),
        Equipos.findAll({
            limit: 3,
            where: {
                categoriaId: 3
            },
            include: [{
                model: Precio,
                as: 'clase'
            }
        ],
        order: [['createdAt', 'DESC']]
        }),
        
        
    ])

    res.render('inicio',{
        pagina:'Inicio',
        categorias,
        precios,
        equipos
    })

}

const categoria = (req, res) =>{
    
}


const noEncontrado = (req, res) =>{
    
}

const buscador = (req, res) =>{

}



export{
    inicio,
    categoria,
    noEncontrado,
    buscador
}