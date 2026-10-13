import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/sandbox',
      name: 'sandbox',
      component: () => import('./pages/SandboxPage.vue')
    },
    {
      path: '/cases',
      name: 'cases',
      component: () => import('./pages/CasesV2Page.vue')
    },
    {
      path: '/websites',
      name: 'websites',
      component: () => import('./pages/WebsitesPage.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./pages/AboutPage.vue')
    },
    {
      path: '/cases-v2',
      name: 'cases-v2',
      component: () => import('./pages/CasesV2Page.vue')
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('./pages/BuilderPage.vue')
    }
  ]
})

router.afterEach((to) => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  applyMeta(to.path)
})

const BASE_URL = 'https://floridomeacci.xyz'

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Florido Jan Meacci — Creative Technologist Portfolio',
    description: 'Portfolio of Florido Jan Meacci, Creative Technologist at TBWA\\NEBOKO. AI-driven campaigns, interactive installations, 3D and digital products.'
  },
  '/cases': {
    title: 'Cases — Florido Jan Meacci',
    description: 'Selected work by Florido Jan Meacci: AI campaigns, 3D, interactive installations and digital products.'
  },
  '/websites': {
    title: 'Websites — Florido Jan Meacci',
    description: 'Independent websites and tools built by Florido Jan Meacci.'
  },
  '/sandbox': {
    title: 'N8N Sandbox — Florido Jan Meacci',
    description: 'An interactive N8N-style workflow playground.'
  },
  '/about': {
    title: 'About — Florido Jan Meacci',
    description: 'About Florido Jan Meacci, Creative Technologist at TBWA\\NEBOKO.'
  }
}

const NOINDEX_PATHS = ['/cases-v2', '/builder']

function applyMeta(path: string) {
  const meta = PAGE_META[path] || PAGE_META['/']

  document.title = meta.title

  let desc = document.querySelector('meta[name="description"]')
  if (!desc) {
    desc = document.createElement('meta')
    desc.setAttribute('name', 'description')
    document.head.appendChild(desc)
  }
  desc.setAttribute('content', meta.description)

  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', BASE_URL + (path === '/' ? '/' : path))

  let robots = document.querySelector('meta[name="robots"]')
  if (NOINDEX_PATHS.includes(path)) {
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex, nofollow')
  } else if (robots) {
    robots.remove()
  }
}

export default router
