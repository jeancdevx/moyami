import type { APIRoute } from 'astro'

import { isIndexable } from '@/config/indexing'

export const GET: APIRoute = ({ site }) => {
  const indexable = isIndexable(site)
  return new Response(
    indexable
      ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
