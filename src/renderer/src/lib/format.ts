export function dash(value: string | number | null | undefined): string | number {
  if (value === null || value === undefined || value === '') return '-'
  return value
}
