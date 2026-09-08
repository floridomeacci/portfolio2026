<template>
  <div class="board">
    <section class="palette" aria-label="Color palette">
      <article v-for="c in paletteList" :key="c.name" class="swatch" :class="c.key">
        <div class="top" :style="{ background: c.hex, color: textOn(c.hex) }">
          <span>{{ c.name }}</span><span>{{ c.hex.toUpperCase() }}</span>
        </div>
        <div class="ramp">
          <span v-for="(h, i) in ramp(c.hex)" :key="i" :style="{ background: h }"></span>
        </div>
      </article>
    </section>

    <section class="card type-card head">
      <div class="meta"><span>Headline</span><span :style="{ fontFamily: fs(spec.fonts.headline) }">{{ spec.fonts.headline }}</span></div>
      <div class="sample" :style="{ fontFamily: fs(spec.fonts.headline) }">Aa</div>
    </section>

    <section class="card buttons">
      <div class="button-grid">
        <div class="btn primary" :style="{ background: P.hex, color: textOn(P.hex) }">Primary</div>
        <div class="btn secondary" :style="{ background: N.hex, color: textOn(N.hex) }">Secondary</div>
        <div class="btn inverted" style="background:#2f2f2f;color:#f5f5f5">Inverted</div>
        <div class="btn outlined">Outlined</div>
      </div>
    </section>

    <section class="card search-card">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="6.5" stroke-width="2"/><path d="M16 16l5 5" stroke-width="2" stroke-linecap="round"/></svg>
        <span>Search</span>
      </div>
    </section>

    <section class="card type-card body">
      <div class="meta"><span>Body</span><span :style="{ fontFamily: fs(spec.fonts.body) }">{{ spec.fonts.body }}</span></div>
      <div class="sample" :style="{ fontFamily: fs(spec.fonts.body) }">Aa</div>
    </section>

    <section class="card bars">
      <div class="bars-inner">
        <div class="bar"><i :style="{ background: P.hex, width: '70%' }"></i></div>
        <div class="bar"><i :style="{ background: S.hex, width: '85%' }"></i></div>
        <div class="bar"><i :style="{ background: T.hex, width: '55%' }"></i></div>
      </div>
    </section>

    <section class="card nav-card">
      <div class="nav-pill">
        <div class="nav-item active" :style="{ background: P.hex, color: textOn(P.hex) }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 10.5L12 4l8 6.5V20h-6v-6h-4v6H4z" stroke-linejoin="round"/></svg>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="10.5" cy="10.5" r="6.2"/><path d="M15 15l5 5" stroke-linecap="round"/></svg>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="3"/><path d="M5 20v-2c0-3 3-5 7-5s7 2 7 5v2z" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </section>

    <section class="card type-card label">
      <div class="meta"><span>Label</span><span :style="{ fontFamily: fs(spec.fonts.label) }">{{ spec.fonts.label }}</span></div>
      <div class="sample" :style="{ fontFamily: fs(spec.fonts.label) }">Aa</div>
    </section>

    <section class="card icon-card">
      <div class="square" :style="{ background: T.hex, color: textOn(T.hex) }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 20l3.2-.7L19 7.5 16.5 5 4.7 16.8 4 20z" stroke-linejoin="round"/><path d="M14.8 6.7l2.5 2.5"/></svg>
      </div>
    </section>

    <section class="card label-card">
      <div class="label-btn" :style="{ background: P.hex, color: textOn(P.hex) }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M4 20l3.2-.7L19 7.5 16.5 5 4.7 16.8 4 20z" stroke-linejoin="round"/><path d="M14.8 6.7l2.5 2.5"/></svg>
        <span>Label</span>
      </div>
    </section>

    <section class="card action-card">
      <div class="actions">
        <div class="action" :style="{ background: P.hex }"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20l3.2-.7L15 11.5 12.5 9 4.7 16.8 4 20z"/><path d="M15.5 4.5l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8.8-1.8zM20 11l.5 1.2 1.2.5-1.2.5L20 14.4l-.5-1.2-1.2-.5 1.2-.5L20 11z"/></svg></div>
        <div class="action" :style="{ background: S.hex }"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4l5 8H7l5-8z"/><rect x="5" y="14" width="5" height="5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg></div>
        <div class="action" :style="{ background: T.hex }"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.5 5.5h8l8.5 8.5-6 6-10.5-10.5z" stroke-linejoin="round"/><circle cx="8" cy="9" r="1" fill="currentColor" stroke="none"/></svg></div>
        <div class="action" style="background:#cf1616"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13M10 10v7M14 10v7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SiteSpec } from '../data/websites'

const props = defineProps<{ spec: SiteSpec }>()

const P = computed(() => props.spec.palette.primary)
const S = computed(() => props.spec.palette.secondary)
const T = computed(() => props.spec.palette.tertiary)
const N = computed(() => props.spec.palette.neutral)

const paletteList = computed(() => [
  { key: 'primary', ...props.spec.palette.primary },
  { key: 'secondary', ...props.spec.palette.secondary },
  { key: 'tertiary', ...props.spec.palette.tertiary },
  { key: 'neutral', ...props.spec.palette.neutral }
])

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a), cb = hexToRgb(b)
  const c = (x: number, y: number) => Math.round(Math.min(255, Math.max(0, x + (y - x) * t))).toString(16).padStart(2, '0')
  return '#' + c(ca[0], cb[0]) + c(ca[1], cb[1]) + c(ca[2], cb[2])
}

function ramp(brand: string): string[] {
  const out: string[] = []
  for (let i = 0; i < 12; i++) {
    const t = i / 11
    out.push(t <= 0.5 ? mix('#000000', brand, t / 0.5) : mix(brand, '#ffffff', (t - 0.5) / 0.5))
  }
  return out
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

function textOn(hex: string): string {
  return luminance(hex) > 0.6 ? '#111111' : '#ffffff'
}

function fs(name: string): string {
  return `'${name}', sans-serif`
}
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 0.89fr repeat(3, 1fr);
  grid-template-rows: repeat(3, minmax(190px, 1fr));
  gap: 16px;
  width: 100%;
}

.card {
  background: #f2f2f2;
  border-radius: 22px;
  overflow: hidden;
}

.palette {
  grid-row: 1 / 4;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  gap: 16px;
  background: transparent;
  overflow: visible;
}

.swatch {
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.swatch .top {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 14px;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.2px;
  font-family: 'JetBrains Mono', monospace;
}

.swatch .ramp {
  height: 56px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.ramp span { display: block; }

.type-card { position: relative; padding: 22px 20px; }
.type-card .meta {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  color: #8b9191;
  font-weight: 500;
  font-family: 'Hanken Grotesk', Arial, sans-serif;
}
.type-card .sample {
  position: absolute;
  right: 20px;
  bottom: 2px;
  line-height: 0.86;
}
.type-card.head .sample { font-size: 110px; color: #101313; font-weight: 500; }
.type-card.body .sample { font-size: 110px; color: #3f4949; font-weight: 400; }
.type-card.label .sample { font-size: 100px; color: #3f4949; font-weight: 400; }

.buttons { display: flex; align-items: flex-start; padding: 54px 16px 0; }
.button-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
.btn {
  height: 44px;
  border: 0;
  font: 500 15px 'JetBrains Mono', monospace;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}
.btn.outlined { background: transparent; border: 2px solid #8a9292; color: #3e4646; }

.search-card { display: flex; align-items: center; justify-content: center; padding: 20px; }
.search-box {
  width: 100%;
  height: 50px;
  border: 2px solid #c8cfcf;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 18px;
  font-size: 17px;
  color: #3e4646;
  font-family: 'JetBrains Mono', monospace;
}
.search-box svg { width: 22px; height: 22px; color: #929898; }

.bars { display: flex; align-items: center; padding: 0 20px; }
.bars-inner { width: 100%; display: grid; gap: 16px; }
.bar { height: 11px; background: #ececec; border-radius: 6px; overflow: hidden; }
.bar i { display: block; height: 100%; }

.nav-card { display: flex; align-items: center; justify-content: center; }
.nav-pill {
  width: 86%;
  height: 64px;
  border-radius: 22px;
  background: #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}
.nav-item {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: #374242;
  border-radius: 12px;
}
.nav-item svg { width: 22px; height: 22px; stroke-width: 2.3; }

.icon-card, .label-card, .action-card { display: flex; align-items: center; justify-content: center; }
.square { width: 54px; height: 54px; display: grid; place-items: center; border-radius: 12px; }
.square svg { width: 24px; height: 24px; }
.label-btn { height: 44px; padding: 0 16px; display: flex; align-items: center; gap: 12px; font-size: 15px; border-radius: 10px; font-family: 'JetBrains Mono', monospace; }
.label-btn svg { width: 22px; height: 22px; }
.actions { display: flex; gap: 10px; }
.action { width: 44px; height: 44px; color: #fff; display: grid; place-items: center; border-radius: 12px; }
.action svg { width: 20px; height: 20px; }

@media (max-width: 900px) {
  .board {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  .palette {
    grid-row: auto;
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 190px);
  }
  .card { min-height: 220px; }
}

@media (max-width: 560px) {
  .board { grid-template-columns: 1fr; }
  .palette { grid-column: auto; grid-template-columns: 1fr; grid-template-rows: repeat(4, 160px); }
  .type-card .sample { font-size: 84px !important; }
}
</style>
