export function setupReveals() {
  if (
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  )
    return
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        entry.target.classList.remove('is-waiting')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.08 }
  )
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
    // Content already in view stays visible and never delays the first paint.
    if (element.getBoundingClientRect().top < innerHeight) return
    element.classList.add('reveal', 'is-waiting')
    observer.observe(element)
  })
  window.addEventListener(
    'pagehide',
    () => {
      observer.disconnect()
    },
    { once: true }
  )
}
