import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsApi } from '@/api/clients'
import ClientForm from '@/components/clients/ClientForm'
import { UrgencyBadge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search, Trash2, Pencil } from 'lucide-react'

export default function ClientsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editClient, setEditClient] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['clients', search, page],
    queryFn: () => clientsApi.list({ search, page, limit: 20 }),
  })

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })

  function handleDelete(id: string, name: string) {
    if (confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => { setEditClient(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-brand text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-dark"
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Buscar por nombre, cédula o teléfono..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">Cliente</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Teléfono</th>
                  <th className="text-right px-4 py-3">Saldo Pendiente</th>
                  <th className="text-center px-4 py-3 hidden md:table-cell">Estado</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.data.map((client) => {
                  const worstBucket = client.debts.length
                    ? client.debts.reduce((w, d) => {
                        const order = ['al-dia', '0-30', '31-60', '60+']
                        return order.indexOf(d.bucket) > order.indexOf(w) ? d.bucket : w
                      }, 'al-dia')
                    : 'al-dia'
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/clients/${client.id}`} className="font-medium text-brand hover:underline">
                          {client.name}
                        </Link>
                        <div className="text-xs text-gray-400">{client.cedula}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{client.phone || '—'}</td>
                      <td className="px-4 py-3 text-right font-medium text-red-600">
                        {formatCurrency(client.outstandingBalance)}
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        {client.outstandingBalance > 0 && <UrgencyBadge bucket={worstBucket} />}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => { setEditClient(client); setShowForm(true) }}
                            className="p-1.5 text-gray-400 hover:text-brand rounded"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id, client.name)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {data?.data.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No se encontraron clientes
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > 20 && (
          <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
            <span>Mostrando {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} de {data.total}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-40">Anterior</button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page * 20 >= data.total} className="px-3 py-1 border rounded disabled:opacity-40">Siguiente</button>
            </div>
          </div>
        )}
      </div>

      <ClientForm isOpen={showForm} onClose={() => { setShowForm(false); setEditClient(null) }} client={editClient} />
    </div>
  )
}
