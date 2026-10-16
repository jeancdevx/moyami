import { supportsVectorMap } from './Location.shared'

export function setupLocationMap() {
  const root = document.querySelector<HTMLElement>('[data-location-map]')
  if (!root) return
  const loading = root.querySelector<HTMLElement>('[data-map-loading]')!
  const error = root.querySelector<HTMLElement>('[data-map-error]')!
  let cleanup: (() => void) | undefined
  let pending = false
  let disposed = false
  let controller: AbortController | undefined
  const load = async (useRaster = false) => {
    if (pending || disposed) return
    pending = true
    controller = new AbortController()
    const { signal } = controller
    root.setAttribute('aria-busy', 'true')
    delete root.dataset.ready
    delete root.dataset.renderer
    error.hidden = true
    loading.hidden = false
    cleanup?.()
    cleanup = undefined
    root.querySelector('[data-map-canvas]')?.replaceChildren()
    try {
      if (!useRaster && supportsVectorMap()) {
        try {
          const { createLocationMap } = await import('./Location.map')
          signal.throwIfAborted()
          cleanup = await createLocationMap(root, signal, () => void load(true))
          root.dataset.renderer = 'vector'
        } catch (cause) {
          signal.throwIfAborted()
          if (import.meta.env.DEV)
            console.warn('Mapa vectorial: se usará el mapa alternativo.', cause)
        }
      }
      if (!cleanup) {
        root.querySelector('[data-map-canvas]')?.replaceChildren()
        const { createRasterMap } = await import('./Location.raster')
        signal.throwIfAborted()
        cleanup = await createRasterMap(root, signal)
        root.dataset.renderer = 'raster'
      }
      if (disposed) cleanup()
      else {
        loading.hidden = true
        root.dataset.ready = 'true'
      }
    } catch (cause) {
      if (!disposed) {
        if (import.meta.env.DEV)
          console.warn('No se pudo iniciar el mapa.', cause)
        loading.hidden = true
        error.hidden = false
        root.dataset.ready = 'false'
      }
    } finally {
      root.setAttribute('aria-busy', 'false')
      pending = false
    }
  }
  const observer = new IntersectionObserver(
    entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect()
      void load()
    },
    { rootMargin: '200px' }
  )
  observer.observe(root)
  root.querySelector('[data-map-retry]')?.addEventListener('click', () => {
    void load()
  })
  window.addEventListener(
    'pagehide',
    () => {
      disposed = true
      controller?.abort()
      observer.disconnect()
      cleanup?.()
    },
    { once: true }
  )
}
