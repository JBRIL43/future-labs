'use client'

import { motion } from 'framer-motion'

interface ShapeProps {
  className?: string
  style?: React.CSSProperties
}

function Cube({ className, style }: ShapeProps) {
  return (
    <div className={className} style={style}>
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 border border-emerald-500/20" style={{ transform: 'translateZ(20px)' }} />
        <div className="absolute inset-0 border border-emerald-500/15" style={{ transform: 'translateZ(-20px)' }} />
        <div className="absolute inset-0 border border-emerald-500/15 bg-emerald-500/[0.02]" style={{ transform: 'rotateY(90deg) translateZ(20px)' }} />
        <div className="absolute inset-0 border border-emerald-500/10 bg-emerald-500/[0.01]" style={{ transform: 'rotateY(-90deg) translateZ(20px)' }} />
        <div className="absolute inset-0 border border-emerald-500/15 bg-emerald-500/[0.02]" style={{ transform: 'rotateX(90deg) translateZ(20px)' }} />
        <div className="absolute inset-0 border border-emerald-500/10" style={{ transform: 'rotateX(-90deg) translateZ(20px)' }} />
      </div>
    </div>
  )
}

function Octahedron({ className, style }: ShapeProps) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" />
        <polygon points="50,5 95,50 50,50" fill="rgba(16,185,129,0.02)" stroke="rgba(16,185,129,0.12)" strokeWidth="0.3" />
        <polygon points="50,5 50,50 5,50" fill="rgba(16,185,129,0.03)" stroke="rgba(16,185,129,0.12)" strokeWidth="0.3" />
        <polygon points="95,50 50,95 50,50" fill="rgba(16,185,129,0.02)" stroke="rgba(16,185,129,0.12)" strokeWidth="0.3" />
        <polygon points="5,50 50,95 50,50" fill="rgba(16,185,129,0.01)" stroke="rgba(16,185,129,0.12)" strokeWidth="0.3" />
      </svg>
    </div>
  )
}

function Ring3D({ className, style }: ShapeProps) {
  return (
    <div className={className} style={style}>
      <div className="w-full h-full rounded-full border border-emerald-500/20" style={{
        boxShadow: '0 0 15px rgba(16,185,129,0.05), inset 0 0 15px rgba(16,185,129,0.03)',
      }} />
    </div>
  )
}

function Sphere3D({ className, style }: ShapeProps) {
  return (
    <div className={className} style={style}>
      <div className="w-full h-full rounded-full" style={{
        background: 'radial-gradient(circle at 30% 30%, rgba(16,185,129,0.08), rgba(16,185,129,0.02) 50%, transparent 70%)',
        boxShadow: '0 0 20px rgba(16,185,129,0.05), inset 0 0 20px rgba(16,185,129,0.02)',
      }} />
    </div>
  )
}

interface FloatingShapes3DProps {
  variant?: 'hero' | 'subtle'
}

export function FloatingShapes3D({ variant = 'hero' }: FloatingShapes3DProps) {
  const isHero = variant === 'hero'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: '1200px' }}>
      {/* Large floating cube - top right */}
      <motion.div
        className="absolute shape-3d"
        style={{
          top: isHero ? '10%' : '5%',
          right: isHero ? '8%' : '12%',
          width: isHero ? 80 : 50,
          height: isHero ? 80 : 50,
        }}
        animate={{
          y: [0, -30, -10, -35, 0],
          rotateX: [0, 45, 90, 135, 360],
          rotateY: [0, -30, -60, -90, -360],
          rotateZ: [0, 10, -5, 15, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        <Cube />
      </motion.div>

      {/* Octahedron - left side */}
      <motion.div
        className="absolute shape-3d"
        style={{
          top: isHero ? '25%' : '15%',
          left: isHero ? '5%' : '8%',
          width: isHero ? 60 : 40,
          height: isHero ? 60 : 40,
        }}
        animate={{
          y: [0, -20, -40, -15, 0],
          x: [0, 10, -5, 15, 0],
          rotateX: [0, 90, 180, 270, 360],
          rotateZ: [0, -45, 45, -45, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <Octahedron />
      </motion.div>

      {/* Ring - center left */}
      <motion.div
        className="absolute shape-3d"
        style={{
          top: isHero ? '60%' : '55%',
          left: isHero ? '12%' : '15%',
          width: isHero ? 120 : 70,
          height: isHero ? 120 : 70,
        }}
        animate={{
          y: [0, -15, 5, -20, 0],
          rotateX: [0, 180, 360],
          rotateY: [0, -90, -180],
          scale: [1, 1.1, 1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Ring3D />
      </motion.div>

      {/* Sphere - bottom right */}
      <motion.div
        className="absolute shape-3d"
        style={{
          bottom: isHero ? '15%' : '20%',
          right: isHero ? '15%' : '18%',
          width: isHero ? 50 : 35,
          height: isHero ? 50 : 35,
        }}
        animate={{
          y: [0, -25, -10, -30, 0],
          x: [0, -10, 5, -8, 0],
          scale: [1, 1.15, 1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sphere3D />
      </motion.div>

      {/* Small cube - floating mid */}
      <motion.div
        className="absolute shape-3d"
        style={{
          top: isHero ? '45%' : '40%',
          right: isHero ? '25%' : '30%',
          width: isHero ? 35 : 25,
          height: isHero ? 35 : 25,
        }}
        animate={{
          y: [0, -40, -20, -50, 0],
          rotateX: [0, 90, 180, 270, 360],
          rotateY: [360, 270, 180, 90, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <Cube />
      </motion.div>

      {/* Second ring - top center */}
      <motion.div
        className="absolute shape-3d"
        style={{
          top: isHero ? '8%' : '5%',
          left: isHero ? '35%' : '40%',
          width: isHero ? 40 : 28,
          height: isHero ? 40 : 28,
          opacity: 0.6,
        }}
        animate={{
          y: [0, -10, -25, -5, 0],
          rotateX: [0, -180, -360],
          rotateZ: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        <Ring3D />
      </motion.div>

      {/* Small sphere - bottom left */}
      {isHero && (
        <motion.div
          className="absolute shape-3d"
          style={{
            bottom: '30%',
            left: '25%',
            width: 25,
            height: 25,
          }}
          animate={{
            y: [0, -20, -8, -25, 0],
            x: [0, 8, -4, 12, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sphere3D />
        </motion.div>
      )}

      {/* Light beams */}
      {isHero && (
        <>
          <div className="light-beam" style={{ left: '20%', '--beam-duration': '7s', '--beam-delay': '0s' } as React.CSSProperties} />
          <div className="light-beam" style={{ left: '45%', '--beam-duration': '9s', '--beam-delay': '3s' } as React.CSSProperties} />
          <div className="light-beam" style={{ left: '70%', '--beam-duration': '8s', '--beam-delay': '5s' } as React.CSSProperties} />
          <div className="light-beam" style={{ left: '85%', '--beam-duration': '10s', '--beam-delay': '1s' } as React.CSSProperties} />
        </>
      )}
    </div>
  )
}
