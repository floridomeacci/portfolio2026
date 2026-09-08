export interface SiteSpec {
  fonts: { family: string; note: string; sample: string }[]
  colors: { hex: string; name: string }[]
  buttons: { label: string; kind: 'primary' | 'outline' | 'ghost' }[]
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
      fonts: [
        { family: 'Inter', note: 'UI / body', sample: 'Aa Bb Cc 0123456789' },
        { family: 'JetBrains Mono', note: 'Code / data', sample: 'Aa Bb Cc 0123456789' }
      ],
      colors: [
        { hex: '#0f0f0f', name: 'Ink' },
        { hex: '#f7f5f2', name: 'Paper' },
        { hex: '#e0522d', name: 'Accent' }
      ],
      buttons: [
        { label: 'Primary', kind: 'primary' },
        { label: 'Outline', kind: 'outline' }
      ]
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
      fonts: [
        { family: 'Inter', note: 'UI', sample: 'Aa Bb Cc 0123456789' }
      ],
      colors: [
        { hex: '#111111', name: 'Ink' },
        { hex: '#ffffff', name: 'White' },
        { hex: '#7a7a7a', name: 'Grain' }
      ],
      buttons: [
        { label: 'Primary', kind: 'primary' },
        { label: 'Ghost', kind: 'ghost' }
      ]
    }
  },
  {
    url: 'https://www.latentsearch.net/',
    label: 'latentsearch.net',
    desc: 'Every search result is AI-generated. It looks normal, but the content is fake.',
    github: 'https://github.com/floridomeacci/latentSearch',
    tags: ['AI', 'Search', 'Generative'],
    spec: {
      fonts: [
        { family: 'Inter', note: 'UI / body', sample: 'Aa Bb Cc 0123456789' },
        { family: 'Space Grotesk', note: 'Display', sample: 'Aa Bb Cc 0123456789' }
      ],
      colors: [
        { hex: '#0a0a0a', name: 'Ink' },
        { hex: '#f4f2ee', name: 'Paper' },
        { hex: '#2563eb', name: 'Accent' }
      ],
      buttons: [
        { label: 'Search', kind: 'primary' },
        { label: 'Outline', kind: 'outline' }
      ]
    }
  },
  {
    url: 'https://creditswap.app',
    label: 'creditswap.app',
    desc: 'A private marketplace for reselling AI API credits. Buyers pay less, sellers monetize unused capacity.',
    github: 'https://github.com/floridomeacci/creditSwapV2',
    tags: ['Marketplace', 'AI', 'Fintech'],
    spec: {
      fonts: [
        { family: 'Inter', note: 'UI / body', sample: 'Aa Bb Cc 0123456789' },
        { family: 'Manrope', note: 'Display', sample: 'Aa Bb Cc 0123456789' }
      ],
      colors: [
        { hex: '#0b0f0c', name: 'Ink' },
        { hex: '#f5f7f4', name: 'Paper' },
        { hex: '#16a34a', name: 'Accent' }
      ],
      buttons: [
        { label: 'Buy', kind: 'primary' },
        { label: 'Sell', kind: 'outline' }
      ]
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
      fonts: [
        { family: 'Inter', note: 'UI / body', sample: 'Aa Bb Cc 0123456789' },
        { family: 'JetBrains Mono', note: 'Data', sample: 'Aa Bb Cc 0123456789' }
      ],
      colors: [
        { hex: '#0d0d0d', name: 'Ink' },
        { hex: '#ffffff', name: 'White' },
        { hex: '#ff4500', name: 'Reddit Orange' }
      ],
      buttons: [
        { label: 'Analyse', kind: 'primary' },
        { label: 'Outline', kind: 'outline' }
      ]
    }
  },
  {
    url: 'https://colino.work',
    label: 'colino.work',
    desc: 'A job search that filters live openings down to the roles that actually match your CV. Upload your resume and it ranks the jobs that fit.',
    github: 'https://github.com/floridomeacci/colino',
    tags: ['AI', 'Jobs', 'WebMCP'],
    spec: {
      fonts: [
        { family: 'Inter', note: 'UI / body', sample: 'Aa Bb Cc 0123456789' }
      ],
      colors: [
        { hex: '#0a0a0a', name: 'Ink' },
        { hex: '#faf9f6', name: 'Paper' },
        { hex: '#e0522d', name: 'Accent' }
      ],
      buttons: [
        { label: 'Get matches', kind: 'primary' },
        { label: 'Outline', kind: 'outline' }
      ]
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
      fonts: [
        { family: 'Space Grotesk', note: 'Display', sample: 'Aa Bb Cc 0123456789' },
        { family: 'JetBrains Mono', note: 'Mono', sample: 'Aa Bb Cc 0123456789' }
      ],
      colors: [
        { hex: '#0a0a0a', name: 'Ink' },
        { hex: '#ffffff', name: 'White' },
        { hex: '#e0522d', name: 'Accent' }
      ],
      buttons: [
        { label: 'Paint', kind: 'primary' },
        { label: 'Ghost', kind: 'ghost' }
      ]
    }
  }
]
