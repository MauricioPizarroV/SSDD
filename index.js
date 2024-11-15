//const express = require('express') //commmon js 
import express from 'express'   // enmasc script module, es una sintaxis mas moderna que funciona correctamente a dia de hoy
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'
//Crear la app contiene toda la informacion de express que estamos haciendo
const app=express()

//conexion a la base de datos
try{
    await db.authenticate();
    db.sync()
    console.log('Conexion Correcta a la base de datos')
} catch(error){
    console.log(error)
}


//Habilitar lectura de datos de formulario 
app.use( express.urlencoded({extended: true}))

//Habilitar Cookie Parser 
app.use( cookieParser() )

//habilitar CSRF
app.use(csrf( {cookie: true}) )

//Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')


//Carpeta publica 
app.use(express.static('public'))

//Routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api',apiRoutes)





//Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});