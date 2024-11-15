import{ check, validationResult }from 'express-validator'
import bcrypt from 'bcrypt'
import csrf from 'csrf'
import jwt from 'jsonwebtoken'
import Usuario from "../models/Usuario.js"
import{generarJWT, generarId} from '../helpers/token.js'
import {emailRegistro, emailOlvidePassword} from '../helpers/email.js'


const formularioLogin = (req, res) =>{
    res.render('auth/login', {
        autenticado: false,
        pagina: 'Iniciar Sesion',
        csrfToken : req.csrfToken()
    })
}


const autenticar =async (req, res) => {
    //Validacion de los camnpos
    await check('email').isEmail().withMessage('El email se debe colocar de manera obligatoria').run(req)
    await check('password').notEmpty().withMessage('El Password es obligatorio').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            email: {
                email: req.body.email
            }
        })
    }
    const { email, password } = req.body

    // Comprobacion de usuario

    const usuario = await Usuario.findOne({ where: { email : email }})
    if(!usuario) {
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El Usuario No Existe'}],
            email: {
                email: req.body.email
            }
        })
    }
    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}],
        })
    }
    // Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina: 'Iniciar Sesion',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El password es incorrecto'}],
        })

    }
    //Autenticar a un usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre})

    console.log(token)

    //Almacenar en un cookie

    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true
    }).redirect('/mis-propiedades')
}

const formulariorRegistro = (req, res) =>{
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken : req.csrfToken()
    })
}



const registrar = async (req,res) =>{
    const password = req.body.password;
    //Validacion
    await check('nombre').notEmpty().withMessage('El Nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({min: 6}).withMessage('El Password debe tener al menos 6 caracteres').run
    (req)
    await check('repetir_password').equals(password).withMessage('Los passwords no coinciden').run
    (req)
    //No funciona porque el password literalmente equivale a password
    let resultado= validationResult(req)
    
    //Verificar que el resultado este vacio 
    if(!resultado.isEmpty()) {
        //Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }  
    const{nombre,email} = req.body
    //Verificar que el usuario no este duplicado  //Await es una interaccion a la base de datos
    const existeUser = await Usuario.findOne( { where: { email : req.body.email } } )
    if (existeUser){
        return res.render('auth/registro',{
            pagina:'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores:[{msg: 'El Usuario ya esta Registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }

        })
    }
    //const usuario = await Usuario.create(req.body);
    //res.json(usuario)    
    //almacenar un usuario
    // Con este await no se crea y tampoco se muestra la vista hasta tener las variables 
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })
    //Funcion enviar correo de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })
    //Mostrar mensaje de confirmacion
    res.render('templates/mensaje',{
        pagina:'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de confirmacion, presiona aqui',

    })
}

// Funcion que comprueba una cuenta
const confirmar = async (req, res, next)=>{

    const { token } = req.params;
    console.log(req.params.token)
    //verificar si el token es valido
    const usuario = await Usuario.findOne({where:{token}})  

    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina:'Error al confirmar esta cuenta',
            mensaje: 'Hubo un error al confirmar la cuenta, el token no existe',
            error: true
    
        })
    }
    
    //Confirmar la cuenta 
    usuario.token = null;
    usuario.confirmado = true;
    console.log(usuario)
    await usuario.save();
    return res.render('auth/confirmar-cuenta', {
        pagina:'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo Correctamente ',

    })
}

const formularioOlvidePassword = (req, res) =>{
    res.render('auth/olvide-password', {
        pagina: 'Recupera el acceso a tu cuenta',
        csrfToken : req.csrfToken(),
    })
}
const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    let resultado= validationResult(req)
    
    //Verificar que el resultado este vacio 
    if(!resultado.isEmpty()) {
        //Errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a tu cuenta',
            csrfToken : req.csrfToken(),
            errores: resultado.array()
            
        })
    }
    //Buscar al usuario funcion 
    
    const {email} = req.body

    const usuario = await Usuario.findOne({where:{ email }})
    if(!usuario){
        return res.render('auth/olvide-password',{
            pagina:'Recupera el acceso a tu cuenta',
            csrfToken: req.csrfToken(),
            errores:[{msg: 'El email no pertence a ningún usuario'}]
        })
    }


    //Generar el token para enviar el email 
    usuario.token = generarId();
    await usuario.save();

    // Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token

    })

    //Renderizar el mensaje para el redireccionamiento
    res.render('templates/mensaje',{
        pagina:'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las instrucciones',

    })
    //Funcion para comprobar que el token existe

}

const comprobarToken = async (req, res)=>{
        const{ token } = req.params; //variable del token

        const usuario = await Usuario.findOne({where:{token}})
        if(!usuario){
            return res.render('auth/confirmar-cuenta',{
                pagina: 'Reestablece tu Password',
                mensaje:'Hubo un error al validar la informacion, intentalo de nuevo',
                error:true
            })
        }
        // Mostrar formulario para el password(Modificacion)
        res.render('auth/reset-password',{
            pagina: 'Reestablece tu contraseña',
            csrfToken: req.csrfToken()
        })
}

const nuevoPassword  = async (req, res)=>{
//Validar el password
    await check('password').isLength({min: 6}).withMessage('El Password debe tener al menos 6 caracteres').run(req)
    let resultado = validationResult(req)

//Identificar que el resultado no este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/reset-password',{
            pagina:'Reestablece tu password',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
        })
    }
//Identificar quien hace el cambio
    const { token } = req.params
    const { password } = req.body;

    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})
    console.log(usuario)

    //hashear el nuevo password 
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: 'Password Reestablecido',
        mensaje: 'El password se guardo correctamente'
    })
}

export{
    formularioLogin,
    formulariorRegistro,
    formularioOlvidePassword,
    confirmar,
    registrar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    autenticar
}