const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL || ''
function imgUrl(path: string): string {
  return CDN_BASE ? `${CDN_BASE}/${path}` : `/assets/${path}`
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
    imagePath: imgUrl('images/00-hero/HERO.png'),
  },
  {
    id: 1,
    slug: 'entrance',
    room: 'The Threshold',
    eyebrow: '01 — Entrance',
    headline: 'The Threshold',
    subtitle: 'Where the world dissolves',
    details: 'Monumental pivot door · Travertine stone · Natural filtered light',
    imagePath: imgUrl('images/01-entrance/ENTRANCE.png'),
  },
  {
    id: 2,
    slug: 'lobby',
    room: 'Open Sky',
    eyebrow: '02 — Lobby',
    headline: 'Open Sky',
    subtitle: 'Twelve metres of glass',
    details: '12m floor-to-ceiling glass · Double height ceiling · Polished concrete floors',
    imagePath: imgUrl('images/02-LOBBY/LOBBY.png'),
  },
  {
    id: 3,
    slug: 'living',
    room: 'Living Space',
    eyebrow: '03 — Living Room',
    headline: 'Living Space',
    subtitle: 'The ocean as wallpaper',
    details: 'Open plan · Bespoke Italian furnishings · Full ocean panorama · Integrated sound',
    imagePath: imgUrl('images/03-living-room/LIVING%20ROOM.png'),
  },
  {
    id: 4,
    slug: 'corridor',
    room: 'Between Moments',
    eyebrow: '04 — Corridor',
    headline: 'Between Moments',
    subtitle: '',
    details: 'Hand-laid limestone · Indirect lighting · Ocean views at every turn',
    imagePath: imgUrl('images/04-corridor/CORRIDOR.png'),
  },
  {
    id: 5,
    slug: 'suite',
    room: 'The Suite',
    eyebrow: '05 — Suite',
    headline: 'The Suite',
    subtitle: 'Sleep above the horizon',
    details: '210 m² · King size bed · Handwoven silk linens · Private ocean terrace',
    imagePath: imgUrl('images/05-suite/SUITE.png'),
  },
  {
    id: 6,
    slug: 'bathroom',
    room: 'Water Ritual',
    eyebrow: '06 — Bathroom',
    headline: 'Water Ritual',
    subtitle: 'Marble from a single mountain',
    details: 'Freestanding stone bathtub · Single-mountain marble · Sky-open shower',
    imagePath: imgUrl('images/06-bathroom/BATHROOM.png'),
  },
  {
    id: 7,
    slug: 'terrace',
    room: 'Edge of the World',
    eyebrow: '07 — Terrace',
    headline: 'Edge of the World',
    subtitle: 'Breakfast at dawn',
    details: 'Seamless cliff edge · Breakfast at dawn · Cocktails at dusk · 180° ocean view',
    imagePath: imgUrl('images/07-terrace/TERRACE.png'),
  },
  {
    id: 8,
    slug: 'pool',
    room: 'Liquid Horizon',
    eyebrow: '08 — Pool',
    headline: 'Liquid Horizon',
    subtitle: 'Twenty-two metres of infinity',
    details: '22m heated infinity pool · Submerged sunbeds · Poolside dining service',
    imagePath: imgUrl('images/08-pool/POOL.png'),
  },
  {
    id: 9,
    slug: 'events',
    room: 'Celebrate Here',
    eyebrow: '09 — Events',
    headline: 'Celebrate Here',
    subtitle: 'Gatherings around the light',
    details: 'Up to 20 guests · 3 indoor spaces · Catering available · Ocean pavilion',
    imagePath: imgUrl('images/09-events/EVENTS.png'),
  },
  {
    id: 10,
    slug: 'sunset',
    room: 'Reserve',
    eyebrow: '10 — Reserve',
    headline: 'Reserve Villa Aura',
    subtitle: 'hello@villaaura.com',
    details: 'hello@villaaura.com · +34 900 000 000 · Request availability',
    imagePath: imgUrl('images/10-sunset/SUNSET.png'),
  },
]
