<template>
  <span
    class="dword"
    :class="{ 'dword--active': active }"
    :style="active ? { filter: `url(#${filterId})` } : {}"
  >
    {{ text }}
    <svg v-if="active" class="dword-svg" aria-hidden="true" focusable="false">
      <defs>
        <filter :id="filterId" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" :baseFrequency="freq" numOctaves="2" :seed="seed" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" :scale="scale" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{ text: string; active: boolean }>()

const filterId = 'dword-' + Math.random().toString(36).slice(2, 9)
const seed = Math.floor(Math.random() * 900) + 1
const scale = ref(3)
const freq = ref('0.06 0.12')

let raf = 0

function loop() {
  const t = performance.now() / 1000
  const s = 3.5 + Math.sin(t * 0.5) * 1.0 + Math.sin(t * 0.21 + 1.3) * 0.6
  const fx = 0.06 + Math.sin(t * 0.4 + 0.5) * 0.015 + Math.sin(t * 0.13) * 0.01
  const fy = 0.12 + Math.sin(t * 0.33 + 2.1) * 0.025 + Math.sin(t * 0.17 + 0.8) * 0.015
  scale.value = s
  freq.value = fx.toFixed(3) + ' ' + fy.toFixed(3)
  raf = requestAnimationFrame(loop)
}

function start() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(loop)
}

function stop() {
  cancelAnimationFrame(raf)
}

watch(() => props.active, (v) => {
  if (v) start()
  else stop()
})

onMounted(() => {
  if (props.active) start()
})

onBeforeUnmount(stop)
</script>

<style scoped>
.dword {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}

.dword-svg {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
