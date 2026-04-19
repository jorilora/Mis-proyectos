import { Router } from 'express'
import { loginHandler, changePasswordHandler, changeUsernameHandler } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth'

const router = Router()
router.post('/login', loginHandler)
router.put('/change-password', authMiddleware, changePasswordHandler)
router.put('/change-username', authMiddleware, changeUsernameHandler)
export default router
