import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { debtsApi } from '@/api/debts'
import Modal from '@/components/ui/Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
  debtId: string
  clientId: string
  maxAmount: number
}

export default function PaymentForm({ isOpen, onClose, debtId, clientId, maxAmount }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ amount: '', paidAt: new Date().toISOString().split('T')[0], notes: '' })
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      debtsApi.addPayment(debtId, {
        amount: Number(form.amount),
        paidAt: form.paidAt,
        notes: form.notes,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', clientId] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      setForm({ amount: '', paidAt: new Date().toISOString().split('T')[0], notes: '' })
      onClose()
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al registrar'),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (Number(form.amount) <= 0) { setError('El monto debe ser mayor a 0'); return }
    mutation.mutate()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Abono">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto del abono * (máx. {maxAmount.toLocaleString('es-CO')})
          </label>
          <input
            type="number"
            min="1"
            max={maxAmount}
            step="0.01"
            value={form.amount}
            onChange={(e) => { setForm((f) => ({ ...f, amount: e.target.value })); setError('') }}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del pago</label>
          <input
            type="date"
            value={form.paidAt}
            onChange={(e) => setForm((f) => ({ ...f, paidAt: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Ej: Transferencia bancaria"
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
            className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Registrando...' : 'Registrar Abono'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
