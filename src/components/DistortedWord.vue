<template>
  <span class="dword" :class="{ 'dword--active': active }">
    <template v-if="active">
      <span
        v-for="(ch, i) in chars"
        :key="i"
        class="dletter"
        :style="{ transform: transforms[i] || 'none' }"
      >{{ ch }}</span>
    </template>
    <template v-else>{{ text }}</template>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{ text: string; active: boolean }>()

const chars = computed(() => props.text.split(''))
const transforms = ref<string[]>([])
let timer: ReturnType<typeof setInterval> | null = null

const rand = () => Math.random() * 2 - 1

function randomTransform() {
  const rot = (rand() * 10).toFixed(1)
  const sx = (rand() * 12).toFixed(1)
  const sy = (rand() * 12).toFixed(1)
  const scx = (1 + rand() * 0.14).toFixed(2)
  const scy = (1 + rand() * 0.14).toFixed(2)
  const tx = (rand() * 3).toFixed(1)
  const ty = (rand() * 3).toFixed(1)
  return `rotate(${rot}deg) skewX(${sx}deg) skewY(${sy}deg) scale(${scx}, ${scy}) translate(${tx}px, ${ty}px)`
}

function tick() {
  transforms.value = chars.value.map(() => randomTransform())
}

function start() {
  tick()
  timer = setInterval(tick, 280)
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(() => props.active, (v) => {
  if (v) start()
  else {
    stop()
    transforms.value = []
  }
})

onMounted(() => {
  if (props.active) start()
})

onBeforeUnmount(stop)
</script>

<style scoped>
.dword {
  display: inline-block;
  white-space: nowrap;
}

.dletter {
  display: inline-block;
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
</style>
