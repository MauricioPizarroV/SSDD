import Equipos from './Equipos.js'
import Categoria from './Categoria.js'
import Precio from './Precio.js'
import Usuario from './Usuario.js'

Equipos.belongsTo(Precio, { foreignKey: 'precioId'})
Equipos.belongsTo(Categoria, { foreignKey: 'categoriaId'})
Equipos.belongsTo(Usuario, { foreignKey: 'usuarioId'})



export {
    Equipos,
    Precio,
    Categoria,
    Usuario
}