export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function asFiniteNumber(value: unknown, fallback = 0): number {
  return isFiniteNumber(value) ? value : fallback
}

export function asText(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

export function asNullableText(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

export function asObject<T extends object>(value: unknown): Partial<T> {
  return typeof value === 'object' && value !== null ? (value as Partial<T>) : {}
}
