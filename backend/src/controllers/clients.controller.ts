import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import * as clientsService from '../services/clients.service'

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const search = String(req.query.search || '')
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)
    res.json(await clientsService.listClients(search, page, limit))
  } catch (err) { next(err) }
}

export async function getOne(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(await clientsService.getClient(req.params.id))
  } catch (err: any) {
    if (err.message === 'Cliente no encontrado') res.status(404).json({ message: err.message })
    else next(err)
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { cedula, name, phone, address, email, notes } = req.body
    if (!cedula || !name) {
      res.status(400).json({ message: 'Cédula y nombre son requeridos' })
      return
    }
    res.status(201).json(await clientsService.createClient({ cedula, name, phone, address, email, notes }))
  } catch (err) { next(err) }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(await clientsService.updateClient(req.params.id, req.body))
  } catch (err) { next(err) }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await clientsService.deleteClient(req.params.id)
    res.status(204).send()
  } catch (err) { next(err) }
}
