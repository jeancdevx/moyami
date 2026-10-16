export function setupGalleries(parent: ParentNode = document) {
  parent.querySelectorAll<HTMLElement>('[data-gallery]').forEach(gallery => {
    if (gallery.dataset.initialized) return
    gallery.dataset.initialized = 'true'
    const images = gallery.querySelectorAll<HTMLElement>('[data-gallery-image]')
    const controls = gallery.querySelector<HTMLElement>(
      '[data-gallery-controls]'
    )
    const buttons = gallery.querySelectorAll<HTMLButtonElement>(
      '[data-gallery-select]'
    )
    if (!controls || images.length < 2) return
    controls.hidden = false
    const select = (index: number) => {
      images.forEach((image, i) => {
        image.hidden = i !== index
      })
      buttons.forEach((button, i) =>
        button.setAttribute('aria-pressed', String(i === index))
      )
    }
    select(0)
    controls.addEventListener('click', event => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
        '[data-gallery-select]'
      )
      if (button) select(Number(button.dataset.gallerySelect))
    })
  })
}
