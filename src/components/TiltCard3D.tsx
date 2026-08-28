'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BentoCardProps {
  children: ReactNode
  className?: string
  tiltDegree?: number // kept for prop backward compatibility
  glareOpacity?: number // kept for backward compatibility
  scaleOnHover?: number
}

export function TiltCard3D({
  children,
  className = '',
}: BentoCardProps) {
  return (
    <div
      className={cn(
        'bento-card relative overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  )
}
