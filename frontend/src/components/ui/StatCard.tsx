import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string
  subtitle?: string
  className?: string
  icon?: React.ReactNode
}

export default function StatCard({ title, value, subtitle, className, icon }: Props) {
  return (
    <div className={cn('bg-white rounded-xl p-5 shadow-sm border', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-gray-300">{icon}</div>}
      </div>
    </div>
  )
}
