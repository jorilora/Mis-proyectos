import prisma from '../utils/prisma'

export async function createPayment(debtId: string, data: { amount: number; paidAt?: string; notes?: string }) {
  return prisma.payment.create({
    data: {
      debtId,
      amount: data.amount,
      paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
      notes: data.notes,
    },
  })
}

export async function deletePayment(id: string) {
  return prisma.payment.delete({ where: { id } })
}
