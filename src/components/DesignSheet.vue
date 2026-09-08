<template>
  <div class="design-sheet">
    <div class="ds-section">
      <span class="ds-label">Typography</span>
      <div v-for="f in spec.fonts" :key="f.family" class="ds-font">
        <div class="ds-font-meta">
          <span class="ds-font-name">{{ f.family }}</span>
          <span class="ds-font-note">{{ f.note }}</span>
        </div>
        <div class="ds-font-sample" :style="{ fontFamily: `'${f.family}', sans-serif` }">{{ f.sample }}</div>
      </div>
    </div>

    <div class="ds-section">
      <span class="ds-label">Colors</span>
      <div class="ds-colors">
        <div v-for="c in spec.colors" :key="c.hex" class="ds-color">
          <div class="ds-swatch" :style="{ background: c.hex }"></div>
          <div class="ds-color-meta">
            <span class="ds-color-name">{{ c.name }}</span>
            <span class="ds-color-hex">{{ c.hex }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="ds-section">
      <span class="ds-label">Buttons</span>
      <div class="ds-buttons">
        <button v-for="b in spec.buttons" :key="b.label" class="ds-btn" :class="'ds-btn--' + b.kind">{{ b.label }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SiteSpec } from '../data/websites'

defineProps<{ spec: SiteSpec }>()
</script>

<style scoped>
.design-sheet {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 8px 0;
}

.ds-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ds-label {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--ink-faint);
}

.ds-font {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ds-font-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.ds-font-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--ink);
}

.ds-font-note {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-faint);
}

.ds-font-sample {
  font-size: 22px;
  color: var(--ink);
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-sub);
}

.ds-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ds-color {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
}

.ds-swatch {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.ds-color-meta {
  display: flex;
  flex-direction: column;
}

.ds-color-name {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--ink);
}

.ds-color-hex {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-faint);
}

.ds-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ds-btn {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.ds-btn--primary {
  background: var(--ink);
  color: var(--bg);
  border: 1px solid var(--ink);
}

.ds-btn--outline {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--border-s);
}

.ds-btn--ghost {
  background: transparent;
  color: var(--ink-muted);
  border: 1px solid transparent;
}

.ds-btn:hover {
  opacity: 0.8;
}
</style>
