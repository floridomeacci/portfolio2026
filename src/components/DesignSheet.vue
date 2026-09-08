<template>
  <div class="dsheet">
    <div class="cell cell--colors">
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

    <div class="cell cell--buttons">
      <span class="cell-label">Buttons</span>
      <div class="btns">
        <button class="btn" :style="{ background: P.hex, color: textOn(P.hex) }">Primary</button>
        <button class="btn btn--outline">Secondary</button>
      </div>
    </div>

    <div class="cell cell--headline">
      <span class="cell-label">Headline</span>
      <div class="aa" :style="{ fontFamily: fs(spec.fonts.headline) }">Aa</div>
      <span class="font-name">{{ spec.fonts.headline }}</span>
    </div>

    <div class="cell cell--body">
      <span class="cell-label">Body</span>
      <div class="aa" :style="{ fontFamily: fs(spec.fonts.body) }">Aa</div>
      <span class="font-name">{{ spec.fonts.body }}</span>
    </div>

    <div class="cell cell--label">
      <span class="cell-label">Label</span>
      <div class="aa aa--mono" :style="{ fontFamily: fs(spec.fonts.label) }">Aa</div>
      <span class="font-name">{{ spec.fonts.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SiteSpec } from '../data/websites'

const props = defineProps<{ spec: SiteSpec }>()

const P = computed(() => props.spec.palette.primary)

const paletteList = computed(() => [
  props.spec.palette.primary,
  props.spec.palette.secondary,
  props.spec.palette.tertiary,
  props.spec.palette.neutral
])

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
  grid-template-rows: 1fr 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-sub);
}

.cell--colors {
  grid-column: 1;
  grid-row: 1 / 3;
}
.cell--buttons {
  grid-column: 1;
  grid-row: 3;
}
.cell--headline {
  grid-column: 2;
  grid-row: 1;
}
.cell--body {
  grid-column: 2;
  grid-row: 2;
}
.cell--label {
  grid-column: 2;
  grid-row: 3;
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
  gap: 10px;
  margin-top: auto;
  margin-bottom: auto;
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

@media (max-width: 640px) {
  .dsheet {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
  }
  .cell--colors { grid-row: 1 / 3; }
  .cell--buttons { grid-row: 3; }
}
</style>
