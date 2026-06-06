'use client'
import { useTexture } from '@react-three/drei'
import { scenes } from '@/lib/scenes'

// Preloads all 11 scene images in parallel inside an R3F Suspense context.
// Three.js caches the results so individual Space components get instant hits.
export function useFrameTextures() {
  return useTexture(scenes.map((s) => s.imagePath))
}
