export interface MediaItem {
  type: 'video' | 'image'
  src?: string
}

export interface MediaBlock {
  type: 'video' | 'image' | 'text' | 'grid'
  src?: string
  text?: string
  cols?: number
  rows?: number
  aspect?: string
  items?: MediaItem[]
}

export interface CaseItem {
  title: string
  client: string
  description: string
  tags: string[]
  video?: string
  videos?: string[]
  youtube?: string
  images?: string[]
  darkBg?: boolean
  projectUrl?: string
  blocks?: MediaBlock[]
}

const img = (name: string) => '/cases/images/' + name

export const posterFor = (v: string) => v.replace('/cases/videos/', '/cases/videos/posters/').replace('.mp4', '.webp')

export const orderedMedia = (c: CaseItem): MediaBlock[] => {
  if (c.blocks && c.blocks.length) return c.blocks
  const list: MediaBlock[] = []
  if (c.video) list.push({ type: 'video', src: c.video })
  if (c.videos) c.videos.forEach(v => list.push({ type: 'video', src: v }))
  if (c.images) c.images.forEach(i => list.push({ type: 'image', src: i }))
  return list
}

export const cases: CaseItem[] = [
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
]
