export function isIndexable(site: URL | undefined): boolean {
  return (
    import.meta.env.PROD &&
    import.meta.env.PUBLIC_INDEXABLE === 'true' &&
    Boolean(site)
  )
}
