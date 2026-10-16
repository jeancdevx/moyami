import { Map, Marker, setWorkerUrl, type StyleSpecification } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

import 'maplibre-gl/dist/maplibre-gl.css'

import { mapProviders } from './Location.config'
import { bindMapControls, createMapMarker } from './Location.shared'

setWorkerUrl(workerUrl)

export async function createLocationMap(
  root: HTMLElement,
  signal: AbortSignal,
  onContextLost: () => void
): Promise<() => void> {
  signal.throwIfAborted()
  const canvas = root.querySelector<HTMLElement>('[data-map-canvas]')!
  const response = await fetch(mapProviders.vectorStyle, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(8000)])
  })
  if (!response.ok) throw new Error('No se pudo cargar el estilo del mapa.')
  const style = (await response.json()) as StyleSpecification
  for (const layer of style.layers) {
    if (layer.type === 'background')
      layer.paint = { ...layer.paint, 'background-color': '#f7f8f2' }
    if (layer.type === 'fill' && /park|landcover|landuse/.test(layer.id))
      layer.paint = { ...layer.paint, 'fill-color': '#e0e9cd' }
    if (layer.type === 'fill' && layer.id === 'water')
      layer.paint = { ...layer.paint, 'fill-color': '#c7b7ef' }
  }
  const center: [number, number] = [
    Number(root.dataset.longitude),
    Number(root.dataset.latitude)
  ]
  const map = new Map({
    container: canvas,
    style,
    center,
    zoom: 16,
    minZoom: 11,
    maxZoom: 19,
    attributionControl: { compact: true },
    cooperativeGestures: true,
    scrollZoom: false,
    pitchWithRotate: false,
    dragRotate: false,
    canvasContextAttributes: { antialias: false },
    locale: {
      'CooperativeGesturesHandler.WindowsHelpText':
        'Usa Ctrl y desplaza para acercar el mapa',
      'CooperativeGesturesHandler.MacHelpText':
        'Usa ⌘ y desplaza para acercar el mapa',
      'CooperativeGesturesHandler.MobileHelpText':
        'Usa dos dedos para mover el mapa',
      'AttributionControl.ToggleAttribution': 'Mostrar atribución del mapa'
    }
  })
  const marker = createMapMarker()
  marker.setAttribute('aria-label', 'Moyami, Jr. San Martín 316, Caraz')
  new Marker({ element: marker, anchor: 'bottom' }).setLngLat(center).addTo(map)
  let disposed = false
  let unbindControls: (() => void) | undefined
  const dispose = () => {
    if (disposed) return
    disposed = true
    signal.removeEventListener('abort', dispose)
    map.getCanvas().removeEventListener('webglcontextlost', onContextLost)
    unbindControls?.()
    map.remove()
  }
  signal.addEventListener('abort', dispose, { once: true })
  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => finish(new Error('El mapa tardó demasiado en cargar.')),
        12000
      )
      const onLoad = () => finish()
      const onError = (event: { error: { message: string } }) =>
        finish(new Error(event.error.message))
      const aborted = () =>
        finish(new DOMException('Carga cancelada', 'AbortError'))
      const finish = (error?: Error) => {
        clearTimeout(timeout)
        map.off('load', onLoad)
        map.off('error', onError)
        signal.removeEventListener('abort', aborted)
        if (error) reject(error)
        else resolve()
      }
      map.once('load', onLoad)
      map.once('error', onError)
      signal.addEventListener('abort', aborted, { once: true })
    })
    signal.throwIfAborted()
    map
      .getCanvas()
      .addEventListener('webglcontextlost', onContextLost, { once: true })
    unbindControls = bindMapControls(root, direction => {
      const duration = matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 0
        : 700
      const options = {
        duration,
        easing: (t: number) => 1 - Math.pow(1 - t, 3)
      }
      if (direction === 'in') map.zoomIn(options)
      else map.zoomOut(options)
    })
    return dispose
  } catch (error) {
    dispose()
    throw error
  }
}
