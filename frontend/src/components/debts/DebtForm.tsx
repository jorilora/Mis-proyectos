import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { debtsApi } from '@/api/debts'
import Modal from '@/components/ui/Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
  clientId: string
  debt?: { id: string; amount: number; dueDate: string; description?: string | null; invoiceNumber?: string | null }
}

export default function DebtForm({ isOpen, onClose, clientId, debt }: Props) {
  const qc = useQueryClient()
  const isEdit = !!debt
  const [form, setForm] = useState({ amount: '', dueDate: '', description: '', invoiceNumber: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (debt) {
      setForm({
        amount: String(debt.amount),
        dueDate: debt.dueDate ? debt.dueDate.slice(0, 10) : '',
        description: debt.description ?? '',
        invoiceNumber: debt.invoiceNumber ?? '',
      })
    } else {
      setForm({ amount: '', dueDate: '', description: '', invoiceNumber: '' })
    }
    setError('')
  }, [debt, isOpen])

  const mutation = useMutation({
    mutationFn: () =>
      isEdit
        ? debtsApi.update(debt!.id, {
            amount: Number(form.amount),
            dueDate: form.dueDate,
            description: form.description,
            invoiceNumber: form.invoiceNumber,
          })
        : debtsApi.create({
            clientId,
            amount: Number(form.amount),
            dueDate: form.dueDate,
            description: form.description,
            invoiceNumber: form.invoiceNumber,
          }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', clientId] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      onClose()
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al guardar'),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar Deuda' : 'Registrar Deuda'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de Factura</label>
          <input
            type="text"
            value={form.invoiceNumber}
            onChange={(e) => setForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Ej: FAC-001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Ej: Préstamo enero 2024"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-brand text-white rounded-lg py-2 text-sm font-medium hover:bg-brand-dark disabled:opacity-50"
          >
            {mutation.isPending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
