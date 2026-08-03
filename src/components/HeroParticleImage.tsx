'use client'

import { useEffect, useRef } from 'react'

// Spring-physics image particle system
// Each pixel-sampled particle springs back to its home position
// Cursor repels particles with inverse-square falloff

const SPRING = 0.035          // spring pull strength (back to home)
const FRICTION = 0.88         // velocity damping per frame
const CURSOR_RADIUS = 120     // repulsion radius
const CURSOR_FORCE = 8        // repulsion strength
const PARTICLE_GAP = 5        // sample every Nth pixel
const MIN_BRIGHTNESS = 15     // skip very dark pixels

interface ImgParticle {
  x: number
  y: number
  homeX: number
  homeY: number
  vx: number
  vy: number
  r: number
  g: number
  b: number
  size: number
}

export function HeroParticleImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<ImgParticle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const animRef = useRef<number>(0)
  const loadedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Load image and extract pixel data
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/hero-bg.png'

    img.onload = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr      
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Draw image scaled to fill viewport (cover)
      const imgAspect = img.width / img.height
      const vpAspect = w / h
      let drawW: number, drawH: number, drawX: number, drawY: number
      if (imgAspect > vpAspect) {
        drawH = h
        drawW = h * imgAspect
        drawX = (w - drawW) / 2
        drawY = 0
      } else {
        drawW = w
        drawH = w / imgAspect
        drawX = 0
        drawY = (h - drawH) / 2
      }

      // Draw to offscreen canvas to sample
      const offscreen = document.createElement('canvas')
      offscreen.width = w
      offscreen.height = h
      const offCtx = offscreen.getContext('2d')
      if (!offCtx) return
      offCtx.drawImage(img, drawX, drawY, drawW, drawH)
      const imageData = offCtx.getImageData(0, 0, w, h)
      const data = imageData.data

      // Build particles from pixel data
      const particles: ImgParticle[] = []
      const gap = w < 768 ? PARTICLE_GAP + 2 : PARTICLE_GAP

      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const idx = (y * w + x) * 4
          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]
          const brightness = (r + g + b) / 3

          if (brightness < MIN_BRIGHTNESS) continue

          // Slightly boost brightness for visibility
          const boost = 1.15
          particles.push({
            x,
            y,
            homeX: x,
            homeY: y,
            vx: 0,
            vy: 0,
            r: Math.min(255, Math.round(r * boost)),
            g: Math.min(255, Math.round(g * boost)),
            b: Math.min(255, Math.round(b * boost)),
            size: gap * 0.48,
          })
        }
      }

      particlesRef.current = particles
      loadedRef.current = true
    }

    // Mouse tracking (local to hero section)
    const handleMouseMove = (e: MouseEvent) => {
      if (!loadedRef.current) return
      const rect = canvas.getBoundingClientRect()
      // Only track if mouse is within or near the hero area
      if (e.clientY < rect.bottom + 100) {
        mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
      } else {
        mouseRef.current.active = false
      }
    }
    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    // Animation loop
    const animate = () => {
      if (!loadedRef.current || particlesRef.current.length === 0) {
        animRef.current = requestAnimationFrame(animate)
        return
      }

      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const radius = CURSOR_RADIUS
      const radiusSq = radius * radius

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Cursor repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const distSq = dx * dx + dy * dy

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq)
            const force = ((radius - dist) / radius) * CURSOR_FORCE
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        // Spring back to home
        const homeDx = p.homeX - p.x
        const homeDy = p.homeY - p.y
        p.vx += homeDx * SPRING
        p.vy += homeDy * SPRING

        // Friction
        p.vx *= FRICTION
        p.vy *= FRICTION

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Draw particle as a tiny square (faster than arc)
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`
        ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size)
      }

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      loadedRef.current = false
      particlesRef.current = []
      // Re-trigger image load
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Reload image particles
      const offscreen = document.createElement('canvas')
      offscreen.width = w
      offscreen.height = h
      const offCtx = offscreen.getContext('2d')
      if (!offCtx) return

      const newImg = new Image()
      newImg.crossOrigin = 'anonymous'
      newImg.src = '/hero-bg.png'
      newImg.onload = () => {
        const imgAspect = newImg.width / newImg.height
        const vpAspect = w / h
        let drawW: number, drawH: number, drawX: number, drawY: number
        if (imgAspect > vpAspect) {
          drawH = h
          drawW = h * imgAspect
          drawX = (w - drawW) / 2
          drawY = 0
        } else {
          drawW = w
          drawH = w / imgAspect
          drawX = 0
          drawY = (h - drawH) / 2
        }
        offCtx.drawImage(newImg, drawX, drawY, drawW, drawH)
        const imageData = offCtx.getImageData(0, 0, w, h)
        const data = imageData.data
        const particles: ImgParticle[] = []
        const gap = w < 768 ? PARTICLE_GAP + 2 : PARTICLE_GAP
        for (let y = 0; y < h; y += gap) {
          for (let x = 0; x < w; x += gap) {
            const idx = (y * w + x) * 4
            const r = data[idx]
            const g = data[idx + 1]
            const b = data[idx + 2]
            if ((r + g + b) / 3 < MIN_BRIGHTNESS) continue
            const boost = 1.15
            particles.push({
              x, y, homeX: x, homeY: y, vx: 0, vy: 0,
              r: Math.min(255, Math.round(r * boost)),
              g: Math.min(255, Math.round(g * boost)),
              b: Math.min(255, Math.round(b * boost)),
              size: gap * 0.48,
            })
          }
        }
        particlesRef.current = particles
        loadedRef.current = true
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
