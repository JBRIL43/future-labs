'use client'

/**
 * PageBackground — two-canvas approach for performance:
 *
 * 1. staticCanvas  — `position: absolute`, covers full document height.
 *    Drawn ONCE on mount (and on resize). Grid, blobs, rings, circuit lines.
 *    Zero per-frame cost after initial paint.
 *
 * 2. animCanvas   — `position: fixed`, covers only the viewport.
 *    Runs at ~20fps (every 50ms). Only draws the small drifting particles.
 *    Tiny surface, minimal compositing cost.
 */

import { useEffect, useRef } from 'react'

/* ── deterministic pseudo-random (no hydration mismatch) ── */
function makeRand(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/* ── hex → rgba helper ── */
function rgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

const TEAL  = '#00C9A7'
const AMBER = '#F5A623'
const GRID  = 72   // px between grid lines — larger = fewer lines = faster

/* ────────────────────────────────────────────────────────── */
/* STATIC LAYER — drawn once                                  */
/* ────────────────────────────────────────────────────────── */
function drawStatic(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.clearRect(0, 0, W, H)

  /* 1 — Grid lines */
  ctx.beginPath()
  ctx.strokeStyle = rgba(TEAL, 0.03)
  ctx.lineWidth = 0.5
  for (let x = 0; x <= W; x += GRID) { ctx.moveTo(x, 0); ctx.lineTo(x, H) }
  for (let y = 0; y <= H; y += GRID) { ctx.moveTo(0, y); ctx.lineTo(W, y) }
  ctx.stroke()

  /* 2 — Grid intersection dots (sample every 2nd to halve count) */
  ctx.fillStyle = rgba(TEAL, 0.04)
  for (let x = 0; x <= W; x += GRID * 2) {
    for (let y = 0; y <= H; y += GRID * 2) {
      ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill()
    }
  }

  /* 3 — Ambient blobs */
  const blobs = [
    { xp: 12,  yp: 6,   rp: 35, color: TEAL,      a: 0.045 },
    { xp: 88,  yp: 20,  rp: 28, color: AMBER,      a: 0.028 },
    { xp: 50,  yp: 42,  rp: 40, color: TEAL,       a: 0.025 },
    { xp: 8,   yp: 62,  rp: 25, color: '#8b5cf6',  a: 0.025 },
    { xp: 92,  yp: 76,  rp: 32, color: TEAL,       a: 0.030 },
    { xp: 55,  yp: 90,  rp: 28, color: AMBER,      a: 0.022 },
  ]
  blobs.forEach(b => {
    const cx = (b.xp / 100) * W
    const cy = (b.yp / 100) * H
    const r  = (b.rp / 100) * Math.max(W, H)
    const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    g.addColorStop(0, rgba(b.color, b.a))
    g.addColorStop(1, rgba(b.color, 0))
    ctx.fillStyle = g
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
  })

  /* 4 — Ellipse rings (static snapshot, no animation) */
  const rand = makeRand(99)
  for (let i = 0; i < 7; i++) {
    const cx    = rand() * W
    const cy    = rand() * H
    const rx    = rand() * 180 + 100
    const ry    = rand() * 70  + 35
    const angle = rand() * Math.PI
    const col   = i % 2 === 0 ? TEAL : AMBER
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
    ctx.strokeStyle = rgba(col, 0.038)
    ctx.lineWidth = 0.8
    ctx.stroke()
    ctx.restore()
  }

  /* 5 — Corner circuit lines */
  const drawPath = (path: [number,number][], stroke: string) => {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 0.7
    ctx.lineCap = 'round'
    ctx.beginPath()
    path.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
    ctx.stroke()
    // node dots
    ctx.fillStyle = rgba(TEAL, 0.1)
    path.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill() })
  }

  const tealStroke  = rgba(TEAL,  0.055)
  const amberStroke = rgba(AMBER, 0.040)

  // Top-left
  ;[
    [[0,80],[60,80],[60,120],[130,120]] as [number,number][],
    [[0,150],[45,150],[45,210],[110,210],[110,170],[175,170]] as [number,number][],
    [[85,0],[85,55],[150,55]] as [number,number][],
  ].forEach(p => drawPath(p, tealStroke))

  // Bottom-right
  ;[
    [[W, H-80],[W-60,H-80],[W-60,H-120],[W-130,H-120]] as [number,number][],
    [[W, H-150],[W-45,H-150],[W-45,H-200],[W-110,H-200]] as [number,number][],
    [[W-85,H],[W-85,H-55],[W-150,H-55]] as [number,number][],
  ].forEach(p => drawPath(p, tealStroke))

  // Top-right amber accent
  ;[
    [[W-120,0],[W-120,48],[W-185,48],[W-185,95]] as [number,number][],
    [[W,65],[W-55,65],[W-55,115],[W-115,115]] as [number,number][],
  ].forEach(p => drawPath(p, amberStroke))
}

/* ────────────────────────────────────────────────────────── */
/* ANIMATED LAYER — viewport only, ~20fps                     */
/* ────────────────────────────────────────────────────────── */
const PARTICLE_COUNT = 28

function makeParticles() {
  const rand = makeRand(7)
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    x:       rand() * (typeof window !== 'undefined' ? window.innerWidth  : 1440),
    y:       rand() * (typeof window !== 'undefined' ? window.innerHeight : 900),
    r:       rand() * 1.3 + 0.4,
    vx:      (rand() - 0.5) * 0.18,
    vy:      (rand() - 0.5) * 0.10,
    opacity: rand() * 0.16 + 0.04,
    color:   i % 3 === 0 ? AMBER : TEAL,
  }))
}

/* ────────────────────────────────────────────────────────── */
/* COMPONENT                                                   */
/* ────────────────────────────────────────────────────────── */
export function PageBackground() {
  const staticRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const particles = useRef(makeParticles())

  useEffect(() => {
    const staticCanvas = staticRef.current!
    const animCanvas   = animRef.current!
    const sCtx = staticCanvas.getContext('2d')!
    const aCtx = animCanvas.getContext('2d')!

    /* Draw static layer */
    function resizeAndPaint() {
      const W = window.innerWidth
      const H = document.documentElement.scrollHeight
      staticCanvas.width  = W
      staticCanvas.height = H
      drawStatic(sCtx, W, H)

      animCanvas.width  = window.innerWidth
      animCanvas.height = window.innerHeight
    }

    /* Animated layer loop — capped at ~20fps */
    let lastFrame = 0
    function loop(ts: number) {
      rafRef.current = requestAnimationFrame(loop)
      if (ts - lastFrame < 50) return   // 20fps cap
      lastFrame = ts

      const VW = animCanvas.width
      const VH = animCanvas.height
      aCtx.clearRect(0, 0, VW, VH)

      const ps = particles.current
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = VW; else if (p.x > VW) p.x = 0
        if (p.y < 0) p.y = VH; else if (p.y > VH) p.y = 0
        aCtx.beginPath()
        aCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        aCtx.fillStyle = rgba(p.color, p.opacity)
        aCtx.fill()
      }
    }

    /* Debounced resize */
    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resizeAndPaint, 120)
    }
    window.addEventListener('resize', onResize, { passive: true })

    resizeAndPaint()
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <>
      {/* Static full-document layer */}
      <canvas
        ref={staticRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'auto',
        }}
      />
      {/* Animated viewport-only layer */}
      <canvas
        ref={animRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'auto',
        }}
      />
    </>
  )
}
