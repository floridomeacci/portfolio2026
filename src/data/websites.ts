export interface PaletteColor {
  name: string
  hex: string
}

export type CustomKind = 'search' | 'slider' | 'input' | 'swap' | 'swatches'

export interface SiteSpec {
  palette: {
    primary: PaletteColor
    secondary: PaletteColor
    tertiary: PaletteColor
    neutral: PaletteColor
  }
  fonts: {
    headline: string
    body: string
    label: string
  }
  custom: {
    kind: CustomKind
    placeholder?: string
    label?: string
  }
}

export interface Site {
  url: string
  label: string
  desc: string
  github?: string
  tags: string[]
  noEmbed?: boolean
  thumb?: string
  spec: SiteSpec
}

export const websites: Site[] = [
  {
    url: 'https://tlguide.com',
    label: 'tlguide.com',
    desc: 'I made a review site for Figma plugins and widgets. The reviews and outreach are mostly automated with AI.',
    github: 'https://github.com/floridomeacci/TLguide',
    tags: ['Reviews', 'AI Pipeline', 'Full-stack'],
    spec: {
      palette: {
        primary: { name: 'Primary', hex: '#09090b' },
        secondary: { name: 'Secondary', hex: '#7c3aed' },
        tertiary: { name: 'Tertiary', hex: '#22c55e' },
        neutral: { name: 'Neutral', hex: '#f4f4f5' }
      },
      fonts: { headline: 'Space Grotesk', body: 'Inter', label: 'JetBrains Mono' },
      custom: { kind: 'search', placeholder: 'Search plugins…' }
    }
  },
  {
    url: 'https://www.figma.com/community/plugin/1626934504810261537',
    label: 'Filters & Grain',
    desc: 'A Figma plugin for color grading, film grain and vignette. No Photoshop needed.',
    tags: ['Figma Plugin', 'Design Tool'],
    noEmbed: true,
    thumb: 'figma.webp',
    spec: {
      palette: {
        primary: { name: 'Primary', hex: '#111111' },
        secondary: { name: 'Secondary', hex: '#c9a227' },
        tertiary: { name: 'Tertiary', hex: '#7a7a7a' },
        neutral: { name: 'Neutral', hex: '#f2f2f2' }
      },
      fonts: { headline: 'Space Grotesk', body: 'Inter', label: 'JetBrains Mono' },
      custom: { kind: 'slider', label: 'Grain intensity' }
    }
  },
  {
    url: 'https://www.latentsearch.net/',
    label: 'latentsearch.net',
    desc: 'Every search result is AI-generated. It looks normal, but the content is fake.',
    github: 'https://github.com/floridomeacci/latentSearch',
    tags: ['AI', 'Search', 'Generative'],
    spec: {
      palette: {
        primary: { name: 'Primary', hex: '#1967d2' },
        secondary: { name: 'Secondary', hex: '#1a1a1a' },
        tertiary: { name: 'Tertiary', hex: '#8ab4f8' },
        neutral: { name: 'Neutral', hex: '#e8eaed' }
      },
      fonts: { headline: 'Sora', body: 'Plus Jakarta Sans', label: 'JetBrains Mono' },
      custom: { kind: 'search', placeholder: 'Search the latent web' }
    }
  },
  {
    url: 'https://creditswap.app',
    label: 'creditswap.app',
    desc: 'A private marketplace for reselling AI API credits. Buyers pay less, sellers monetize unused capacity.',
    github: 'https://github.com/floridomeacci/creditSwapV2',
    tags: ['Marketplace', 'AI', 'Fintech'],
    spec: {
      palette: {
        primary: { name: 'Primary', hex: '#111827' },
        secondary: { name: 'Secondary', hex: '#16a34a' },
        tertiary: { name: 'Tertiary', hex: '#2563eb' },
        neutral: { name: 'Neutral', hex: '#ffffff' }
      },
      fonts: { headline: 'Manrope', body: 'Inter', label: 'JetBrains Mono' },
      custom: { kind: 'swap', placeholder: 'Amount' }
    }
  },
  {
    url: 'https://reddituser.info',
    label: 'reddituser.info',
    desc: 'Paste a Reddit username, get an AI-generated report with graphs. Activity, interests, posting habits.',
    github: 'https://github.com/floridomeacci/redditUserInfo',
    tags: ['AI', 'Analytics', 'React'],
    noEmbed: true,
    thumb: 'reddituserinfo.webp',
    spec: {
      palette: {
        primary: { name: 'Primary', hex: '#ff6b6b' },
        secondary: { name: 'Secondary', hex: '#4ade80' },
        tertiary: { name: 'Tertiary', hex: '#1a1a1a' },
        neutral: { name: 'Neutral', hex: '#ffffff' }
      },
      fonts: { headline: 'Space Grotesk', body: 'Space Grotesk', label: 'JetBrains Mono' },
      custom: { kind: 'input', placeholder: 'u/username' }
    }
  },
  {
    url: 'https://colino.work',
    label: 'colino.work',
    desc: 'A job search that filters live openings down to the roles that actually match your CV. Upload your resume and it ranks the jobs that fit.',
    github: 'https://github.com/floridomeacci/colino',
    tags: ['AI', 'Jobs', 'WebMCP'],
    spec: {
      palette: {
        primary: { name: 'Primary', hex: '#b45309' },
        secondary: { name: 'Secondary', hex: '#1c1917' },
        tertiary: { name: 'Tertiary', hex: '#78716c' },
        neutral: { name: 'Neutral', hex: '#fafaf9' }
      },
      fonts: { headline: 'DM Serif Display', body: 'DM Sans', label: 'DM Sans' },
      custom: { kind: 'search', placeholder: 'Search jobs…' }
    }
  },
  {
    url: 'https://mlnpx.com',
    label: 'million.pixels',
    desc: 'A one-million-pixel canvas painted by AI agents and the people who direct them. A live demo of WebMCP.',
    github: 'https://github.com/floridomeacci/mlnpx.webmcp',
    tags: ['AI Agents', 'WebMCP', 'Canvas'],
    noEmbed: true,
    thumb: 'millionpixels.webp',
    spec: {
      palette: {
        primary: { name: 'Primary', hex: '#f97316' },
        secondary: { name: 'Secondary', hex: '#22d3ee' },
        tertiary: { name: 'Tertiary', hex: '#08080c' },
        neutral: { name: 'Neutral', hex: '#ececf4' }
      },
      fonts: { headline: 'Sora', body: 'Plus Jakarta Sans', label: 'JetBrains Mono' },
      custom: { kind: 'swatches', label: 'Paint' }
    }
  }
]
