import prisma from '../utils/prisma'

export async function listClients(search = '', page = 1, limit = 20) {
  const skip = (page - 1) * limit
  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { cedula: { contains: search } },
          { phone: { contains: search } },
        ],
      }
    : {}

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        debts: {
          include: { payments: true },
        },
      },
    }),
    prisma.client.count({ where }),
  ])

  return {
    data: clients.map(enrichClient),
    total,
    page,
    limit,
  }
}

export async function getClient(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: { debts: { include: { payments: true }, orderBy: { dueDate: 'asc' } } },
  })
  if (!client) throw new Error('Cliente no encontrado')
  return enrichClient(client)
}

export async function createClient(data: {
  cedula: string
  name: string
  phone?: string
  address?: string
  email?: string
  notes?: string
}) {
  return prisma.client.create({ data })
}

export async function updateClient(
  id: string,
  data: Partial<{
    cedula: string
    name: string
    phone: string
    address: string
    email: string
    notes: string
  }>
) {
  return prisma.client.update({ where: { id }, data })
}

export async function deleteClient(id: string) {
  return prisma.client.delete({ where: { id } })
}

function enrichClient(client: any) {
  const debts = (client.debts ?? []).map(enrichDebt)
  const totalDebt = debts.reduce((s: number, d: any) => s + d.originalAmount, 0)
  const totalPaid = debts.reduce((s: number, d: any) => s + d.paidAmount, 0)
  const outstandingBalance = totalDebt - totalPaid
  return { ...client, debts, totalDebt, totalPaid, outstandingBalance }
}

export function enrichDebt(debt: any) {
  const originalAmount = Number(debt.amount)
  const paidAmount = (debt.payments ?? []).reduce(
    (s: number, p: any) => s + Number(p.amount),
    0
  )
  const outstandingBalance = originalAmount - paidAmount
  const today = new Date()
  const due = new Date(debt.dueDate)
  const daysOverdue = outstandingBalance > 0 ? Math.max(0, Math.floor((today.getTime() - due.getTime()) / 86400000)) : 0
  const bucket =
    daysOverdue === 0 ? 'al-dia' : daysOverdue <= 15 ? '1-15' : daysOverdue <= 30 ? '16-30' : '30+'
  return { ...debt, originalAmount, paidAmount, outstandingBalance, daysOverdue, bucket }
}
