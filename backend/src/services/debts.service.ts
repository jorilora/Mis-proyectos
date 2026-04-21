import prisma from '../utils/prisma'
import { enrichDebt } from './clients.service'

export async function getClientDebts(clientId: string) {
  const debts = await prisma.debt.findMany({
    where: { clientId },
    include: { payments: true },
    orderBy: { dueDate: 'asc' },
  })
  return debts.map(enrichDebt)
}

export async function createDebt(data: {
  clientId: string
  amount: number
  dueDate: string
  description?: string
  invoiceNumber?: string
}) {
  const debt = await prisma.debt.create({
    data: {
      clientId: data.clientId,
      amount: data.amount,
      dueDate: new Date(data.dueDate),
      description: data.description,
      invoiceNumber: data.invoiceNumber,
    },
    include: { payments: true },
  })
  return enrichDebt(debt)
}

export async function updateDebt(
  id: string,
  data: Partial<{ amount: number; dueDate: string; description: string; invoiceNumber: string }>
) {
  const debt = await prisma.debt.update({
    where: { id },
    data: {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.invoiceNumber !== undefined && { invoiceNumber: data.invoiceNumber }),
    },
    include: { payments: true },
  })
  return enrichDebt(debt)
}

export async function deleteDebt(id: string) {
  return prisma.debt.delete({ where: { id } })
}

export async function getDashboardStats() {
  const debts = await prisma.debt.findMany({ include: { payments: true } })
  const enriched = debts.map(enrichDebt)

  const totalPortfolio = enriched.reduce((s, d) => s + d.originalAmount, 0)
  const totalOutstanding = enriched.reduce((s, d) => s + d.outstandingBalance, 0)
  const totalRecovered = enriched.reduce((s, d) => s + d.paidAmount, 0)
  const recoveryRate = totalPortfolio > 0 ? (totalRecovered / totalPortfolio) * 100 : 0

  const buckets: Record<string, { count: number; amount: number }> = {
    'al-dia': { count: 0, amount: 0 },
    '1-15': { count: 0, amount: 0 },
    '16-30': { count: 0, amount: 0 },
    '30+': { count: 0, amount: 0 },
  }

  for (const d of enriched) {
    if (d.outstandingBalance <= 0) continue
    buckets[d.bucket].count++
    buckets[d.bucket].amount += d.outstandingBalance
  }

  const overdueByBucket = Object.entries(buckets).map(([bucket, v]) => ({
    bucket,
    ...v,
  }))

  const topOverdue = enriched
    .filter((d) => d.outstandingBalance > 0 && d.daysOverdue > 0)
    .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
    .slice(0, 10)

  const clientIds = [...new Set(topOverdue.map((d) => d.clientId))]
  const clients = await prisma.client.findMany({ where: { id: { in: clientIds } } })
  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c]))

  const topOverdueClients = topOverdue.map((d) => ({
    debtId: d.id,
    client: clientMap[d.clientId],
    outstandingBalance: d.outstandingBalance,
    daysOverdue: d.daysOverdue,
    bucket: d.bucket,
    description: d.description,
  }))

  return {
    totalPortfolio,
    totalOutstanding,
    totalRecovered,
    recoveryRate,
    overdueByBucket,
    topOverdueClients,
  }
}

export async function getOverdueReport(bucket?: string) {
  const debts = await prisma.debt.findMany({
    include: { payments: true, client: true },
  })
  const enriched = debts
    .map((d) => ({ ...enrichDebt(d), client: (d as any).client }))
    .filter((d) => d.outstandingBalance > 0)

  const filtered = bucket ? enriched.filter((d) => d.bucket === bucket) : enriched
  return filtered.sort((a, b) => b.daysOverdue - a.daysOverdue)
}
