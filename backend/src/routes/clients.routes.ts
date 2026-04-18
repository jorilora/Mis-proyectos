import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import * as c from '../controllers/clients.controller'
import { getClientDebts } from '../controllers/debts.controller'

const router = Router()
router.use(authMiddleware)

router.get('/', c.list)
router.post('/', c.create)
router.get('/:id', c.getOne)
router.put('/:id', c.update)
router.delete('/:id', c.remove)
router.get('/:clientId/debts', getClientDebts)

export default router
