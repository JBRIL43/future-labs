'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const rafRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      // Dot: instant — write directly to DOM
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`
      }
      if (!visible) setVisible(true)
    }

    const onEnter = () => setVisible(true)
    const onLeave = () => setVisible(false)

    // Ring: smooth follow at 60fps via rAF (no React re-renders)
    const tick = () => {
      const rp = ringPos.current
      const mp = mousePos.current
      rp.x += (mp.x - rp.x) * 0.55
      rp.y += (mp.y - rp.y) * 0.55
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rp.x}px,${rp.y}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [visible])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ opacity: visible ? 1 : 0, willChange: 'transform' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 rounded-full bg-primary" style={{
            boxShadow: '0 0 8px rgba(16,185,129,0.8), 0 0 20px rgba(16,185,129,0.3)',
          }} />
        </div>
      </div>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ opacity: visible ? 1 : 0, willChange: 'transform' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="w-7 h-7 rounded-full border border-primary/25" style={{
            boxShadow: '0 0 10px rgba(16,185,129,0.08)',
          }} />
        </div>
      </div>
    </>
  )
}
