import path from 'path'
import express from 'express'
import api from './api'

const router = express.Router()
router.use('/api', api)
router.use('/static', express.static(path.join(__dirname, '..', '..', 'data', 'uploads')))

export default router