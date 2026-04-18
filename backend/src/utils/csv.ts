export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? ''
          return `"${String(val).replace(/"/g, '""')}"`
        })
        .join(',')
    ),
  ]
  return lines.join('\n')
}
