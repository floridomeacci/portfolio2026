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
const seed = ref(3)
const scale = ref(4)
const freq = ref('0.06 0.14')
let timer: ReturnType<typeof setInterval> | null = null

function tick() {
  seed.value = Math.floor(Math.random() * 900) + 1
  scale.value = Math.floor(Math.random() * 5) + 2
  freq.value = (0.04 + Math.random() * 0.06).toFixed(2) + ' ' + (0.1 + Math.random() * 0.12).toFixed(2)
}

function start() {
  tick()
  timer = setInterval(tick, 300)
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
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
