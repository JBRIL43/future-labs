'use client'

import { useEffect, useRef, useCallback } from 'react'

const GEEZ_CHARS = [
  'ፊ', 'ደ', 'ላ', 'ብ', 'ስ', 'ኢ', 'ት', 'ዮ', 'ፒ', 'ያ',
  'ግ', 'ር', 'ኤ', 'ር', 'ት', 'አ', 'ት', 'ር', 'ኦ', 'ፒ',
]

const ETH_COLORS = {
  green: { r: 16, g: 185, b: 129 },
  gold:  { r: 245, g: 158, b: 11 },
  red:   { r: 239, g: 68, b: 68 },
}

const SPRING       = 0.015
const FRICTION     = 0.9
const REPEL_RADIUS = 90
const REPEL_FORCE  = 3
const ACTIVE_ZONE  = REPEL_RADIUS * 3
const ACTIVE_ZONE_SQ = ACTIVE_ZONE * ACTIVE_ZONE
const RADIUS_SQ    = REPEL_RADIUS * REPEL_RADIUS

interface Particle {
  x: number;  y: number
  homeX: number;  homeY: number
  vx: number;  vy: number
  size: number;  halfSize: number
  baseOpacity: number
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
  const ripplesRef = useRef<Ripple[]>([])
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  const createParticles = useCallback((w: number, h: number) => {
    const count = Math.min(120, Math.floor((w * h) / 14000))
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const rand = Math.random()
      let type: Particle['type'] = 'normal'
      if (rand < 0.12) type = 'geez'
      else if (rand < 0.2) type = 'accent'

      let color = ETH_COLORS.green
      if (type === 'accent') color = Math.random() < 0.6 ? ETH_COLORS.gold : ETH_COLORS.red

      const px = Math.random() * w
      const py = Math.random() * h
      const size = type === 'geez' ? Math.random() * 6 + 10 : Math.random() * 1.2 + 0.4

      particles.push({
        x: px, y: py, homeX: px, homeY: py,
        vx: 0, vy: 0,
        size, halfSize: size * 1.2,
        baseOpacity: type === 'geez'
          ? Math.random() * 0.035 + 0.015
          : type === 'accent'
            ? Math.random() * 0.12 + 0.05
            : Math.random() * 0.2 + 0.08,
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
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createParticles(w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }
    const handleMouseLeave = () => { mouseRef.current.active = false }

    const handleClick = (e: MouseEvent) => {
      const colors = [ETH_COLORS.green, ETH_COLORS.gold, ETH_COLORS.red]
      ripplesRef.current.push({
        x: e.clientX, y: e.clientY,
        radius: 0, maxRadius: 140, opacity: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
      for (const p of particlesRef.current) {
        const dx = p.x - e.clientX; const dy = p.y - e.clientY
        const dSq = dx * dx + dy * dy
        if (dSq < 25600 && dSq > 0) {
          const dist = Math.sqrt(dSq)
          const f = ((160 - dist) / 160) * 2
          p.vx += (dx / dist) * f; p.vy += (dy / dist) * f
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click', handleClick)

    const animate = () => {
      timeRef.current += 0.004
      const time = timeRef.current
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const mx = mouse.x
      const my = mouse.y
      const isActive = mouse.active

      if (isActive) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 80)
        g.addColorStop(0, 'rgba(16,185,129,0.035)')
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(mx - 80, my - 80, 160, 160)
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        let needsPhysicsUpdate = true

        if (isActive) {
          const dx = p.x - mx
          const dy = p.y - my
          const distSq = dx * dx + dy * dy

          if (distSq < ACTIVE_ZONE_SQ) {
            if (distSq < RADIUS_SQ && distSq > 1) {
              const dist = Math.sqrt(distSq)
              const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE
              p.vx += (dx / dist) * force
              p.vy += (dy / dist) * force
            }
            p.vx += (p.homeX - p.x) * SPRING
            p.vy += (p.homeY - p.y) * SPRING
          } else {
            if (p.vx !== 0 || p.vy !== 0) {
              p.vx += (p.homeX - p.x) * SPRING * 3
              p.vy += (p.homeY - p.y) * SPRING * 3
              p.vx *= FRICTION; p.vy *= FRICTION
              p.x += p.vx; p.y += p.vy
              if (Math.abs(p.x - p.homeX) < 0.3 && Math.abs(p.y - p.homeY) < 0.3 && Math.abs(p.vx) < 0.05) {
                p.x = p.homeX; p.y = p.homeY; p.vx = 0; p.vy = 0
              }
              needsPhysicsUpdate = false
            } else {
              p.x = p.homeX; p.y = p.homeY
              needsPhysicsUpdate = false
            }
          }
        } else {
          p.x = p.homeX; p.y = p.homeY; p.vx = 0; p.vy = 0
          needsPhysicsUpdate = false
        }

        if (needsPhysicsUpdate) {
          p.vx *= FRICTION; p.vy *= FRICTION
          p.x += p.vx; p.y += p.vy
          p.vx += Math.sin(time + i * 0.7) * 0.0003
          p.vy += Math.cos(time + i * 0.5) * 0.0003
        }

        // Draw
        p.angle += p.rotSpeed
        const pulse = Math.sin(time * 1.5 + p.pulsePhase) * 0.06
        const opacity = Math.max(p.baseOpacity * 0.5, p.baseOpacity + pulse)

        if (p.type === 'geez') {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)
          ctx.font = `${p.size}px sans-serif`
          ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${opacity})`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(p.char || '', 0, 0)
          ctx.restore()
        } else {
          ctx.globalAlpha = opacity
          ctx.fillStyle = `rgb(${p.color.r},${p.color.g},${p.color.b})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.halfSize, 0, 6.2832)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      // Ripples
      const ripples = ripplesRef.current
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.radius += 2; r.opacity *= 0.96
        if (r.opacity < 0.005 || r.radius > r.maxRadius) { ripples.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, 6.2832)
        ctx.strokeStyle = `rgba(${r.color.r},${r.color.g},${r.color.b},${r.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
        if (r.radius < r.maxRadius * 0.4) {
          const cs = r.radius * 0.3
          ctx.beginPath()
          ctx.moveTo(r.x - cs, r.y); ctx.lineTo(r.x + cs, r.y)
          ctx.moveTo(r.x, r.y - cs); ctx.lineTo(r.x, r.y + cs)
          ctx.strokeStyle = `rgba(${r.color.r},${r.color.g},${r.color.b},${r.opacity * 0.4})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Ethiopian cross watermark
      const cp = Math.sin(time * 0.5) * 0.003 + 0.01
      ctx.save()
      ctx.translate(w / 2, h / 2)
      ctx.rotate(time * 0.06)
      ctx.strokeStyle = `rgba(16,185,129,${cp})`
      ctx.lineWidth = 0.3
      drawEthiopianCross(ctx, 0, 0, Math.min(w, h) * 0.2)
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

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" style={{ opacity: 0.6 }} />
}

function drawEthiopianCross(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const s = size; const arm = s * 0.12
  ctx.beginPath()
  ctx.moveTo(cx - arm, cy - s * 0.45); ctx.lineTo(cx + arm, cy - s * 0.45)
  ctx.lineTo(cx + arm, cy - arm); ctx.lineTo(cx + s * 0.35, cy - arm)
  ctx.lineTo(cx + s * 0.35, cy - arm * 1.5); ctx.lineTo(cx + arm * 1.5, cy - arm * 1.5)
  ctx.lineTo(cx + arm * 1.5, cy + arm * 1.5); ctx.lineTo(cx + s * 0.35, cy + arm * 1.5)
  ctx.lineTo(cx + s * 0.35, cy + arm); ctx.lineTo(cx + arm, cy + arm)
  ctx.lineTo(cx + arm, cy + s * 0.45); ctx.lineTo(cx - arm, cy + s * 0.45)
  ctx.lineTo(cx - arm, cy + arm); ctx.lineTo(cx - s * 0.35, cy + arm)
  ctx.lineTo(cx - s * 0.35, cy + arm * 1.5); ctx.lineTo(cx - arm * 1.5, cy + arm * 1.5)
  ctx.lineTo(cx - arm * 1.5, cy - arm * 1.5); ctx.lineTo(cx - s * 0.35, cy - arm * 1.5)
  ctx.lineTo(cx - s * 0.35, cy - arm); ctx.lineTo(cx - arm, cy - arm)
  ctx.closePath(); ctx.stroke()
  const d = arm * 2
  ctx.beginPath()
  ctx.moveTo(cx, cy - d); ctx.lineTo(cx + d, cy)
  ctx.lineTo(cx, cy + d); ctx.lineTo(cx - d, cy)
  ctx.closePath(); ctx.stroke()
}
