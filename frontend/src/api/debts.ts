import api from './client'
import type { Debt, Payment } from './clients'

export const debtsApi = {
  create: (data: { clientId: string; amount: number; dueDate: string; description?: string }) =>
    api.post<Debt>('/debts', data).then((r) => r.data),

  update: (id: string, data: Partial<{ amount: number; dueDate: string; description: string }>) =>
    api.put<Debt>(`/debts/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/debts/${id}`),

  addPayment: (debtId: string, data: { amount: number; paidAt?: string; notes?: string }) =>
    api.post<Payment>(`/debts/${debtId}/payments`, data).then((r) => r.data),

  deletePayment: (debtId: string, paymentId: string) =>
    api.delete(`/debts/${debtId}/payments/${paymentId}`),
}

export interface DashboardStats {
  totalPortfolio: number
  totalOutstanding: number
  totalRecovered: number
  recoveryRate: number
  overdueByBucket: { bucket: string; count: number; amount: number }[]
  topOverdueClients: {
    debtId: string
    client: { id: string; cedula: string; name: string; phone?: string }
    outstandingBalance: number
    daysOverdue: number
    bucket: string
    description?: string
  }[]
}

export const dashboardApi = {
  get: () => api.get<DashboardStats>('/dashboard').then((r) => r.data),
  overdueReport: (params?: { bucket?: string; format?: string }) =>
    api.get('/reports/overdue', { params, responseType: params?.format === 'csv' ? 'blob' : 'json' }).then((r) => r.data),
}
