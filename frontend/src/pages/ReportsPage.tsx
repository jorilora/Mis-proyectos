import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/debts'
import { UrgencyBadge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Download } from 'lucide-react'
import api from '@/api/client'

const buckets = ['', '1-15', '16-30', '30+']
const bucketLabels: Record<string, string> = {
  '': 'Todos', '1-15': '1-15 días', '16-30': '16-30 días', '30+': '+30 días',
}

export default function ReportsPage() {
  const [bucket, setBucket] = useState('')
  const [downloading, setDownloading] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['overdue-report', bucket],
    queryFn: () => dashboardApi.overdueReport(bucket ? { bucket } : undefined),
  })

  async function downloadCsv() {
    setDownloading(true)
    try {
      const resp = await api.get('/reports/overdue', {
        params: { format: 'csv', ...(bucket && { bucket }) },
        responseType: 'blob',
      })
      const url = URL.createObjectURL(resp.data)
      const a = document.createElement('a')
      a.href = url
      a.download = 'reporte-mora.csv'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  const rows = Array.isArray(data) ? data : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Reportes de Mora</h1>
        <button
          onClick={downloadCsv}
          disabled={downloading}
          className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <Download size={16} /> {downloading ? 'Descargando...' : 'Exportar CSV'}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {buckets.map((b) => (
          <button
            key={b}
            onClick={() => setBucket(b)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${bucket === b ? 'bg-brand text-white border-brand' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {bucketLabels[b]}
          </button>
        ))}
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
                  <th className="text-left px-4 py-3 hidden md:table-cell">Número de Celular</th>
                  <th className="text-right px-4 py-3">Original</th>
                  <th className="text-right px-4 py-3">Pagado</th>
                  <th className="text-right px-4 py-3">Pendiente</th>
                  <th className="text-center px-4 py-3">Vence</th>
                  <th className="text-center px-4 py-3">Días</th>
                  <th className="text-center px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/clients/${row.client?.id}`} className="font-medium text-brand hover:underline">
                        {row.client?.name}
                      </Link>
                      <div className="text-xs text-gray-400">{row.client?.cedula}</div>
                      <div className="text-xs text-gray-400">{row.client?.phone || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{row.client?.phone || '—'}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(row.originalAmount)}</td>
                    <td className="px-4 py-3 text-right text-green-600">{formatCurrency(row.paidAmount)}</td>
                    <td className="px-4 py-3 text-right font-medium text-red-600">{formatCurrency(row.outstandingBalance)}</td>
                    <td className="px-4 py-3 text-center text-xs">{formatDate(row.dueDate)}</td>
                    <td className="px-4 py-3 text-center">{row.daysOverdue}</td>
                    <td className="px-4 py-3 text-center"><UrgencyBadge bucket={row.bucket} /></td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Sin registros en mora</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
