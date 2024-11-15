import { Equipos, Precio, Categoria } from '../models/index.js'


const equipos = async (req, res) => {

    const equipos = await Equipos.findAll({
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'clase' }
        ]
    })

    res.json(equipos)

}

export{
    equipos
}