'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Stars } from '@react-three/drei'
import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'

/* ═══════════════════════════════════════════
   BRAND COLORS (from Future Labs logo)
   ═══════════════════════════════════════════ */
const BRAND = {
  teal: '#0d9488',        // Primary teal from logo
  tealLight: '#14b8a6',   // Lighter teal
  tealBright: '#2dd4bf',  // Bright teal for corona
  tealGlow: '#5eead4',    // Softest teal
  gold: '#d4af37',        // Gold dot accent from logo
  daynFlow: '#c4a35a',    // Earthy gold from Dayn Flow logo
}

export const sceneVisible = { current: true }

/* ═══════════════════════════════════════════
   ORBIT CONFIG — product planets
   ═══════════════════════════════════════════ */

interface ProductPlanet {
  name: string
  label: string
  sublabel: string
  radius: number          // planet visual radius
  orbitRadius: number      // distance from sun
  speed: number            // orbit angular speed
  color: string
  emissiveColor: string
  morphColor: string       // color when morphed
  tilt: number             // orbit plane tilt
  hasRing: boolean
  ringColor: string
  // Morph: sphere → product shape
  morphType: 'capsule' | 'sphere' | 'cube' | 'octahedron'
  morphDelay: number       // seconds before morph starts
  morphDuration: number    // seconds to complete morph
}

const PRODUCT_PLANETS: ProductPlanet[] = [
  {
    name: 'dayn-flow',
    label: 'DAYN FLOW',
    sublabel: 'Product Platform',
    radius: 0.38,
    orbitRadius: 4.0,
    speed: 0.12,
    color: BRAND.daynFlow,
    emissiveColor: BRAND.daynFlow,
    morphColor: '#e0c068',
    tilt: 0.08,
    hasRing: true,
    ringColor: BRAND.daynFlow,
    morphType: 'capsule',
    morphDelay: 2.5,
    morphDuration: 3.0,
  },
  {
    name: 'ai-engine',
    label: 'AI ENGINE',
    sublabel: 'Coming Soon',
    radius: 0.22,
    orbitRadius: 5.8,
    speed: -0.08,
    color: '#06b6d4',
    emissiveColor: '#06b6d4',
    morphColor: '#22d3ee',
    tilt: -0.12,
    hasRing: false,
    ringColor: '#06b6d4',
    morphType: 'octahedron',
    morphDelay: 4.0,
    morphDuration: 3.5,
  },
  {
    name: 'cloud-platform',
    label: 'CLOUD',
    sublabel: 'Coming Soon',
    radius: 0.18,
    orbitRadius: 7.0,
    speed: 0.06,
    color: '#a855f7',
    emissiveColor: '#a855f7',
    morphColor: '#c084fc',
    tilt: 0.15,
    hasRing: false,
    ringColor: '#a855f7',
    morphType: 'sphere',
    morphDelay: 5.5,
    morphDuration: 4.0,
  },
]

/* ═══════════════════════════════════════════
   SUN (FUTURE LABS)
   ═══════════════════════════════════════════ */

function Sun() {
  const coreRef = useRef<THREE.Mesh>(null)
  const coronaRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ]
  const lightRef = useRef<THREE.PointLight>(null)
  const goldLightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!sceneVisible.current) return

    const pulse = Math.sin(t * 1.5) * 0.06 + 1

    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse)
    }

    const coronaPulses = [
      Math.sin(t * 1.2 + 0.5) * 0.05 + 1,
      Math.sin(t * 0.9 + 1.2) * 0.04 + 1,
      Math.sin(t * 0.6 + 2.0) * 0.06 + 1,
    ]
    coronaRefs.forEach((ref, i) => {
      if (!ref.current) return
      ref.current.scale.setScalar(coronaPulses[i])
    })

    if (lightRef.current) {
      lightRef.current.intensity = 4 + Math.sin(t * 1.5) * 0.8
    }
    if (goldLightRef.current) {
      goldLightRef.current.intensity = 1.5 + Math.sin(t * 1.0) * 0.3
    }
  })

  return (
    <group>
      <pointLight ref={lightRef} color={BRAND.teal} distance={15} decay={2} intensity={4} />
      <pointLight ref={goldLightRef} color={BRAND.gold} distance={12} decay={2} intensity={1.5} />

      {/* Core sun body — brand teal */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          emissive={BRAND.teal}
          emissiveIntensity={4}
          color={BRAND.tealLight}
          toneMapped={false}
        />
      </mesh>

      {/* Gold accent dot (like the logo dot) */}
      <mesh position={[0.85, -0.65, 0.3]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          emissive={BRAND.gold}
          emissiveIntensity={6}
          color={BRAND.gold}
          toneMapped={false}
        />
      </mesh>

      {/* Corona glow layers */}
      {[
        { size: 1.4, opacity: 0.15, color: BRAND.teal },
        { size: 1.9, opacity: 0.07, color: BRAND.tealLight },
        { size: 2.6, opacity: 0.03, color: BRAND.tealGlow },
      ].map((g, i) => (
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
   SOLAR PARTICLES — round spheres orbiting sun
   ═══════════════════════════════════════════ */

function SolarParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 50 : 100

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
      <meshBasicMaterial color={BRAND.tealLight} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════
   ORBIT RING — visible orbital path
   ═══════════════════════════════════════════ */

function OrbitRing({ radius, color, opacity = 0.08, tilt = 0 }: {
  radius: number; color: string; opacity?: number; tilt?: number
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const entryRef = useRef(0)

  useFrame(() => {
    if (!sceneVisible.current) return
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
   PRODUCT PLANET
   Morphs from sphere → product shape
   ═══════════════════════════════════════════ */

function ProductPlanet({ config }: { config: ProductPlanet }) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const morphRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const scaleRef = useRef(0.01)
  const morphProgressRef = useRef(0) // 0 = sphere, 1 = product shape
  const [showLabel, setShowLabel] = useState(false)

  useFrame(({ clock }) => {
    if (!sceneVisible.current) return
    const t = clock.getElapsedTime()

    // Entry animation
    const entryDelay = 1.5
    if (t > entryDelay) {
      scaleRef.current += (1 - scaleRef.current) * 0.03
    }
    const entry = Math.min(1, scaleRef.current)

    // Morph progress: sphere → product shape
    if (t > config.morphDelay) {
      morphProgressRef.current = Math.min(
        1,
        morphProgressRef.current + (1 / (config.morphDuration * 60))
      )
    }
    const morph = morphProgressRef.current
    // Smooth easing for morph
    const smoothMorph = morph < 0.5
      ? 4 * morph * morph * morph
      : 1 - Math.pow(-2 * morph + 2, 3) / 2

    // Orbit position
    const angle = t * config.speed
    const x = Math.cos(angle) * config.orbitRadius
    const z = Math.sin(angle) * config.orbitRadius
    const y = Math.sin(angle * 0.5) * 0.15 + Math.sin(t * 0.3) * 0.08

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z)
    }

    // Sphere: fades out as morph progresses
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.3
      const sphereScale = entry * (1 - smoothMorph)
      sphereRef.current.scale.setScalar(Math.max(0.001, sphereScale))
      ;(sphereRef.current.material as THREE.MeshStandardMaterial).opacity = 1 - smoothMorph
    }

    // Morphed product shape: fades in
    if (morphRef.current) {
      morphRef.current.rotation.y = t * 0.4
      morphRef.current.rotation.x = config.tilt
      const productScale = entry * smoothMorph
      morphRef.current.scale.setScalar(Math.max(0.001, productScale))
      ;(morphRef.current.material as THREE.MeshStandardMaterial).opacity = smoothMorph
    }

    // Glow
    if (glowRef.current) {
      const glowPulse = Math.sin(t * 2) * 0.08 + 1
      glowRef.current.scale.setScalar(entry * glowPulse * 2)
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = hovered ? 0.12 : 0.04
    }

    // Ring
    if (ringRef.current && config.hasRing) {
      ringRef.current.rotation.x = Math.PI / 2.5
      ringRef.current.rotation.z = Math.sin(t * 0.2) * 0.05
      ringRef.current.scale.setScalar(entry * (0.5 + smoothMorph * 0.5))
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = (hovered ? 0.3 : 0.15) * entry
    }

    // Show label after morph completes
    setShowLabel(smoothMorph > 0.6 && entry > 0.5)
  })

  // Render different morph target geometries based on product type
  const renderMorphGeometry = () => {
    switch (config.morphType) {
      case 'capsule':
        return <capsuleGeometry args={[config.radius * 0.7, config.radius * 1.2, 16, 32]} />
      case 'octahedron':
        return <octahedronGeometry args={[config.radius, 0]} />
      case 'cube':
        return <boxGeometry args={[config.radius * 1.4, config.radius * 1.4, config.radius * 1.4]} />
      default:
        return <sphereGeometry args={[config.radius, 48, 48]} />
    }
  }

  const hoverScale = hovered ? 1.3 : 1

  return (
    <group ref={groupRef}>
      {/* SPHERE — the starting circle form */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[config.radius, 48, 48]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissiveColor}
          emissiveIntensity={hovered ? 2 : 0.5}
          transparent
          opacity={1}
          roughness={0.3}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* MORPHED PRODUCT SHAPE — the end form */}
      <mesh
        ref={morphRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        scale={0.001}
      >
        {renderMorphGeometry()}
        <meshStandardMaterial
          color={config.morphColor}
          emissive={config.morphColor}
          emissiveIntensity={hovered ? 3 : 1}
          transparent
          opacity={0}
          roughness={0.25}
          metalness={0.3}
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
          <torusGeometry args={[config.radius * 1.8, 0.025, 8, 64]} />
          <meshBasicMaterial
            color={config.ringColor}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Product label */}
      {showLabel && (
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
            <div className="text-xs font-bold tracking-widest" style={{ color: config.morphColor }}>
              {config.label}
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">{config.sublabel}</div>
          </div>
        </Html>
      )}
    </group>
  )
}

/* ═══════════════════════════════════════════
   AMBIENT DUST
   ═══════════════════════════════════════════ */

function AmbientDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 30 : 60

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
      <meshBasicMaterial color={BRAND.teal} transparent opacity={0.25} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════
   SUN LABEL
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
          className="text-[10px] font-bold tracking-[0.3em] uppercase"
          style={{
            color: `${BRAND.tealLight}b3`,
            textShadow: `0 0 20px ${BRAND.teal}66`,
          }}
        >
          Future Labs
        </div>
        <div
          className="text-[8px] tracking-[0.2em] uppercase mt-0.5"
          style={{ color: `${BRAND.gold}99` }}
        >
          Software Technologies
        </div>
      </div>
    </Html>
  )
}

/* ═══════════════════════════════════════════
   SCENE LIGHTING
   ═══════════════════════════════════════════ */

function SceneLighting() {
  return <ambientLight intensity={0.06} />
}

/* ═══════════════════════════════════════════
   CAMERA CONTROLLER
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

    const z = THREE.MathUtils.lerp(9, 16, sp)
    const baseY = THREE.MathUtils.lerp(0.5, 1.5, sp)
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

        {/* ☀️ The Sun — Future Labs */}
        <Sun />
        <SunLabel />

        {/* Solar particles around the sun */}
        <SolarParticles />

        {/* Orbit rings for each product */}
        {PRODUCT_PLANETS.map((planet) => (
          <OrbitRing
            key={`orbit-${planet.name}`}
            radius={planet.orbitRadius}
            color={planet.color}
            opacity={0.1}
            tilt={planet.tilt}
          />
        ))}

        {/* Product planets */}
        {PRODUCT_PLANETS.map((planet) => (
          <ProductPlanet key={planet.name} config={planet} />
        ))}

        {/* Ambient dust */}
        <AmbientDust />

        {/* Starfield */}
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

      {/* Vignette */}
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
