import express from 'express'
import articleController from '../controllers/articleController'

const router = express.Router()

router.get('/all', articleController.getAll)

export default router
