import api from './client'

export interface Client {
  id: string
  cedula: string
  name: string
  phone?: string
  address?: string
  email?: string
  notes?: string
  createdAt: string
  debts: Debt[]
  totalDebt: number
  totalPaid: number
  outstandingBalance: number
}

export interface Debt {
  id: string
  clientId: string
  amount: string
  originalAmount: number
  paidAmount: number
  outstandingBalance: number
  daysOverdue: number
  bucket: string
  dueDate: string
  description?: string
  invoiceNumber?: string
  payments: Payment[]
}

export interface Payment {
  id: string
  debtId: string
  amount: string
  paidAt: string
  notes?: string
}

export const clientsApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get<{ data: Client[]; total: number; page: number; limit: number }>('/clients', { params }).then((r) => r.data),

  get: (id: string) => api.get<Client>(`/clients/${id}`).then((r) => r.data),

  create: (data: Omit<Client, 'id' | 'createdAt' | 'debts' | 'totalDebt' | 'totalPaid' | 'outstandingBalance'>) =>
    api.post<Client>('/clients', data).then((r) => r.data),

  update: (id: string, data: Partial<Client>) =>
    api.put<Client>(`/clients/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/clients/${id}`),

  getDebts: (clientId: string) => api.get<Debt[]>(`/clients/${clientId}/debts`).then((r) => r.data),
}
