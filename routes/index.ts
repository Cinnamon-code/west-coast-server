import express from 'express'
import user from './user'
import article from './article'

const router = express.Router()

router.use('/user', user)
router.use('/article', article)

export default router
