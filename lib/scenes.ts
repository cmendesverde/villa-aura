// Poster images served from jsDelivr (public GitHub repo, WebP).
const CDN_IMAGES = 'https://cdn.jsdelivr.net/gh/cmendesverde/villa-aura-images@main'
function imgUrl(path: string): string {
  return `${CDN_IMAGES}/${path}`
}

export interface Scene {
  id: number
  slug: string
  room: string
  eyebrow: string
  headline: string
  subtitle: string
  details: string
  imagePath: string
}

export const scenes: Scene[] = [
  {
    id: 0,
    slug: 'hero',
    room: 'Villa Aura',
    eyebrow: '',
    headline: 'Villa Aura',
    subtitle: 'Above the ocean',
    details: 'Exclusive private villa · Mediterranean cliffside · Available for stays & events',
    imagePath: imgUrl('00-hero/HERO.webp'),
  },
  {
    id: 1,
    slug: 'entrance',
    room: 'The Threshold',
    eyebrow: '01 — Entrance',
    headline: 'The Threshold',
    subtitle: 'Where the world dissolves',
    details: 'Monumental pivot door · Travertine stone · Natural filtered light',
    imagePath: imgUrl('01-entrance/ENTRANCE.webp'),
  },
  {
    id: 2,
    slug: 'lobby',
    room: 'Open Sky',
    eyebrow: '02 — Lobby',
    headline: 'Open Sky',
    subtitle: 'Twelve metres of glass',
    details: '12m floor-to-ceiling glass · Double height ceiling · Polished concrete floors',
    imagePath: imgUrl('02-LOBBY/LOBBY.webp'),
  },
  {
    id: 3,
    slug: 'living',
    room: 'Living Space',
    eyebrow: '03 — Living Room',
    headline: 'Living Space',
    subtitle: 'The ocean as wallpaper',
    details: 'Open plan · Bespoke Italian furnishings · Full ocean panorama · Integrated sound',
    imagePath: imgUrl('03-living-room/LIVING%20ROOM.webp'),
  },
  {
    id: 4,
    slug: 'corridor',
    room: 'Between Moments',
    eyebrow: '04 — Corridor',
    headline: 'Between Moments',
    subtitle: '',
    details: 'Hand-laid limestone · Indirect lighting · Ocean views at every turn',
    imagePath: imgUrl('04-corridor/CORRIDOR.webp'),
  },
  {
    id: 5,
    slug: 'suite',
    room: 'The Suite',
    eyebrow: '05 — Suite',
    headline: 'The Suite',
    subtitle: 'Sleep above the horizon',
    details: '210 m² · King size bed · Handwoven silk linens · Private ocean terrace',
    imagePath: imgUrl('05-suite/SUITE.webp'),
  },
  {
    id: 6,
    slug: 'bathroom',
    room: 'Water Ritual',
    eyebrow: '06 — Bathroom',
    headline: 'Water Ritual',
    subtitle: 'Marble from a single mountain',
    details: 'Freestanding stone bathtub · Single-mountain marble · Sky-open shower',
    imagePath: imgUrl('06-bathroom/BATHROOM.webp'),
  },
  {
    id: 7,
    slug: 'terrace',
    room: 'Edge of the World',
    eyebrow: '07 — Terrace',
    headline: 'Edge of the World',
    subtitle: 'Breakfast at dawn',
    details: 'Seamless cliff edge · Breakfast at dawn · Cocktails at dusk · 180° ocean view',
    imagePath: imgUrl('07-terrace/TERRACE.webp'),
  },
  {
    id: 8,
    slug: 'pool',
    room: 'Liquid Horizon',
    eyebrow: '08 — Pool',
    headline: 'Liquid Horizon',
    subtitle: 'Twenty-two metres of infinity',
    details: '22m heated infinity pool · Submerged sunbeds · Poolside dining service',
    imagePath: imgUrl('08-pool/POOL.webp'),
  },
  {
    id: 9,
    slug: 'events',
    room: 'Celebrate Here',
    eyebrow: '09 — Events',
    headline: 'Celebrate Here',
    subtitle: 'Gatherings around the light',
    details: 'Up to 20 guests · 3 indoor spaces · Catering available · Ocean pavilion',
    imagePath: imgUrl('09-events/EVENTS.webp'),
  },
  {
    id: 10,
    slug: 'sunset',
    room: 'Reserve',
    eyebrow: '10 — Reserve',
    headline: 'Reserve Villa Aura',
    subtitle: 'hello@villaaura.com',
    details: 'hello@villaaura.com · +34 900 000 000 · Request availability',
    imagePath: imgUrl('10-sunset/SUNSET.webp'),
  },
]
