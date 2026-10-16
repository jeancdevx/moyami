import markerUrl from '@/assets/brand/svg/moyami-simbolo-color.svg?url'

export function createMapMarker(): HTMLElement {
  const marker = document.createElement('div')
  marker.className = 'moyami-marker'
  const icon = document.createElement('img')
  icon.src = markerUrl
  icon.alt = ''
  marker.appendChild(icon)
  return marker
}

export function bindMapControls(
  root: HTMLElement,
  zoom: (direction: 'in' | 'out') => void
) {
  const controls = root.querySelector<HTMLElement>('[data-map-controls]')!
  const onZoom = (event: Event) => {
    const direction = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-map-zoom]'
    )?.dataset.mapZoom
    if (direction === 'in' || direction === 'out') zoom(direction)
  }
  controls.hidden = false
  controls.addEventListener('click', onZoom)
  return () => {
    controls.hidden = true
    controls.removeEventListener('click', onZoom)
  }
}

export function supportsVectorMap(): boolean {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('webgl2')
  if (!context) return false
  context.getExtension('WEBGL_lose_context')?.loseContext()
  return true
}
