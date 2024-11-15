import express from "express";
import { formularioLogin,formulariorRegistro,registrar,confirmar ,formularioOlvidePassword,resetPassword,comprobarToken, nuevoPassword, autenticar} from '../controllers/usuarioController.js';

const router = express.Router();
//routing
router.get('/login', formularioLogin);
router.post('/login', autenticar);
router.get('/registro',formulariorRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword)

router.post('/olvide-password', resetPassword)

//Almacena la nueva contraseña
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);



export default router