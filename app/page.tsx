'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Overlay } from '@/components/Overlay'
import { Loader } from '@/components/Loader'
import { Navigation } from '@/components/Navigation'
import { ReservePanel } from '@/components/ReservePanel'
import { scenes } from '@/lib/scenes'

const FramePlayer = dynamic(() => import('@/components/FramePlayer'), { ssr: false })
const LensFlare   = dynamic(() => import('@/components/LensFlare'),   { ssr: false })

const FRAME_COUNTS  = [121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121]
const SCENE_STARTS  = FRAME_COUNTS.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + FRAME_COUNTS[i - 1])
  return acc
}, [])
const TOTAL_FRAMES  = FRAME_COUNTS.reduce((a, b) => a + b, 0)
console.log('SCENE_STARTS:', SCENE_STARTS)
console.log('TOTAL_FRAMES:', TOTAL_FRAMES)

export default function Home() {
  const scrollProgressRef = useRef(0)
  const [currentScene,  setCurrentScene]  = useState(0)
  const [progress,      setProgress]      = useState(0)
  const [loadProgress,  setLoadProgress]  = useState(0)
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [reserveOpen,   setReserveOpen]   = useState(false)
  const [scrollHeight]  = useState<string>(() =>
    typeof window !== 'undefined' && window.innerWidth <= 768 ? '600vh' : '800vh'
  )

  // Scroll engine: Lenis + GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const isMobile = window.innerWidth <= 768

    const lenis = new Lenis({
      duration:        1.2,
      easing:          (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:     true,
      syncTouch:       false,
      wheelMultiplier: isMobile ? 1.2 : 1.8,
      touchMultiplier: isMobile ? 3.0 : 2.0,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const tickerFn = (time: number) => { lenis.raf(time * 1000) }
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    const trigger = ScrollTrigger.create({
      trigger: '#scroll-container',
      start:   'top top',
      end:     'bottom bottom',
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress
        setProgress(self.progress)

        const frameIndex = Math.floor(self.progress * (TOTAL_FRAMES - 1))
        const sceneIdx = SCENE_STARTS.findLastIndex((start: number) => frameIndex >= start)
        setCurrentScene(sceneIdx)
      },
    })

    return () => {
      trigger.kill()
      lenis.destroy()
      gsap.ticker.remove(tickerFn)
    }
  }, [])

  // FramePlayer callbacks — stable refs via useCallback([])
  const handleLoadProgress = useCallback((loaded: number, total: number) => {
    setLoadProgress(Math.round((loaded / total) * 100))
  }, [])

  const handleReady = useCallback(() => {
    // Fade out loader as soon as first 60 frames are ready
    // Framer Motion exit transition takes 0.9s
    setLoaderVisible(false)
  }, [])

  useEffect(() => {
    console.log('currentScene:', currentScene)
  }, [currentScene])

  useEffect(() => {
    document.body.style.overflow = reserveOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [reserveOpen])

  const handleDotClick = useCallback((sceneIdx: number) => {
    const targetProgress = SCENE_STARTS[sceneIdx] / TOTAL_FRAMES
    const totalHeight    = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: targetProgress * totalHeight, behavior: 'smooth' })
  }, [])

  return (
    <>
      {/* Gold progress bar + preload overlay */}
      <Loader progress={loadProgress} visible={loaderVisible} onComplete={() => setLoaderVisible(false)} />

      {/* 2D canvas frame player — client-only */}
      <FramePlayer
        scrollProgress={scrollProgressRef}
        onProgress={handleLoadProgress}
        onReady={handleReady}
      />

      {/* HTML overlays above canvas */}
      <Overlay currentScene={currentScene} onReserve={() => setReserveOpen(true)} />
      <Navigation
        currentScene={currentScene}
        scrollProgress={progress}
        onDotClick={handleDotClick}
      />

      {/* Scroll container — 8 viewports desktop, 6 mobile */}
      <div
        id="scroll-container"
        style={{ height: scrollHeight }}
        className="relative z-0"
      />

      <ReservePanel open={reserveOpen} onClose={() => setReserveOpen(false)} />

      <LensFlare />
    </>
  )
}
