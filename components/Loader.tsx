'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoaderProps {
  progress: number  // 0–100
  visible: boolean
  onComplete: () => void
}

export function Loader({ progress, visible, onComplete }: LoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    setIsMobile('ontouchstart' in window || window.innerWidth <= 768)
  }, [])

  // Safety net: force-hide after 5 seconds no matter what
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true
        console.log('Loader: 5s timeout — forcing experience to show')
        onComplete()
      }
    }, 5000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Hide as soon as 30% of frames are loaded — plenty to start
  useEffect(() => {
    if (progress >= 30 && !doneRef.current) {
      doneRef.current = true
      console.log('Loader: progress reached', progress, '% — showing experience')
      onComplete()
    }
  }, [progress, onComplete])

  useEffect(() => {
    if (isMobile) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cx = canvas.width / 2
    const cy = canvas.height / 2
    let frame = 0
    let rafId = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const pulse = 0.5 + 0.5 * Math.sin(frame * 0.04)
      const o = 0.3 + pulse * 0.5

      // Outer glow
      const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300)
      outer.addColorStop(0, `rgba(201,169,110,${o * 0.2})`)
      outer.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = outer
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Mid glow
      const mid = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80)
      mid.addColorStop(0, `rgba(255,240,200,${o * 0.6})`)
      mid.addColorStop(1, 'rgba(255,240,200,0)')
      ctx.fillStyle = mid
      ctx.beginPath()
      ctx.arc(cx, cy, 80, 0, Math.PI * 2)
      ctx.fill()

      // Core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12)
      core.addColorStop(0, `rgba(255,255,255,${o * 0.9})`)
      core.addColorStop(0.4, `rgba(255,240,180,${o * 0.6})`)
      core.addColorStop(1, 'rgba(255,200,100,0)')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(cx, cy, 12, 0, Math.PI * 2)
      ctx.fill()

      // Rays
      const rays = [
        { angle: 0,                    length: 200 + pulse * 60, width: 1.0 },
        { angle: Math.PI / 2,          length: 180 + pulse * 50, width: 0.8 },
        { angle: Math.PI / 4,          length: 100 + pulse * 30, width: 0.5 },
        { angle: (3 * Math.PI) / 4,    length:  90 + pulse * 25, width: 0.4 },
      ]
      rays.forEach(({ angle, length, width }) => {
        ;[angle, angle + Math.PI].forEach(a => {
          const grad = ctx.createLinearGradient(
            cx, cy,
            cx + Math.cos(a) * length,
            cy + Math.sin(a) * length
          )
          grad.addColorStop(0, `rgba(255,240,180,${o * 0.7})`)
          grad.addColorStop(1, 'rgba(255,240,180,0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = width
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(cx + Math.cos(a) * length, cy + Math.sin(a) * length)
          ctx.stroke()
        })
      })

      frame++
      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(rafId)
  }, [isMobile])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0d0b09',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {!isMobile && (
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
              }}
            />
          )}

          <h1
            style={{
              fontFamily: 'var(--font-okaluera), Georgia, serif',
              position: 'relative',
              zIndex: 1,
            }}
            className="mb-10 text-5xl font-normal tracking-widest text-[#F5F0E8]"
          >
            Villa Aura
          </h1>

          {isMobile ? (
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#C9A96E', position: 'relative', zIndex: 1,
              }}
            />
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-jost), sans-serif',
                fontWeight: 200,
                position: 'relative',
                zIndex: 1,
              }}
              className="text-[10px] uppercase tracking-[0.3em] text-white/30"
            >
              Loading experience
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
