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

// Ethiopian cross shape (3D wireframe)
function EthCross3D({ className, style }: ShapeProps) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 60 60" className="w-full h-full eth-cross-glow">
        {/* Axumite cross with 3D depth illusion */}
        <path d="M28 4v14H14v8h14v14h4V26h14v-8H32V4h-4z" 
          fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="0.6" />
        <path d="M26 8v10H16v4h10v10h8V22h10v-4H34V8h-8z" 
          fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="0.4" strokeDasharray="2 2" />
        {/* Diamond center */}
        <rect x="26" y="26" width="8" height="8" transform="rotate(45 30 30)" 
          fill="none" stroke="rgba(245,158,11,0.1)" strokeWidth="0.4" />
        {/* Corner dots */}
        <circle cx="30" cy="4" r="1" fill="rgba(16,185,129,0.2)" />
        <circle cx="30" cy="56" r="1" fill="rgba(16,185,129,0.2)" />
        <circle cx="4" cy="30" r="1" fill="rgba(16,185,129,0.2)" />
        <circle cx="56" cy="30" r="1" fill="rgba(16,185,129,0.2)" />
      </svg>
    </div>
  )
}

// Meskel daisy 3D
function MeskelDaisy3D({ className, style }: ShapeProps) {
  return (
    <div className={className} style={style}>
      <svg viewBox="0 0 60 60" className="w-full h-full">
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36) * (Math.PI / 180)
          return (
            <ellipse
              key={i}
              cx="30"
              cy="18"
              rx="2.5"
              ry="10"
              fill="none"
              stroke="rgba(245,158,11,0.1)"
              strokeWidth="0.4"
              transform={`rotate(${i * 36} 30 30)`}
            />
          )
        })}
        <circle cx="30" cy="30" r="4" fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="0.5" />
        <circle cx="30" cy="30" r="2" fill="rgba(245,158,11,0.05)" />
      </svg>
    </div>
  )
}

// Ge'ez character floating element
function GezChar3D({ char, className, style }: ShapeProps & { char: string }) {
  return (
    <div className={className} style={style}>
      <span className="geez-watermark text-emerald-500/[0.08] text-xl block">
        {char}
      </span>
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

      {/* Ethiopian Cross - left side (NEW) */}
      <motion.div
        className="absolute shape-3d"
        style={{
          top: isHero ? '20%' : '12%',
          left: isHero ? '4%' : '7%',
          width: isHero ? 70 : 45,
          height: isHero ? 70 : 45,
        }}
        animate={{
          y: [0, -20, -40, -15, 0],
          x: [0, 10, -5, 15, 0],
          rotateX: [0, 90, 180, 270, 360],
          rotateZ: [0, -45, 45, -45, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <EthCross3D />
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

      {/* Meskel Daisy - bottom right (NEW) */}
      <motion.div
        className="absolute shape-3d"
        style={{
          bottom: isHero ? '18%' : '22%',
          right: isHero ? '12%' : '15%',
          width: isHero ? 55 : 35,
          height: isHero ? 55 : 35,
        }}
        animate={{
          y: [0, -25, -10, -30, 0],
          x: [0, -10, 5, -8, 0],
          scale: [1, 1.15, 1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        <MeskelDaisy3D />
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

      {/* Ge'ez character - top left area (NEW) */}
      <motion.div
        className="absolute shape-3d"
        style={{
          top: isHero ? '35%' : '25%',
          left: isHero ? '22%' : '28%',
          width: isHero ? 30 : 20,
          height: isHero ? 30 : 20,
        }}
        animate={{
          y: [0, -15, -30, -10, 0],
          rotateX: [0, 15, -10, 5, 0],
          rotateY: [0, -20, 10, -15, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      >
        <GezChar3D char="ፊ" />
      </motion.div>

      {/* Ge'ez character - right area (NEW) */}
      <motion.div
        className="absolute shape-3d"
        style={{
          top: isHero ? '55%' : '60%',
          right: isHero ? '8%' : '12%',
          width: isHero ? 25 : 18,
          height: isHero ? 25 : 18,
        }}
        animate={{
          y: [0, 10, -20, 5, 0],
          rotateX: [0, -10, 15, -5, 0],
          rotateY: [0, 20, -10, 15, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      >
        <GezChar3D char="ደ" />
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

      {/* Ethiopian Cross - bottom center (NEW) */}
      {isHero && (
        <motion.div
          className="absolute shape-3d"
          style={{
            bottom: '30%',
            left: '35%',
            width: 45,
            height: 45,
            opacity: 0.5,
          }}
          animate={{
            y: [0, -20, -8, -25, 0],
            x: [0, 8, -4, 12, 0],
            rotateX: [0, 180, 360],
            rotateZ: [0, -90, -180],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <EthCross3D />
        </motion.div>
      )}

      {/* Small sphere - bottom left */}
      {isHero && (
        <motion.div
          className="absolute shape-3d"
          style={{
            bottom: '15%',
            left: '8%',
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

      {/* Octahedron - mid right (replaced old left position) */}
      <motion.div
        className="absolute shape-3d"
        style={{
          top: isHero ? '70%' : '75%',
          right: isHero ? '30%' : '35%',
          width: isHero ? 40 : 28,
          height: isHero ? 40 : 28,
          opacity: 0.5,
        }}
        animate={{
          y: [0, -12, -25, -8, 0],
          rotateX: [0, 90, 180, 270, 360],
          rotateZ: [0, -45, 45, -45, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        <Octahedron />
      </motion.div>

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
