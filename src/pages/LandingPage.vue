<template>
  <div class="cv-page" @mousemove="onMouseMove" @mouseleave="gridVisible = false" @mouseenter="gridVisible = true">
    <!-- Grid overlay -->
    <div class="grid-reveal" :class="{ active: gridVisible }" :style="{ '--mx': mouseX + 'px', '--my': mouseY + 'px', 'background-position': '0 ' + (-scrollY) + 'px' }"></div>
    <!-- Red accent spots -->
    <div class="grid-accents" :class="{ active: gridVisible }" :style="{ '--mx': mouseX + 'px', '--my': mouseY + 'px', top: (-scrollY) + 'px' }">
      <span v-for="(c, i) in accentCells" :key="i" class="accent-cell" :style="{ top: c.y + 'px', left: c.x + 'px' }"></span>
    </div>
    <!-- Header -->
    <SiteNav />

    <!-- Hero: Name -->
    <section class="hero">
      <GlassHero />
      <div class="hero-sub">
        <p class="tagline">Turning ambitious ideas into working AI systems, tools and experiences</p>
      </div>
    </section>

    <main id="main-content" class="cv-body">
      <!-- Personal Projects -->
      <section class="section reveal">
        <div class="sec-hdr">
          <span>My Websites</span>
          <span class="idx">01</span>
        </div>
        <div
          class="passion-scroll-wrap"
          ref="passionRef"
          @pointerdown="onPassionPointerDown"
          @pointermove="onPassionPointerMove"
          @pointerup="onPassionPointerUp"
          @pointercancel="onPassionPointerUp"
          @pointerleave="onPassionPointerUp"
        >
          <div class="passion-scroll">
            <a
              v-for="(p, i) in loopPassion"
              :key="i"
              :href="p.url"
              target="_blank"
              rel="noopener"
              class="passion-card"
            >
              <div class="passion-preview">
                <div v-if="p.noEmbed" class="passion-fallback">
                  <img :src="'/images/' + p.thumb" :alt="p.label" class="passion-thumb" loading="lazy" decoding="async" />
                </div>
                <iframe
                  v-else
                  :src="p.url"
                  class="passion-iframe"
                  :title="p.label + ' Preview'"
                  loading="lazy"
                  scrolling="no"
                ></iframe>
                <div class="passion-overlay">
                  <span class="passion-cta">Visit {{ p.label }} <span class="arrow">&rarr;</span></span>
                </div>
              </div>
              <p class="passion-desc">{{ p.desc }}</p>
            </a>
          </div>
        </div>
        <router-link to="/websites" class="cases-directory">View all websites <span class="arrow">&rarr;</span></router-link>
      </section>

      <!-- Sandbox Preview -->
      <section class="section reveal">
        <div class="sec-hdr">
          <span>N8N Sandbox</span>
          <span class="idx">02</span>
        </div>
        <router-link to="/sandbox" class="sandbox-card">
          <div class="sandbox-preview">
            <img
              src="/images/n8n.webp"
              alt="N8N Sandbox Preview"
              class="sandbox-img"
              loading="lazy"
            />
            <div class="sandbox-overlay">
              <span class="sandbox-cta">Open Interactive Sandbox <span class="arrow">&rarr;</span></span>
            </div>
          </div>
          <p class="sandbox-desc">An N8N-style workflow playground. Drag nodes, connect ideas, break things.</p>
        </router-link>
      </section>

      <!-- Cases -->
      <section class="section reveal" id="cases">
        <div class="sec-hdr">
          <span>Cases</span>
          <span class="idx">03</span>
        </div>
        <div
          class="cases-scroll-wrap"
          ref="scrollRef"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @pointerleave="onPointerUp"
        >
          <div class="cases-scroll">
            <div class="case-card" v-for="(c, i) in loopCases" :key="i" :data-slug="c.slug">
              <div class="case-card-img">
                <img :src="c.img" :alt="c.title" draggable="false" loading="lazy" decoding="async" />
              </div>
              <div class="case-card-info">
                <span class="case-card-title">{{ c.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/cases" class="cases-directory">View all cases <span class="arrow">&rarr;</span></router-link>
      </section>

      <!-- About -->
      <section class="section reveal">
        <div class="sec-hdr">
          <span>About</span>
          <span class="idx">04</span>
        </div>
        <router-link to="/about" class="about-card">
          <div class="about-content">
            <p class="about-text">Creative Technologist at TBWA\NEBOKO. I connect brand strategy, automation and applied AI to build systems that actually work. Campaigns, tools, installations. If it needs a mix of design and code, that's my lane.</p>
            <span class="view-about">Read more <span class="arrow">&rarr;</span></span>
          </div>
        </router-link>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SiteNav from '../components/SiteNav.vue'
import GlassHero from '../components/GlassHero.vue'

const router = useRouter()

// Scroll-reveal IntersectionObserver
let revealObserver: IntersectionObserver | null = null

const mouseX = ref(0)
const mouseY = ref(0)
const scrollY = ref(0)
const gridVisible = ref(false)

// Red accent cells snapped to 28px grid
const G = 28
const accentCells = [
  // cluster top-left
  { x: 3 * G, y: 8 * G },
  { x: 3 * G, y: 9 * G },
  // solo mid-right
  { x: 30 * G, y: 6 * G },
  // L-shape center
  { x: 18 * G, y: 14 * G },
  { x: 19 * G, y: 14 * G },
  { x: 18 * G, y: 15 * G },
  // solo left
  { x: 6 * G, y: 20 * G },
  // solo far right
  { x: 35 * G, y: 24 * G },
  // solo center
  { x: 22 * G, y: 10 * G },
  // pair bottom-left
  { x: 12 * G, y: 28 * G },
  { x: 13 * G, y: 28 * G },
  // solo top center
  { x: 16 * G, y: 4 * G },
  // solo bottom-right
  { x: 38 * G, y: 18 * G },
]

const onMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  scrollY.value = window.scrollY
}

const topCases = [
  { title: "McDonald's Fan Favorites", subtitle: '4 million AI-generated custom menus', img: '/cases/images/fan_favorites_hero.webp', slug: 'mcdonald-s-fan-favorites' },
  { title: 'LG Radio Optimism', subtitle: 'A million live songs and AI album covers', img: '/cases/images/lg_hero.webp', slug: 'lg-radio-optimism' },
  { title: "McDonald's Olifantenpaadjes", subtitle: 'An interactive map of desire paths', img: '/images/olifantenpaadjes1.jpeg', slug: 'mcdonald-s-olifantenpaadjes' },
  { title: 'TBWA\\X Custom Arcade', subtitle: 'A hand-built arcade cabinet', img: '/cases/images/arcade_hero.webp', slug: 'tbwa-x-custom-arcade' },
  { title: "McDonald's Delivery Detector", subtitle: 'A Big Mac that orders itself', img: '/cases/images/mcdeliverydetector.avif', slug: 'mcdonald-s-delivery-detector' },
  { title: 'SS26 New Amsterdam Surf Association', subtitle: 'Selfie to Palm Beach, for Paris Fashion Week', img: '/cases/images/nasa_thumb.webp', slug: 'ss26-new-amsterdam-surf-association' },
  { title: 'Abdulla Al Ghurair Foundation', subtitle: 'An offline AI touchscreen installation', img: '/cases/images/abdul_thumb.webp', slug: 'abdulla-al-ghurair-foundation' },
  { title: 'New Care Supplements', subtitle: 'A 3D + AI content pipeline', img: '/cases/images/newcare_thumb.webp', slug: 'new-care-supplements' },
  { title: 'Food Token Soup (NFT)', subtitle: '10,000 generative 3D soup cans', img: '/cases/images/food_token_soup_hero.webp', slug: 'food-token-soup-nft' },
  { title: "McDonald's Family Mode", subtitle: 'A 3D avatar builder inside the app', img: '/cases/images/imgi_1_hero.webp', slug: 'mcdonald-s-family-mode' },
]

const loopCases = computed(() => [...topCases, ...topCases, ...topCases])

const passionProjects = [
  { url: 'https://tlguide.com', label: 'tlguide.com', desc: 'I made a review site for Figma plugins and widgets. The reviews and outreach are mostly automated with AI.' },
  { url: 'https://www.latentsearch.net/', label: 'latentsearch.net', desc: 'Every search result is AI-generated. It looks normal, but the content is fake.' },
  { url: 'https://creditswap.app', label: 'creditswap.app', desc: 'A private marketplace for reselling AI API credits. Buyers pay less, sellers monetize unused capacity.' },
  { url: 'https://reddituser.info', label: 'reddituser.info', desc: 'Paste a Reddit username, get an AI-generated report with graphs. Activity, interests, posting habits.', noEmbed: true, thumb: 'reddituserinfo.webp' },
  { url: 'https://colino.work', label: 'colino.work', desc: 'A job search that filters live openings down to the roles that actually match your CV. Upload your resume and it ranks the jobs that fit.' },
  { url: 'https://mlnpx.com', label: 'million.pixels', desc: 'A one-million-pixel canvas painted by AI agents and the people who direct them. A live demo of WebMCP.', noEmbed: true, thumb: 'millionpixels.webp' },
  { url: 'https://www.figma.com/community/plugin/1626934504810261537', label: 'Filters & Grain', desc: 'A Figma plugin for color grading, film grain and vignette. No Photoshop needed.', noEmbed: true, thumb: 'figma.webp' },
]

const loopPassion = computed(() => [...passionProjects, ...passionProjects, ...passionProjects])

// Drag-to-scroll + infinite loop (Cases)
const scrollRef = ref<HTMLElement | null>(null)
let isDragging = false
let hasDragged = false
let startX = 0
let scrollLeft = 0
let downTarget: HTMLElement | null = null

const onPointerDown = (e: PointerEvent) => {
  const el = scrollRef.value
  if (!el) return
  isDragging = true
  hasDragged = false
  downTarget = e.target as HTMLElement
  el.style.cursor = 'grabbing'
  startX = e.pageX - el.offsetLeft
  scrollLeft = el.scrollLeft
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging) return
  const el = scrollRef.value
  if (!el) return
  e.preventDefault()
  const x = e.pageX - el.offsetLeft
  const diff = Math.abs(x - startX)
  if (diff > 5) hasDragged = true
  el.scrollLeft = scrollLeft - (x - startX)
}

const onPointerUp = () => {
  isDragging = false
  const el = scrollRef.value
  if (el) el.style.cursor = 'grab'
  if (!hasDragged && downTarget) {
    const card = downTarget.closest('.case-card') as HTMLElement | null
    if (card) {
      const slug = card.dataset.slug
      if (slug) router.push('/cases#' + slug)
    }
  }
  downTarget = null
}

// Infinite loop: reset scroll when reaching clone boundaries
const onScroll = () => {
  const el = scrollRef.value
  if (!el) return
  const setWidth = el.scrollWidth / 3
  if (el.scrollLeft >= setWidth * 2) {
    el.scrollLeft -= setWidth
  } else if (el.scrollLeft <= 0) {
    el.scrollLeft += setWidth
  }
}

// Drag-to-scroll + infinite loop (Passion projects)
const passionRef = ref<HTMLElement | null>(null)
let pIsDragging = false
let pHasDragged = false
let pStartX = 0
let pScrollLeft = 0

const onPassionPointerDown = (e: PointerEvent) => {
  const el = passionRef.value
  if (!el) return
  pIsDragging = true
  pHasDragged = false
  el.style.cursor = 'grabbing'
  pStartX = e.pageX - el.offsetLeft
  pScrollLeft = el.scrollLeft
}

const onPassionPointerMove = (e: PointerEvent) => {
  if (!pIsDragging) return
  const el = passionRef.value
  if (!el) return
  e.preventDefault()
  const x = e.pageX - el.offsetLeft
  if (Math.abs(x - pStartX) > 5) pHasDragged = true
  el.scrollLeft = pScrollLeft - (x - pStartX)
}

const onPassionPointerUp = () => {
  pIsDragging = false
  const el = passionRef.value
  if (el) el.style.cursor = 'grab'
}

const onPassionScroll = () => {
  const el = passionRef.value
  if (!el) return
  const setWidth = el.scrollWidth / 3
  if (el.scrollLeft >= setWidth * 2) {
    el.scrollLeft -= setWidth
  } else if (el.scrollLeft <= 0) {
    el.scrollLeft += setWidth
  }
}

onMounted(() => {
  const el = scrollRef.value
  if (el) {
    // Start at middle set
    el.scrollLeft = el.scrollWidth / 3
    el.addEventListener('scroll', onScroll)
  }

  const pEl = passionRef.value
  if (pEl) {
    pEl.scrollLeft = pEl.scrollWidth / 3
    pEl.addEventListener('scroll', onPassionScroll)
  }
  // Scroll-reveal: observe all .reveal elements
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger entrance by 100ms per element
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, i * 100)
          revealObserver?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  document.querySelectorAll('.reveal').forEach((el) => revealObserver?.observe(el))
})

onUnmounted(() => {
  const el = scrollRef.value
  if (el) el.removeEventListener('scroll', onScroll)
  const pEl = passionRef.value
  if (pEl) pEl.removeEventListener('scroll', onPassionScroll)
  revealObserver?.disconnect()
})
</script>

<style scoped>
.cv-page {
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  overflow-x: clip;
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  position: relative;
}

.grid-reveal {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-image:
    linear-gradient(oklch(15% 0.008 45 / 0.1) 1px, transparent 1px),
    linear-gradient(90deg, oklch(15% 0.008 45 / 0.1) 1px, transparent 1px);
  background-size: 28px 28px;
  -webkit-mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
  mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
}

.grid-reveal.active {
  opacity: 1;
}

.grid-accents {
  position: fixed;
  left: 0;
  width: 100%;
  height: 200%;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  -webkit-mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
  mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
}

.grid-accents.active {
  opacity: 1;
}

.accent-cell {
  position: absolute;
  width: 28px;
  height: 28px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
}

.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

@keyframes arrow-nudge {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

/* Header nav */
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
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

.header-link:hover {
  opacity: 1;
}

.header-sep {
  opacity: 0.2;
  font-size: var(--text-xs);
}

/* Body */
.cv-body {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-xl) 32px var(--space-2xl);
}

/* Hero */
.hero {
  position: relative;
  height: calc(100vh - 53px);
  min-height: 560px;
  max-height: 1000px;
  overflow: hidden;
}

.tagline {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--ink-muted);
  margin: 0;
  text-align: center;
}

.hero-sub {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 40px;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 32px;
  animation: hero-sub-in 0.8s var(--ease-out) both;
  animation-delay: 0.7s;
}

@keyframes hero-sub-in {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Section headers (CV style) */
.section {
  margin-bottom: 106px;
}

.section + .section {
  padding-top: 50px;
}

.sec-hdr {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-family: var(--font-ui);
  font-weight: 300;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--ink);
}

.sec-hdr::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid var(--border);
}

.sec-hdr .idx {
  font-size: var(--text-xs);
  color: var(--ink-faint);
}

/* Cases Carousel */
.cases-scroll-wrap {
  margin: 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding-right: 60px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
  -webkit-mask-image: linear-gradient(90deg, black 0%, black 80%, transparent 100%);
  mask-image: linear-gradient(90deg, black 0%, black 80%, transparent 100%);
}

.cases-scroll-wrap::-webkit-scrollbar {
  display: none;
}

.cases-scroll {
  display: flex;
  gap: 16px;
  padding-bottom: 4px;
}

.case-card {
  flex-shrink: 0;
  width: 260px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--border);
  transition: transform var(--duration-mid) var(--ease-out),
              box-shadow var(--duration-mid) var(--ease-out);
}

.case-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px oklch(15% 0.008 45 / 0.08);
}

.case-card-img {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.case-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-out);
}

.case-card:hover .case-card-img img {
  transform: scale(1.04);
}

.case-card-info {
  padding: 14px var(--space-md) var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.case-card-title {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.3;
}

.cases-directory {
  display: inline-block;
  margin-top: 20px;
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  color: var(--ink-faint);
  transition: color var(--duration-fast) var(--ease-out);
}

.cases-directory:hover {
  color: var(--ink);
}

.cases-directory:hover .arrow {
  animation: arrow-nudge 0.8s var(--ease-out) infinite;
}

/* Sandbox Preview */
.sandbox-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 6px;
  transition: transform var(--duration-mid) var(--ease-out);
}

.sandbox-card:hover {
  transform: translateY(-2px);
}

.sandbox-preview {
  position: relative;
  width: 100%;
  height: 340px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-s);
  background: var(--ink);
}

.sandbox-img {
  width: 100%;
  height: calc(100% + 30px);
  object-fit: cover;
  object-position: center top;
  pointer-events: none;
  filter: brightness(0.85);
  transition: transform var(--duration-slow) var(--ease-out);
  margin-top: -30px;
}

.sandbox-card:hover .sandbox-img {
  transform: scale(1.05);
}

.sandbox-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 70%, oklch(15% 0.008 45 / 0.2) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  cursor: pointer;
}

.sandbox-cta {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.7;
  color: oklch(97.5% 0.008 45);
  transition: opacity var(--duration-fast) var(--ease-out);
}

.sandbox-card:hover .sandbox-cta {
  opacity: 0.8;
}

.sandbox-card:hover .arrow {
  animation: arrow-nudge 0.8s var(--ease-out) infinite;
}

.sandbox-desc {
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--ink-muted);
  margin: 14px 0 0;
}

/* Passion Project Carousel */
.passion-scroll-wrap {
  margin: 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding-right: 60px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
  -webkit-mask-image: linear-gradient(90deg, black 0%, black 85%, transparent 100%);
  mask-image: linear-gradient(90deg, black 0%, black 85%, transparent 100%);
}

.passion-scroll-wrap::-webkit-scrollbar {
  display: none;
}

.passion-scroll {
  display: flex;
  gap: 20px;
  padding-bottom: 4px;
}

.passion-card {
  flex-shrink: 0;
  width: 480px;
  display: block;
  text-decoration: none;
  color: var(--ink);
  transition: transform var(--duration-fast) var(--ease-out);
}

.passion-card:hover {
  transform: translateY(-2px);
}

.passion-preview {
  position: relative;
  width: 100%;
  height: 340px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-s);
  background: var(--ink);
}

.passion-fallback {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.passion-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(0.85);
  transition: transform var(--duration-slow) var(--ease-out), filter var(--duration-slow) var(--ease-out);
}

.passion-card:hover .passion-thumb {
  transform: scale(1.03);
  filter: brightness(1);
}

.passion-fallback-label {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 600;
  color: oklch(75% 0.01 45);
  letter-spacing: 0.04em;
}

.passion-iframe {
  width: 200%;
  height: 200%;
  border: none;
  transform: scale(0.5);
  transform-origin: top left;
  pointer-events: none;
  filter: brightness(0.85);
  transition: transform var(--duration-slow) var(--ease-out);
}

.passion-card:hover .passion-iframe {
  transform: scale(0.55) translate(-4.5%, -4.5%);
}

.passion-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 70%, oklch(15% 0.008 45 / 0.2) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  cursor: pointer;
}

.passion-desc {
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--ink-muted);
  margin: 14px 0 0;
}

.passion-cta {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.7;
  color: oklch(97.5% 0.008 45);
  transition: opacity var(--duration-fast) var(--ease-out);
}

.passion-card:hover .passion-cta {
  opacity: 0.9;
}

.passion-card:hover .arrow {
  animation: arrow-nudge 0.8s var(--ease-out) infinite;
}

/* About Card */
.about-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform var(--duration-mid) var(--ease-out);
}

.about-card:hover {
  transform: translateY(-2px);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-text {
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--ink-muted);
  margin: 0;
  max-width: 640px;
}

.view-about {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--ink-faint);
  transition: color var(--duration-fast) var(--ease-out);
}

.about-card:hover .view-about {
  color: var(--ink);
}

.about-card:hover .arrow {
  animation: arrow-nudge 0.8s var(--ease-out) infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .cv-header {
    padding: 14px 18px;
  }

  .cv-body {
    padding: 32px 18px 60px;
  }

  .hero {
    height: 70vh;
    min-height: 420px;
    max-height: 560px;
    margin-bottom: 32px;
  }

  .hero-sub {
    bottom: 24px;
    padding: 0 18px;
  }

  .tagline {
    font-size: 16px;
    line-height: 1.55;
  }

  .section {
    margin-bottom: 90px;
  }

  .section + .section {
    padding-top: 50px;
  }

  .cases-scroll-wrap {
    margin-left: -18px;
    margin-right: -18px;
    padding-right: 40px;
  }

  .case-card {
    width: 200px;
  }

  .case-card-img {
    height: 240px;
  }

  .case-card-info {
    padding: 10px 12px 14px;
  }

  .case-card-title {
    font-size: 14px;
  }

  .passion-scroll-wrap {
    margin-left: -18px;
    margin-right: -18px;
    padding-right: 40px;
  }

  .passion-card {
    width: 320px;
  }

  .sandbox-preview,
  .passion-preview {
    height: 220px;
  }

  .sandbox-desc,
  .passion-desc {
    font-size: 14px;
  }

  .about-text {
    font-size: 16px;
  }
}

@media (max-width: 400px) {
  .case-card {
    width: 170px;
  }

  .case-card-img {
    height: 200px;
  }

  .passion-card {
    width: 260px;
  }
}
</style>
