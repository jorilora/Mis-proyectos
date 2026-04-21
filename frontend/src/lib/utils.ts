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
    '1-15': '1-15 días',
    '16-30': '16-30 días',
    '30+': 'Más de 30 días',
  }
  return labels[bucket] ?? bucket
}
