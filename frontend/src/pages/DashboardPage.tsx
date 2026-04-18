import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { dashboardApi } from '@/api/debts'
import StatCard from '@/components/ui/StatCard'
import { UrgencyBadge } from '@/components/ui/Badge'
import { formatCurrency, getBucketLabel } from '@/lib/utils'
import { DollarSign, TrendingUp, AlertCircle, Users } from 'lucide-react'

const BUCKET_COLORS: Record<string, string> = {
  'al-dia': '#22c55e',
  '0-30': '#eab308',
  '31-60': '#f97316',
  '60+': '#ef4444',
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    refetchInterval: 60000,
  })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  const stats = data!
  const chartData = stats.overdueByBucket.map((b) => ({
    name: getBucketLabel(b.bucket),
    monto: b.amount,
    clientes: b.count,
    color: BUCKET_COLORS[b.bucket],
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Cartera Total"
          value={formatCurrency(stats.totalPortfolio)}
          icon={<DollarSign size={28} />}
        />
        <StatCard
          title="Saldo en Mora"
          value={formatCurrency(stats.totalOutstanding)}
          className="border-red-200"
          icon={<AlertCircle size={28} className="text-red-300" />}
        />
        <StatCard
          title="Recuperado"
          value={formatCurrency(stats.totalRecovered)}
          className="border-green-200"
          icon={<TrendingUp size={28} className="text-green-300" />}
        />
        <StatCard
          title="Tasa de Recuperación"
          value={`${stats.recoveryRate.toFixed(1)}%`}
          icon={<Users size={28} />}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h2 className="font-semibold mb-4 text-gray-700">Cartera por Antigüedad</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="monto" name="Saldo">
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h2 className="font-semibold mb-4 text-gray-700">Distribución por Clientes</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData} dataKey="clientes" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Clientes con Mayor Mora</h2>
          <Link to="/clients" className="text-sm text-brand hover:underline">Ver todos</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Cliente</th>
                <th className="text-left px-4 py-3">Descripción</th>
                <th className="text-right px-4 py-3">Saldo</th>
                <th className="text-center px-4 py-3">Días</th>
                <th className="text-center px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.topOverdueClients.map((row) => (
                <tr key={row.debtId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/clients/${row.client.id}`} className="font-medium text-brand hover:underline">
                      {row.client.name}
                    </Link>
                    <div className="text-xs text-gray-400">{row.client.cedula}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.description || '—'}</td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">
                    {formatCurrency(row.outstandingBalance)}
                  </td>
                  <td className="px-4 py-3 text-center">{row.daysOverdue}</td>
                  <td className="px-4 py-3 text-center">
                    <UrgencyBadge bucket={row.bucket} />
                  </td>
                </tr>
              ))}
              {stats.topOverdueClients.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Sin clientes en mora</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
