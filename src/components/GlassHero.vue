<template>
  <canvas ref="canvasRef" class="glass-hero" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const WORDS = ['FLORIDO', 'MEACCI']
const INK = '#0e0a08'
const BG = '#fcf5f2'
const CAMERA_Z = 5

let renderer: THREE.WebGLRenderer | null = null
let cleanup: (() => void) | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(BG)
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.z = CAMERA_Z

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

  let textTexture: THREE.CanvasTexture | null = null
  const textPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ toneMapped: false })
  )
  scene.add(textPlane)

  const torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.3, 300, 48, 2, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 0.7,
      ior: 1.45,
      dispersion: 4,
      envMapIntensity: 1,
      toneMapped: false
    })
  )
  torus.position.z = 2.2
  scene.add(torus)

  const drawText = (width: number, height: number) => {
    const dpr = Math.min(window.devicePixelRatio, 2)
    const tc = document.createElement('canvas')
    const ctx = tc.getContext('2d')
    if (!ctx) return
    tc.width = Math.round(width * dpr)
    tc.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = INK
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const maxWidth = width * 0.55
    const maxHeight = height * 0.45
    const baseSize = 70
    const maxFont = 140
    const lineGap = 1.0

    ctx.font = `900 ${baseSize}px "Inter Tight", sans-serif`
    const sizes = WORDS.map((line) => Math.min(maxFont, baseSize * (maxWidth / Math.max(1, ctx.measureText(line).width))))
    const totalHeight = sizes.reduce((sum, size) => sum + size * lineGap, 0)
    const fit = Math.min(1, maxHeight / totalHeight)

    let y = height / 2 - (totalHeight * fit) / 2
    WORDS.forEach((line, i) => {
      const size = sizes[i] * fit
      ctx.font = `900 ${size}px "Inter Tight", sans-serif`
      y += (size * lineGap) / 2
      ctx.fillText(line, width / 2, y)
      y += (size * lineGap) / 2
    })

    if (textTexture) textTexture.dispose()
    textTexture = new THREE.CanvasTexture(tc)
    textTexture.colorSpace = THREE.SRGBColorSpace
    textTexture.anisotropy = renderer!.capabilities.getMaxAnisotropy()
    const mat = textPlane.material as THREE.MeshBasicMaterial
    mat.map = textTexture
    mat.needsUpdate = true
  }

  const tick = () => {
    const t = clock.getElapsedTime()
    if (!reducedMotion) {
      torus.rotation.x = t * 0.35 + pointer.y * 0.15
      torus.rotation.y = t * 0.5 + pointer.x * 0.2
    } else {
      torus.rotation.set(0.6, 0.4, 0)
    }
    renderer!.render(scene, camera)
  }

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer!.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()

    const visibleHeight = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const visibleWidth = visibleHeight * camera.aspect
    textPlane.scale.set(visibleWidth, visibleHeight, 1)
    const torusScale = Math.min(visibleWidth, visibleHeight) * 0.075
    torus.scale.setScalar(torusScale)
    drawText(w, h)
  }

  const pointer = new THREE.Vector2()
  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  }

  const clock = new THREE.Clock()

  const onResize = () => {
    resize()
    if (reducedMotion) tick()
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('resize', onResize)

  document.fonts.ready.then(() => {
    resize()
    if (reducedMotion) {
      tick()
    } else {
      renderer!.setAnimationLoop(tick)
    }
  })

  cleanup = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', onResize)
    renderer?.setAnimationLoop(null)
    textTexture?.dispose()
    renderer?.dispose()
    renderer = null
  }
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<style scoped>
.glass-hero {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
