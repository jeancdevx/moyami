import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

import { isIndexable } from '@/config/indexing'

export const GET: APIRoute = async ({ site }) => {
  const paths = isIndexable(site)
    ? [
        '/',
        '/privacidad/',
        '/condiciones/',
        ...(await getCollection('products')).map(p => `/productos/${p.id}/`)
      ]
    : []
  const urls = paths
    .map(
      pathname =>
        `<url><loc>${new URL(pathname, site).href.replaceAll('&', '&amp;')}</loc></url>`
    )
    .join('')
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  )
}
