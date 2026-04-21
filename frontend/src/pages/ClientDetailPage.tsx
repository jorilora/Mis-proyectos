import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsApi } from '@/api/clients'
import { debtsApi } from '@/api/debts'
import DebtForm from '@/components/debts/DebtForm'
import PaymentForm from '@/components/debts/PaymentForm'
import ClientForm from '@/components/clients/ClientForm'
import { UrgencyBadge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, Plus, Pencil, Trash2, CreditCard } from 'lucide-react'

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const [showDebtForm, setShowDebtForm] = useState(false)
  const [editDebt, setEditDebt] = useState<any>(null)
  const [showEditClient, setShowEditClient] = useState(false)
  const [paymentDebt, setPaymentDebt] = useState<any>(null)

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsApi.get(id!),
  })

  const deleteDebt = useMutation({
    mutationFn: debtsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', id] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const deletePayment = useMutation({
    mutationFn: ({ debtId, paymentId }: { debtId: string; paymentId: string }) =>
      debtsApi.deletePayment(debtId, paymentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client', id] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  if (isLoading) return <div className="p-8 text-center text-gray-400">Cargando...</div>
  if (!client) return <div className="p-8 text-center text-red-400">Cliente no encontrado</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/clients" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{client.name}</h1>
        <button onClick={() => setShowEditClient(true)} className="p-1.5 text-gray-400 hover:text-brand">
          <Pencil size={16} />
        </button>
      </div>

      {/* Client info */}
      <div className="bg-white rounded-xl p-5 shadow-sm border grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><p className="text-gray-400 text-xs">Cédula</p><p className="font-medium">{client.cedula}</p></div>
        <div><p className="text-gray-400 text-xs">Teléfono</p><p className="font-medium">{client.phone || '—'}</p></div>
        <div><p className="text-gray-400 text-xs">Email</p><p className="font-medium">{client.email || '—'}</p></div>
        <div><p className="text-gray-400 text-xs">Dirección</p><p className="font-medium">{client.address || '—'}</p></div>
        <div className="col-span-2">
          <p className="text-gray-400 text-xs">Total en Mora</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(client.outstandingBalance)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Total Pagado</p>
          <p className="font-medium text-green-600">{formatCurrency(client.totalPaid)}</p>
        </div>
        {client.notes && (
          <div className="col-span-2 md:col-span-4">
            <p className="text-gray-400 text-xs">Notas</p>
            <p>{client.notes}</p>
          </div>
        )}
      </div>

      {/* Debts */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Deudas</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDebtForm(true)}
              className="flex items-center gap-2 bg-brand text-white rounded-lg px-3 py-1.5 text-sm hover:bg-brand-dark"
            >
              <Plus size={14} /> Nueva Deuda
            </button>
          </div>
        </div>

        {client.debts.length === 0 ? (
          <p className="p-8 text-center text-gray-400">Sin deudas registradas</p>
        ) : (
          <div className="divide-y">
            {client.debts.map((debt) => (
              <div key={debt.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{debt.description || 'Sin descripción'}</p>
                    {debt.invoiceNumber && (
                      <p className="text-xs text-gray-500">Factura: {debt.invoiceNumber}</p>
                    )}
                    <p className="text-xs text-gray-400">Venció: {formatDate(debt.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <UrgencyBadge bucket={debt.bucket} />
                    {debt.daysOverdue > 0 && (
                      <span className="text-xs text-gray-400">{debt.daysOverdue}d</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-gray-400 text-xs">Original</p>
                    <p className="font-medium">{formatCurrency(debt.originalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Pagado</p>
                    <p className="font-medium text-green-600">{formatCurrency(debt.paidAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Pendiente</p>
                    <p className="font-medium text-red-600">{formatCurrency(debt.outstandingBalance)}</p>
                  </div>
                </div>

                {/* Payments */}
                {debt.payments.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1">
                    <p className="text-xs font-medium text-gray-500 mb-2">Abonos registrados</p>
                    {debt.payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-xs">
                        <span>{formatDate(p.paidAt)} — {p.notes || 'Abono'}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-green-600">{formatCurrency(Number(p.amount))}</span>
                          <button
                            onClick={() => confirm('¿Eliminar este abono?') && deletePayment.mutate({ debtId: debt.id, paymentId: p.id })}
                            className="text-gray-300 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {debt.outstandingBalance > 0 && (
                    <button
                      onClick={() => setPaymentDebt(debt)}
                      className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-1.5 hover:bg-green-100"
                    >
                      <CreditCard size={12} /> Registrar Abono
                    </button>
                  )}
                  <button
                    onClick={() => setEditDebt(debt)}
                    className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50"
                  >
                    <Pencil size={12} /> Editar Deuda
                  </button>
                  <button
                    onClick={() => confirm('¿Eliminar esta deuda y sus abonos?') && deleteDebt.mutate(debt.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 border rounded-lg px-3 py-1.5 hover:text-red-500 hover:border-red-200"
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DebtForm isOpen={showDebtForm} onClose={() => setShowDebtForm(false)} clientId={id!} />
      <DebtForm isOpen={!!editDebt} onClose={() => setEditDebt(null)} clientId={id!} debt={editDebt} />
      {paymentDebt && (
        <PaymentForm
          isOpen={!!paymentDebt}
          onClose={() => setPaymentDebt(null)}
          debtId={paymentDebt.id}
          clientId={id!}
          maxAmount={paymentDebt.outstandingBalance}
        />
      )}
      <ClientForm isOpen={showEditClient} onClose={() => setShowEditClient(false)} client={client} />
    </div>
  )
}
