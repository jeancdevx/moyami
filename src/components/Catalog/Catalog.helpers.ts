export type Category = 'todos' | 'snacks' | 'bebidas' | 'ramen'

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[’']/g, '')
    .trim()
}

export function matchesProduct(searchText: string, query: string): boolean {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean)
  const normalized = normalizeSearch(searchText)
  return terms.every(term => normalized.includes(term))
}
