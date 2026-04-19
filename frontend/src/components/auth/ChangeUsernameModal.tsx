import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { useAuth } from '@/contexts/AuthContext'
import Modal from '@/components/ui/Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ChangeUsernameModal({ isOpen, onClose }: Props) {
  const { updateUser } = useAuth()
  const [form, setForm] = useState({ newUsername: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: () => authApi.changeUsername(form.newUsername, form.password),
    onSuccess: (data) => {
      updateUser({ username: data.user.username })
      setSuccess(true)
      setForm({ newUsername: '', password: '' })
      setTimeout(() => { setSuccess(false); onClose() }, 2000)
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al cambiar usuario'),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.newUsername.trim().length < 3) {
      setError('El usuario debe tener al menos 3 caracteres')
      return
    }
    mutation.mutate()
  }

  function handleClose() {
    setForm({ newUsername: '', password: '' })
    setError('')
    setSuccess(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar Usuario">
      {success ? (
        <div className="py-6 text-center">
          <p className="text-green-600 font-medium text-lg">✓ Usuario actualizado</p>
          <p className="text-gray-400 text-sm mt-1">Cerrando...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo usuario *</label>
            <input
              type="text"
              value={form.newUsername}
              onChange={(e) => { setForm((f) => ({ ...f, newUsername: e.target.value })); setError('') }}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Mínimo 3 caracteres"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => { setForm((f) => ({ ...f, password: e.target.value })); setError('') }}
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
              {mutation.isPending ? 'Guardando...' : 'Cambiar Usuario'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
