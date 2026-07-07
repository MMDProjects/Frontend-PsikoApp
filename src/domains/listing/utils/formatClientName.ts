export function formatClientName(fullName: string): string {
  const parts = fullName.trim().split(' ')
  return parts.map((w, i) => (i === 0 ? w : w[0] + '.')).join(' ')
}
