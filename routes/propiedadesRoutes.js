import express from "express"
import { body } from 'express-validator'
import{ admin , crear, guardar, agregarImagen, almacenarImagen,editar, guardarCambios, eliminar, mostrarEquipo, principal } from '../controllers/propiedadController.js'
import protegerRuta from "../middleware/protegerRuta.js"
import upload from '../middleware/subirImagen.js'

const router = express.Router()


router.get('/mis-propiedades',protegerRuta, admin)
router.get('/propiedades/crear',protegerRuta, crear)
router.post('/propiedades/crear',protegerRuta,


    body('modelo').notEmpty().withMessage('El Modelo del Equipo es Obligatorio'),
    body('categoria').notEmpty().withMessage('El campo categoria no puede estar vació'),
    body('precio').notEmpty().withMessage('El campo Tipo no puede estar vació'),

    body('serial')
        .notEmpty().withMessage('Se debe brindar un Número de serie para el equipo')
        .isLength({ max: 20}).withMessage('No puede exceder un maximo de 20 caracteres el Serial Number'),
    body('AF')
        .notEmpty().withMessage('Se debe brindar un Número de Activo fijo para el equipo')
        .isLength({ max: 20}).withMessage('No puede exceder un maximo de 20 caracteres el Activo Fijo'),
    body('ubicacion').notEmpty().withMessage('Debe Ingresar la Ubicación en la que se encuentra el equipo'),
    body('observaciones')
        .notEmpty().withMessage('El El campo de observaciones no debe estar vacio')
        .isLength({ max: 20 }).withMessage('La Observacion escrita es demasiado extensa'),
    guardar
)

router.get('/propiedades/agregar-imagen/:id', protegerRuta ,agregarImagen)

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen    
)

router.get('/propiedades/editar/:id', protegerRuta, editar)



router.post('/propiedades/editar/:id',protegerRuta,


    body('modelo').notEmpty().withMessage('El Modelo del Equipo es Obligatorio'),
    body('categoria').notEmpty().withMessage('El campo categoria no puede estar vació'),
    body('precio').notEmpty().withMessage('El campo Tipo no puede estar vació'),

    body('serial')
        .notEmpty().withMessage('Se debe brindar un Número de serie para el equipo')
        .isLength({ max: 20}).withMessage('No puede exceder un maximo de 20 caracteres el Serial Number'),
    body('AF')
        .notEmpty().withMessage('Se debe brindar un Número de Activo fijo para el equipo')
        .isLength({ max: 20}).withMessage('No puede exceder un maximo de 20 caracteres el Activo Fijo'),
    body('ubicacion').notEmpty().withMessage('Debe Ingresar la Ubicación en la que se encuentra el equipo'),
    body('observaciones')
        .notEmpty().withMessage('El El campo de observaciones no debe estar vacio')
        .isLength({ max: 20 }).withMessage('La Observacion escrita es demasiado extensa'),
    guardarCambios
)

router.post('/propiedades/eliminar/:id', 
    protegerRuta,
    eliminar
)


//Area Publica
router.get('/propiedad/:id',
    mostrarEquipo

)

router.get('/propiedad/home',
    principal
)

export default router