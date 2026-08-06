'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

/* ─── Product theme definition ─── */
export interface ProductTheme {
  /** Display name */
  name: string
  /** Core nucleus colour */
  core: string
  /** Orbital ring colour */
  ring: string
  /** Particle field colour */
  particle: string
  /** Satellite dot colours (3-5 items) */
  satellites: string[]
  /** Ambient glow colour (CSS, used outside canvas) */
  glow: string
}

/* ─── Registered products ─── */
export const PRODUCT_THEMES: Record<string, ProductTheme> = {
  daynflow: {
    name: 'Dayn Flow',
    core: '#F5A623',          // amber — food warmth
    ring: '#F5A623',
    particle: '#FFD580',      // soft golden
    satellites: ['#ef4444', '#f97316', '#eab308', '#10b981', '#F5A623'],
    glow: 'rgba(245,166,35,0.18)',
  },
  fintech: {
    name: 'FinTech Suite',
    core: '#3b82f6',          // blue — trust / finance
    ring: '#60a5fa',
    particle: '#93c5fd',
    satellites: ['#1d4ed8', '#3b82f6', '#60a5fa', '#7c3aed', '#06b6d4'],
    glow: 'rgba(59,130,246,0.18)',
  },
  healthtech: {
    name: 'HealthTech',
    core: '#10b981',          // emerald — health / growth
    ring: '#34d399',
    particle: '#6ee7b7',
    satellites: ['#059669', '#10b981', '#34d399', '#06b6d4', '#f0fdf4'],
    glow: 'rgba(16,185,129,0.18)',
  },
  edutech: {
    name: 'EduTech',
    core: '#8b5cf6',          // purple — creativity / learning
    ring: '#a78bfa',
    particle: '#c4b5fd',
    satellites: ['#7c3aed', '#8b5cf6', '#a78bfa', '#ec4899', '#f59e0b'],
    glow: 'rgba(139,92,246,0.18)',
  },
}

/* default fallback */
export const DEFAULT_THEME: ProductTheme = {
  name: 'Coming Soon',
  core: '#00C9A7',
  ring: '#00C9A7',
  particle: '#34d399',
  satellites: ['#00C9A7', '#F5A623', '#3b82f6', '#a855f7', '#10b981'],
  glow: 'rgba(0,201,167,0.15)',
}

/* ─── Sub-components ─── */

function OrbitCore({ theme }: { theme: ProductTheme }) {
  const coreRef = useRef<THREE.Mesh>(null)
  const glow1Ref = useRef<THREE.Mesh>(null)

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    const p = Math.sin(t * 1.4) * 0.07 + 1
    coreRef.current?.scale.setScalar(p)
    glow1Ref.current?.scale.setScalar(Math.sin(t * 0.9) * 0.05 + 1)
  })

  return (
    <group>
      <pointLight color={theme.core} distance={8} decay={2} intensity={4} />
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          emissive={theme.core}
          emissiveIntensity={6}
          color={theme.core}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={glow1Ref}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color={theme.ring} transparent opacity={0.14} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

function OrbitRings({ theme }: { theme: ProductTheme }) {
  const ringRefs = useRef<THREE.Mesh[]>([])

  const rings = useMemo(() => [
    { radius: 1.1, tiltX: Math.PI / 2,          tiltY: 0,    tiltZ: -0.3,  opacity: 0.22, speed: 0.0004 },
    { radius: 1.6, tiltX: Math.PI / 2 + 0.45,   tiltY: 0.25, tiltZ: 0.2,   opacity: 0.14, speed: 0.0006 },
    { radius: 2.1, tiltX: Math.PI / 2 - 0.22,   tiltY: -0.2, tiltZ: -0.45, opacity: 0.08, speed: 0.0003 },
  ], [])

  useFrame(() => {
    ringRefs.current.forEach((ref, i) => {
      if (!ref) return
      const mat = ref.material as THREE.MeshBasicMaterial
      const base = rings[i].opacity
      mat.opacity = base + Math.sin(Date.now() * rings[i].speed + i * 1.5) * base * 0.25
    })
  })

  return (
    <group>
      {rings.map((r, i) => (
        <mesh key={i} ref={(el) => { if (el) ringRefs.current[i] = el }} rotation={[r.tiltX, r.tiltY, r.tiltZ]}>
          <torusGeometry args={[r.radius, 0.004, 8, 140]} />
          <meshBasicMaterial color={theme.ring} transparent opacity={r.opacity} />
        </mesh>
      ))}
    </group>
  )
}

function OrbitParticles({ theme }: { theme: ProductTheme }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 55

  const particlesRef = useRef(
    Array.from({ length: count }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: (Math.random() - 0.5) * Math.PI * 0.55,
      radius: 0.85 + Math.random() * 1.15,
      speed: (Math.random() * 0.22 + 0.07) * (Math.random() < 0.5 ? 1 : -1),
      yOffset: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 0.35 + 0.18,
      phase: Math.random() * Math.PI * 2,
    }))
  )

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!meshRef.current) return
    const particles = particlesRef.current
    const col = new THREE.Color(theme.particle)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const angle = p.theta + t * p.speed
      const r = p.radius + Math.sin(t * 0.5 + p.phase) * 0.1
      dummy.position.set(
        Math.cos(angle) * Math.cos(p.phi) * r,
        p.yOffset + Math.sin(t * 0.3 + p.phase) * 0.07,
        Math.sin(angle) * Math.cos(p.phi) * r,
      )
      const sz = p.size * (0.55 + Math.sin(t * 0.8 + p.phase) * 0.45)
      dummy.scale.setScalar(Math.max(0.01, sz))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, col)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.018, 5, 5]} />
      <meshBasicMaterial transparent opacity={0.55} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  )
}

function OrbitSatellites({ theme }: { theme: ProductTheme }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = theme.satellites.length

  const sats = useMemo(() => {
    return theme.satellites.map((color, i) => {
      const angle = (i / count) * Math.PI * 2
      const orbitR = 1.3 + (i % 2) * 0.55
      return {
        angle,
        orbitR,
        yOffset: (i % 3 - 1) * 0.55,
        speed: 0.18 + i * 0.04,
        floatSpeed: 0.12 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        size: 0.055 + (i % 2) * 0.03,
        color: new THREE.Color(color),
        isDiamond: i % 2 === 0,
      }
    })
  }, [theme, count])

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!meshRef.current) return

    for (let i = 0; i < sats.length; i++) {
      const sat = sats[i]
      const a = sat.angle + t * sat.speed
      dummy.position.set(
        Math.cos(a) * sat.orbitR,
        sat.yOffset + Math.sin(t * sat.floatSpeed + sat.phase) * 0.15,
        Math.sin(a) * sat.orbitR,
      )
      dummy.rotation.set(t * 0.4, t * 0.3, sat.isDiamond ? Math.PI / 4 : 0)
      const sz = sat.size * (0.85 + Math.sin(t * 0.5 + sat.phase) * 0.15)
      dummy.scale.setScalar(Math.max(0.01, sz))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, sat.color)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.88} />
    </instancedMesh>
  )
}

function OrbitScene({ theme }: { theme: ProductTheme }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.04} />
      <OrbitCore theme={theme} />
      <OrbitRings theme={theme} />
      <OrbitParticles theme={theme} />
      <OrbitSatellites theme={theme} />
    </group>
  )
}

/* ─── Public component ─── */

interface ProductOrbitProps {
  theme?: ProductTheme
  /** Canvas size in px (renders square) */
  size?: number
  className?: string
}

export function ProductOrbit({ theme = DEFAULT_THEME, size = 200, className = '' }: ProductOrbitProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: `0 0 40px ${theme.glow}, 0 0 80px ${theme.glow}`,
        flexShrink: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <OrbitScene theme={theme} />
        </Suspense>
      </Canvas>
    </div>
  )
}
