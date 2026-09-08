export interface PaletteColor {
  name: string
  hex: string
}

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
        primary: { name: 'Primary', hex: '#008080' },
        secondary: { name: 'Secondary', hex: '#d40055' },
        tertiary: { name: 'Tertiary', hex: '#cc7a00' },
        neutral: { name: 'Neutral', hex: '#f2f2f2' }
      },
      fonts: { headline: 'Oswald', body: 'Hanken Grotesk', label: 'JetBrains Mono' }
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
        secondary: { name: 'Secondary', hex: '#7a7a7a' },
        tertiary: { name: 'Tertiary', hex: '#c9a227' },
        neutral: { name: 'Neutral', hex: '#f2f2f2' }
      },
      fonts: { headline: 'Space Grotesk', body: 'Inter', label: 'JetBrains Mono' }
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
        primary: { name: 'Primary', hex: '#2563eb' },
        secondary: { name: 'Secondary', hex: '#0a0a0a' },
        tertiary: { name: 'Tertiary', hex: '#7c3aed' },
        neutral: { name: 'Neutral', hex: '#f4f2ee' }
      },
      fonts: { headline: 'Inter', body: 'Inter', label: 'JetBrains Mono' }
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
        primary: { name: 'Primary', hex: '#16a34a' },
        secondary: { name: 'Secondary', hex: '#0b0f0c' },
        tertiary: { name: 'Tertiary', hex: '#2563eb' },
        neutral: { name: 'Neutral', hex: '#f5f7f4' }
      },
      fonts: { headline: 'Manrope', body: 'Inter', label: 'JetBrains Mono' }
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
        primary: { name: 'Primary', hex: '#ff4500' },
        secondary: { name: 'Secondary', hex: '#0d0d0d' },
        tertiary: { name: 'Tertiary', hex: '#0079d3' },
        neutral: { name: 'Neutral', hex: '#ffffff' }
      },
      fonts: { headline: 'Inter', body: 'Inter', label: 'JetBrains Mono' }
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
        primary: { name: 'Primary', hex: '#e0522d' },
        secondary: { name: 'Secondary', hex: '#0a0a0a' },
        tertiary: { name: 'Tertiary', hex: '#cc7a00' },
        neutral: { name: 'Neutral', hex: '#faf9f6' }
      },
      fonts: { headline: 'Inter', body: 'Inter', label: 'JetBrains Mono' }
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
        primary: { name: 'Primary', hex: '#e0522d' },
        secondary: { name: 'Secondary', hex: '#0a0a0a' },
        tertiary: { name: 'Tertiary', hex: '#2563eb' },
        neutral: { name: 'Neutral', hex: '#ffffff' }
      },
      fonts: { headline: 'Space Grotesk', body: 'Inter', label: 'JetBrains Mono' }
    }
  }
]
