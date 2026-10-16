type Connection = { saveData?: boolean }

export function mountWorldWhenReady() {
  const root = document.querySelector<HTMLElement>('[data-world]')
  if (!root) return
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const connection = (navigator as Navigator & { connection?: Connection })
    .connection
  if (reducedMotion.matches || connection?.saveData) return
  let started = false
  let disposed = false
  let cleanup: (() => void) | undefined
  const observer = new IntersectionObserver(
    async entries => {
      if (started || !entries.some(entry => entry.isIntersecting)) return
      started = true
      observer.disconnect()
      try {
        // Keep the poster and text ahead of optional WebGL work on slow devices.
        if (document.readyState !== 'complete') {
          await new Promise<void>(resolve =>
            window.addEventListener('load', () => resolve(), { once: true })
          )
        }
        await new Promise<void>(resolve => {
          if ('requestIdleCallback' in window)
            window.requestIdleCallback(() => resolve(), { timeout: 2000 })
          else setTimeout(resolve, 200)
        })
        if (disposed || reducedMotion.matches) return
        const { createWorld } = await import('./World.scene')
        if (!disposed && !reducedMotion.matches)
          cleanup = await createWorld(root)
        if (disposed || reducedMotion.matches) cleanup?.()
      } catch {
        // The poster remains the complete visual fallback.
        root.dataset.ready = 'false'
      }
    },
    { rootMargin: '100px' }
  )
  observer.observe(root)
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return
    disposed = true
    cleanup?.()
  })
  window.addEventListener(
    'pagehide',
    () => {
      disposed = true
      observer.disconnect()
      cleanup?.()
    },
    { once: true }
  )
}
