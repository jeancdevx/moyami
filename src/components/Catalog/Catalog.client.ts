import { setupGalleries } from '@/components/ProductDetail/ProductDetail.client'

import { matchesProduct, type Category } from './Catalog.helpers'

export function setupCatalog() {
  const root = document.querySelector<HTMLElement>('[data-catalog]')
  if (!root) return
  const tools = root.querySelector<HTMLElement>('[data-catalog-tools]')!
  const search = root.querySelector<HTMLInputElement>('[data-catalog-search]')!
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>('[data-product-card]')
  )
  const filters = root.querySelectorAll<HTMLButtonElement>('[data-category]')
  const counter = root.querySelector<HTMLElement>('[data-catalog-count]')!
  const empty = root.querySelector<HTMLElement>('[data-catalog-empty]')!
  const dialog = root.querySelector<HTMLDialogElement>('[data-product-dialog]')!
  const content = root.querySelector<HTMLElement>('[data-dialog-content]')!
  let category: Category = 'todos'
  let opener: HTMLAnchorElement | null = null
  tools.hidden = false
  const filter = () => {
    let count = 0
    cards.forEach(card => {
      const matches =
        (category === 'todos' || card.dataset.productCategory === category) &&
        matchesProduct(card.dataset.searchText || '', search.value)
      card.hidden = !matches
      if (matches) count++
    })
    filters.forEach(button =>
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.category === category)
      )
    )
    counter.textContent = `${count} ${count === 1 ? 'producto para descubrir' : 'productos para descubrir'}`
    empty.hidden = count !== 0
  }
  filters.forEach(button =>
    button.addEventListener('click', () => {
      category = button.dataset.category as Category
      filter()
    })
  )
  search.addEventListener('input', filter)
  root.querySelector('[data-catalog-clear]')?.addEventListener('click', () => {
    category = 'todos'
    search.value = ''
    filter()
    search.focus()
  })
  root.addEventListener('click', event => {
    const mouseEvent = event as MouseEvent
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      '[data-product-open]'
    )
    if (
      !anchor ||
      mouseEvent.ctrlKey ||
      mouseEvent.metaKey ||
      mouseEvent.shiftKey ||
      mouseEvent.altKey ||
      mouseEvent.button !== 0 ||
      typeof dialog.showModal !== 'function'
    )
      return
    const template = root.querySelector<HTMLTemplateElement>(
      `template[data-product-template="${anchor.dataset.productOpen}"]`
    )
    if (!template) return
    event.preventDefault()
    opener = anchor
    content.replaceChildren(template.content.cloneNode(true))
    setupGalleries(content)
    dialog.showModal()
    content
      .querySelector('[data-detail-location]')
      ?.addEventListener('click', () => dialog.close(), { once: true })
  })
  root
    .querySelector('[data-product-close]')
    ?.addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect()
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialog.close()
    }
  })
  dialog.addEventListener('close', () => {
    content.replaceChildren()
    opener?.focus({ preventScroll: true })
  })
}
