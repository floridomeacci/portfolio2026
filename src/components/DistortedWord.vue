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
let scaleVal = 3
let scaleTarget = 3
let fx = 0.06
let fy = 0.12
let fxT = 0.06
let fyT = 0.12

function loop() {
  scaleVal += (scaleTarget - scaleVal) * 0.05
  fx += (fxT - fx) * 0.05
  fy += (fyT - fy) * 0.05
  scale.value = scaleVal
  freq.value = fx.toFixed(3) + ' ' + fy.toFixed(3)

  if (Math.abs(scaleTarget - scaleVal) < 0.05) scaleTarget = 2 + Math.random() * 3
  if (Math.abs(fxT - fx) < 0.001) fxT = 0.04 + Math.random() * 0.04
  if (Math.abs(fyT - fy) < 0.001) fyT = 0.08 + Math.random() * 0.08

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
