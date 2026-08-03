'use client'

// Pure CSS animations — no Framer Motion, zero main-thread jank

const ETHIOPIAN_CROSSES = [
  { path: 'M12 2v8h-8v4h8v8h4v-8h8v-4h-8V2h-4zM6 6h-4v2h4V6zM22 6h-4v2h4V6zM6 18h-4v2h4v-2zM22 18h-4v2h4v-2z', viewBox: '0 0 28 28' },
  { path: 'M12 1v6H6v4h6v6h4v-6h6v-4h-6V1h-4zM4 4h-2v2h2V4zM24 4h-2v2h2V4zM4 20h-2v2h2v-2zM24 20h-2v2h2v-2zM12 21v6h4v-6h-4z', viewBox: '0 0 28 28' },
  { path: 'M14 1L14 6 9 6 9 9 6 9 6 14 1 14 1 18 6 18 6 23 9 23 9 26 14 26 14 21 19 21 19 18 22 18 22 14 27 14 27 10 22 10 22 7 19 7 19 4 14 4Z', viewBox: '0 0 28 28' },
  { path: 'M14 0v8M14 20v8M6 14h-6M28 14h-6M14 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16z', viewBox: '0 0 28 28' },
]

function MeskelDaisy({ size = 40, color = 'rgba(245, 158, 11, 0.06)' }: { size?: number; color?: string }) {
  const petals = 8
  const petalLength = size * 0.4
  const petalWidth = size * 0.12
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse
          key={i}
          cx={size / 2}
          cy={size / 2 - petalLength / 2}
          rx={petalWidth}
          ry={petalLength / 2}
          fill={color}
          transform={`rotate(${(i * 360) / petals} ${size / 2} ${size / 2})`}
        />
      ))}
      <circle cx={size / 2} cy={size / 2} r={size * 0.12} fill={color} fillOpacity={1.5} />
    </svg>
  )
}

function Jebena({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 50 65" fill="none">
      <path d="M15 20 C15 12, 35 12, 35 20 L33 45 C33 55, 17 55, 17 45 Z" stroke="rgba(245, 158, 11, 0.06)" strokeWidth="0.8" fill="rgba(245, 158, 11, 0.01)" />
      <path d="M35 28 C40 28, 45 24, 45 18" stroke="rgba(245, 158, 11, 0.06)" strokeWidth="0.8" fill="none" />
      <path d="M15 25 C8 25, 6 35, 15 38" stroke="rgba(245, 158, 11, 0.06)" strokeWidth="0.8" fill="none" />
      <ellipse cx="25" cy="20" rx="10" ry="3" stroke="rgba(245, 158, 11, 0.06)" strokeWidth="0.6" fill="rgba(245, 158, 11, 0.01)" />
      <ellipse cx="25" cy="55" rx="8" ry="2" stroke="rgba(245, 158, 11, 0.06)" strokeWidth="0.6" fill="rgba(245, 158, 11, 0.01)" />
    </svg>
  )
}

export function EthiopianCulturalOverlay() {
  const chars = 'ፊደል ቋንቋ አማርኛ ግእዝ ትግርኛ ኦሮሞ'

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* ===== FLOATING ETHIOPIAN CROSSES (CSS animated) ===== */}
      <div className="absolute" style={{ top: '12%', left: '6%', opacity: 0.04, animation: 'eth-cross-float 40s ease-in-out infinite' }}>
        <svg width="60" height="60" viewBox={ETHIOPIAN_CROSSES[0].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[0].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="absolute" style={{ top: '30%', right: '8%', opacity: 0.035, animation: 'drift 35s linear infinite' }}>
        <svg width="45" height="45" viewBox={ETHIOPIAN_CROSSES[1].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[1].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="absolute" style={{ bottom: '25%', left: '10%', opacity: 0.03, animation: 'eth-cross-float 45s ease-in-out infinite reverse' }}>
        <svg width="55" height="55" viewBox={ETHIOPIAN_CROSSES[2].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[2].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="absolute" style={{ bottom: '15%', right: '12%', opacity: 0.025, animation: 'spin-slow 50s linear infinite' }}>
        <svg width="70" height="70" viewBox={ETHIOPIAN_CROSSES[3].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[3].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.6" />
        </svg>
      </div>

      <div className="absolute" style={{ top: '50%', left: '3%', opacity: 0.02, animation: 'eth-cross-float 60s ease-in-out infinite' }}>
        <svg width="90" height="90" viewBox={ETHIOPIAN_CROSSES[0].viewBox} fill="none">
          <path d={ETHIOPIAN_CROSSES[0].path} stroke="rgba(16, 185, 129, 1)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ===== ADEY ABEBA (MESKEL DAISY) ===== */}
      <div className="absolute" style={{ top: '8%', right: '20%', opacity: 0.5, animation: 'daisy-spin 30s linear infinite' }}>
        <MeskelDaisy size={35} color="rgba(245, 158, 11, 0.05)" />
      </div>

      <div className="absolute" style={{ bottom: '35%', right: '5%', opacity: 0.4, animation: 'daisy-spin 35s linear infinite reverse' }}>
        <MeskelDaisy size={28} color="rgba(245, 158, 11, 0.04)" />
      </div>

      <div className="absolute" style={{ top: '65%', left: '18%', opacity: 0.3, animation: 'daisy-pulse 40s ease-in-out infinite' }}>
        <MeskelDaisy size={22} color="rgba(245, 158, 11, 0.035)" />
      </div>

      {/* ===== JEBENA ===== */}
      <div className="absolute" style={{ top: '20%', left: '18%', opacity: 0.4, animation: 'float-slow 20s ease-in-out infinite' }}>
        <Jebena size={40} />
      </div>

      <div className="absolute" style={{ bottom: '20%', right: '22%', opacity: 0.3, animation: 'float-reverse 25s ease-in-out infinite' }}>
        <Jebena size={32} />
      </div>

      {/* ===== TRICOLOR ACCENT LINE ===== */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="w-full h-full" style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(16, 185, 129, 0.15) 20%, rgba(245, 158, 11, 0.12) 50%, rgba(239, 68, 68, 0.1) 80%, transparent 95%)',
        }} />
      </div>

      {/* ===== GEEZ SCRIPT BORDER (CSS marquee) ===== */}
      <div className="absolute top-[1px] left-0 right-0 overflow-hidden">
        <div style={{
          display: 'flex',
          gap: '2rem',
          whiteSpace: 'nowrap',
          animation: 'marquee 60s linear infinite',
        }}>
          <span className="text-primary/[0.04] text-sm tracking-[0.5em] uppercase font-mono">
            {chars} &bull; {chars} &bull; {chars} &bull; {chars} &bull;
          </span>
          <span className="text-primary/[0.04] text-sm tracking-[0.5em] uppercase font-mono">
            {chars} &bull; {chars} &bull; {chars} &bull; {chars} &bull;
          </span>
        </div>
      </div>

      {/* ===== INJERA PATTERN ===== */}
      <div className="absolute" style={{ top: '40%', right: '2%', opacity: 0.02, animation: 'spin-slow 120s linear infinite' }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {[40, 60, 80, 100, 120, 140].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(245, 158, 11, 1)" strokeWidth="0.3" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * Math.PI * 2) / 12
            return (
              <circle key={`dot-${i}`} cx={100 + Math.cos(angle) * 90} cy={100 + Math.sin(angle) * 90} r="2" fill="rgba(245, 158, 11, 1)" />
            )
          })}
        </svg>
      </div>

      {/* ===== TIBEB PATTERN ===== */}
      <div className="absolute" style={{ bottom: '40%', left: '1%', opacity: 0.025, animation: 'float-slow 15s ease-in-out infinite' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
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
          <polygon
            points="60,42 66,54 78,54 68,62 72,74 60,66 48,74 52,62 42,54 54,54"
            fill="none"
            stroke="rgba(245, 158, 11, 1)"
            strokeWidth="0.4"
          />
        </svg>
      </div>
    </div>
  )
}
