<template>
  <div class="dsheet">
    <div class="col">
      <div class="cell">
        <span class="cell-label">Colors</span>
        <div class="swatches">
          <div v-for="c in paletteList" :key="c.name" class="swatch">
            <span class="swatch-dot" :style="{ background: c.hex }"></span>
            <span class="swatch-meta">
              <span class="swatch-name">{{ c.name }}</span>
              <span class="swatch-hex">{{ c.hex.toUpperCase() }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="cell">
        <span class="cell-label">Buttons</span>
        <div class="btns">
          <button class="btn" :style="{ background: P.hex, color: textOn(P.hex) }">Primary</button>
          <button class="btn btn--outline">Secondary</button>
        </div>
      </div>

      <div class="cell">
        <span class="cell-label">{{ customLabel }}</span>
        <div v-if="spec.custom.kind === 'search'" class="c-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="6.5" stroke-width="2"/><path d="M16 16l5 5" stroke-width="2" stroke-linecap="round"/></svg>
          <span>{{ spec.custom.placeholder }}</span>
        </div>
        <div v-else-if="spec.custom.kind === 'input'" class="c-input">
          <span>{{ spec.custom.placeholder }}</span>
        </div>
        <div v-else-if="spec.custom.kind === 'slider'" class="c-slider">
          <span class="slider-label">{{ spec.custom.label }}</span>
          <div class="slider-track"><div class="slider-fill" :style="{ width: '55%', background: P.hex }"></div><div class="slider-knob" :style="{ left: '55%', background: P.hex }"></div></div>
        </div>
        <div v-else-if="spec.custom.kind === 'swap'" class="c-swap">
          <div class="swap-row"><span class="swap-amt">{{ spec.custom.placeholder }}</span><button class="swap-btn" :style="{ background: S.hex, color: textOn(S.hex) }">Swap</button></div>
        </div>
        <div v-else class="c-swatches">
          <span v-for="c in paletteList" :key="c.hex" class="dot" :style="{ background: c.hex }"></span>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="cell">
        <span class="cell-label">Headline</span>
        <div class="aa" :style="{ fontFamily: fs(spec.fonts.headline) }">Aa</div>
        <span class="font-name">{{ spec.fonts.headline }}</span>
      </div>
      <div class="cell">
        <span class="cell-label">Body</span>
        <div class="aa" :style="{ fontFamily: fs(spec.fonts.body) }">Aa</div>
        <span class="font-name">{{ spec.fonts.body }}</span>
      </div>
      <div class="cell">
        <span class="cell-label">Label</span>
        <div class="aa aa--mono" :style="{ fontFamily: fs(spec.fonts.label) }">Aa</div>
        <span class="font-name">{{ spec.fonts.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SiteSpec } from '../data/websites'

const props = defineProps<{ spec: SiteSpec }>()

const P = computed(() => props.spec.palette.primary)
const S = computed(() => props.spec.palette.secondary)

const paletteList = computed(() => [
  props.spec.palette.primary,
  props.spec.palette.secondary,
  props.spec.palette.tertiary,
  props.spec.palette.neutral
])

const customLabel = computed(() => {
  switch (props.spec.custom.kind) {
    case 'search': return 'Search'
    case 'input': return 'Input'
    case 'slider': return 'Control'
    case 'swap': return 'Swap'
    case 'swatches': return 'Paint'
  }
})

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function textOn(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#111111' : '#ffffff'
}

function fs(name: string): string {
  return `'${name}', sans-serif`
}
</script>

<style scoped>
.dsheet {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-sub);
  min-height: 130px;
}

.cell-label {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--ink-faint);
}

.swatches {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.swatch {
  display: flex;
  align-items: center;
  gap: 10px;
}

.swatch-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--border-s);
  flex-shrink: 0;
}

.swatch-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.swatch-name {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--ink);
}

.swatch-hex {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-faint);
}

.aa {
  font-size: 40px;
  line-height: 1;
  color: var(--ink);
  margin-top: auto;
}

.aa--mono {
  font-family: var(--font-mono);
}

.font-name {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-muted);
}

.btns {
  display: flex;
  gap: 8px;
  margin-top: auto;
  flex-wrap: wrap;
}

.btn {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn--outline {
  background: transparent;
  border-color: var(--border-s);
  color: var(--ink);
}

/* Custom elements */
.c-search,
.c-input {
  margin-top: auto;
  height: 38px;
  border: 1px solid var(--border-s);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--ink-faint);
  background: var(--bg);
}
.c-search svg {
  width: 16px;
  height: 16px;
  color: var(--ink-faint);
}

.c-slider {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.slider-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--ink-muted);
}
.slider-track {
  position: relative;
  height: 6px;
  border-radius: 3px;
  background: var(--border);
}
.slider-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 3px;
}
.slider-knob {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 2px var(--bg);
}

.c-swap {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.swap-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.swap-amt {
  flex: 1;
  height: 38px;
  border: 1px solid var(--border-s);
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--ink-faint);
}
.swap-btn {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  padding: 9px 14px;
  border-radius: 6px;
  border: 0;
  cursor: pointer;
}

.c-swatches {
  margin-top: auto;
  display: flex;
  gap: 8px;
}
.dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid var(--border-s);
}

@media (max-width: 640px) {
  .dsheet {
    grid-template-columns: 1fr;
  }
}
</style>
