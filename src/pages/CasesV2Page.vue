<template>
  <div class="cv-page">
    <header class="cv-header">
      <router-link to="/" class="header-link">Home</router-link>
      <span class="header-sep">/</span>
      <router-link to="/websites" class="header-link">Websites</router-link>
      <span class="header-sep">/</span>
      <router-link to="/cases" class="header-link">Cases</router-link>
      <span class="header-sep">/</span>
      <router-link to="/sandbox" class="header-link">N8N Sandbox</router-link>
      <span class="header-sep">/</span>
      <router-link to="/about" class="header-link">About</router-link>
    </header>

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
              <span class="entry-client">{{ c.client }}</span>
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
        <div class="overlay-hdr">
          <router-link to="/" class="header-link">Home</router-link>
          <span class="header-sep">/</span>
          <router-link to="/websites" class="header-link">Websites</router-link>
          <span class="header-sep">/</span>
          <router-link to="/cases" class="header-link">Cases</router-link>
          <span class="header-sep">/</span>
          <router-link to="/sandbox" class="header-link">N8N Sandbox</router-link>
          <span class="header-sep">/</span>
          <router-link to="/about" class="header-link">About</router-link>
        </div>

        <div class="overlay-body">
          <div class="overlay-text">
            <button class="overlay-close" @click="closeOverlay" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2 class="overlay-case-title">{{ cases[expandedCase].title }}</h2>
            <p class="overlay-client">{{ cases[expandedCase].client }}</p>
            <p class="overlay-desc">{{ cases[expandedCase].description }}</p>
            <div class="overlay-tags">
              <span v-for="tag in cases[expandedCase].tags" :key="tag" class="overlay-tag">{{ tag }}</span>
            </div>
            <a v-if="cases[expandedCase].projectUrl" :href="cases[expandedCase].projectUrl" target="_blank" rel="noopener" class="overlay-link">Open interactive map <span class="arrow">&rarr;</span></a>
          </div>

          <div class="overlay-media" ref="mediaRef" @scroll="onMediaScroll" @wheel="onMediaWheel">
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

const route = useRoute()
const expandedCase = ref<number | null>(null)
const transitioning = ref(false)
const mediaRef = ref<HTMLElement | null>(null)
const reachedBottom = ref(false)

const LOOP = 3
const listRef = ref<HTMLElement | null>(null)

let extraScroll = 0

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
  extraScroll = 0
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
  extraScroll = 0
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
  extraScroll = 0
  expandedCase.value = null
  setTimeout(() => {
    expandedCase.value = next
    nextTick(() => {
      transitioning.value = false
      scrollMediaTop()
    })
  }, 400)
}

function onMediaScroll() {
  const el = mediaRef.value
  if (!el) return
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
  if (atBottom) {
    if (!reachedBottom.value) extraScroll = 0
    reachedBottom.value = true
  } else {
    reachedBottom.value = false
    extraScroll = 0
  }
}

function onMediaWheel(e: WheelEvent) {
  if (!reachedBottom.value || transitioning.value) return
  if (e.deltaY > 0) {
    extraScroll += e.deltaY
    if (extraScroll > 120) {
      extraScroll = 0
      advanceNext()
    }
  } else {
    extraScroll = 0
  }
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

interface MediaItem {
  type: 'video' | 'image'
  src?: string
}

interface MediaBlock {
  type: 'video' | 'image' | 'text' | 'grid'
  src?: string
  text?: string
  cols?: number
  rows?: number
  aspect?: string
  items?: MediaItem[]
}

interface CaseItem {
  title: string; client: string; description: string
  tags: string[]; video?: string; videos?: string[]; youtube?: string; images?: string[]; darkBg?: boolean; projectUrl?: string
  blocks?: MediaBlock[]
}

const img = (name: string) => '/cases/images/' + name
const posterFor = (v: string) => v.replace('/cases/videos/', '/cases/videos/posters/').replace('.mp4', '.webp')
const range = (s: number, e: number) => Array.from({ length: e - s + 1 }, (_, i) => s + i)

const orderedMedia = (c: CaseItem): MediaBlock[] => {
  if (c.blocks && c.blocks.length) return c.blocks
  const list: MediaBlock[] = []
  if (c.video) list.push({ type: 'video', src: c.video })
  if (c.videos) c.videos.forEach(v => list.push({ type: 'video', src: v }))
  if (c.images) c.images.forEach(i => list.push({ type: 'image', src: i }))
  return list
}

const cases = ref<CaseItem[]>([
  {
    title: "McDonald's Fan Favorites",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "Ran this three times, in the Netherlands, Portugal and Spain. I built the pipeline in Python. For each market I generated every product with AI (Flux, then ChatGPT), combined them into millions of menu combinations, and handled all the uploads and naming. Over 4 million unique combos. The design teams spent a week on post-editing.",
    tags: ['AI', 'Pipeline', 'Generative'],
    darkBg: true,
    blocks: [
      { type: 'image', src: img('fanfavorites.webp') },
      { type: 'text', text: 'The final batch for Spain alone ran to 4 million cards. Each one is made of individually generated products, combined and placed together in Python, and the hardest part was uploading and serving 4 million images in Google Cloud.' },
      { type: 'image', src: img('fanfavo1.webp') },
      { type: 'text', text: "All of those personalised fan menus lived inside the McDonald's app, where fans put together their own combinations." },
      { type: 'image', src: img('fanfavo4.webp') },
      { type: 'text', text: 'For the first Dutch million we used the Flux image model, and switched over to GPT-Image partway through.' },
      { type: 'image', src: img('fanfavo2.webp') },
      { type: 'text', text: 'That pipeline gave us a handful of burger designs to propose, and only a few made it past the brand police.' },
      { type: 'image', src: img('fanfavo3.webp') },
      { type: 'text', text: "McDonald's was happy with the result, so we rolled the campaign out to Spain and Portugal." },
      { type: 'image', src: img('fanfavo5.webp') },
      { type: 'text', text: 'Each market has its own range of products and photography, which I ran through multiple art styles, and we handpicked and edited the final images manually.' }
    ]
  },
  {
    title: 'LG Radio Optimism',
    client: 'LG Electronics — Global',
    description: "I made the thumbnail album covers for every custom AI-generated song. Used Adobe Firefly to generate thousands of assets, stress-testing every language and prompt type. Built the pipeline in n8n with a custom testing frontend. Songs and covers were generated live, so each listener got something unique. Built with LG and Adobe Firefly. Reached over a million users.",
    tags: ['AI', 'Real-time', 'Global Campaign'],
    blocks: [
      { type: 'image', src: img('lg.webp') },
      { type: 'text', text: 'We built it for LG with Adobe Firefly, and I must have generated at least 100k thumbnails while we were testing.' },
      { type: 'image', src: img('lg2.webp') },
      { type: 'text', text: 'Since launch, over a million songs and album covers have been generated in real time, all following my pipeline and system prompt.' },
      { type: 'image', src: '/images/lgradio1.webp' },
      { type: 'image', src: '/images/lgradio2.webp' }
    ]
  },
  {
    title: "McDonald's Olifantenpaadjes",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "I mapped unofficial footpath shortcuts across the Netherlands and cross-referenced them with McDonald's locations. Built the interactive map (React, Vercel) using OpenPath data and Google Street View to check which paths passed a McDonald's pole. Confirmed paths were then photographed by interns.",
    tags: ['Interactive Map', 'React', 'Geo Data'],
    projectUrl: 'https://mcd-pad.vercel.app/',
    blocks: [
      { type: 'image', src: '/images/olifantenpaadjes2.jpeg' },
      { type: 'grid', cols: 2, rows: 1, aspect: '9:16', items: [
        { type: 'image', src: '/images/olifantenpaadjes1.jpeg' },
        { type: 'image', src: '/images/olifantenpaadjes4.jpeg' }
      ] },
      { type: 'text', text: "From there I cross-referenced the shortcut data with every McDonald's location, which became this interactive map. We confirmed each spot on Google Maps' satellite view, then sent interns out to photograph them before the photographer went in last. https://mcd-pad.vercel.app/" },
      { type: 'image', src: '/images/olifantenpaadjes_map.webp' },
      { type: 'image', src: '/images/olifantenpaadjes3.jpeg' },
      { type: 'image', src: '/images/olifantenpaadjes5.jpeg' }
    ]
  },
  {
    title: "McDonald's Family Mode",
    client: "McDonald's Netherlands — TBWA\\NEBOKO",
    description: "I built the whole 3D world: characters, items, clothing, all packaged into a single .glb file. All animation done in Cinema 4D and Blender. Over half a million avatars were made.",
    tags: ['3D', 'AR', 'App Feature', 'Webby Winner 2024'],
    blocks: [
      { type: 'image', src: img('imgi_1_hero.webp') },
      { type: 'text', text: "Family Mode is an avatar builder and game platform inside the McDonald's app. My job was all the 3D: the world, the characters, the animations, and packing it into a format that ran on hundreds of thousands of phones. Everything had to be low-poly, and it was the first time I'd attempted anything like it, but we absolutely nailed it." },
      { type: 'image', src: img('imgi_2_family_mode2.webp') },
      { type: 'text', text: 'UX and UI were handled by the TBWA\\X team, so my role stayed strictly on the 3D.' },
      { type: 'grid', cols: 2, rows: 1, aspect: '1:1', items: [
        { type: 'video', src: '/cases/videos/AvatarCreator.mp4' },
        { type: 'image', src: img('imgi_5_room1.webp') }
      ] },
      { type: 'text', text: 'I mostly worked in Cinema 4D for the rendering and rigging, then exported the final .glb file and optimised it in Blender.' },
      { type: 'grid', cols: 2, rows: 2, aspect: '1:1', items: [
        { type: 'image', src: img('imgi_3_scene1.webp') },
        { type: 'image', src: img('imgi_4_family_mode3.webp') },
        { type: 'image', src: img('imgi_6_room2.webp') },
        { type: 'image', src: img('imgi_7_scene2.webp') }
      ] },
      { type: 'text', text: "We even turned the Happy Meal placemat into a boardgame, so you could play with your characters in the app. The app is still used and sold across other markets." },
      { type: 'image', src: img('familymode1.webp') }
    ]
  },
  {
    title: "McDonald's Delivery Detector",
    client: "McDonald's Netherlands — TBWA\\NEBOKO",
    description: "A limited-edition 3D-printed smoke alarm shaped like a Big Mac that auto-ordered McDonald's when it detected smoke. I designed the whole product as a printable device, from concept to production files. Covered by Adweek, Highsnobiety and B&T.",
    tags: ['3D Product Design', '3D Printing', 'Campaign', 'ADCN Nominated'],
    blocks: [
      { type: 'video', src: '/cases/videos/mcdeliverydetector.mp4' },
      { type: 'text', text: 'The product went viral, which was a blast.' },
      { type: 'image', src: img('mcdeliverydetector.avif') },
      { type: 'text', text: "Here's one of the printed smoke detectors. I designed the whole thing in Cinema 4D, including the locking system that holds each piece together, while the electronics inside were handled by Robot Kittens." },
      { type: 'grid', cols: 2, rows: 1, aspect: '1:1', items: [
        { type: 'image', src: img('burger1.webp') },
        { type: 'image', src: img('burger3.webp') }
      ] },
      { type: 'image', src: img('burger2.webp') }
    ]
  },
  {
    title: 'SS26 New Amsterdam Surf Association',
    client: 'New Amsterdam Surf Association — Sabatoka',
    description: "A mobile web app for Paris Fashion Week 2025. You upload a selfie and get dropped into a Palm Beach scene. I built the whole thing end to end: n8n backend with Replicate for AI, AWS for NSFW detection, React frontend, Cloudflare Workers and R2 storage, and a Hetzner server that scaled to 500 concurrent runs.",
    tags: ['AI', 'React', 'n8n', 'Fashion', 'Web App'],
    blocks: [
      { type: 'video', src: '/cases/videos/nasa_ss26.mp4' },
      { type: 'text', text: 'Below is the n8n flow that tied it all together.' },
      { type: 'image', src: img('nasa_n8n_flow.webp') },
      { type: 'text', text: "You take a selfie, and you're transported to Palm Beach." },
      { type: 'image', src: img('nasa2.webp') }
    ]
  },
  {
    title: 'Abdulla Al Ghurair Foundation',
    client: 'Abdulla Al Ghurair Foundation — We Are Anatomy / Sabatoka',
    description: "Built the software for an interactive touchscreen installation at an exhibition. Users picked options and the screen played AI-generated videos. The whole app ran locally with no internet. React frontend, custom offline video pipeline. UI/UX by Rex Amesbury.",
    tags: ['AI', 'React', 'Video Gen', 'Installation'],
    blocks: [
      { type: 'video', src: '/cases/videos/abdul_ui.mp4' },
      { type: 'grid', cols: 2, rows: 1, aspect: '9:16', items: [
        { type: 'video', src: '/cases/videos/abdul_ai.mp4' },
        { type: 'image', src: img('abdul_thumb.webp') }
      ] }
    ]
  },
  {
    title: 'New Care Supplements',
    client: 'New Care — Sabatoka',
    description: "Made social content and animations for New Care over several years. Built a 3D + AI pipeline: AI generation (nano-banana, seedream) composited with 3D product renders in Cinema 4D. Modelled the entire catalog, over 100 products, in 3D.",
    tags: ['3D', 'AI', 'Social', 'Animation', 'Content Pipeline'],
    blocks: [
      { type: 'grid', cols: 2, rows: 1, aspect: '1:1', items: [
        { type: 'video', src: '/cases/videos/newcare2.mp4' },
        { type: 'video', src: '/cases/videos/newcare3.mp4' }
      ] },
      { type: 'grid', cols: 3, rows: 1, aspect: '9:16', items: [
        { type: 'video', src: '/cases/videos/newcare1.mp4' },
        { type: 'video', src: '/cases/videos/newcare4.mp4' },
        { type: 'video', src: '/cases/videos/newcare5.mp4' }
      ] },
      { type: 'video', src: '/cases/videos/newcare6.mp4' },
      { type: 'grid', cols: 2, rows: 1, aspect: '1:1', items: [
        { type: 'video', src: '/cases/videos/newcare7.mp4' },
        { type: 'image', src: img('newcare1.webp') }
      ] },
      { type: 'image', src: img('newcare2.webp') },
      { type: 'image', src: img('newcare3.webp') }
    ]
  },
  {
    title: "McDonald's The Hidden Campaign",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "McDonald's hid easter eggs across games, Twitch streams and its app, including a custom Moonlander arcade game. I made all the 3D assets and animations in Cinema 4D: the spaceship, holograms, stair sequences and light animations.",
    tags: ['3D', 'Animation', 'Gaming', 'Webby Honoree 2025'],
    video: '/cases/videos/spaceship_horizontal.mp4',
    images: [img('imgi_4_image_ui.webp'), img('imgi_6_footer_bg.webp')]
  },
  {
    title: 'McNificents',
    client: "McDonald's — TBWA\\NEBOKO",
    description: "Created the 3D character models in Cinema 4D and rendered the visuals used on McDonald's placemats, printed nationwide.",
    tags: ['3D', 'Print', 'Character Design'],
    blocks: [
      { type: 'image', src: img('mcnificents0.webp') },
      { type: 'text', text: 'I made the 3D characters on the placemats, in the corners and on the back.' },
      { type: 'grid', cols: 2, rows: 2, aspect: '3:2', items: [
        { type: 'image', src: img('mcnificents1.webp') },
        { type: 'image', src: img('mcnificents2.webp') },
        { type: 'image', src: img('mcnificents3.webp') },
        { type: 'image', src: img('mcnificents4.webp') }
      ] },
      { type: 'image', src: img('mcnificents5.webp') },
      { type: 'grid', cols: 3, rows: 3, aspect: '9:16', items: [
        { type: 'image', src: img('mcnificents6.webp') },
        { type: 'image', src: img('mcnificents7.webp') },
        { type: 'image', src: img('mcnificents8.webp') },
        { type: 'image', src: img('mcnificents9.webp') },
        { type: 'image', src: img('mcnificents10.webp') }
      ] }
    ]
  },
  {
    title: 'TOTO Tactics',
    client: 'Koning TOTO — TBWA\\NEBOKO',
    description: "Animated the full banner set in Cinema 4D: cloth banners that roll out and wave in the wind, featuring Wesley Sneijder as Koning Toto.",
    tags: ['3D Animation', 'Banner', 'Sports'],
    video: '/cases/videos/koningtoto.mp4'
  },
  {
    title: 'Odido Brand Launch',
    client: 'Odido (formerly T-Mobile NL) — TBWA\\NEBOKO',
    description: "Oversaw the entire HTML5 banner development for the Odido (formerly T-Mobile) rebrand launch. Created the banner animations and guided the dev teams on final delivery across HPTO and IAB formats. The campaign won a Gold Dutch PR Award in 2024.",
    tags: ['Rebrand', 'Digital', 'Gold Dutch PR Award'],
    video: '/cases/videos/odidobanner.mp4'
  },
  {
    title: 'Schiphol World of Gifts',
    client: 'Schiphol Airport — TBWA\\NEBOKO',
    description: "Designed and rendered the 3D gift boxes in Cinema 4D. The visuals were used across Schiphol Airport's Christmas campaign for three consecutive years.",
    tags: ['3D', 'Installation', 'Holiday'],
    video: '/cases/videos/schipholkerst.mp4',
    images: [img('schiphol.webp'), img('schiphol2.webp')]
  },
  {
    title: 'Food Token Soup (NFT)',
    client: "Branca's Kitchen — Personal",
    description: "10,000 procedurally generated 3D soup cans from the 2021 NFT wave. Created the generative pipeline in Cinema 4D. This project kicked off my journey into coding and Python.",
    tags: ['NFT', '3D', 'Generative', 'Coding'],
    blocks: [
      { type: 'video', src: '/cases/videos/foodtokensoup.mp4' },
      { type: 'grid', cols: 2, rows: 2, aspect: '1:1', items: [
        { type: 'image', src: img('soup1.webp') },
        { type: 'image', src: img('soup2.webp') },
        { type: 'image', src: img('soup3.webp') },
        { type: 'image', src: img('soup4.webp') }
      ] },
      { type: 'grid', cols: 2, rows: 2, aspect: '1:1', items: [
        { type: 'image', src: img('soup5.webp') },
        { type: 'image', src: img('soup6.webp') },
        { type: 'image', src: img('soup7.webp') },
        { type: 'image', src: img('soup8.webp') }
      ] },
      { type: 'grid', cols: 2, rows: 2, aspect: '1:1', items: [
        { type: 'image', src: img('soup9.webp') },
        { type: 'image', src: img('soup10.webp') },
        { type: 'image', src: img('soup11.webp') },
        { type: 'image', src: img('soup12.webp') }
      ] },
      { type: 'grid', cols: 2, rows: 1, aspect: '1:1', items: [
        { type: 'image', src: img('soup13.webp') },
        { type: 'image', src: img('soup14.webp') }
      ] }
    ]
  },
  {
    title: 'TBWA\\X Custom Arcade',
    client: 'TBWA\\X',
    description: "Hand-built a full arcade cabinet for the TBWA\\X office. MDF frame, lasercut panels, hand-painted finish. All wiring and electronics. Runs RetroPie on a Raspberry Pi 4. Also created the intro video in Cinema 4D.",
    tags: ['Hardware', 'Craftsmanship', 'Design'],
    blocks: [
      { type: 'grid', cols: 3, rows: 3, aspect: '9:16', items: [
        { type: 'image', src: img('arcade3.webp') },
        { type: 'image', src: img('arcade4.webp') },
        { type: 'image', src: img('arcade5.webp') },
        { type: 'image', src: img('arcade6.webp') },
        { type: 'image', src: img('arcade7.webp') },
        { type: 'image', src: img('arcade8.webp') }
      ] },
      { type: 'text', text: 'I first drafted the design in SketchUp. The cabinet follows the same slant as the TBWA backslash logo, and it runs on a Raspberry Pi 4B.' },
      { type: 'image', src: img('arcade1.webp') },
      { type: 'image', src: img('arcade2.webp') }
    ]
  }
])

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

.entry-client {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: var(--ink-faint);
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

.overlay-client {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: var(--ink-faint);
  margin: 0;
}

.overlay-desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
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
  font-size: 0.5rem;
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
  font-size: var(--text-sm);
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
  .header-link { font-size: 10px; letter-spacing: 1px; }
  .cv-body { height: calc(100vh - 45px); }
  .entry-tags { display: none; }
  .entry-bar { padding: 16px 18px; gap: var(--space-sm); }
  .entry-title { font-size: var(--text-sm); }
  .entry-client { font-size: var(--text-xs); }
  .entry-images.dark-bg .entry-img { padding: 12px; }
}
</style>
