<template>
  <div class="cv-page">
    <SiteNav />

    <main class="cv-body">
      <div class="sites-list">
        <div
          v-for="(s, i) in websites"
          :key="s.label"
          class="site-entry"
          :class="{ open: expanded === i }"
          @click="toggleSite(i)"
        >
          <div class="entry-bar">
            <div class="entry-text">
              <span class="entry-title">{{ s.label }}</span>
              <span class="entry-tags">
                <span v-for="t in s.tags" :key="t" class="entry-tag">{{ t }}</span>
              </span>
            </div>
            <svg class="chevron" :class="{ rotated: expanded === i }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>
    </main>

    <Transition name="overlay">
      <div v-if="expanded !== null" class="site-overlay" @click.self="closeOverlay">
        <SiteNav overlay />

        <div class="overlay-body">
          <div class="overlay-text">
            <button class="overlay-close" @click="closeOverlay" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2 class="overlay-title">{{ sites[expanded].label }}</h2>
            <p class="overlay-desc">{{ sites[expanded].desc }}</p>
            <div class="overlay-tags">
              <span v-for="t in sites[expanded].tags" :key="t" class="overlay-tag">{{ t }}</span>
            </div>
            <div class="overlay-actions">
              <a :href="sites[expanded].url" target="_blank" rel="noopener" class="action-btn action-btn--primary">Visit site <span class="arrow">&rarr;</span></a>
              <a v-if="sites[expanded].github" :href="sites[expanded].github" target="_blank" rel="noopener" class="action-btn action-btn--outline">GitHub</a>
            </div>
          </div>

          <div class="overlay-media">
            <DesignSheet :spec="sites[expanded].spec" />

            <div class="site-preview">
              <span class="preview-label">Live preview</span>
              <div v-if="sites[expanded].noEmbed" class="preview-fallback">
                <img :src="'/images/' + sites[expanded].thumb" :alt="sites[expanded].label" loading="lazy" />
              </div>
              <iframe
                v-else
                :src="sites[expanded].url"
                :title="sites[expanded].label + ' preview'"
                loading="lazy"
                scrolling="no"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SiteNav from '../components/SiteNav.vue'
import DesignSheet from '../components/DesignSheet.vue'
import { websites } from '../data/websites'

const sites = websites
const expanded = ref<number | null>(null)

const toggleSite = (i: number) => {
  expanded.value = expanded.value === i ? null : i
  document.documentElement.style.overflow = expanded.value !== null ? 'hidden' : ''
}

const closeOverlay = () => {
  expanded.value = null
  document.documentElement.style.overflow = ''
}
</script>

<style scoped>
.cv-page {
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

.cv-body {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-xl) 32px var(--space-2xl);
}

.sites-list {
  display: flex;
  flex-direction: column;
}

.site-entry {
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}
.site-entry:hover {
  background: oklch(15% 0.008 45 / 0.015);
}
.site-entry.open {
  background: oklch(15% 0.008 45 / 0.02);
}

.entry-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: 20px 4px;
}

.entry-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.entry-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--ink);
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.entry-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .4px;
  padding: 3px 10px;
  border-radius: 3px;
  background: oklch(15% 0.008 45 / 0.04);
  color: var(--ink-muted);
  white-space: nowrap;
}

.chevron {
  flex-shrink: 0;
  color: var(--ink-faint);
  transition: transform var(--duration-mid) var(--ease-out);
}
.chevron.rotated {
  transform: rotate(180deg);
}

/* Overlay */
.site-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.overlay-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.overlay-text {
  width: 38%;
  flex-shrink: 0;
  padding: 40px 28px 40px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.overlay-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-faint);
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  transition: color var(--duration-fast) var(--ease-out);
  margin-bottom: var(--space-sm);
}
.overlay-close:hover { color: var(--ink); }

.overlay-title {
  font-family: var(--font-body);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  margin: 0;
  color: var(--ink);
}

.overlay-desc {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 170%;
  color: var(--ink-muted);
  margin: 0;
}

.overlay-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.overlay-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .4px;
  padding: 4px 10px;
  border-radius: 2px;
  background: oklch(15% 0.008 45 / 0.04);
  color: var(--ink-muted);
  white-space: nowrap;
}

.overlay-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: auto;
  padding-top: var(--space-md);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: 12px 20px;
  border-radius: 6px;
  text-decoration: none;
  transition: opacity var(--duration-fast) var(--ease-out);
}
.action-btn:hover { opacity: 0.8; }

.action-btn--primary {
  background: var(--ink);
  color: var(--bg);
}

.action-btn--outline {
  border: 1px solid var(--border-s);
  color: var(--ink);
}

.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}
.action-btn:hover .arrow { transform: translateX(2px); }

/* Media column */
.overlay-media {
  flex: 1;
  padding: 40px 32px 40px 28px;
  overflow-y: auto;
}

.site-preview {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-label {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--ink-faint);
}

.site-preview iframe {
  width: 100%;
  height: 480px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
}

.preview-fallback {
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}
.preview-fallback img {
  width: 100%;
  display: block;
}

/* Overlay transition */
.overlay-enter-active {
  transition: opacity 300ms var(--ease-out), transform 400ms var(--ease-out);
}
.overlay-leave-active {
  transition: opacity 200ms var(--ease-out), transform 250ms var(--ease-out);
}
.overlay-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.overlay-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .overlay-body {
    flex-direction: column;
    overflow-y: auto;
  }
  .overlay-text {
    width: 100%;
    flex-shrink: 0;
    padding: 24px 20px 16px;
    overflow-y: visible;
  }
  .overlay-media {
    width: 100%;
    padding: 0 20px 40px;
    overflow-y: visible;
  }
  .overlay-title {
    font-size: 20px;
  }
  .site-preview iframe {
    height: 320px;
  }
}
</style>
