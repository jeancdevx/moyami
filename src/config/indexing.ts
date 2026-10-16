/** Build-time policy shared by metadata, robots.txt and the sitemap. */
export function isIndexable(site: URL | undefined): boolean {
  const productionDeployment =
    process.env.VERCEL === '1'
      ? process.env.VERCEL_ENV === 'production'
      : !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'

  return (
    import.meta.env.PROD &&
    import.meta.env.PUBLIC_INDEXABLE === 'true' &&
    Boolean(site) &&
    productionDeployment
  )
}
