import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { createDebt, updateDebt, deleteDebt, createPayment, deletePayment } from '../controllers/debts.controller'

const router = Router()
router.use(authMiddleware)

router.post('/', createDebt)
router.put('/:id', updateDebt)
router.delete('/:id', deleteDebt)
router.post('/:debtId/payments', createPayment)
router.delete('/:debtId/payments/:paymentId', deletePayment)

export default router
