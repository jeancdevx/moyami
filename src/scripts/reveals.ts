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
  const words = document.querySelectorAll<HTMLElement>('[data-reveal-word]')
  const wordObservers: IntersectionObserver[] = []
  words.forEach((word, index) => {
    word.closest('.tagline-inner')?.classList.add('word-enhanced')
    const wordObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries)
          entry.target.classList.toggle(
            'word-active',
            entry.isIntersecting || entry.boundingClientRect.top < 0
          )
      },
      { rootMargin: `0px 0px -${30 + index * 4}% 0px`, threshold: 1 }
    )
    wordObserver.observe(word)
    wordObservers.push(wordObserver)
  })
  window.addEventListener(
    'pagehide',
    () => {
      observer.disconnect()
      wordObservers.forEach(item => item.disconnect())
    },
    { once: true }
  )
}
