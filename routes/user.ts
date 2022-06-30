import express from 'express'
import userController from '../controllers/userController'

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/existed', userController.existed)
router.get('/info', userController.info)
router.post('/signature', userController.signature)

export default router
