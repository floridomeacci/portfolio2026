<template>
  <span class="glitch">
    {{ text }}
    <span v-if="active && visible" class="slice slice--a" :style="sliceStyle('a')" aria-hidden="true">{{ text }}</span>
    <span v-if="active && visible" class="slice slice--b" :style="sliceStyle('b')" aria-hidden="true">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{ text: string; active: boolean }>()

const visible = ref(false)
const band = ref({ top: 0, bottom: 100, shift: 0 })

let timer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function sliceStyle(kind: 'a' | 'b') {
  const s = kind === 'a' ? band.value.shift : -band.value.shift
  return {
    clipPath: `inset(${band.value.top}% 0 ${100 - band.value.bottom}% 0)`,
    transform: `translateX(${s}px)`
  }
}

function trigger() {
  const h = 5 + Math.random() * 20
  const top = Math.random() * (100 - h)
  band.value = { top, bottom: top + h, shift: Math.round(6 + Math.random() * 8) }
  visible.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => { visible.value = false }, 90)
}

function schedule() {
  timer = setTimeout(() => {
    trigger()
    schedule()
  }, 2200 + Math.random() * 2800)
}

function start() {
  schedule()
}

function stop() {
  if (timer) clearTimeout(timer)
  if (hideTimer) clearTimeout(hideTimer)
  visible.value = false
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
.glitch {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}

.slice {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  pointer-events: none;
}

.slice--a { color: rgba(255, 66, 66, 0.75); }
.slice--b { color: rgba(66, 150, 255, 0.75); }
</style>
