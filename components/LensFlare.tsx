'use client'
import { useEffect, useRef } from 'react'

export default function LensFlare() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const opacity = useRef(0)
  const fadeTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if ('ontouchstart' in window) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })

    const drawFlare = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (opacity.current <= 0) return

      const x = mouse.current.x
      const y = mouse.current.y
      const o = opacity.current

      // Outer glow
      const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, 120)
      outerGlow.addColorStop(0, `rgba(201,169,110,${o * 0.15})`)
      outerGlow.addColorStop(1, 'rgba(201,169,110,0)')
      ctx.fillStyle = outerGlow
      ctx.beginPath()
      ctx.arc(x, y, 120, 0, Math.PI * 2)
      ctx.fill()

      // Mid glow
      const midGlow = ctx.createRadialGradient(x, y, 0, x, y, 40)
      midGlow.addColorStop(0, `rgba(255,240,200,${o * 0.5})`)
      midGlow.addColorStop(1, 'rgba(255,240,200,0)')
      ctx.fillStyle = midGlow
      ctx.beginPath()
      ctx.arc(x, y, 40, 0, Math.PI * 2)
      ctx.fill()

      // Core bright center
      const core = ctx.createRadialGradient(x, y, 0, x, y, 8)
      core.addColorStop(0, `rgba(255,255,255,${o * 0.95})`)
      core.addColorStop(0.3, `rgba(255,240,180,${o * 0.7})`)
      core.addColorStop(1, 'rgba(255,200,100,0)')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Rays
      const rays = [
        { angle: 0, length: 180, width: 1.2 },
        { angle: Math.PI / 2, length: 160, width: 1.0 },
        { angle: Math.PI / 4, length: 90, width: 0.6 },
        { angle: (3 * Math.PI) / 4, length: 80, width: 0.5 },
      ]

      rays.forEach(({ angle, length, width }) => {
        ;[angle, angle + Math.PI].forEach(a => {
          const grad = ctx.createLinearGradient(
            x, y,
            x + Math.cos(a) * length,
            y + Math.sin(a) * length
          )
          grad.addColorStop(0, `rgba(255,240,180,${o * 0.8})`)
          grad.addColorStop(1, 'rgba(255,240,180,0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = width
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(
            x + Math.cos(a) * length,
            y + Math.sin(a) * length
          )
          ctx.stroke()
        })
      })

      // Rainbow ring
      const ring = ctx.createRadialGradient(x, y, 55, x, y, 75)
      ring.addColorStop(0, 'rgba(100,180,255,0)')
      ring.addColorStop(0.4, `rgba(100,180,255,${o * 0.08})`)
      ring.addColorStop(0.6, `rgba(255,100,180,${o * 0.06})`)
      ring.addColorStop(1, 'rgba(255,100,180,0)')
      ctx.fillStyle = ring
      ctx.beginPath()
      ctx.arc(x, y, 75, 0, Math.PI * 2)
      ctx.fill()
    }

    const animate = () => {
      drawFlare()
      requestAnimationFrame(animate)
    }
    animate()

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      opacity.current = 1

      clearTimeout(fadeTimer.current)
      fadeTimer.current = setTimeout(() => {
        const fade = setInterval(() => {
          opacity.current -= 0.05
          if (opacity.current <= 0) {
            opacity.current = 0
            clearInterval(fade)
          }
        }, 30)
      }, 150)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  )
}
