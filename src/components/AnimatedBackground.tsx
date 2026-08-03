'use client'

import { useEffect, useRef, useCallback } from 'react'

// Ge'ez script characters (Ethiopian Fidel) for ambient decoration
const GEEZ_CHARS = [
  'ፊ', 'ደ', 'ላ', 'ብ', 'ስ', 'ኢ', 'ት', 'ዮ', 'ፒ', 'ያ',
  'ግ', 'ር', 'ኤ', 'ር', 'ት', 'አ', 'ት', 'ር', 'ኦ', 'ፒ',
  'ያ', 'ጥ', 'ኦ', 'ኒ', 'ያ', 'ፈ', 'ው', 'ት', 'ረ', 'አ',
  'ር', 'ት', 'ማ', 'ሪ', 'ያ', 'ሀ', 'ለ', 'ሐ', 'መ', 'ሠ',
]

// Ethiopian flag accent colors
const ETH_COLORS = {
  green: { r: 16, g: 185, b: 129 },
  gold:  { r: 245, g: 158, b: 11 },
  red:   { r: 239, g: 68, b: 68 },
}

// Spring physics constants (subtle — same mechanic as hero, gentler tuning)
const SPRING      = 0.012    // pull back to home (hero uses 0.035)
const FRICTION    = 0.92     // velocity damping
const REPEL_RADIUS = 100    // cursor influence zone (hero uses 120)
const REPEL_FORCE  = 2.5     // push strength (hero uses 8)
const CONNECTION_DIST = 120

interface Particle {
  x: number;  y: number
  homeX: number;  homeY: number
  vx: number;  vy: number
  size: number
  baseOpacity: number
  opacity: number
  color: { r: number; g: number; b: number }
  type: 'normal' | 'accent' | 'geez'
  char?: string
  angle: number
  rotSpeed: number
  pulsePhase: number
}

interface Ripple {
  x: number;  y: number
  radius: number;  maxRadius: number
  opacity: number
  color: { r: number; g: number; b: number }
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const prevMouseRef = useRef({ x: -9999, y: -9999 })
  const ripplesRef = useRef<Ripple[]>([])
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  const createParticles = useCallback((w: number, h: number) => {
    const count = Math.min(160, Math.floor((w * h) / 10000))
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const rand = Math.random()
      let type: Particle['type'] = 'normal'
      if (rand < 0.12) type = 'geez'
      else if (rand < 0.22) type = 'accent'

      let color = ETH_COLORS.green
      if (type === 'accent') {
        color = Math.random() < 0.6 ? ETH_COLORS.gold : ETH_COLORS.red
      }

      const px = Math.random() * w
      const py = Math.random() * h

      particles.push({
        x: px, y: py,
        homeX: px, homeY: py,
        vx: 0, vy: 0,
        size: type === 'geez' ? Math.random() * 7 + 11 : Math.random() * 1.2 + 0.4,
        baseOpacity: type === 'geez'
          ? Math.random() * 0.04 + 0.015
          : type === 'accent'
            ? Math.random() * 0.15 + 0.05
            : Math.random() * 0.25 + 0.08,
        opacity: 0,
        color, type,
        char: type === 'geez' ? GEEZ_CHARS[Math.floor(Math.random() * GEEZ_CHARS.length)] : undefined,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createParticles(w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
 prevMouseRef.current = { ...mouseRef.current }
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }
    const handleMouseLeave = () => { mouseRef.current.active = false }

    const handleClick = (e: MouseEvent) => {
      const colors = [ETH_COLORS.green, ETH_COLORS.gold, ETH_COLORS.red]
      ripplesRef.current.push({
        x: e.clientX, y: e.clientY,
        radius: 0, maxRadius: 160 + Math.random() * 80,
        opacity: 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
      // Burst nearby particles
      for (const p of particlesRef.current) {
        const dx = p.x - e.clientX
        const dy = p.y - e.clientY
        const distSq = dx * dx + dy * dy
        const radius = 160
        if (distSq < radius * radius && distSq > 0) {
          const dist = Math.sqrt(distSq)
          const force = ((radius - dist) / radius) * 2.5
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click', handleClick)

    const repelRadiusSq = REPEL_RADIUS * REPEL_RADIUS
    const connDistSq = CONNECTION_DIST * CONNECTION_DIST

    const animate = () => {
      timeRef.current += 0.004
      const time = timeRef.current

      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // === SUBTLE CURSOR GLOW ===
      if (mouse.active) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100)
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.04)')
        grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.015)')
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      // === UPDATE & DRAW PARTICLES ===
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // --- Cursor repulsion (spring-home physics, same as hero) ---
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const distSq = dx * dx + dy * dy

          if (distSq < repelRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq)
            const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        // --- Spring back to home ---
        p.vx += (p.homeX - p.x) * SPRING
        p.vy += (p.homeY - p.y) * SPRING

        // --- Friction ---
        p.vx *= FRICTION
        p.vy *= FRICTION

        // --- Subtle ambient drift ---
        p.vx += Math.sin(time * 1.5 + i * 0.7) * 0.0004
        p.vy += Math.cos(time * 1.2 + i * 0.5) * 0.0004

        // --- Update position ---
        p.x += p.vx
        p.y += p.vy

        // --- Rotation for Ge'ez ---
        p.angle += p.rotSpeed

        // --- Pulse opacity ---
        const pulse = Math.sin(time * 1.5 + p.pulsePhase) * 0.08
        p.opacity = p.baseOpacity + pulse
        if (p.opacity < p.baseOpacity * 0.4) p.opacity = p.baseOpacity * 0.4

        // === DRAW ===
        if (p.type === 'geez') {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)
          ctx.font = `${p.size}px sans-serif`
          ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.opacity})`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(p.char || '', 0, 0)
          ctx.restore()
        } else {
          // Glowing dot — use simple fillRect for performance
          const s = p.size * 2.5
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = `rgb(${p.color.r},${p.color.g},${p.color.b})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, s, 0, Math.PI * 2)
          ctx.fill()
          // Soft glow halo
          ctx.globalAlpha = p.opacity * 0.3
          ctx.beginPath()
          ctx.arc(p.x, p.y, s * 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      // === DRAW CONNECTIONS (batch for performance) ===
      ctx.lineWidth = 0.4
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (p.type === 'geez') continue

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          if (p2.type === 'geez') continue
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distSq = dx * dx + dy * dy
          if (distSq < connDistSq) {
            const dist = Math.sqrt(distSq)
            const lineOpacity = ((CONNECTION_DIST - dist) / CONNECTION_DIST) * 0.06
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(16,185,129,${lineOpacity})`
            ctx.stroke()
          }
        }

        // Connection to cursor
        if (mouse.active) {
          const mdx = p.x - mouse.x
          const mdy = p.y - mouse.y
          const mdistSq = mdx * mdx + mdy * mdy
          if (mdistSq < repelRadiusSq) {
            const mdist = Math.sqrt(mdistSq)
            const lineOpacity = ((REPEL_RADIUS - mdist) / REPEL_RADIUS) * 0.1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${lineOpacity})`
            ctx.lineWidth = 0.3
            ctx.stroke()
            ctx.lineWidth = 0.4
          }
        }
      }

      // === DRAW RIPPLES ===
      const ripples = ripplesRef.current
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.radius += 2.5
        r.opacity *= 0.965
        if (r.opacity < 0.005 || r.radius > r.maxRadius) {
          ripples.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r.color.r},${r.color.g},${r.color.b},${r.opacity})`
        ctx.lineWidth = 1.2
        ctx.stroke()

        // Inner cross
        if (r.radius < r.maxRadius * 0.5) {
          const cs = r.radius * 0.35
          ctx.beginPath()
          ctx.moveTo(r.x - cs, r.y)
          ctx.lineTo(r.x + cs, r.y)
          ctx.moveTo(r.x, r.y - cs)
          ctx.lineTo(r.x, r.y + cs)
          ctx.strokeStyle = `rgba(${r.color.r},${r.color.g},${r.color.b},${r.opacity * 0.4})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      // === ETHIOPIAN CROSS WATERMARK ===
      const crossPulse = Math.sin(time * 0.5) * 0.004 + 0.012
      ctx.save()
      ctx.translate(w / 2, h / 2)
      ctx.rotate(time * 0.08)
      ctx.strokeStyle = `rgba(16,185,129,${crossPulse})`
      ctx.lineWidth = 0.4
      drawEthiopianCross(ctx, 0, 0, Math.min(w, h) * 0.22)
      ctx.restore()

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('click', handleClick)
      cancelAnimationFrame(animRef.current)
    }
  }, [createParticles])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" style={{ opacity: 0.65 }} />
}

// Draw an Axumite-style Ethiopian cross
function drawEthiopianCross(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const s = size
  const arm = s * 0.12

  ctx.beginPath()
  ctx.moveTo(cx - arm, cy - s * 0.45)
  ctx.lineTo(cx + arm, cy - s * 0.45)
  ctx.lineTo(cx + arm, cy - arm)
  ctx.lineTo(cx + s * 0.35, cy - arm)
  ctx.lineTo(cx + s * 0.35, cy - arm * 1.5)
  ctx.lineTo(cx + arm * 1.5, cy - arm * 1.5)
  ctx.lineTo(cx + arm * 1.5, cy + arm * 1.5)
  ctx.lineTo(cx + s * 0.35, cy + arm * 1.5)
  ctx.lineTo(cx + s * 0.35, cy + arm)
  ctx.lineTo(cx + arm, cy + arm)
  ctx.lineTo(cx + arm, cy + s * 0.45)
  ctx.lineTo(cx - arm, cy + s * 0.45)
  ctx.lineTo(cx - arm, cy + arm)
  ctx.lineTo(cx - s * 0.35, cy + arm)
  ctx.lineTo(cx - s * 0.35, cy + arm * 1.5)
  ctx.lineTo(cx - arm * 1.5, cy + arm * 1.5)
  ctx.lineTo(cx - arm * 1.5, cy - arm * 1.5)
  ctx.lineTo(cx - s * 0.35, cy - arm * 1.5)
  ctx.lineTo(cx - s * 0.35, cy - arm)
  ctx.lineTo(cx - arm, cy - arm)
  ctx.closePath()
  ctx.stroke()

  const d = arm * 2
  ctx.beginPath()
  ctx.moveTo(cx, cy - d)
  ctx.lineTo(cx + d, cy)
  ctx.lineTo(cx, cy + d)
  ctx.lineTo(cx - d, cy)
  ctx.closePath()
  ctx.stroke()
}
