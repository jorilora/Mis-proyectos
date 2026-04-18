import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function getBucketLabel(bucket: string): string {
  const labels: Record<string, string> = {
    'al-dia': 'Al día',
    '0-30': '1-30 días',
    '31-60': '31-60 días',
    '60+': 'Más de 60 días',
  }
  return labels[bucket] ?? bucket
}
