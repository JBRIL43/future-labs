'use client'

import { useEffect, useRef, useCallback } from 'react'

// Ge'ez script characters (Ethiopian Fidel) for ambient decoration
const GEEZ_CHARS = [
  'ፊ', 'ደ', 'ላ', 'ብ', 'ስ', 'ፊ', 'ደ', 'ላ', 'ብ', 'ስ',
  'ኢ', 'ት', 'ዮ', 'ፒ', 'ያ', 'ግ', 'ር', 'ኤ', 'ር', 'ት',
  'አ', 'ት', 'ር', 'ኦ', 'ፒ', 'ያ', 'ጥ', 'ኦ', 'ኒ', 'ያ',
  'ፈ', 'ው', 'ት', 'ረ', 'አ', 'ር', 'ት', 'ማ', 'ሪ', 'ያ',
  'ሀ', 'ለ', 'ሐ', 'መ', 'ሠ', 'ረ', 'ሰ', 'ሸ', 'ቀ', 'በ',
  'ተ', 'ቸ', 'ኀ', 'ነ', 'ኘ', 'አ', 'ከ', 'ወ', 'ዐ', 'ዘ',
]

// Ethiopian flag accent colors (subtle)
const ETH_COLORS = {
  green: { r: 16, g: 185, b: 129 },    // brand emerald (represents green)
  gold: { r: 245, g: 158, b: 11 },     // Ethiopian gold/yellow
  red: { r: 239, g: 68, b: 68 },       // Ethiopian red (very subtle)
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseOpacity: number
  opacity: number
  color: { r: number; g: number; b: number }
  type: 'normal' | 'accent' | 'geez'
  char?: string
  angle: number
  rotSpeed: number
  pulsePhase: number
  orbitRadius: number
  orbitAngle: number
  orbitSpeed: number
  isOrbiting: boolean
}

interface TrailPoint {
  x: number
  y: number
  opacity: number
  size: number
  age: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  color: { r: number; g: number; b: number }
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000, active: false })
  const trailRef = useRef<TrailPoint[]>([])
  const ripplesRef = useRef<Ripple[]>([])
  const animFrameRef = useRef<number>(0)
  const timeRef = useRef(0)

  const createParticles = useCallback((canvas: HTMLCanvasElement) => {
    const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000))
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      // 15% are Ge'ez characters, 10% are accent (gold/red), 75% normal green
      const rand = Math.random()
      let type: Particle['type'] = 'normal'
      if (rand < 0.15) type = 'geez'
      else if (rand < 0.25) type = 'accent'

      let color = ETH_COLORS.green
      if (type === 'accent') {
        color = Math.random() < 0.6 ? ETH_COLORS.gold : ETH_COLORS.red
      }

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: type === 'geez' ? Math.random() * 8 + 12 : Math.random() * 1.5 + 0.5,
        baseOpacity: type === 'geez' ? Math.random() * 0.06 + 0.02 : Math.random() * 0.4 + 0.1,
        opacity: 0,
        color,
        type,
        char: type === 'geez' ? GEEZ_CHARS[Math.floor(Math.random() * GEEZ_CHARS.length)] : undefined,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 60 + 40,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() - 0.5) * 0.02,
        isOrbiting: false,
      })
    }

    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
      createParticles(canvas)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
      // Add trail points
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        opacity: 0.6,
        size: 3,
        age: 0,
      })
      // Limit trail length
      if (trailRef.current.length > 50) {
        trailRef.current.shift()
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false }
    }

    const handleClick = (e: MouseEvent) => {
      // Create ripple on click
      const colors = [ETH_COLORS.green, ETH_COLORS.gold, ETH_COLORS.red]
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 200 + Math.random() * 100,
        opacity: 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
      // Burst particles outward from click
      const particles = particlesRef.current
      for (const p of particles) {
        const dx = p.x - e.clientX
        const dy = p.y - e.clientY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          const force = ((200 - dist) / 200) * 3
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
          p.isOrbiting = false
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click', handleClick)

    const animate = () => {
      timeRef.current += 0.005
      const time = timeRef.current
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // === DRAW CURSOR TRAIL ===
      const trail = trailRef.current
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i]
        t.age += 1
        t.opacity *= 0.92
        t.size *= 0.97
        if (t.opacity < 0.01) {
          trail.splice(i, 1)
          continue
        }
        const trailGrad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size * 3)
        trailGrad.addColorStop(0, `rgba(16, 185, 129, ${t.opacity * 0.5})`)
        trailGrad.addColorStop(0.5, `rgba(245, 158, 11, ${t.opacity * 0.2})`)
        trailGrad.addColorStop(1, `rgba(16, 185, 129, 0)`)
        ctx.beginPath()
        ctx.arc(t.x, t.y, t.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = trailGrad
        ctx.fill()
      }

      // === DRAW CURSOR GLOW ===
      if (mouse.active) {
        const cursorGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120)
        cursorGrad.addColorStop(0, 'rgba(16, 185, 129, 0.08)')
        cursorGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.03)')
        cursorGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.01)')
        cursorGrad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2)
        ctx.fillStyle = cursorGrad
        ctx.fill()

        // Magnetic field rings around cursor
        for (let ring = 0; ring < 3; ring++) {
          const ringRadius = 30 + ring * 25 + Math.sin(time * 2 + ring) * 5
          ctx.beginPath()
          ctx.arc(mouse.x, mouse.y, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.06 - ring * 0.015})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // === UPDATE & DRAW PARTICLES ===
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 250 && dist > 0) {
            if (dist < 100) {
              // Close range: orbit the cursor
              if (!p.isOrbiting) {
                p.isOrbiting = true
                p.orbitAngle = Math.atan2(dy, dx)
              }
              const targetAngle = Math.atan2(dy, dx)
              // Smoothly adjust orbit angle
              let angleDiff = targetAngle - p.orbitAngle
              while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
              while (angleDiff < -Math.PI) angleDiff += Math.PI * 2
              p.orbitAngle += angleDiff * 0.03
              p.orbitAngle += p.orbitSpeed

              // Maintain orbit radius
              const targetRadius = p.type === 'geez' ? 130 : (100 + (1 - dist / 100) * 50)
              p.orbitRadius += (targetRadius - p.orbitRadius) * 0.02

              const targetX = mouse.x + Math.cos(p.orbitAngle) * p.orbitRadius
              const targetY = mouse.y + Math.sin(p.orbitAngle) * p.orbitRadius
              p.vx += (targetX - p.x) * 0.015
              p.vy += (targetY - p.y) * 0.015
            } else {
              // Medium range: magnetic attraction
              p.isOrbiting = false
              const force = ((250 - dist) / 250) * 0.015
              p.vx += (dx / dist) * force
              p.vy += (dy / dist) * force
            }
          } else {
            p.isOrbiting = false
          }
        } else {
          p.isOrbiting = false
        }

        // Subtle drift when not near cursor
        if (!p.isOrbiting) {
          p.vx += Math.sin(time + i * 0.5) * 0.0008
          p.vy += Math.cos(time + i * 0.3) * 0.0008
        }

        // Damping
        p.vx *= p.isOrbiting ? 0.92 : 0.985
        p.vy *= p.isOrbiting ? 0.92 : 0.985

        p.x += p.vx
        p.y += p.vy

        // Wrap around with padding
        const pad = 50
        if (p.x < -pad) p.x = w + pad
        if (p.x > w + pad) p.x = -pad
        if (p.y < -pad) p.y = h + pad
        if (p.y > h + pad) p.y = -pad

        // Rotation for Ge'ez chars
        p.angle += p.rotSpeed

        // Pulse opacity
        const pulse = Math.sin(time * 2 + p.pulsePhase) * 0.15
        p.opacity = p.baseOpacity + pulse

        // Fade in
        if (p.opacity < p.baseOpacity * 0.5) p.opacity = p.baseOpacity * 0.5

        // === DRAW PARTICLE ===
        if (p.type === 'geez') {
          // Draw Ge'ez character
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)
          ctx.font = `${p.size}px sans-serif`
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(p.char || '', 0, 0)
          ctx.restore()
        } else {
          // Draw glowing dot
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
          grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`)
          grad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }

        // === DRAW CONNECTIONS ===
        if (p.type !== 'geez') {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j]
            if (p2.type === 'geez') continue
            const cdx = p.x - p2.x
            const cdy = p.y - p2.y
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
            if (cdist < 140) {
              const lineOpacity = ((140 - cdist) / 140) * 0.1
              // Blend colors
              const mr = Math.round((p.color.r + p2.color.r) / 2)
              const mg = Math.round((p.color.g + p2.color.g) / 2)
              const mb = Math.round((p.color.b + p2.color.b) / 2)
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${lineOpacity})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }

          // Connection to cursor
          if (mouse.active) {
            const mdx = p.x - mouse.x
            const mdy = p.y - mouse.y
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
            if (mdist < 200) {
              const lineOpacity = ((200 - mdist) / 200) * 0.15
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(mouse.x, mouse.y)
              ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${lineOpacity})`
              ctx.lineWidth = 0.3
              ctx.stroke()
            }
          }
        }
      }

      // === DRAW & UPDATE RIPPLES ===
      const ripples = ripplesRef.current
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.radius += 3
        r.opacity *= 0.97
        if (r.opacity < 0.01 || r.radius > r.maxRadius) {
          ripples.splice(i, 1)
          continue
        }
        // Ethiopian cross ripple pattern
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, ${r.opacity})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Inner cross lines
        if (r.radius < r.maxRadius * 0.5) {
          const crossSize = r.radius * 0.4
          ctx.beginPath()
          ctx.moveTo(r.x - crossSize, r.y)
          ctx.lineTo(r.x + crossSize, r.y)
          ctx.moveTo(r.x, r.y - crossSize)
          ctx.lineTo(r.x, r.y + crossSize)
          ctx.strokeStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, ${r.opacity * 0.5})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      // === DRAW ETHIOPIAN CROSS WATERMARK (center, very subtle) ===
      const crossPulse = Math.sin(time * 0.5) * 0.005 + 0.015
      ctx.save()
      ctx.translate(w / 2, h / 2)
      ctx.rotate(time * 0.1)
      ctx.strokeStyle = `rgba(16, 185, 129, ${crossPulse})`
      ctx.lineWidth = 0.5
      // Axumite cross shape
      drawEthiopianCross(ctx, 0, 0, Math.min(w, h) * 0.25)
      ctx.restore()

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('click', handleClick)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [createParticles])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" style={{ opacity: 0.7 }} />
}

// Draw an Axumite-style Ethiopian cross
function drawEthiopianCross(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const s = size
  const arm = s * 0.12

  // Main cross arms
  ctx.beginPath()
  // Vertical arm
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

  // Diamond at center
  const d = arm * 2
  ctx.beginPath()
  ctx.moveTo(cx, cy - d)
  ctx.lineTo(cx + d, cy)
  ctx.lineTo(cx, cy + d)
  ctx.lineTo(cx - d, cy)
  ctx.closePath()
  ctx.stroke()
}
