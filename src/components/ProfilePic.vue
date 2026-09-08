<template>
  <div class="profile-pic-wrap">
    <div class="profile-pic-inner">
      <img :src="picSrc" alt="Florido Jan Meacci" class="profile-pic-img" :class="{ blurred }" />
    </div>
    <span class="profile-pic-label">{{ labelText }}<span class="type-cursor">|</span></span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const variants = [
  { img: '/picture.webp', text: '...wearing a beanie and overcoat' },
  { img: '/astronaut.webp', text: '...dressed as an astronaut' },
  { img: '/bear.webp', text: '...dressed as a bear' },
  { img: '/samurai.webp', text: '...dressed as a samurai' },
]

const index = ref(0)
const labelText = ref('')
const picSrc = ref(variants[0].img)
const blurred = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function runTypewriter() {
  const variant = variants[index.value]
  picSrc.value = variant.img
  requestAnimationFrame(() => { blurred.value = false })
  const text = variant.text
  let i = 0

  function typeNext() {
    if (i <= text.length) {
      labelText.value = text.slice(0, i)
      i++
      timer = setTimeout(typeNext, 60)
    } else {
      timer = setTimeout(() => {
        blurred.value = true
        backspaceNext()
      }, 1800)
    }
  }

  function backspaceNext() {
    if (labelText.value.length > 0) {
      labelText.value = labelText.value.slice(0, -1)
      timer = setTimeout(backspaceNext, 35)
    } else {
      index.value = (index.value + 1) % variants.length
      timer = setTimeout(runTypewriter, 300)
    }
  }

  typeNext()
}

onMounted(() => runTypewriter())
onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>

<style scoped>
.profile-pic-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.profile-pic-inner {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--border);
}

.profile-pic-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  transition: filter var(--duration-mid) var(--ease-out);
}

.profile-pic-img.blurred {
  filter: blur(6px);
}

.profile-pic-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-muted);
  min-height: 1.2em;
}

.type-cursor {
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>
