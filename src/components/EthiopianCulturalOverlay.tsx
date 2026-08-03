'use client'

import { motion } from 'framer-motion'

// Axumite Ethiopian Cross SVG paths - various traditional designs
const ETHIOPIAN_CROSSES = [
  // Lalibela Cross
  {
    path: 'M12 2v8h-8v4h8v8h4v-8h8v-4h-8V2h-4zM6 6h-4v2h4V6zM22 6h-4v2h4V6zM6 18h-4v2h4v-2zM22 18h-4v2h4v-2z',
    viewBox: '0 0 28 28',
  },
  // Axum Cross
  {
    path: 'M12 1v6H6v4h6v6h4v-6h6v-4h-6V1h-4zM4 4h-2v2h2V4zM24 4h-2v2h2V4zM4 20h-2v2h2v-2zM24 20h-2v2h2v-2zM12 21v6h4v-6h-4z',
    viewBox: '0 0 28 28',
  },
  // Gondar Cross (complex)
  {
    path: 'M14 1L14 6 9 6 9 9 6 9 6 14 1 14 1 18 6 18 6 23 9 23 9 26 14 26 14 21 19 21 19 18 22 18 22 14 27 14 27 10 22 10 22 7 19 7 19 4 14 4Z',
    viewBox: '0 0 28 28',
  },
  // Processional Cross
  {
    path: 'M14 0v8M14 20v8M6 14h-6M28 14h-6M14 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16z',
    viewBox: '0 0 28 28',
  },
]

// Adey Abeba (Meskel Daisy) - simplified SVG
function MeskelDaisy({ size = 40, color = 'rgba(245, 158, 11, 0.06)' }: { size?: number; color?: string }) {
  const petals = 8
  const petalLength = size * 0.4
  const petalWidth = size * 0.12
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * 360) / petals
        return (
          <ellipse
            key={i}
            cx={size / 2}
            cy={size / 2 - petalLength / 2}
            rx={petalWidth}
            ry={petalLength / 2}
            fill={color}
            transform={`rotate(${angle} ${size / 2} ${size / 2})`}
          />
        )
      })}
      {/* Center */}
      <circle cx={size / 2} cy={size / 2} r={size * 0.12} fill={color} fillOpacity={1.5} />
    </svg>
  )
}

// Jebena (Ethiopian coffee pot) silhouette
function Jebena({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 50 65" fill="none">
      {/* Body */}
      <path
        d="M15 20 C15 12, 35 12, 35 20 L33 45 C33 55, 17 55, 17 45 Z"
        stroke="rgba(245, 158, 11, 0.06)"
        strokeWidth="0.8"
        fill="rgba(245, 158, 11, 0.01)"
      />
      {/* Spout */}
      <path
        d="M35 28 C40 28, 45 24, 45 18"
        stroke="rgba(245, 158, 11, 0.06)"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Handle */}
      <path
        d="M15 25 C8 25, 6 35, 15 38"
        stroke="rgba(245, 158, 11, 0.06)"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Lid */}
      <ellipse
        cx="25" cy="20" rx="10" ry="3"
        stroke="rgba(245, 158, 11, 0.06)"
        strokeWidth="0.6"
        fill="rgba(245, 158, 11, 0.01)"
      />
      {/* Base */}
      <ellipse
        cx="25" cy="55" rx="8" ry="2"
        stroke="rgba(245, 158, 11, 0.06)"
        strokeWidth="0.6"
        fill="rgba(245, 158, 11, 0.01)"
      />
    </svg>
  )
}

// Ge'ez script decorative border pattern
function GezBorderPattern({ className }: { className?: string }) {
  const chars = 'ፊደል ቋንቋ አማርኛ ግእዝ ትግርኛ ኦሮሞ'
  return (
    <div className={`overflow-hidden ${className || ''}`}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <span className="text-primary/[0.04] text-sm tracking-[0.5em] uppercase font-mono">
          {chars} &bull; {chars} &bull; {chars} &bull; {chars} &bull;
        </span>
        <span className="text-primary/[0.04] text-sm tracking-[0.5em] uppercase font-mono">
          {chars} &bull; {chars} &bull; {chars} &bull; {chars} &bull;
        </span>
      </motion.div>
    </div>
  )
}

export function EthiopianCulturalOverlay() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* ===== FLOATING ETHIOPIAN CROSSES ===== */}
      {/* Cross 1 - Top left area */}
      <motion.div
        className="absolute"
        style={{ top: '12%', left: '6%', opacity: 0.04 }}
        animate={{
          y: [0, -20, 0, -15, 0],
          rotate: [0, 45, 90, 135, 360],
          scale: [1, 1.05, 1, 1.03, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="60" height="60" viewBox={ETHIOPIAN_CROSSES[0].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[0].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.8" />
        </svg>
      </motion.div>

      {/* Cross 2 - Right area */}
      <motion.div
        className="absolute"
        style={{ top: '30%', right: '8%', opacity: 0.035 }}
        animate={{
          y: [0, 15, -10, 20, 0],
          rotate: [360, 315, 270, 225, 0],
          scale: [1, 1.08, 0.95, 1.04, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="45" height="45" viewBox={ETHIOPIAN_CROSSES[1].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[1].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.8" />
        </svg>
      </motion.div>

      {/* Cross 3 - Bottom left */}
      <motion.div
        className="absolute"
        style={{ bottom: '25%', left: '10%', opacity: 0.03 }}
        animate={{
          y: [0, -12, 8, -18, 0],
          x: [0, 8, -5, 10, 0],
          rotate: [0, -90, -180, -270, -360],
        }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="55" height="55" viewBox={ETHIOPIAN_CROSSES[2].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[2].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.8" />
        </svg>
      </motion.div>

      {/* Cross 4 - Bottom right */}
      <motion.div
        className="absolute"
        style={{ bottom: '15%', right: '12%', opacity: 0.025 }}
        animate={{
          y: [0, 10, -15, 5, 0],
          rotate: [0, 120, 240, 360, 480],
          scale: [1, 0.95, 1.1, 0.98, 1],
        }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="70" height="70" viewBox={ETHIOPIAN_CROSSES[3].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[3].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.6" />
        </svg>
      </motion.div>

      {/* Cross 5 - Center left (large, very faint) */}
      <motion.div
        className="absolute"
        style={{ top: '50%', left: '3%', opacity: 0.02 }}
        animate={{
          y: [0, -25, -10, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="90" height="90" viewBox={ETHIOPIAN_CROSSES[0].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[0].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* ===== ADEY ABEBA (MESKEL DAISY) MOTIFS ===== */}
      <motion.div
        className="absolute"
        style={{ top: '8%', right: '20%', opacity: 0.5 }}
        animate={{
          y: [0, -10, 5, -15, 0],
          rotate: [0, 60, 120, 180, 360],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MeskelDaisy size={35} color="rgba(245, 158, 11, 0.05)" />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ bottom: '35%', right: '5%', opacity: 0.4 }}
        animate={{
          y: [0, 12, -8, 15, 0],
          rotate: [360, 300, 240, 180, 0],
          scale: [1, 0.9, 1.08, 0.95, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MeskelDaisy size={28} color="rgba(245, 158, 11, 0.04)" />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ top: '65%', left: '18%', opacity: 0.3 }}
        animate={{
          y: [0, -8, 12, -5, 0],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <MeskelDaisy size={22} color="rgba(245, 158, 11, 0.035)" />
      </motion.div>

      {/* ===== JEBENA (COFFEE POT) SILHOUETTES ===== */}
      <motion.div
        className="absolute"
        style={{ top: '20%', left: '18%', opacity: 0.4 }}
        animate={{
          y: [0, -15, 5, -10, 0],
          rotate: [-2, 2, -1, 1, -2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Jebena size={40} />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ bottom: '20%', right: '22%', opacity: 0.3 }}
        animate={{
          y: [0, 8, -12, 5, 0],
          rotate: [1, -2, 2, -1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Jebena size={32} />
      </motion.div>

      {/* ===== ETHIOPIAN FLAG TRICOLOR ACCENT LINES ===== */}
      {/* Subtle horizontal tricolor line - top */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="w-full h-full" style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(16, 185, 129, 0.15) 20%, rgba(245, 158, 11, 0.12) 50%, rgba(239, 68, 68, 0.1) 80%, transparent 95%)',
        }} />
      </div>

      {/* ===== GEEZ SCRIPT BORDER PATTERN ===== */}
      <div className="absolute top-[1px] left-0 right-0">
        <GezBorderPattern />
      </div>

      {/* ===== INJERA PATTERN (CIRCULAR EYE PATTERN) - SUBTLE ===== */}
      <motion.div
        className="absolute"
        style={{ top: '40%', right: '2%', opacity: 0.02 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Concentric circles mimicking injera eyes */}
          {[40, 60, 80, 100, 120, 140].map((r) => (
            <circle
              key={r}
              cx="100" cy="100" r={r}
              fill="none"
              stroke="rgba(245, 158, 11, 1)"
              strokeWidth="0.3"
            />
          ))}
          {/* Dot pattern inside */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 12
            const r = 90
            return (
              <circle
                key={`dot-${i}`}
                cx={100 + Math.cos(angle) * r}
                cy={100 + Math.sin(angle) * r}
                r="2"
                fill="rgba(245, 158, 11, 1)"
              />
            )
          })}
        </svg>
      </motion.div>

      {/* ===== TIBEB PATTERN (ETHIOPIAN TEXTILE BORDER) ===== */}
      <motion.div
        className="absolute"
        style={{ bottom: '40%', left: '1%', opacity: 0.025 }}
        animate={{ y: [0, -5, 0, 5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Diamond/tibeb pattern */}
          {[-1, 0, 1].map((row) =>
            [-1, 0, 1].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={60 + col * 20 - 8}
                y={60 + row * 20 - 8}
                width="16" height="16"
                transform={`rotate(45 ${60 + col * 20} ${60 + row * 20})`}
                fill="none"
                stroke="rgba(16, 185, 129, 1)"
                strokeWidth="0.4"
              />
            ))
          )}
          {/* Center star */}
          <polygon
            points="60,42 66,54 78,54 68,62 72,74 60,66 48,74 52,62 42,54 54,54"
            fill="none"
            stroke="rgba(245, 158, 11, 1)"
            strokeWidth="0.4"
          />
        </svg>
      </motion.div>
    </div>
  )
}
