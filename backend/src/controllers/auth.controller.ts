import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'

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
