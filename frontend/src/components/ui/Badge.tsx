import { cn } from '@/lib/utils'

type Bucket = 'al-dia' | '0-30' | '31-60' | '60+'

const styles: Record<Bucket, string> = {
  'al-dia': 'bg-green-100 text-green-800',
  '0-30': 'bg-yellow-100 text-yellow-800',
  '31-60': 'bg-orange-100 text-orange-800',
  '60+': 'bg-red-100 text-red-800',
}

const labels: Record<Bucket, string> = {
  'al-dia': 'Al día',
  '0-30': '1-30 días',
  '31-60': '31-60 días',
  '60+': '+60 días',
}

export function UrgencyBadge({ bucket }: { bucket: string }) {
  const b = (bucket as Bucket) in styles ? (bucket as Bucket) : '60+'
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', styles[b])}>
      {labels[b]}
    </span>
  )
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700', className)}>
      {children}
    </span>
  )
}
