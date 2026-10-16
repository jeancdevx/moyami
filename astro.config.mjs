import tailwindcss from '@tailwindcss/vite'
// @ts-check
import { defineConfig } from 'astro/config'

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const deploymentHost = process.env.VERCEL_URL
const site =
  process.env.SITE_URL ||
  (productionHost || deploymentHost
    ? `https://${productionHost || deploymentHost}`
    : undefined)

// https://astro.build/config
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] }
})
