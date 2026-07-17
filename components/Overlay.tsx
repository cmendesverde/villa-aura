'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { scenes } from '@/lib/scenes'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 as const },
  },
}

const childVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    x: 120,
    rotateY: 8,
    scale: 0.92,
    transition: { duration: 0.6, ease: [0.55, 0, 1, 0.45] },
  },
}

interface OverlayProps {
  currentScene: number
  onReserve: () => void
}

export function Overlay({ currentScene, onReserve }: OverlayProps) {
  const scene = scenes[currentScene]
  if (!scene) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            textAlign: 'center',
            width: '90vw',
            maxWidth: '1000px',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <motion.h2
            variants={childVariants}
            style={{
              fontFamily: 'var(--font-okaluera), Georgia, serif',
              fontSize: 'clamp(48px, 12vw, 200px)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 30px rgba(0,0,0,0.9), 0 4px 60px rgba(0,0,0,0.7)',
              width: '100%',
              textAlign: 'center',
            }}
            className="font-normal text-[#F5F0E8]"
          >
            {scene.headline}
          </motion.h2>

          {scene.subtitle && (
            <motion.p
              variants={childVariants}
              style={{
                fontFamily: 'var(--font-jost), sans-serif',
                fontSize: 'clamp(14px, 3vw, 20px)',
                textShadow: '0 1px 20px rgba(0,0,0,0.8), 0 2px 40px rgba(0,0,0,0.6)',
                width: '100%',
                textAlign: 'center',
              }}
              className="mt-4 font-light text-[#F5F0E8]/70"
            >
              {scene.subtitle}
            </motion.p>
          )}

          {scene.details && (
            <motion.p
              variants={childVariants}
              style={{
                fontFamily: 'var(--font-jost), sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(12px, 2.5vw, 15px)',
                letterSpacing: '0.12em',
                textAlign: 'center',
                width: '100%',
                color: 'rgba(255,255,255,0.95)',
                marginTop: '28px',
                borderTop: '1px solid rgba(201,169,110,0.5)',
                paddingTop: '20px',
                textShadow: '0 1px 20px rgba(0,0,0,0.9), 0 2px 40px rgba(0,0,0,0.8)',
              }}
            >
              {scene.details}
            </motion.p>
          )}

          {currentScene === 10 && (
            <motion.div
              variants={childVariants}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                marginTop: '40px',
                pointerEvents: 'auto',
              }}
            >
              <motion.button
                onClick={onReserve}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: '#C9A96E',
                  color: '#1A1612',
                  border: 'none',
                  fontSize: 'clamp(11px, 2.5vw, 12px)',
                  fontFamily: 'var(--font-jost), sans-serif',
                  fontWeight: 400,
                  letterSpacing: '0.5em',
                  padding: '20px clamp(28px, 8vw, 72px)',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 40px rgba(201,169,110,0.35)',
                  whiteSpace: 'nowrap',
                  width: 'min(80vw, 400px)',
                }}
              >
                Reserve Villa Aura
              </motion.button>

              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                whileHover={{ opacity: 1 }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-jost), sans-serif',
                  fontWeight: 300,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '8px 0',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 20px rgba(255,255,255,0.8), 0 2px 20px rgba(0,0,0,0.9)',
                }}
              >
                ↑ Restart experience
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
