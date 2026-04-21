import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import * as debtsService from '../services/debts.service'
import * as paymentsService from '../services/payments.service'
import { toCsv } from '../utils/csv'

export async function getClientDebts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(await debtsService.getClientDebts(req.params.clientId))
  } catch (err) { next(err) }
}

export async function createDebt(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { clientId, amount, dueDate, description, invoiceNumber } = req.body
    if (!clientId || !amount || !dueDate) {
      res.status(400).json({ message: 'clientId, amount y dueDate son requeridos' })
      return
    }
    res.status(201).json(await debtsService.createDebt({ clientId, amount, dueDate, description, invoiceNumber }))
  } catch (err) { next(err) }
}

export async function updateDebt(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(await debtsService.updateDebt(req.params.id, req.body))
  } catch (err) { next(err) }
}

export async function deleteDebt(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await debtsService.deleteDebt(req.params.id)
    res.status(204).send()
  } catch (err) { next(err) }
}

export async function createPayment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { amount, paidAt, notes } = req.body
    if (!amount) {
      res.status(400).json({ message: 'amount es requerido' })
      return
    }
    res.status(201).json(await paymentsService.createPayment(req.params.debtId, { amount, paidAt, notes }))
  } catch (err) { next(err) }
}

export async function deletePayment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await paymentsService.deletePayment(req.params.paymentId)
    res.status(204).send()
  } catch (err) { next(err) }
}

export async function dashboard(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(await debtsService.getDashboardStats())
  } catch (err) { next(err) }
}

export async function overdueReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const bucket = req.query.bucket as string | undefined
    const format = req.query.format as string | undefined
    const data = await debtsService.getOverdueReport(bucket)

    if (format === 'csv') {
      const rows = data.map((d) => ({
        Cedula: d.client?.cedula ?? '',
        Cliente: d.client?.name ?? '',
        Telefono: d.client?.phone ?? '',
        Descripcion: d.description ?? '',
        'Monto Original': d.originalAmount,
        'Monto Pagado': d.paidAmount,
        'Saldo Pendiente': d.outstandingBalance,
        'Fecha Vencimiento': new Date(d.dueDate).toLocaleDateString('es-CO'),
        'Dias en Mora': d.daysOverdue,
        Bucket: d.bucket,
      }))
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="reporte-mora.csv"')
      res.send(toCsv(rows))
    } else {
      res.json(data)
    }
  } catch (err) { next(err) }
}
