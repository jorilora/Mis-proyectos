import { cn } from '@/lib/utils'

type Bucket = 'al-dia' | '1-15' | '16-30' | '30+'

const styles: Record<Bucket, string> = {
  'al-dia': 'bg-green-100 text-green-800',
  '1-15': 'bg-yellow-100 text-yellow-800',
  '16-30': 'bg-orange-100 text-orange-800',
  '30+': 'bg-red-100 text-red-800',
}

const labels: Record<Bucket, string> = {
  'al-dia': 'Al día',
  '1-15': '1-15 días',
  '16-30': '16-30 días',
  '30+': '+30 días',
}

export function UrgencyBadge({ bucket }: { bucket: string }) {
  const b = (bucket as Bucket) in styles ? (bucket as Bucket) : '30+'
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
