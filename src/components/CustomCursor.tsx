'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const posRef = useRef({ x: -100, y: -100 })
  const followerPosRef = useRef({ x: -100, y: -100 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    // Only show custom cursor on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)

      // Dot follows instantly — direct DOM write, no React state
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Smooth follower — snappy lerp (0.35 = fluid but responsive)
    const animate = () => {
      const fp = followerPosRef.current
      const tp = posRef.current
      fp.x += (tp.x - fp.x) * 0.35
      fp.y += (tp.y - fp.y) * 0.35

      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${fp.x}px, ${fp.y}px)`
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animRef.current)
    }
  }, [isVisible])

  return (
    <>
      {/* Main cursor dot — instant, no transition */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
          willChange: 'transform',
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 rounded-full bg-primary" style={{
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.3)',
          }} />
        </div>
      </div>
      {/* Follower ring — snappy, not laggy */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
          willChange: 'transform',
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 rounded-full border border-primary/30" style={{
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.1), inset 0 0 12px rgba(16, 185, 129, 0.05)',
          }} />
        </div>
      </div>
    </>
  )
}
