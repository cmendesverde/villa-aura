'use client'
import { useEffect, useRef, useCallback, MutableRefObject } from 'react'

// Hero poster served from jsDelivr (same repo as the other poster images).
const CDN_IMAGES = 'https://cdn.jsdelivr.net/gh/cmendesverde/villa-aura-images@main'
const HERO_IMAGE = `${CDN_IMAGES}/00-hero/HERO.webp`

// Frames served from jsDelivr (public GitHub repos, split in two to stay
// under GitHub free hosting). Scenes 00–05 → repo A, 06–10 → repo B.
const CDN_FRAMES_A = 'https://cdn.jsdelivr.net/gh/cmendesverde/villa-aura-frames-a@main'
const CDN_FRAMES_B = 'https://cdn.jsdelivr.net/gh/cmendesverde/villa-aura-frames-b@main'

const SCENES = [
  { folder: '00-hero',       count: 61, base: CDN_FRAMES_A },
  { folder: '01-entrance',   count: 61, base: CDN_FRAMES_A },
  { folder: '02-lobby',      count: 61, base: CDN_FRAMES_A },
  { folder: '03-living-room',count: 61, base: CDN_FRAMES_A },
  { folder: '04-corridor',   count: 61, base: CDN_FRAMES_A },
  { folder: '05-suite',      count: 61, base: CDN_FRAMES_A },
  { folder: '06-bathroom',   count: 61, base: CDN_FRAMES_B },
  { folder: '07-terrace',    count: 61, base: CDN_FRAMES_B },
  { folder: '08-pool',       count: 61, base: CDN_FRAMES_B },
  { folder: '09-events',     count: 61, base: CDN_FRAMES_B },
  { folder: '10-sunset',     count: 61, base: CDN_FRAMES_B },
]

function buildFramePaths(): string[] {
  const paths: string[] = []
  for (const scene of SCENES) {
    for (let i = 1; i <= scene.count; i++) {
      paths.push(
        `${scene.base}/${scene.folder}/frame_${String(i).padStart(4, '0')}.webp`
      )
    }
  }
  return paths
}

interface FramePlayerProps {
  scrollProgress: MutableRefObject<number>
  onProgress: (loaded: number, total: number) => void
  onReady: () => void
}

export default function FramePlayer({
  scrollProgress,
  onProgress,
  onReady,
}: FramePlayerProps) {
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const framesRef      = useRef<HTMLImageElement[]>([])
  const loadedRef      = useRef(0)
  const isReadyRef     = useRef(false)
  const lastIdxRef     = useRef(-1)
  const rafRef         = useRef(0)

  // Stable refs — let the one-time loading useEffect always call
  // the latest versions of these without being a dep
  const onProgressRef = useRef(onProgress)
  const onReadyRef    = useRef(onReady)
  useEffect(() => { onProgressRef.current = onProgress })
  useEffect(() => { onReadyRef.current    = onReady    })

  // Cover-fit draw: image always fills the entire canvas
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const frame = framesRef.current[idx]
    if (!frame?.complete || !frame.naturalWidth) return

    const { width, height } = canvas
    const scale = Math.max(width / frame.naturalWidth, height / frame.naturalHeight)
    const x = (width  - frame.naturalWidth  * scale) / 2
    const y = (height - frame.naturalHeight * scale) / 2
    ctx.drawImage(frame, x, y, frame.naturalWidth * scale, frame.naturalHeight * scale)
  }, [])

  // Keep canvas dimensions in sync with viewport
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onResize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      if (lastIdxRef.current >= 0) drawFrame(lastIdxRef.current)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [drawFrame])

  // Draw hero immediately so screen is never black while frames preload
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const hero = new Image()
    hero.src = HERO_IMAGE
    hero.onload = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const scale = Math.max(canvas.width / hero.naturalWidth, canvas.height / hero.naturalHeight)
      const x = (canvas.width  - hero.naturalWidth  * scale) / 2
      const y = (canvas.height - hero.naturalHeight * scale) / 2
      ctx.drawImage(hero, x, y, hero.naturalWidth * scale, hero.naturalHeight * scale)
      console.log('Hero image drawn immediately on canvas')
    }
    hero.onerror = () => console.warn('Hero immediate-draw failed:', HERO_IMAGE)
  }, [])

  // Preload all frames — runs exactly once
  useEffect(() => {
    const paths = buildFramePaths()
    const total = paths.length
    const frames = new Array<HTMLImageElement>(total)
    framesRef.current = frames

    console.log('FramePlayer: loading', total, 'frames')
    console.log('Frame 0 src:', paths[0])
    console.log('Frame 1 src:', paths[1])
    console.log('Frame 2 src:', paths[2])

    const triggerReady = () => {
      if (!isReadyRef.current) {
        isReadyRef.current = true
        onReadyRef.current()
      }
    }

    // Frame 0: high-res hero photo
    const hero = new Image()
    hero.onload = () => {
      frames[0] = hero
      loadedRef.current++
      onProgressRef.current(loadedRef.current, total)
      triggerReady()
    }
    hero.onerror = () => {
      console.warn('Hero frame failed to load:', hero.src)
      loadedRef.current++
      onProgressRef.current(loadedRef.current, total)
      // Still trigger ready — Loader has its own timeout fallback
      triggerReady()
    }
    hero.src = HERO_IMAGE

    // Remaining frames — skip index 0 (replaced by hero)
    paths.forEach((src, i) => {
      if (i === 0) return
      const img = new Image()
      img.onload = () => {
        frames[i] = img
        loadedRef.current++
        onProgressRef.current(loadedRef.current, total)
        if (loadedRef.current >= 60) triggerReady()
      }
      img.onerror = () => {
        console.warn('Frame failed to load:', src)
        loadedRef.current++
        onProgressRef.current(loadedRef.current, total)
        if (loadedRef.current >= 60) triggerReady()
      }
      img.src   = src
      frames[i] = img
    })
  }, []) // intentionally empty — runs once

  // RAF loop: check scroll ref, draw only when frame index changes
  useEffect(() => {
    const tick = () => {
      if (isReadyRef.current) {
        const total = framesRef.current.length
        if (total > 0) {
          const idx = Math.min(
            Math.floor(scrollProgress.current * (total - 1)),
            total - 1
          )
          if (idx !== lastIdxRef.current) {
            lastIdxRef.current = idx
            drawFrame(idx)
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scrollProgress, drawFrame])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        background: '#1A1612',
      }}
    />
  )
}
