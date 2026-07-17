'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scenes } from '@/lib/scenes'

const RIBBON_LABELS = ['Arrival', 'Entrance', 'Lobby', 'Living', 'Corridor', 'Suite', 'Bathroom', 'Terrace', 'Pool', 'Events', 'Sunset']

const FRAME_COUNTS = [61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61]
const TOTAL_FRAMES = FRAME_COUNTS.reduce((a, b) => a + b, 0) // 671

const SCENE_STARTS = FRAME_COUNTS.reduce((acc, _count, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + FRAME_COUNTS[i - 1])
  return acc
}, [] as number[])

interface NavigationProps {
  currentScene: number
  scrollProgress: number
  onDotClick: (index: number) => void
}

export function Navigation({ currentScene, scrollProgress, onDotClick }: NavigationProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleSceneClick = (sceneIndex: number) => {
    const targetFrame = SCENE_STARTS[sceneIndex]
    const targetProgress = targetFrame / (TOTAL_FRAMES - 1)
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const targetScroll = targetProgress * maxScroll
    console.log('Navigate to scene:', sceneIndex, 'frame:', targetFrame, 'scroll:', targetScroll)
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      {/* 1px gold progress bar across the top */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-30 h-px bg-white/5">
        <div
          className="h-full bg-[#C9A96E]"
          style={{ width: `${scrollProgress * 100}%`, transition: 'width 0.1s linear' }}
        />
      </div>

      {/* Logo top-left */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex h-16 items-center px-6">
        <span
          style={{ fontFamily: 'var(--font-okaluera), Georgia, serif', cursor: 'pointer' }}
          className="pointer-events-auto text-xl font-normal tracking-widest text-[#F5F0E8]"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Villa Aura
        </span>
      </div>

      {/* Room name bottom-left */}
      <div className="pointer-events-none fixed bottom-[11.5rem] left-8 z-20">
        <p
          style={{ fontFamily: 'var(--font-jost), sans-serif' }}
          className="text-[10px] font-light uppercase tracking-[0.3em] text-[#F5F0E8]/40"
        >
          {scenes[currentScene]?.room ?? ''}
        </p>
      </div>

      {isMobile ? (
        <>
          {/* Hamburger button top-right */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
            style={{
              position: 'fixed', top: 14, right: 20, zIndex: 25,
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 5, padding: 10,
            }}
          >
            <div style={{ width: 22, height: 1, background: '#C9A96E' }} />
            <div style={{ width: 22, height: 1, background: '#C9A96E' }} />
            <div style={{ width: 22, height: 1, background: '#C9A96E' }} />
          </button>

          {/* Full-screen slide-from-right menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  position: 'fixed', inset: 0, zIndex: 90,
                  background: 'rgba(13,11,9,0.98)', backdropFilter: 'blur(24px)',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center',
                }}
              >
                {/* Close */}
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation"
                  style={{
                    position: 'absolute', top: 16, right: 20,
                    background: 'transparent', border: 'none',
                    color: 'rgba(245,240,232,0.5)', fontSize: 28,
                    cursor: 'pointer', lineHeight: 1, padding: '8px 12px',
                    fontFamily: 'var(--font-jost), sans-serif', fontWeight: 300,
                  }}
                >×</button>

                <p style={{
                  fontFamily: 'var(--font-jost), sans-serif', fontWeight: 200,
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4em',
                  color: 'rgba(201,169,110,0.5)', marginBottom: 32,
                }}>
                  Navigate
                </p>

                {RIBBON_LABELS.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => handleSceneClick(i)}
                    style={{
                      background: 'transparent', border: 'none',
                      fontFamily: 'var(--font-jost), sans-serif',
                      fontWeight: i === currentScene ? 300 : 200,
                      fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.35em',
                      color: i === currentScene ? '#C9A96E' : 'rgba(245,240,232,0.65)',
                      cursor: 'pointer', padding: '13px 0',
                      width: '72vw', textAlign: 'center',
                      borderBottom: i < RIBBON_LABELS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <>
          {/* Vertical dots nav right side */}
          <nav className="fixed right-8 top-1/2 z-20 -translate-y-1/2">
            <ul className="flex flex-col items-center gap-3">
              {scenes.map((scene, i) => (
                <li key={scene.id}>
                  <button
                    onClick={() => handleSceneClick(i)}
                    aria-label={scene.room}
                    className={[
                      'block w-1 cursor-pointer rounded-sm transition-all duration-300',
                      i === currentScene
                        ? 'h-6 bg-[#C9A96E]'
                        : 'h-1 bg-white/30 hover:bg-white/60',
                    ].join(' ')}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Ribbon navigation top */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '72px',
              background: 'linear-gradient(rgba(10,8,6,0.92), transparent)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: '40px',
              paddingRight: '40px',
              gap: '32px',
              zIndex: 20,
            }}
          >
            {RIBBON_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => handleSceneClick(i)}
                style={{
                  fontFamily: 'var(--font-jost), sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  color: i === currentScene ? '#C9A96E' : 'rgba(255,255,255,0.9)',
                  textShadow: '0 1px 12px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.8)',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 4px',
                  transition: 'color 0.3s ease',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
