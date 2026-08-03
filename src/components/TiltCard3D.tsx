'use client'

import { useRef, useState, type ReactNode, type MouseEvent } from 'react'

interface TiltCard3DProps {
  children: ReactNode
  className?: string
  tiltDegree?: number
  glareOpacity?: number
  scaleOnHover?: number
}

export function TiltCard3D({
  children,
  className = '',
  tiltDegree = 8,
  glareOpacity = 0.06,
  scaleOnHover = 1.02,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [shinePos, setShinePos] = useState({ x: '50%', y: '50%' })
  const [isHovering, setIsHovering] = useState(false)
  const [shadowStyle, setShadowStyle] = useState({})

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltDegree
    const rotateY = ((x - centerX) / centerX) * tiltDegree

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scaleOnHover}, ${scaleOnHover}, 1.05)`)
    setShinePos({ x: `${(x / rect.width) * 100}%`, y: `${(y / rect.height) * 100}%` })

    // Dynamic shadow based on tilt
    const shadowX = (x - centerX) / centerX * 15
    const shadowY = (y - centerY) / centerY * 15
    setShadowStyle({
      boxShadow: `
        ${shadowX}px ${shadowY + 8}px 30px rgba(0,0,0,0.4),
        0 0 ${isHovering ? 40 : 20}px rgba(16,185,129,${isHovering ? 0.1 : 0.05}),
        inset 0 1px 0 rgba(255,255,255,${isHovering ? 0.06 : 0.03})
      `,
    })
  }

  const handleMouseEnter = () => setIsHovering(true)

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setShinePos({ x: '50%', y: '50%' })
    setIsHovering(false)
    setShadowStyle({})
  }

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform,
        transition: isHovering ? 'transform 0.1s ease-out, box-shadow 0.3s ease' : 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.5s ease',
        ...shadowStyle,
      }}
    >
      {/* Glare/shine overlay */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-[1] transition-opacity duration-300"
        style={{
          opacity: isHovering ? glareOpacity : 0,
          background: `radial-gradient(600px circle at ${shinePos.x} ${shinePos.y}, rgba(16,185,129,0.15), transparent 40%)`,
          borderRadius: 'inherit',
        }}
      />
      {/* Edge light effect */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-[1] transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `linear-gradient(${Math.atan2(parseFloat(shinePos.y) - 50, parseFloat(shinePos.x) - 50) * (180 / Math.PI) + 90}deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)`,
          borderRadius: 'inherit',
        }}
      />
      <div style={{ transformStyle: 'preserve-3d', position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}
