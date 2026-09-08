<template>
  <header class="site-nav" :class="{ 'site-nav--overlay': overlay }">
    <router-link to="/" class="nav-link" :class="{ active: activeKey === '/' }">Home</router-link>
    <span class="nav-sep">/</span>
    <router-link to="/websites" class="nav-link" :class="{ active: activeKey === '/websites' }">Websites</router-link>
    <span class="nav-sep">/</span>
    <router-link to="/cases" class="nav-link" :class="{ active: activeKey === '/cases' }">Cases</router-link>
    <span class="nav-sep">/</span>
    <router-link to="/sandbox" class="nav-link" :class="{ active: activeKey === '/sandbox' }">N8N Sandbox</router-link>
    <span class="nav-sep">/</span>
    <router-link to="/about" class="nav-link" :class="{ active: activeKey === '/about' }">About</router-link>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{ overlay?: boolean }>()

const route = useRoute()

const activeKey = computed(() => {
  const p = route.path
  if (p === '/') return '/'
  if (p.startsWith('/cases')) return '/cases'
  if (p.startsWith('/websites')) return '/websites'
  if (p.startsWith('/sandbox')) return '/sandbox'
  if (p.startsWith('/about')) return '/about'
  return ''
})
</script>

<style scoped>
.site-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.site-nav--overlay {
  position: static;
  flex-shrink: 0;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.nav-link {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--ink);
  text-decoration: none;
  opacity: 0.5;
  transition: opacity var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.nav-link:hover { opacity: 1; }

.nav-link.active {
  opacity: 1;
  font-weight: 600;
}

.nav-sep {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  color: var(--ink-faint);
  opacity: 0.5;
}

@media (max-width: 640px) {
  .site-nav {
    padding: 12px 18px;
    gap: 6px;
  }
  .nav-link {
    font-size: 12px;
    letter-spacing: 1px;
  }
}
</style>
