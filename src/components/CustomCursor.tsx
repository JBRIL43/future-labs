'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const rafRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
      if (!visible) setVisible(true)

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null
      if (target) {
        const isInteractive = !!target.closest('a, button, [role="button"], input, textarea, select, .bento-card')
        setIsHovered(isInteractive)
      }
    }

    const onEnter = () => setVisible(true)
    const onLeave = () => setVisible(false)

    const tick = () => {
      const rp = ringPos.current
      const mp = mousePos.current
      rp.x += (mp.x - rp.x) * 0.35
      rp.y += (mp.y - rp.y) * 0.35
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rp.x}px, ${rp.y}px, 0)`
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
      {/* Precision Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0, willChange: 'transform' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div
            className={`rounded-full bg-primary transition-all duration-150 ${
              isHovered ? 'w-3 h-3 bg-primary' : 'w-2 h-2'
            }`}
            style={{
              boxShadow: '0 0 10px rgba(0, 201, 167, 0.8), 0 0 20px rgba(0, 201, 167, 0.4)',
            }}
          />
        </div>
      </div>

      {/* Lagging Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0, willChange: 'transform' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div
            className={`rounded-full border border-primary/40 transition-all duration-200 ${
              isHovered
                ? 'w-10 h-10 border-primary/60 bg-primary/10'
                : 'w-7 h-7 bg-transparent'
            }`}
            style={{
              boxShadow: '0 0 12px rgba(0, 201, 167, 0.15)',
            }}
          />
        </div>
      </div>
    </>
  )
}
