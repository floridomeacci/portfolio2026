<template>
  <div class="cv-page">
    <SiteNav />

    <main class="cv-body">
      <div class="builder-head">
        <h1 class="builder-title">Case Builder</h1>
        <p class="builder-sub">Add images to a case, then copy the export and send it with the files.</p>
        <div class="builder-actions">
          <button class="btn btn--primary" @click="copyExport">Copy export</button>
          <button class="btn" @click="clearAll">Reset</button>
        </div>
      </div>

      <div v-for="c in cases" :key="c.title" class="builder-case">
        <h2 class="case-title">{{ c.title }}</h2>
        <div class="thumbs">
          <div v-for="(b, i) in mediaOf(c)" :key="'m' + i" class="thumb">
            <img v-if="b.type === 'image'" :src="b.src" :alt="c.title" loading="lazy" />
            <img v-else-if="b.type === 'video'" :src="posterFor(b.src || '')" :alt="c.title" loading="lazy" />
            <div v-else class="thumb-text">{{ (b.text || '').slice(0, 80) }}</div>
          </div>
          <div v-for="(n, i) in added(c.title)" :key="'n' + i" class="thumb thumb--new">
            <img :src="n.dataUrl" :alt="n.name" />
            <span class="new-badge">NEW</span>
          </div>
        </div>
        <button class="btn btn--add" @click="addImages(c.title)">+ add images</button>
      </div>
    </main>

    <input type="file" multiple accept="image/*" hidden ref="fileInput" @change="onFiles" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SiteNav from '../components/SiteNav.vue'
import { cases, orderedMedia, posterFor, type CaseItem } from '../data/cases'

type AddedImg = { name: string; dataUrl: string }

const fileInput = ref<HTMLInputElement | null>(null)
const pendingCase = ref('')
const additions = ref<Record<string, AddedImg[]>>({})

const mediaOf = (c: CaseItem) => orderedMedia(c).filter(b => b.type === 'image' || b.type === 'video' || b.type === 'text')

const added = (title: string) => additions.value[title] || []

const addImages = (title: string) => {
  pendingCase.value = title
  fileInput.value?.click()
}

const onFiles = () => {
  const files = Array.from(fileInput.value?.files || [])
  if (!files.length || !pendingCase.value) return
  files.forEach(f => {
    const reader = new FileReader()
    reader.onload = e => {
      const list = additions.value[pendingCase.value] || []
      list.push({ name: f.name, dataUrl: e.target?.result as string })
      additions.value = { ...additions.value, [pendingCase.value]: list }
    }
    reader.readAsDataURL(f)
  })
  if (fileInput.value) fileInput.value.value = ''
}

const clearAll = () => { additions.value = {} }

const buildExport = () => {
  const lines: string[] = []
  for (const c of cases) {
    const adds = additions.value[c.title]
    if (!adds || !adds.length) continue
    lines.push(`## ${c.title}`)
    adds.forEach(a => lines.push(`  [NEW IMAGE] ${a.name}`))
    lines.push('')
  }
  return lines.length ? lines.join('\n') : 'No new images added yet.'
}

const copyExport = async () => {
  const text = buildExport()
  try {
    await navigator.clipboard.writeText(text)
    alert('Copied!')
  } catch {
    alert(text)
  }
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

.builder-head {
  margin-bottom: 40px;
}

.builder-title {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: 600;
  margin: 0 0 8px;
}

.builder-sub {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--ink-muted);
  margin: 0 0 16px;
}

.builder-actions {
  display: flex;
  gap: var(--space-sm);
}

.btn {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid var(--border-s);
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}
.btn:hover { opacity: 0.8; }
.btn--primary {
  background: var(--ink);
  color: var(--bg);
  border-color: var(--ink);
}

.builder-case {
  border-top: 1px solid var(--border);
  padding: 24px 0;
}

.case-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 600;
  margin: 0 0 12px;
}

.thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.thumb {
  position: relative;
  width: 120px;
  height: 90px;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  background: var(--bg-sub);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb--new {
  border-color: var(--accent);
}

.new-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  font-family: var(--font-mono);
  font-size: 9px;
  padding: 2px 5px;
  border-radius: 3px;
  background: var(--accent);
  color: #fff;
}

.thumb-text {
  padding: 8px;
  font-size: 11px;
  color: var(--ink-muted);
  line-height: 1.4;
  overflow: hidden;
}

.btn--add {
  font-size: var(--text-xs);
  padding: 8px 12px;
}
</style>
