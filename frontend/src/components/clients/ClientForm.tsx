import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsApi, type Client } from '@/api/clients'
import Modal from '@/components/ui/Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
  client?: Client
}

export default function ClientForm({ isOpen, onClose, client }: Props) {
  const qc = useQueryClient()
  const isEdit = !!client
  const [form, setForm] = useState({
    cedula: client?.cedula ?? '',
    name: client?.name ?? '',
    phone: client?.phone ?? '',
    address: client?.address ?? '',
    email: client?.email ?? '',
    notes: client?.notes ?? '',
  })
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      isEdit
        ? clientsApi.update(client!.id, form)
        : clientsApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] })
      if (client) qc.invalidateQueries({ queryKey: ['client', client.id] })
      onClose()
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al guardar'),
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate()
  }

  const fields: { label: string; key: keyof typeof form; required?: boolean; type?: string }[] = [
    { label: 'Cédula / NIT', key: 'cedula', required: true },
    { label: 'Nombre completo', key: 'name', required: true },
    { label: 'Teléfono', key: 'phone', type: 'tel' },
    { label: 'Dirección', key: 'address' },
    { label: 'Número de Factura', key: 'email' },
    { label: 'Notas', key: 'notes' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {fields.map(({ label, key, required, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
            <input
              type={type || 'text'}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              required={required}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        ))}
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
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
