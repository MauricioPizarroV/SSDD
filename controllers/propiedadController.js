import { unlink, access, stat } from 'node:fs/promises';
import {Precio, Categoria, Equipos } from '../models/index.js' 
import { validationResult } from 'express-validator'
//serial
const admin = async (req, res) =>{
    
    //Leer QueryString

    const { pagina: paginaActual } = req.query
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1')
    }

    //res.send('Mis propiedades')
    try {
        const { id } = req.usuario

        //Limites y Offset para el paginador
        const limit = 2;
        const offset = ((paginaActual * limit) - limit)
 
        const [equipos, total] = await Promise.all([
            Equipos.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                        { model: Categoria, as: 'categoria' },
                        { model: Precio, as: 'clase' }
                    ],
                }),
                //Cantidad total de registros que exiten 
                Equipos.count({
                    where:{
                        usuarioId : id
                }
            })
        ])

        res.render('propiedades/admin',{
            pagina: 'Mis equipos',
            equipos,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total/limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit

        })

    } catch (error) {
        console.log(error)

    }

}

//Formulario para crear un nuevo registro de equipo
const crear = async (req, res) =>{
    //Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear',{
        pagina: 'Mis equipos',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos:{}
    })
}

const guardar = async (req, res) =>{

    // Validacion
    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {

        //Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
        return res.render('propiedades/crear',{
            pagina: 'Registrar Equipo',
            
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }
    const { modelo, observaciones, serial , AF, ubicacion ,precio: precioId, categoria: categoriaId } = req.body
    //Crear un registro

    const { id: usuarioId } = req.usuario

    try {
        const propiedadGuardada = await Equipos.create({
            modelo: modelo,
            observaciones : observaciones,
            precioId,
            serial: serial,
            AF: AF,
            ubicacion: ubicacion,
            categoriaId,
            imagen: '',
            usuarioId
            

        })

        const { id } = propiedadGuardada

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (req, res) => {
    const { id } = req.params
    //Validar que la propiedad exista
    const equipo = await Equipos.findByPk(id)

    if(!equipo){
        return res.redirect('/mis-propiedades')
    }

    // Validar que la propiedad este publicada
    if(equipo.publicado){
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad pertenece a quien visita esta pagina 
    if( req.usuario.id.toString() !== equipo.usuarioId.toString() ){
        return res.redirect('/mis-propiedades')
    }


    res.render('propiedades/agregar-imagen',{
        pagina: `Agregar Imagen: ${equipo.modelo}`,
        csrfToken: req.csrfToken(),
        equipo
    })

    
}

const almacenarImagen = async(req, res, next) =>{
    
    const { id } = req.params
    //Validar que el equipo exista
    const equipo = await Equipos.findByPk(id)
    if(!equipo){
        return res.redirect('/mis-propiedades')
    }

    // Validar que el equipo este publicado
    if(equipo.publicado){
        return res.redirect('/mis-propiedades')
    }

    //Validar que el equipo pertenece a quien visita esta pagina 
    if( req.usuario.id.toString() !== equipo.usuarioId.toString() ){
        return res.redirect('/mis-propiedades')
    }

    try {
        //console.log(req.file)

        //Almacenar la imagen y el equipo registrado
        equipo.imagen = req.file.filename
        equipo.publicado = 1

        await equipo.save()
        
        next()

    } catch (error) {
        console.log(error)
    }


}

const editar = async(req, res, next) =>{




    const{ id } = req.params

    //Validar que la propiedad exista
    const equipo = await Equipos.findByPk(id)
    if(!equipo){
        return res.redirect('/mis-propiedades')
    }

    //Revisar que quien visito la URl es quien creo el registro
    if(equipo.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }


    const [categorias, precios,] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar',{
        pagina: `Editar Propiedad: ${equipo.modelo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: equipo
    })


}

const guardarCambios = async(req, res, next) =>{
    // Verificar la validacion
    // Validacion
    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {

        //Consultar Modelo de Precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
    ])
        return res.render('propiedades/editar',{
            pagina: `Editar Propiedad`,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: {
                ...req.body,
                categoriaId: req.body.categoria,
                precioId: req.body.precio
                
          },
            
        })
    }



    const{ id } = req.params

    //Validar que la propiedad exista
    const equipo = await Equipos.findByPk(id)
    if(!equipo){
        return res.redirect('/mis-propiedades')
    }

    //Revisar que quien visito la URl es quien creo el registro
    if(equipo.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }
    // Reescribir el objeto y actualizarlo    
    try {
        const { modelo, observaciones, serial , AF, ubicacion ,precio: precioId, categoria: categoriaId } = req.body
        equipo.set({
            modelo: modelo,
            observaciones : observaciones,
            precioId,
            serial: serial,
            AF: AF,
            ubicacion: ubicacion,
            categoriaId,
            })

            await equipo.save();
            
            res.redirect('/mis-propiedades')

    } catch (error) {
        console.log(error)
    }
     
}

const eliminar = async (req, res) =>{
    
    const{ id }= req.params 

    //Validacion que el registro existe
    const equipo = await Equipos.findByPk(id)

    if(!equipo){
        return res.redirect('/mis-propiedades')
    }

    //Revisar que quien visita la URL es quien creo el registro
    if(equipo.usuarioId.toString() !== req.usuario.id.toString() ){
        return res.redirect('/mis-propiedades')
    }
    try {
        // Verificar si el archivo existe y si es un archivo, no una carpeta
        await access(imagePath, constants.F_OK); // Verificar si existe

        const fileStat = await stat(imagePath); // Obtener información del archivo

        // Si es un archivo, eliminarlo
        if (fileStat.isFile()) {
            await unlink(imagePath);
            console.log(`Se eliminó la imagen ${equipo.imagen}`);
        } else {
            console.log(`No es un archivo: ${imagePath}`);
        }
    } catch (error) {
        // Si el archivo no existe o hay algún otro error, lo manejamos
        console.log(`Error al intentar eliminar la imagen: ${error.message}`);
    }
// Eliminar el registro de la base de datos
await equipo.destroy();
res.redirect('/mis-propiedades');

}

// Muestra de un registro

const mostrarEquipo = async (req, res) => {
    const { id } = req.params   

    //Comprobar que el registro existe
    const equipo = await Equipos.findByPk(id, {
        include : [
            { model: Precio, as: 'clase'},
            { model: Categoria, as: 'categoria'},
        ]
    })
    if(!equipo ){
        return res.redirect('/404')
    }
    res.render('propiedades/mostrar',{
        equipo,
        pagina: equipo.modelo,


    })
}

const principal = async (req, res) =>{
    try {
        const { id } = req.usuario
 
        const [equipos] = await Promise.all([
            Equipos.findAll({
                where: {
                    usuarioId: id
                },
                include: [
                        { model: Categoria, as: 'categoria' },
                        { model: Precio, as: 'clase' }
                    ],
                }),     
        ])

        res.render('propiedades/inicio',{
            pagina: 'Mis equipos',
            equipos,
            csrfToken: req.csrfToken(),
           
           

        })

    } catch (error) {
        console.log(error)

    }
}



export{
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarEquipo,
    principal
}