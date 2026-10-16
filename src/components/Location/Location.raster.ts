import { Map, divIcon, marker, tileLayer } from 'leaflet'

import 'leaflet/dist/leaflet.css'

import { mapProviders } from './Location.config'
import { bindMapControls, createMapMarker } from './Location.shared'

/** A DOM-based map remains usable when WebGL or the vector provider is unavailable. */
export async function createRasterMap(
  root: HTMLElement,
  signal: AbortSignal
): Promise<() => void> {
  signal.throwIfAborted()
  const canvas = root.querySelector<HTMLElement>('[data-map-canvas]')!
  const center: [number, number] = [
    Number(root.dataset.latitude),
    Number(root.dataset.longitude)
  ]
  const map = new Map(canvas, {
    center,
    zoom: 16,
    minZoom: 11,
    maxZoom: 19,
    zoomControl: false,
    scrollWheelZoom: false,
    // Keep one-finger page scrolling available on touch screens.
    dragging: !matchMedia('(pointer: coarse)').matches,
    fadeAnimation: !matchMedia('(prefers-reduced-motion: reduce)').matches,
    zoomAnimation: !matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  map.attributionControl.setPrefix(false)
  const tiles = tileLayer(mapProviders.rasterTiles, {
    attribution: mapProviders.rasterAttribution,
    maxZoom: 19,
    keepBuffer: 0
  })
  marker(center, {
    icon: divIcon({
      html: createMapMarker(),
      className: 'moyami-leaflet-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 48]
    }),
    title: 'Moyami, Jr. San Martín 316, Caraz',
    alt: 'Moyami, Jr. San Martín 316, Caraz'
  }).addTo(map)
  let disposed = false
  let unbindControls: (() => void) | undefined
  const dispose = () => {
    if (disposed) return
    disposed = true
    signal.removeEventListener('abort', dispose)
    unbindControls?.()
    map.remove()
  }
  signal.addEventListener('abort', dispose, { once: true })
  try {
    await new Promise<void>((resolve, reject) => {
      let loaded = false
      const timeout = setTimeout(
        () => finish(new Error('El mapa alternativo no respondió.')),
        12000
      )
      const aborted = () =>
        finish(new DOMException('Carga cancelada', 'AbortError'))
      const finish = (error?: Error) => {
        clearTimeout(timeout)
        signal.removeEventListener('abort', aborted)
        tiles.off('tileload', onTile)
        tiles.off('load', onLoad)
        if (error) reject(error)
        else resolve()
      }
      const onTile = () => {
        loaded = true
      }
      const onLoad = () =>
        finish(
          loaded ? undefined : new Error('No se pudieron cargar las calles.')
        )
      signal.addEventListener('abort', aborted, { once: true })
      tiles.on('tileload', onTile)
      tiles.on('load', onLoad)
      tiles.addTo(map)
    })
    signal.throwIfAborted()
    unbindControls = bindMapControls(root, direction => {
      if (direction === 'in') map.zoomIn()
      else map.zoomOut()
    })
    return dispose
  } catch (error) {
    dispose()
    throw error
  }
}
