<template>
  <div class="cv-page">
    <SiteNav />

    <main class="cv-body">
      <div class="cases-list" ref="listRef">
        <div
          v-for="c in loopCases"
          :key="c.uid"
          class="case-entry"
          :class="{ open: expandedCase !== null && c.origIdx === expandedCase }"
          @click="toggleCase(c.origIdx)"
        >
          <div class="entry-bar">
            <div class="entry-text">
              <span class="entry-title">{{ c.title }}</span>
            </div>
            <div class="entry-tags">
              <span v-for="tag in c.tags" :key="tag" class="entry-tag">{{ tag }}</span>
            </div>
            <svg class="chevron" :class="{ rotated: expandedCase === c.origIdx }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>
    </main>

    <div v-if="overlayVisible" class="overlay-backdrop"></div>

    <Transition name="overlay">
      <div v-if="expandedCase !== null && !transitioning" class="case-overlay" @click.self="closeOverlay">
        <SiteNav overlay />

        <div class="overlay-body" @scroll="onMediaScroll" @wheel="onMediaWheel">
          <div class="overlay-text">
            <button class="overlay-close" @click="closeOverlay" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2 class="overlay-case-title">{{ cases[expandedCase].title }}</h2>
            <p class="overlay-desc">{{ cases[expandedCase].description }}</p>
            <div class="overlay-tags">
              <span v-for="tag in cases[expandedCase].tags" :key="tag" class="overlay-tag">{{ tag }}</span>
            </div>
            <a v-if="cases[expandedCase].projectUrl" :href="cases[expandedCase].projectUrl" target="_blank" rel="noopener" class="overlay-link">Open interactive map <span class="arrow">&rarr;</span></a>
          </div>

          <div class="overlay-media" ref="mediaRef" @scroll="onMediaScroll" @wheel="onMediaWheel">
            <div class="prev-case-hint" :class="{ visible: reachedTop }" @click="advancePrev">
              <span class="pch-arrow" aria-hidden="true">&#8593;</span>
              <span class="pch-title">{{ prevCaseTitle }}</span>
              <span class="pch-label">Previous case</span>
            </div>
            <template v-if="cases[expandedCase]">
              <div v-if="cases[expandedCase].youtube" class="entry-media">
                <iframe
                  :src="cases[expandedCase].youtube"
                  class="entry-youtube"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>

              <template v-for="(b, bi) in orderedMedia(cases[expandedCase])" :key="bi">
                <div v-if="b.type === 'video'" class="entry-media">
                  <video :src="b.src" :poster="posterFor(b.src || '')" controls preload="metadata" class="entry-video"></video>
                </div>
                <div v-else-if="b.type === 'image'" class="entry-media">
                  <img
                    :src="b.src"
                    :alt="cases[expandedCase].title"
                    class="entry-img"
                    :class="{ 'img-dark': cases[expandedCase].darkBg }"
                    loading="lazy"
                  />
                </div>
                <div v-else-if="b.type === 'grid'" class="entry-grid" :style="{ gridTemplateColumns: 'repeat(' + (b.cols || 1) + ', 1fr)' }">
                  <div
                    v-for="(g, gi) in b.items"
                    :key="gi"
                    class="entry-grid-cell"
                    :style="{ aspectRatio: (b.aspect || '1:1').replace(':', '/') }"
                  >
                    <video v-if="g.type === 'video'" :src="g.src" :poster="posterFor(g.src || '')" controls preload="metadata" class="entry-video"></video>
                    <img v-else :src="g.src" :alt="cases[expandedCase].title" class="entry-img" loading="lazy" />
                  </div>
                </div>
                <p v-else class="entry-caption">{{ b.text }}</p>
              </template>
            </template>

            <div class="next-case-hint" :class="{ visible: reachedBottom }" @click="advanceNext">
              <span class="nch-label">Next case</span>
              <span class="nch-title">{{ nextCaseTitle }}</span>
              <span class="nch-arrow" aria-hidden="true">&#8595;</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import SiteNav from '../components/SiteNav.vue'
import { cases as casesData, type CaseItem, orderedMedia, posterFor } from '../data/cases'

const route = useRoute()
const expandedCase = ref<number | null>(null)
const transitioning = ref(false)
const mediaRef = ref<HTMLElement | null>(null)
const reachedBottom = ref(false)
const reachedTop = ref(false)

const LOOP = 3
const listRef = ref<HTMLElement | null>(null)

let extraScroll = 0
let prevExtraScroll = 0
let cooldown = false

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const toggleCase = (i: number) => {
  if (expandedCase.value === i) {
    closeOverlay()
  } else {
    openCase(i)
  }
}

function lockOverlay(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

function resetListScroll() {
  if (listRef.value) listRef.value.scrollTop = 0
}

function openCase(i: number) {
  lockOverlay(true)
  resetListScroll()
  reachedBottom.value = false
  reachedTop.value = false
  extraScroll = 0
  prevExtraScroll = 0
  if (expandedCase.value !== null) {
    transitioning.value = true
    expandedCase.value = null
    setTimeout(() => {
      expandedCase.value = i
      nextTick(() => {
        transitioning.value = false
        scrollMediaTop()
      })
    }, 250)
  } else {
    expandedCase.value = i
    nextTick(() => {
      scrollMediaTop()
    })
  }
}

function closeOverlay() {
  expandedCase.value = null
  transitioning.value = false
  reachedBottom.value = false
  reachedTop.value = false
  extraScroll = 0
  prevExtraScroll = 0
  resetListScroll()
  lockOverlay(false)
}

function scrollMediaTop() {
  nextTick(() => {
    if (mediaRef.value) {
      mediaRef.value.scrollTop = 0
    }
  })
}

function advanceNext() {
  if (expandedCase.value === null || transitioning.value) return
  const next = (expandedCase.value + 1) % totalCases.value
  transitioning.value = true
  reachedBottom.value = false
  reachedTop.value = false
  extraScroll = 0
  prevExtraScroll = 0
  startCooldown()
  expandedCase.value = null
  setTimeout(() => {
    expandedCase.value = next
    nextTick(() => {
      transitioning.value = false
      scrollMediaTop()
    })
  }, 400)
}

function advancePrev() {
  if (expandedCase.value === null || transitioning.value) return
  const prev = (expandedCase.value - 1 + totalCases.value) % totalCases.value
  transitioning.value = true
  reachedBottom.value = false
  reachedTop.value = false
  extraScroll = 0
  prevExtraScroll = 0
  startCooldown()
  expandedCase.value = null
  setTimeout(() => {
    expandedCase.value = prev
    nextTick(() => {
      transitioning.value = false
      scrollMediaTop()
    })
  }, 400)
}

function getScrollEl(): HTMLElement | null {
  const m = mediaRef.value
  if (!m) return null
  if (m.scrollHeight > m.clientHeight + 1) return m
  const p = m.parentElement
  if (p && p.scrollHeight > p.clientHeight + 1) return p
  return m
}

function updateScrollState() {
  const el = getScrollEl()
  if (!el) return
  const atTop = el.scrollTop <= 8
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
  if (atTop && !reachedTop.value) prevExtraScroll = 0
  if (atBottom && !reachedBottom.value) extraScroll = 0
  reachedTop.value = atTop
  reachedBottom.value = atBottom
}

function onMediaScroll() {
  updateScrollState()
}

function onMediaWheel(e: WheelEvent) {
  if (transitioning.value || cooldown) return
  const el = getScrollEl()
  if (!el) return
  const atTop = el.scrollTop <= 8
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8

  if (e.deltaY < 0 && atTop) {
    prevExtraScroll += Math.abs(e.deltaY)
    if (prevExtraScroll > 300) {
      prevExtraScroll = 0
      advancePrev()
    }
  } else if (e.deltaY > 0 && atBottom) {
    extraScroll += e.deltaY
    if (extraScroll > 300) {
      extraScroll = 0
      advanceNext()
    }
  } else {
    extraScroll = 0
    prevExtraScroll = 0
  }
}

function startCooldown() {
  cooldown = true
  setTimeout(() => { cooldown = false }, 700)
}

onBeforeUnmount(() => {
  lockOverlay(false)
})

const overlayVisible = computed(() => expandedCase.value !== null || transitioning.value)

const totalCases = computed(() => cases.value.length)

const nextCaseTitle = computed(() => {
  if (expandedCase.value === null) return ''
  const next = (expandedCase.value + 1) % cases.value.length
  return cases.value[next].title
})

const prevCaseTitle = computed(() => {
  if (expandedCase.value === null) return ''
  const prev = (expandedCase.value - 1 + cases.value.length) % cases.value.length
  return cases.value[prev].title
})

const cases = ref<CaseItem[]>(casesData)

const loopCases = computed(() => {
  const total = cases.value.length
  const items: Array<CaseItem & { uid: string; origIdx: number }> = []
  for (let r = 0; r < LOOP; r++) {
    for (let i = 0; i < total; i++) {
      items.push({ ...cases.value[i], uid: `c${i}-r${r}`, origIdx: i })
    }
  }
  return items
})

function openCaseFromHash(hash: string | undefined | null) {
  if (!hash) return
  const caseSlug = hash.replace(/^case-/, '')
  const idx = cases.value.findIndex(c => slugify(c.title) === caseSlug)
  if (idx >= 0) {
    expandedCase.value = idx
    nextTick(() => {
      scrollMediaTop()
    })
  }
}

onMounted(() => {
  openCaseFromHash(route.hash?.replace('#', ''))
})

watch(() => route.hash, (hash) => {
  openCaseFromHash(hash?.replace('#', ''))
})
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

/* ─── Nav header (same as homepage) ─── */
.cv-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.header-link {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--ink);
  text-decoration: none;
  opacity: 0.5;
  transition: opacity var(--duration-fast) var(--ease-out);
}
.header-link:hover { opacity: 1; }

.header-sep {
  opacity: 0.2;
  font-size: var(--text-xs);
}

/* ─── Body ─── */
.cv-body {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 53px);
  overflow: hidden;
}

/* ─── Accordion list ─── */
.cases-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.case-entry {
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}
.case-entry:hover {
  background: oklch(15% 0.008 45 / 0.015);
}
.case-entry.open {
  background: oklch(15% 0.008 45 / 0.02);
  cursor: default;
}

.entry-bar {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: 22px 32px;
}

.entry-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entry-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.3;
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
  padding: 4px 12px;
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

/* ─── Overlay backdrop ─── */
.overlay-backdrop {
  position: fixed;
  inset: 0;
  z-index: 39;
  background: var(--bg);
}

/* ─── Overlay ─── */
.case-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.overlay-hdr {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
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
.overlay-close:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

.overlay-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.overlay-text {
  width: 33.33%;
  flex-shrink: 0;
  padding: 40px 28px 40px 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.overlay-case-title {
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
  font-weight: 400;
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

.overlay-link {
  display: inline-block;
  color: var(--ink);
  text-decoration: none;
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  transition: opacity var(--duration-fast) var(--ease-out);
  margin-top: auto;
}
.overlay-link:hover { opacity: 0.7; }

.overlay-media {
  width: 66.67%;
  padding: 40px 32px 40px 28px;
  overflow-y: auto;
}

/* ─── Media ─── */
.entry-media {
  margin-bottom: var(--space-md);
}

.entry-video {
  width: 100%;
  max-width: 100%;
  border-radius: 3px;
  background: var(--ink);
}

.entry-youtube {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 3px;
  background: var(--ink);
}

.entry-img {
  width: 100%;
  display: block;
  border-radius: 3px;
}

.entry-img.img-dark {
  background: oklch(25% 0.008 45);
  padding: 20px;
  border-radius: 6px;
}

.entry-caption {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 170%;
  color: var(--ink-muted);
  margin: 0 0 var(--space-md);
  padding: 0 2px;
}

.entry-grid {
  display: grid;
  gap: 10px;
  margin-bottom: var(--space-md);
}

.entry-grid-cell {
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  background: var(--ink);
}

.entry-grid-cell video,
.entry-grid-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

.scroll-sentinel {
  height: 8px;
}

.next-case-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px 16px 36px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 300ms var(--ease-out), transform 300ms var(--ease-out);
  cursor: pointer;
}

.next-case-hint.visible {
  opacity: 1;
  transform: translateY(0);
}

.nch-label {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--ink-faint);
}

.nch-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--ink-muted);
}

.nch-arrow {
  font-size: 14px;
  color: var(--ink-faint);
  animation: nch-bob 1.4s ease-in-out infinite;
}

@keyframes nch-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.prev-case-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 36px 16px 28px;
  opacity: 0;
  transform: translateY(-6px);
  transition: opacity 300ms var(--ease-out), transform 300ms var(--ease-out);
  cursor: pointer;
}

.prev-case-hint.visible {
  opacity: 1;
  transform: translateY(0);
}

.pch-label {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--ink-faint);
}

.pch-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--ink-muted);
}

.pch-arrow {
  font-size: 14px;
  color: var(--ink-faint);
  animation: pch-bob 1.4s ease-in-out infinite;
}

@keyframes pch-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* ─── Overlay transition ─── */
.overlay-enter-active {
  transition: opacity 300ms var(--ease-out),
              transform 400ms var(--ease-out);
}
.overlay-leave-active {
  transition: opacity 200ms var(--ease-out),
              transform 250ms var(--ease-out);
}
.overlay-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.overlay-leave-to {
  opacity: 0;
  transform: translateY(-15%);
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .overlay-enter-active,
  .overlay-leave-active {
    transition: opacity 150ms ease;
  }
  .overlay-enter-from {
    opacity: 0;
    transform: none;
  }
  .overlay-leave-to {
    opacity: 0;
    transform: none;
  }
}

/* ─── Responsive ─── */
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
  .overlay-hdr {
    padding: 12px 18px;
  }
  .overlay-case-title {
    font-size: 20px;
  }
}

@media (max-width: 640px) {
  .cv-header { padding: 12px 18px; gap: 6px; }
  .header-link { font-size: 12px; letter-spacing: 1px; }
  .cv-body { height: calc(100vh - 45px); }
  .entry-tags { display: none; }
  .entry-bar { padding: 16px 18px; gap: var(--space-sm); }
  .entry-title { font-size: 1rem; }
  .entry-images.dark-bg .entry-img { padding: 12px; }
}
</style>
