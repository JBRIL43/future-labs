'use client'

import { useEffect, useRef } from 'react'

// Performance-tuned particle image with active-zone culling:
// Only particles within 3x repel radius of cursor get physics.
// Far particles draw at home position with zero overhead.

const SPRING = 0.04
const FRICTION = 0.85
const CURSOR_RADIUS = 110
const CURSOR_FORCE = 9
const ACTIVE_ZONE_MULT = 3  // only compute physics within this * CURSOR_RADIUS
const GAP_DESKTOP = 7
const GAP_MOBILE = 9
const MIN_BRIGHTNESS = 20

interface ImgParticle {
  x: number;  y: number
  homeX: number;  homeY: number
  vx: number;  vy: number
  r: number;  g: number;  b: number
  size: number
  halfSize: number
}

export function HeroParticleImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<ImgParticle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const animRef = useRef<number>(0)
  const loadedRef = useRef(false)
  const dimsRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const buildParticles = () => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = '/hero-bg.png'

      img.onload = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = window.innerWidth
        const h = window.innerHeight
        dimsRef.current = { w, h }
        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const imgAspect = img.width / img.height
        const vpAspect = w / h
        let drawW: number, drawH: number, drawX: number, drawY: number
        if (imgAspect > vpAspect) {
          drawH = h; drawW = h * imgAspect; drawX = (w - drawW) / 2; drawY = 0
        } else {
          drawW = w; drawH = w / imgAspect; drawX = 0; drawY = (h - drawH) / 2
        }

        const offscreen = document.createElement('canvas')
        offscreen.width = w; offscreen.height = h
        const offCtx = offscreen.getContext('2d')
        if (!offCtx) return
        offCtx.drawImage(img, drawX, drawY, drawW, drawH)
        const imageData = offCtx.getImageData(0, 0, w, h)
        const data = imageData.data

        const particles: ImgParticle[] = []
        const gap = w < 768 ? GAP_MOBILE : GAP_DESKTOP
        const half = gap * 0.24

        for (let y = 0; y < h; y += gap) {
          for (let x = 0; x < w; x += gap) {
            const idx = (y * w + x) * 4
            const r = data[idx]; const g = data[idx + 1]; const b = data[idx + 2]
            if ((r + g + b) / 3 < MIN_BRIGHTNESS) continue
            const boost = 1.2
            particles.push({
              x, y, homeX: x, homeY: y, vx: 0, vy: 0,
              r: Math.min(255, Math.round(r * boost)),
              g: Math.min(255, Math.round(g * boost)),
              b: Math.min(255, Math.round(b * boost)),
              size: gap * 0.48, halfSize: half,
            })
          }
        }

        particlesRef.current = particles
        loadedRef.current = true
      }
    }

    buildParticles()

    const handleMouseMove = (e: MouseEvent) => {
 if (!loadedRef.current) return
      const { h: ch } = dimsRef.current
      if (e.clientY < ch + 100) {
        mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
      } else {
        mouseRef.current.active = false
      }
    }
    const handleMouseLeave = () => { mouseRef.current.active = false }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    const activeZoneSq = (CURSOR_RADIUS * ACTIVE_ZONE_MULT) ** 2
    const radiusSq = CURSOR_RADIUS * CURSOR_RADIUS

    const animate = () => {
      if (!loadedRef.current) {
        animRef.current = requestAnimationFrame(animate)
        return
      }

      const { w, h } = dimsRef.current
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const mx = mouse.x
      const my = mouse.y
      const isActive = mouse.active

      // --- Fast path: cursor not in hero area ---
      // Just draw all particles at home (no physics)
      if (!isActive) {
        // Snap any displaced particles back
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          p.x = p.homeX; p.y = p.homeY; p.vx = 0; p.vy = 0
          ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`
          ctx.fillRect(p.homeX - p.halfSize, p.homeY - p.halfSize, p.size, p.size)
        }
        animRef.current = requestAnimationFrame(animate)
        return
      }

      // --- Active path: cursor in hero area ---
      // Use active-zone culling: only compute physics for nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Distance to cursor (squared, avoid sqrt when possible)
        const dx = p.x - mx
        const dy = p.y - my
        const distSq = dx * dx + dy * dy

        if (distSq < activeZoneSq) {
          // --- NEAR CURSOR: full spring physics ---
          if (distSq < radiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq)
            const force = ((CURSOR_RADIUS - dist) / CURSOR_RADIUS) * CURSOR_FORCE
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }

          // Spring back to home
          p.vx += (p.homeX - p.x) * SPRING
          p.vy += (p.homeY - p.y) * SPRING
          p.vx *= FRICTION
          p.vy *= FRICTION
          p.x += p.vx
          p.y += p.vy
        } else {
          // --- FAR FROM CURSOR: snap to home, no physics ---
          if (p.vx !== 0 || p.vy !== 0) {
            // Still has velocity — spring back quickly
            p.vx += (p.homeX - p.x) * SPRING * 3
            p.vy += (p.homeY - p.y) * SPRING * 3
            p.vx *= FRICTION
            p.vy *= FRICTION
            p.x += p.vx
            p.y += p.vy
            // Snap when close enough
            if (Math.abs(p.x - p.homeX) < 0.5 && Math.abs(p.y - p.homeY) < 0.5 && Math.abs(p.vx) < 0.1 && Math.abs(p.vy) < 0.1) {
              p.x = p.homeX; p.y = p.homeY; p.vx = 0; p.vy = 0
            }
          } else {
            p.x = p.homeX; p.y = p.homeY
          }
        }

        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`
        ctx.fillRect(p.x - p.halfSize, p.y - p.halfSize, p.size, p.size)
      }

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      loadedRef.current = false
      particlesRef.current = []
      buildParticles()
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
