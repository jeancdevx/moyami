import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const mapTile =
  '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#eeefe7"/><path d="M0 128h256M128 0v256" stroke="white" stroke-width="16"/></svg>'
const rasterUrl = 'https://tile.openstreetmap.org/**'
async function allowRasterMap(page: Page) {
  await page.route(rasterUrl, route =>
    route.fulfill({ contentType: 'image/svg+xml', body: mapTile })
  )
}

test.beforeEach(async ({ page }) => {
  await page.route('https://tiles.openfreemap.org/**', route => route.abort())
  await page.route(rasterUrl, route => route.abort())
})

test('catálogo completo, búsqueda, categorías y recuperación del estado vacío', async ({
  page
}) => {
  await page.goto('/')
  await expect(page.locator('[data-product-card]')).toHaveCount(29)
  await page.getByRole('button', { name: 'Ramen 9', exact: true }).click()
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(9)
  const search = page.getByRole('searchbox')
  await search.fill('uva')
  await expect(
    page.getByText('No encontramos ese antojo', { exact: true })
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Ver todo el catálogo', exact: true })
    .click()
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(29)
  await search.fill('LIMON')
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(1)
  await expect(page.locator('[data-catalog-count]')).toHaveText(
    '1 producto para descubrir'
  )
})

test('detalle con galería, cierre mediante Escape y devolución del foco', async ({
  page
}) => {
  await page.goto('/')
  const opener = page.getByRole('link', {
    name: 'Ver Bubble Milk Tea matcha',
    exact: true
  })
  await opener.click()
  const dialog = page.getByRole('dialog', { name: 'Bubble Milk Tea matcha' })
  await expect(dialog).toBeVisible()
  const position = await dialog.evaluate(element => {
    const rect = element.getBoundingClientRect()
    return {
      horizontalOffset: Math.abs(rect.x + rect.width / 2 - innerWidth / 2),
      verticalOffset: Math.abs(rect.y + rect.height / 2 - innerHeight / 2),
      radius: parseFloat(getComputedStyle(element).borderRadius),
      fits: rect.width <= innerWidth && rect.height <= innerHeight
    }
  })
  expect(position.horizontalOffset).toBeLessThanOrEqual(2)
  expect(position.verticalOffset).toBeLessThanOrEqual(2)
  expect(position.radius).toBeLessThanOrEqual(8)
  expect(position.fits).toBe(true)
  await expect(dialog.locator('figcaption')).toHaveCount(0)
  await dialog
    .getByRole('button', { name: 'Ver vista de tres cuartos', exact: true })
    .click()
  await expect(dialog.locator('[data-gallery-image="1"]')).toBeVisible()
  await expect(dialog.locator('[data-gallery-image="0"]')).toBeHidden()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
})

test('menú móvil accesible y sin desbordamiento a 320 px', async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile')
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  const menu = page.getByRole('dialog', { name: 'Menú de navegación' })
  await expect(menu).toBeVisible()
  await menu.getByRole('link', { name: 'Catálogo', exact: true }).click()
  await expect(menu).not.toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})

test('fallo del mapa conserva la dirección y permite reintentar', async ({
  page
}) => {
  await page.goto('/#ubicacion')
  await expect(
    page.getByText('El mapa no pudo cargarse.', { exact: true })
  ).toBeVisible({
    timeout: 20000
  })
  await expect(page.locator('.location-address')).toContainText(
    'Jr. San Martín 316'
  )
  await allowRasterMap(page)
  await page
    .getByRole('button', { name: 'Volver a cargar el mapa', exact: true })
    .click()
  await expect(page.locator('[data-location-map]')).toHaveAttribute(
    'data-ready',
    'true'
  )
  await expect(
    page.getByText('El mapa no pudo cargarse.', { exact: true })
  ).toBeHidden()
})

test('si falla OpenFreeMap carga el mapa alternativo y sus controles', async ({
  page
}) => {
  await allowRasterMap(page)
  await page.goto('/#ubicacion')
  const map = page.locator('[data-location-map]')
  await expect(map).toHaveAttribute('data-renderer', 'raster')
  await expect(map).toHaveAttribute('data-ready', 'true')
  await expect(map.locator('.moyami-marker')).toBeVisible()
  await expect(map.getByRole('link', { name: 'OpenStreetMap' })).toBeVisible()
  await page.getByRole('button', { name: 'Acercar mapa', exact: true }).click()
  await expect(
    map.locator('img.leaflet-tile[src*="/17/"]').first()
  ).toBeVisible()
})

test('la pérdida del contexto gráfico recupera un mapa utilizable', async ({
  page
}) => {
  await allowRasterMap(page)
  await page.route('https://tiles.openfreemap.org/styles/positron', route =>
    route.fulfill({
      json: {
        version: 8,
        sources: {},
        layers: [{ id: 'background', type: 'background' }]
      }
    })
  )
  await page.goto('/#ubicacion')
  const map = page.locator('[data-location-map]')
  await expect(map).toHaveAttribute('data-renderer', 'vector')
  await map.locator('canvas').dispatchEvent('webglcontextlost')
  await expect(map).toHaveAttribute('data-renderer', 'raster')
  await expect(map).toHaveAttribute('data-ready', 'true')
  await expect(map.locator('.moyami-marker')).toBeVisible()
})

test('movimiento reducido conserva la portada y cumple las comprobaciones de accesibilidad', async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('[data-world-canvas] canvas')).toHaveCount(0)
  await expect(page.locator('[data-world-poster]')).toBeVisible()
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})

test('sin WebGL el catálogo y el mapa siguen disponibles', async ({ page }) => {
  await allowRasterMap(page)
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      kind: string,
      ...args: unknown[]
    ) {
      if (kind.startsWith('webgl') || kind === 'experimental-webgl') return null
      return original.apply(this, [kind, ...args] as Parameters<
        typeof original
      >)
    } as typeof original
  })
  await page.goto('/')
  await expect(page.locator('[data-product-card]')).toHaveCount(29)
  await expect(page.locator('[data-world-poster]')).toBeVisible()
  await page.locator('[data-location-map]').scrollIntoViewIfNeeded()
  await expect(page.locator('[data-location-map]')).toHaveAttribute(
    'data-renderer',
    'raster'
  )
  await expect(page.locator('[data-location-map]')).toHaveAttribute(
    'data-ready',
    'true'
  )
})

test('sin JavaScript se puede navegar al producto y consultar sus vistas', async ({
  browser,
  baseURL
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(`${baseURL}/`)
  await expect(page.locator('[data-product-card]')).toHaveCount(29)
  await page
    .getByRole('link', { name: 'Ver Pepero choco cookie', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Pepero choco cookie', exact: true })
  ).toBeVisible()
  await expect(page.locator('[data-gallery-image]')).toHaveCount(2)
  await expect(
    page.getByText('Vista generada con IA', { exact: true })
  ).toBeVisible()
  await context.close()
})
