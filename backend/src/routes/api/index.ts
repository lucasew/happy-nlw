import express from 'express'
import Orphanages from './orphanages'

const router = express.Router()
router.use('/orphanages', Orphanages)

export default router