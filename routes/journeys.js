import { Router } from 'express'
import * as journeysCtrl from '../controllers/journeys.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

/*---------- Public Routes ----------*/
router.get('/', journeysCtrl.index)

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.post('/', checkAuth, journeysCtrl.create)

export { router }
