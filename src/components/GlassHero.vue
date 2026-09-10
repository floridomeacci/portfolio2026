<template>
  <canvas ref="canvasRef" class="glass-hero" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const canvasRef = ref<HTMLCanvasElement | null>(null)

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

  let floridoPlane: THREE.Mesh | null = null
  let meacciPlane: THREE.Mesh | null = null

  let visibleWidth = 1
  let slideStart = 0

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 1,
    thickness: 0.5,
    ior: 1.45,
    dispersion: 4,
    envMapIntensity: 1,
    toneMapped: false
  })

  let model: THREE.Object3D | null = null

  const onModelLoaded = (gltf: THREE.GLTF) => {
    model = gltf.scene
    model.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) m.material = glassMaterial
    })

    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = 1.2 / maxDim

    model.scale.setScalar(scale)
    model.position.sub(center.multiplyScalar(scale))
    model.position.z = 2.4

    scene.add(model)
  }

  const draco = new DRACOLoader()
  draco.setDecoderPath('/draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(draco)
  loader.load('/models/hero.glb', onModelLoaded, undefined, () => {})

  const createWordPlane = (word: string, size: number, worldK: number) => {
    const mctx = document.createElement('canvas').getContext('2d')
    if (!mctx) return null
    mctx.font = `900 ${size}px "Inter Tight", sans-serif`
    const textW = mctx.measureText(word).width
    const pad = size * 0.2
    const cw = Math.ceil(textW + pad * 2)
    const ch = Math.ceil(size * 1.3)

    const dpr = Math.min(window.devicePixelRatio, 2)
    const tc = document.createElement('canvas')
    tc.width = Math.round(cw * dpr)
    tc.height = Math.round(ch * dpr)
    const ctx = tc.getContext('2d')
    if (!ctx) return null
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, cw, ch)
    ctx.fillStyle = INK
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${size}px "Inter Tight", sans-serif`
    ctx.fillText(word, cw / 2, ch / 2)

    const texture = new THREE.CanvasTexture(tc)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = renderer!.capabilities.getMaxAnisotropy()

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ toneMapped: false, map: texture })
    )
    plane.scale.set(cw * worldK, ch * worldK, 1)
    return plane
  }

  const disposePlane = (p: THREE.Mesh | null) => {
    if (!p) return
    const mat = p.material as THREE.MeshBasicMaterial
    mat.map?.dispose()
    mat.dispose()
    p.geometry.dispose()
  }

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer!.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()

    const visibleHeight = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    visibleWidth = visibleHeight * camera.aspect
    const worldK = visibleWidth / w

    const maxWidth = w * 0.92
    const maxHeight = h * 0.72
    const baseSize = 70
    const lineGap = 1.0

    const mctx = document.createElement('canvas').getContext('2d')
    if (!mctx) return
    mctx.font = `900 ${baseSize}px "Inter Tight", sans-serif`
    const s1 = baseSize * (maxWidth / Math.max(1, mctx.measureText('FLORIDO').width))
    const s2 = baseSize * (maxWidth / Math.max(1, mctx.measureText('MEACCI').width))
    const total = s1 * lineGap + s2 * lineGap
    const fit = Math.min(1, maxHeight / total)
    const size1 = s1 * fit
    const size2 = s2 * fit

    if (floridoPlane) { scene.remove(floridoPlane); disposePlane(floridoPlane) }
    if (meacciPlane) { scene.remove(meacciPlane); disposePlane(meacciPlane) }

    floridoPlane = createWordPlane('FLORIDO', size1, worldK)
    meacciPlane = createWordPlane('MEACCI', size2, worldK)

    if (floridoPlane && meacciPlane) {
      floridoPlane.position.y = (size2 * lineGap) / 2 * worldK
      meacciPlane.position.y = -(size1 * lineGap) / 2 * worldK
      scene.add(floridoPlane)
      scene.add(meacciPlane)
    }
  }

  const AMP = THREE.MathUtils.degToRad(30)

  const slideProgress = () => {
    if (reducedMotion) return 1
    if (!slideStart) return 0
    const t = (performance.now() - slideStart) / 1000
    return 1 - Math.pow(1 - Math.min(1, t / 0.9), 3)
  }

  const tick = () => {
    const t = clock.getElapsedTime()
    const e = slideProgress()

    if (floridoPlane) floridoPlane.position.x = -visibleWidth * (1 - e)
    if (meacciPlane) meacciPlane.position.x = visibleWidth * (1 - e)

    if (model) {
      if (!reducedMotion) {
        model.rotation.y = (Math.sin(t * 0.4) * 0.6 + pointer.x * 0.4) * AMP
        model.rotation.x = (Math.sin(t * 0.3) * 0.6 + pointer.y * 0.4) * AMP
        model.rotation.z = Math.sin(t * 0.2) * AMP * 0.4
      } else {
        model.rotation.set(0, 0, 0)
      }
    }
    renderer!.render(scene, camera)
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
    slideStart = performance.now()
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
    disposePlane(floridoPlane)
    disposePlane(meacciPlane)
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
