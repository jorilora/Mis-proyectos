import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export interface AuthRequest extends Request {
  userId?: string
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No autorizado' })
    return
  }
  try {
    const token = header.slice(7)
    const payload = verifyToken(token)
    req.userId = payload.sub as string
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
