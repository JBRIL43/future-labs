'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Stars } from '@react-three/drei'
import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'

/* ═══════════════════════════════════════════
   EXPORTED VISIBILITY FLAG
   ═══════════════════════════════════════════ */
export const sceneVisible = { current: true }

/* ═══════════════════════════════════════════
   ORBIT CONFIG — planets around the sun
   ═══════════════════════════════════════════ */

interface PlanetConfig {
  name: string
  radius: number        // planet sphere radius
  orbitRadius: number    // distance from sun
  speed: number          // orbit speed (rad/s)
  color: string
  emissiveColor: string
  emissiveIntensity: number
  tilt: number           // axial tilt
  hasRing?: boolean
  ringColor?: string
  label?: string
}

const PLANETS: PlanetConfig[] = [
  {
    name: 'dayn-flow',
    radius: 0.35,
    orbitRadius: 4.2,
    speed: 0.15,
    color: '#f59e0b',
    emissiveColor: '#f59e0b',
    emissiveIntensity: 0.6,
    tilt: 0.15,
    hasRing: true,
    ringColor: '#f59e0b',
    label: 'DAYN FLOW',
  },
]

// Future empty orbit rings (for upcoming products)
const FUTURE_ORBITS = [
  { radius: 2.8, color: '#06b6d4', opacity: 0.04 },
  { radius: 5.8, color: '#a855f7', opacity: 0.03 },
  { radius: 7.2, color: '#f43f5e', opacity: 0.025 },
]

/* ═══════════════════════════════════════════
   SUN (FUTURE LABS)
   The central star of our solar system
   ═══════════════════════════════════════════ */

function Sun() {
  const coreRef = useRef<THREE.Mesh>(null)
  const coronaRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ]
  const lightRef = useRef<THREE.PointLight>(null)
  const outerLightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!sceneVisible.current) return

    const pulse = Math.sin(t * 1.5) * 0.06 + 1

    // Core sphere pulsing
    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse)
    }

    // Corona layers pulse at different rates
    const coronaPulses = [
      Math.sin(t * 1.2 + 0.5) * 0.05 + 1,
      Math.sin(t * 0.9 + 1.2) * 0.04 + 1,
      Math.sin(t * 0.6 + 2.0) * 0.06 + 1,
    ]
    coronaRefs.forEach((ref, i) => {
      if (!ref.current) return
      ref.current.scale.setScalar(coronaPulses[i])
    })

    // Light pulsing
    if (lightRef.current) {
      lightRef.current.intensity = 4 + Math.sin(t * 1.5) * 0.8
    }
    if (outerLightRef.current) {
      outerLightRef.current.intensity = 2 + Math.sin(t * 1.2) * 0.4
    }
  })

  return (
    <group>
      {/* Core point light (emerald glow) */}
      <pointLight ref={lightRef} color="#10b981" distance={15} decay={2} intensity={4} />
      <pointLight ref={outerLightRef} color="#f59e0b" distance={20} decay={2} intensity={2} />

      {/* Bright inner core - the sun body */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          emissive="#10b981"
          emissiveIntensity={4}
          color="#34d399"
          toneMapped={false}
        />
      </mesh>

      {/* Corona glow layers (sun atmosphere) */}
      {[{ size: 1.4, opacity: 0.15, color: '#10b981' },
        { size: 1.9, opacity: 0.07, color: '#34d399' },
        { size: 2.6, opacity: 0.03, color: '#6ee7b7' }].map((g, i) => (
        <mesh key={i} ref={coronaRefs[i]}>
          <sphereGeometry args={[g.size, 32, 32]} />
          <meshBasicMaterial
            color={g.color}
            transparent
            opacity={g.opacity}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════
   SOLAR FLARE PARTICLES
   Instanced particles orbiting close to the sun
   ═══════════════════════════════════════════ */

function SolarParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 60 : 120

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: (Math.random() - 0.5) * Math.PI * 0.6,
      radius: 1.3 + Math.random() * 1.5,
      speed: (Math.random() * 0.3 + 0.1) * (Math.random() < 0.5 ? 1 : -1),
      yOffset: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current || !sceneVisible.current) return
    const t = clock.getElapsedTime()

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const angle = p.theta + t * p.speed
      const r = p.radius + Math.sin(t * 0.5 + p.phase) * 0.15

      dummy.position.set(
        Math.cos(angle) * Math.cos(p.phi) * r,
        p.yOffset + Math.sin(t * 0.3 + p.phase) * 0.1,
        Math.sin(angle) * Math.cos(p.phi) * r
      )
      const s = p.size * (0.6 + Math.sin(t * 0.8 + p.phase) * 0.4)
      dummy.scale.setScalar(Math.max(0.01, s))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.025, 6, 6]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════
   ORBIT RING
   Visible orbital path (faint ellipse)
   ═══════════════════════════════════════════ */

function OrbitRing({ radius, color, opacity = 0.08, tilt = 0 }: {
  radius: number; color: string; opacity?: number; tilt?: number
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const entryRef = useRef(0)

  useFrame(({ clock }) => {
    if (!sceneVisible.current) return
    const t = clock.getElapsedTime()
    // Fade in orbits gradually
    entryRef.current = Math.min(1, entryRef.current + 0.008)
    if (matRef.current) {
      matRef.current.opacity = opacity * entryRef.current
    }
  })

  return (
    <mesh rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 128]} />
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={0} />
    </mesh>
  )
}

/* ═══════════════════════════════════════════
   PLANET
   A round planet orbiting the sun
   ═══════════════════════════════════════════ */

function Planet({ config }: { config: PlanetConfig }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const scaleRef = useRef(0.01)
  const entryStarted = useRef(false)

  useFrame(({ clock }) => {
    if (!sceneVisible.current) return
    const t = clock.getElapsedTime()

    // Entry animation: scale up from 0
    const entryDelay = 2.0
    if (t > entryDelay) {
      entryStarted.current = true
      scaleRef.current += (1 - scaleRef.current) * 0.03
    }
    const entry = Math.min(1, scaleRef.current)

    // Orbit position
    const angle = t * config.speed
    const x = Math.cos(angle) * config.orbitRadius
    const z = Math.sin(angle) * config.orbitRadius
    const y = Math.sin(angle * 0.5) * 0.15 // slight vertical wobble

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z)
    }

    // Self-rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4
      meshRef.current.rotation.x = config.tilt
      const hoverScale = hovered ? 1.4 : 1
      meshRef.current.scale.setScalar(entry * hoverScale)
    }

    // Glow
    if (glowRef.current) {
      const glowPulse = Math.sin(t * 2) * 0.08 + 1
      glowRef.current.scale.setScalar(entry * glowPulse * 2)
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = hovered ? 0.1 : 0.04
    }

    // Planet ring (Saturn-like)
    if (ringRef.current && config.hasRing) {
      ringRef.current.rotation.x = Math.PI / 2.5
      ringRef.current.rotation.z = Math.sin(t * 0.2) * 0.05
      ringRef.current.scale.setScalar(entry)
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = hovered ? 0.25 : 0.12
    }
  })

  return (
    <group ref={groupRef}>
      {/* Planet body - ROUND sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[config.radius, 48, 48]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissiveColor}
          emissiveIntensity={hovered ? 2 : config.emissiveIntensity}
          roughness={0.3}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[config.radius * 1.15, 24, 24]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Saturn-like ring for Dayn Flow */}
      {config.hasRing && (
        <mesh ref={ringRef}>
          <torusGeometry args={[config.radius * 1.8, 0.03, 8, 64]} />
          <meshBasicMaterial
            color={config.ringColor || config.color}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Hover label */}
      {hovered && config.label && (
        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div
            className="px-4 py-2 rounded-full text-center whitespace-nowrap"
            style={{
              background: 'rgba(5,5,7,0.92)',
              border: `1px solid ${config.color}50`,
              backdropFilter: 'blur(12px)',
              boxShadow: `0 0 30px ${config.color}25, 0 0 60px ${config.color}10`,
            }}
          >
            <div className="text-xs font-bold tracking-widest" style={{ color: config.color }}>
              {config.label}
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Product Platform</div>
          </div>
        </Html>
      )}
    </group>
  )
}

/* ═══════════════════════════════════════════
   AMBIENT STARDUST
   Distant particles for depth
   ═══════════════════════════════════════════ */

function AmbientDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 40 : 80

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 25
      ),
      speed: Math.random() * 0.15 + 0.03,
      offset: Math.random() * Math.PI * 2,
      size: Math.random() * 0.4 + 0.2,
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current || !sceneVisible.current) return
    const t = clock.getElapsedTime()

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      dummy.position.set(
        p.position.x + Math.sin(t * p.speed + p.offset) * 0.4,
        p.position.y + Math.cos(t * p.speed * 0.5 + p.offset) * 0.25,
        p.position.z + Math.sin(t * p.speed * 0.3 + p.offset * 2) * 0.3
      )
      const s = p.size * (0.5 + Math.sin(t * 0.6 + p.offset) * 0.5)
      dummy.scale.setScalar(Math.max(0.01, s))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.018, 4, 4]} />
      <meshBasicMaterial color="#10b981" transparent opacity={0.25} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════
   FUTURE LABS LABEL ON SUN
   ═══════════════════════════════════════════ */

function SunLabel() {
  const [show, setShow] = useState(false)

  useFrame(({ clock }) => {
    if (clock.getElapsedTime() > 1.5 && !show) setShow(true)
  })

  if (!show) return null

  return (
    <Html center position={[0, -1.8, 0]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <div className="text-center">
        <div
          className="text-[10px] font-bold tracking-[0.3em] text-emerald-400/70 uppercase"
          style={{ textShadow: '0 0 20px rgba(16,185,129,0.4)' }}
        >
          Future Labs
        </div>
      </div>
    </Html>
  )
}

/* ═══════════════════════════════════════════
   SCENE LIGHTING
   ═══════════════════════════════════════════ */

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.06} />
    </>
  )
}

/* ═══════════════════════════════════════════
   CAMERA CONTROLLER
   Mouse parallax + scroll-driven zoom out
   ═══════════════════════════════════════════ */

function CameraController() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef(new THREE.Vector3(0, 0.5, 9))

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    if (!sceneVisible.current) return

    const scrollY = window.scrollY
    const vh = window.innerHeight
    const sp = Math.min(1, scrollY / (vh * 2.5))

    // Camera zooms out on scroll
    const z = THREE.MathUtils.lerp(9, 16, sp)
    // Slight upward shift on scroll
    const baseY = THREE.MathUtils.lerp(0.5, 1.5, sp)
    // Mouse parallax reduces with scroll
    const parallaxStrength = 1 - sp * 0.7
    const x = mouse.current.x * 0.6 * parallaxStrength
    const y = baseY - mouse.current.y * 0.35 * parallaxStrength

    target.current.set(x, y, z)
    camera.position.lerp(target.current, 0.04)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════ */

export function SolarSystemScene() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!wrapperRef.current) return
      const vh = window.innerHeight
      const opacity = Math.max(0, 1 - window.scrollY / (vh * 2.8))
      wrapperRef.current.style.opacity = String(opacity)
      sceneVisible.current = opacity > 0.01
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-[2] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.5, 9], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <SceneLighting />
        <CameraController />

        {/* The Sun — Future Labs */}
        <Sun />
        <SunLabel />

        {/* Solar particles around the sun */}
        <SolarParticles />

        {/* Dayn Flow orbit ring */}
        <OrbitRing radius={PLANETS[0].orbitRadius} color={PLANETS[0].color} opacity={0.1} />

        {/* Future (empty) orbit rings */}
        {FUTURE_ORBITS.map((orbit, i) => (
          <OrbitRing key={i} radius={orbit.radius} color={orbit.color} opacity={orbit.opacity} />
        ))}

        {/* Planets */}
        {PLANETS.map((planet) => (
          <Planet key={planet.name} config={planet} />
        ))}

        {/* Ambient dust */}
        <AmbientDust />

        {/* Starfield background */}
        <Stars
          radius={60}
          depth={70}
          count={500}
          factor={3}
          saturation={0}
          fade
          speed={0.3}
        />
      </Canvas>

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,7,0.5) 100%)',
        }}
      />
    </div>
  )
}
