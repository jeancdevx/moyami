import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

import logoUrl from '@/assets/brand/svg/moyami-compacto-color.svg?url'
import symbolUrl from '@/assets/brand/svg/moyami-simbolo-color.svg?url'
import amyUrl from '@/assets/mascots/amy/amy-estatica.png?url'
import mollyUrl from '@/assets/mascots/molly/molly-estatica.png?url'

const colors = {
  carbon: '#18201a',
  lima: '#c8f04a',
  lila: '#a792ef',
  tiza: '#f7f8f2',
  white: '#ffffff'
}

export async function createWorld(root: HTMLElement): Promise<() => void> {
  const container = root.querySelector<HTMLElement>('[data-world-canvas]')!
  const controls = root.querySelector<HTMLElement>('[data-world-controls]')!
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false
  })
  const mobile = matchMedia('(max-width: 767px)').matches
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.4
  container.appendChild(renderer.domElement)
  const camera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.1, 100)
  const target = new THREE.Vector3(0, 1.55, 0)
  camera.position.set(8, 7, 10)
  camera.lookAt(target)
  scene.add(new THREE.HemisphereLight('#ffffff', '#b5b0b9', 2.3))
  const sun = new THREE.DirectionalLight('#fff8e8', 3.7)
  sun.position.set(-4, 9, 7)
  sun.castShadow = true
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048)
  sun.shadow.camera.left = -7
  sun.shadow.camera.right = 7
  sun.shadow.camera.top = 7
  sun.shadow.camera.bottom = -7
  sun.shadow.normalBias = 0.04
  sun.shadow.bias = -0.0003
  sun.shadow.radius = 4
  scene.add(sun)
  const fill = new THREE.DirectionalLight('#d7c7ff', 1.3)
  fill.position.set(5, 3, -4)
  scene.add(fill)

  const world = new THREE.Group()
  scene.add(world)
  const materials = Object.fromEntries(
    Object.entries(colors).map(([key, color]) => [
      key,
      new THREE.MeshStandardMaterial({ color, roughness: 0.83 })
    ])
  )
  const box = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    color: keyof typeof colors,
    radius = 0.06
  ) => {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, d, 3, Math.min(radius, w / 3, h / 3, d / 3)),
      materials[color]
    )
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    world.add(mesh)
    return mesh
  }
  const cylinder = (
    r: number,
    h: number,
    x: number,
    y: number,
    z: number,
    color: keyof typeof colors
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, h, 20),
      materials[color]
    )
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    world.add(mesh)
    return mesh
  }

  // A cutaway corner shop: the open front keeps the real catalog outside the canvas.
  box(5.5, 0.34, 4.3, 0, 0, 0, 'lila', 0.16)
  box(5.2, 0.14, 4.0, 0, 0.23, 0, 'tiza')
  box(5.1, 3.3, 0.16, 0, 1.94, -1.82, 'lila')
  box(0.16, 3.3, 3.65, -2.47, 1.94, -0.08, 'lila')
  for (let i = -4; i <= 4; i++)
    box(0.012, 0.005, 3.8, i * 0.55, 0.305, 0, 'lila', 0.001)
  for (let i = -3; i <= 3; i++)
    box(5.0, 0.005, 0.012, 0, 0.306, i * 0.55, 'lila', 0.001)

  // Back shelves, stocked with small stylized cans and snack packets.
  box(3.2, 2.35, 0.18, -0.7, 1.7, -1.59, 'carbon')
  for (let shelf = 0; shelf < 3; shelf++) {
    const y = 0.7 + shelf * 0.68
    box(3.3, 0.1, 0.65, -0.7, y, -1.3, 'tiza')
    for (let p = 0; p < 7; p++) {
      const x = -2.02 + p * 0.43
      const color = (['lima', 'lila', 'white'] as const)[(p + shelf) % 3]
      if (shelf === 1) {
        box(0.27, 0.42, 0.15, x, y + 0.26, -1.3, color, 0.025)
        box(0.2, 0.04, 0.01, x, y + 0.32, -1.214, 'carbon', 0.005)
      } else {
        cylinder(0.115, 0.34, x, y + 0.22, -1.3, color)
        cylinder(0.117, 0.05, x, y + 0.22, -1.3, 'white')
        cylinder(0.1, 0.012, x, y + 0.397, -1.3, 'carbon')
      }
    }
  }

  // Tall drinks fridge with a clear front and colored shelves.
  box(1.05, 2.38, 0.77, 1.65, 1.53, -1.15, 'carbon')
  box(0.9, 2.13, 0.05, 1.65, 1.5, -0.735, 'tiza')
  for (let row = 0; row < 3; row++) {
    const y = 0.7 + row * 0.58
    box(0.85, 0.04, 0.4, 1.65, y, -0.68, 'lila')
    for (let j = 0; j < 3; j++) {
      cylinder(
        0.085,
        0.3,
        1.4 + j * 0.25,
        y + 0.18,
        -0.58,
        j === 1 ? 'lila' : 'lima'
      )
      cylinder(0.05, 0.05, 1.4 + j * 0.25, y + 0.35, -0.58, 'carbon')
    }
  }
  box(0.05, 0.45, 0.06, 2.06, 1.45, -0.61, 'white')

  // Counter, cash register, and a row of colorful paper cups.
  box(2.65, 1.05, 0.88, 0.35, 0.83, 0.65, 'carbon')
  box(2.85, 0.13, 1.02, 0.35, 1.42, 0.65, 'tiza')
  box(0.48, 0.09, 0.4, 1.15, 1.53, 0.58, 'lila')
  const screen = box(0.43, 0.35, 0.06, 1.15, 1.73, 0.5, 'carbon')
  screen.rotation.x = -0.2
  box(0.33, 0.24, 0.02, 1.15, 1.73, 0.544, 'lima')
  for (let i = 0; i < 3; i++) {
    cylinder(0.12, 0.28, -0.48 + i * 0.38, 1.62, 0.7, i === 1 ? 'lila' : 'lima')
    cylinder(0.125, 0.035, -0.48 + i * 0.38, 1.78, 0.7, 'carbon')
    const straw = box(
      0.025,
      0.23,
      0.025,
      -0.45 + i * 0.38,
      1.9,
      0.7,
      'white',
      0.003
    )
    straw.rotation.z = -0.15
  }

  // Signature striped awning and an unchanged vector logo on the shop sign.
  box(5.3, 0.56, 0.2, 0, 3.56, 0.95, 'tiza')
  box(0.13, 2.85, 0.13, -2.38, 1.76, 1.34, 'carbon')
  box(0.13, 2.85, 0.13, 2.38, 1.76, 1.34, 'carbon')
  for (let i = 0; i < 12; i++) {
    const awning = box(
      0.44,
      0.12,
      1.15,
      -2.42 + i * 0.44,
      3.11,
      1.08,
      i % 2 === 0 ? 'lima' : 'tiza',
      0.035
    )
    awning.rotation.x = 0.18
    box(
      0.44,
      0.17,
      0.13,
      -2.42 + i * 0.44,
      2.94,
      1.61,
      i % 2 === 0 ? 'lima' : 'tiza',
      0.035
    )
  }

  const textureLoader = new THREE.TextureLoader()
  const textures = await Promise.all(
    [logoUrl, symbolUrl, amyUrl, mollyUrl].map(url =>
      textureLoader.loadAsync(url)
    )
  )
  textures.forEach(texture => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
  })
  const imagePlane = (
    texture: THREE.Texture,
    w: number,
    h: number,
    x: number,
    y: number,
    z: number
  ) => {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    )
    plane.position.set(x, y, z)
    world.add(plane)
    return plane
  }
  const logoImage = textures[0].image as { width: number; height: number }
  imagePlane(
    textures[0],
    2.1,
    (2.1 * logoImage.height) / logoImage.width,
    0,
    3.56,
    1.06
  )
  imagePlane(textures[1], 0.67, 0.67, 0.35, 0.87, 1.101)
  const amy = imagePlane(textures[2], 1.55, 1.55, -1.65, 1.08, 1.65)
  const molly = imagePlane(textures[3], 1.5, 1.5, 2, 1.06, 1.75)

  // Small branded discovery sparks sit around the miniature, not over the copy.
  const sparks: THREE.Mesh[] = []
  for (const [i, position] of [
    [-3.05, 3.25, 0],
    [2.9, 3.7, -1],
    [2.9, 1, 1.6]
  ].entries()) {
    const spark = new THREE.Mesh(
      new THREE.OctahedronGeometry(i === 2 ? 0.14 : 0.23),
      materials[i === 1 ? 'lila' : 'lima']
    )
    spark.position.set(position[0], position[1], position[2])
    world.add(spark)
    sparks.push(spark)
  }
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.14 })
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.2
  shadow.receiveShadow = true
  scene.add(shadow)

  let visible = false
  let stopped = false
  let frame = 0
  let lastTime = 0
  let targetAngle = 0
  let angle = 0
  let pointerX = 0
  let pointerY = 0
  const resize = () => {
    const { width, height } = container.getBoundingClientRect()
    if (!width || !height) return
    const aspect = width / height
    const extent = aspect < 1 ? 4.15 / aspect : 3.85
    camera.left = -extent * aspect
    camera.right = extent * aspect
    camera.top = extent
    camera.bottom = -extent
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
    renderer.render(scene, camera)
  }
  const observer = new ResizeObserver(resize)
  observer.observe(container)
  resize()
  const render = (time: number) => {
    if (!visible || stopped) return
    frame = requestAnimationFrame(render)
    if (mobile && time - lastTime < 32) return
    lastTime = time
    angle = THREE.MathUtils.lerp(angle, targetAngle + pointerX * 0.08, 0.065)
    world.rotation.y = angle
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      7 + pointerY * 0.35,
      0.06
    )
    camera.lookAt(target)
    amy.rotation.y = camera.rotation.y - world.rotation.y
    molly.rotation.y = camera.rotation.y - world.rotation.y
    sparks.forEach((spark, i) => {
      spark.rotation.y = time * 0.0004 + i
      spark.rotation.z = Math.sin(time * 0.0007 + i) * 0.18
    })
    renderer.render(scene, camera)
  }
  const visibility = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && !document.hidden
    cancelAnimationFrame(frame)
    if (visible) frame = requestAnimationFrame(render)
  })
  visibility.observe(root)
  const onVisibility = () => {
    const bounds = root.getBoundingClientRect()
    visible = !document.hidden && bounds.bottom > 0 && bounds.top < innerHeight
    cancelAnimationFrame(frame)
    if (visible) frame = requestAnimationFrame(render)
  }
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    const bounds = container.getBoundingClientRect()
    pointerX = (event.clientX - bounds.left) / bounds.width - 0.5
    pointerY = (event.clientY - bounds.top) / bounds.height - 0.5
  }
  const resetPointer = () => {
    pointerX = 0
    pointerY = 0
  }
  const onControl = (event: Event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-world-view]'
    )
    if (!button) return
    targetAngle =
      button.dataset.worldView === 'left'
        ? -0.32
        : button.dataset.worldView === 'right'
          ? 0.32
          : 0
    controls
      .querySelectorAll('button')
      .forEach(item =>
        item.setAttribute('aria-pressed', String(item === button))
      )
  }
  controls.hidden = false
  controls.addEventListener('click', onControl)
  container.addEventListener('pointermove', onPointer)
  container.addEventListener('pointerleave', resetPointer)
  document.addEventListener('visibilitychange', onVisibility)
  root.dataset.ready = 'true'
  const dispose = () => {
    if (stopped) return
    stopped = true
    cancelAnimationFrame(frame)
    observer.disconnect()
    visibility.disconnect()
    controls.removeEventListener('click', onControl)
    container.removeEventListener('pointermove', onPointer)
    container.removeEventListener('pointerleave', resetPointer)
    document.removeEventListener('visibilitychange', onVisibility)
    scene.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return
      object.geometry.dispose()
      const all = Array.isArray(object.material)
        ? object.material
        : [object.material]
      all.forEach(material => material.dispose())
    })
    textures.forEach(texture => texture.dispose())
    renderer.dispose()
    renderer.domElement.remove()
    controls.hidden = true
    root.dataset.ready = 'false'
  }
  renderer.domElement.addEventListener(
    'webglcontextlost',
    event => {
      event.preventDefault()
      dispose()
    },
    { once: true }
  )
  return dispose
}
