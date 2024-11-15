import express from 'express'
import { equipos } from '../controllers/apiController.js'

const router = express.Router()

router.get('/equipos', equipos)


export default router