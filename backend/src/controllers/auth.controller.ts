import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'
import { AuthRequest } from '../middleware/auth'

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400).json({ message: 'Usuario y contraseña requeridos' })
      return
    }
    const result = await authService.login(username, password)
    res.json(result)
  } catch (err: any) {
    if (err.message === 'Credenciales incorrectas') {
      res.status(401).json({ message: err.message })
    } else {
      next(err)
    }
  }
}

export async function changePasswordHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Todos los campos son requeridos' })
      return
    }
    await authService.changePassword(req.userId!, currentPassword, newPassword)
    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (err: any) {
    if (err.message === 'La contraseña actual es incorrecta' || err.message.startsWith('La nueva contraseña')) {
      res.status(400).json({ message: err.message })
    } else {
      next(err)
    }
  }
}
