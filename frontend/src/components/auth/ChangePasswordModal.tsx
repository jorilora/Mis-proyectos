import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import Modal from '@/components/ui/Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: () => authApi.changePassword(form.current, form.next),
    onSuccess: () => {
      setSuccess(true)
      setForm({ current: '', next: '', confirm: '' })
      setTimeout(() => { setSuccess(false); onClose() }, 2000)
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al cambiar contraseña'),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.next !== form.confirm) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }
    if (form.next.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }
    mutation.mutate()
  }

  function handleClose() {
    setForm({ current: '', next: '', confirm: '' })
    setError('')
    setSuccess(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar Contraseña">
      {success ? (
        <div className="py-6 text-center">
          <p className="text-green-600 font-medium text-lg">✓ Contraseña actualizada</p>
          <p className="text-gray-400 text-sm mt-1">Cerrando...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual *</label>
            <input
              type="password"
              value={form.current}
              onChange={(e) => { setForm((f) => ({ ...f, current: e.target.value })); setError('') }}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña *</label>
            <input
              type="password"
              value={form.next}
              onChange={(e) => { setForm((f) => ({ ...f, next: e.target.value })); setError('') }}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña *</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => { setForm((f) => ({ ...f, confirm: e.target.value })); setError('') }}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={handleClose} className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-brand text-white rounded-lg py-2 text-sm font-medium hover:bg-brand-dark disabled:opacity-50"
            >
              {mutation.isPending ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
