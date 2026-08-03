'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

/* ═══════════════════════════════════════════
   BRAND COLORS
   ═══════════════════════════════════════════ */
const BRAND = {
  teal: '#0d9488',
  tealLight: '#14b8a6',
  tealBright: '#2dd4bf',
  tealGlow: '#5eead4',
  gold: '#d4af37',
  daynFlow: '#c4a35a',
}

// Accent square colors from reference design
const ACCENT_COLORS = [
  '#9b59b6', // purple
  '#5dade2', // blue
  '#f1c40f', // gold/yellow
  '#85c1e9', // light blue
  '#2ecc71', // green
  '#e74c3c', // red/coral
]

export const sceneVisible = { current: true }

/* ═══════════════════════════════════════════
   PRODUCT PLANETS
   ═══════════════════════════════════════════ */

interface ProductPlanet {
  name: string
  radius: number
  orbitRadius: number
  speed: number
  color: string
  morphColor: string
  morphType: 'capsule' | 'sphere' | 'octahedron'
  morphDelay: number
  morphDuration: number
  hasRing: boolean
}

const PRODUCT_PLANETS: ProductPlanet[] = [
  {
    name: 'dayn-flow',
    radius: 0.32,
    orbitRadius: 3.8,
    speed: 0.1,
    color: BRAND.daynFlow,
    morphColor: '#e0c068',
    morphType: 'capsule',
    morphDelay: 2.5,
    morphDuration: 3.0,
    hasRing: true,
  },
  {
    name: 'ai-engine',
    radius: 0.18,
    orbitRadius: 5.4,
    speed: -0.065,
    color: '#06b6d4',
    morphColor: '#22d3ee',
    morphType: 'octahedron',
    morphDelay: 4.0,
    morphDuration: 3.5,
    hasRing: false,
  },
  {
    name: 'cloud-platform',
    radius: 0.15,
    orbitRadius: 6.8,
    speed: 0.045,
    color: '#a855f7',
    morphColor: '#c084fc',
    morphType: 'sphere',
    morphDelay: 5.5,
    morphDuration: 4.0,
    hasRing: false,
  },
]

// Main orbit tilt: ~20 degrees from horizontal
const ORBIT_TILT = -0.35

/* ═══════════════════════════════════════════
   SUN (FUTURE LABS CORE)
   ═══════════════════════════════════════════ */

function Sun() {
  const coreRef = useRef<THREE.Mesh>(null)
  const coronaRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ]
  const lightRef = useRef<THREE.PointLight>(null)
  const goldDotRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!sceneVisible.current) return

    const pulse = Math.sin(t * 1.5) * 0.05 + 1
    if (coreRef.current) coreRef.current.scale.setScalar(pulse)

    const coronaPulses = [
      Math.sin(t * 1.2 + 0.5) * 0.04 + 1,
      Math.sin(t * 0.9 + 1.2) * 0.03 + 1,
      Math.sin(t * 0.6 + 2.0) * 0.05 + 1,
    ]
    coronaRefs.forEach((ref, i) => {
      if (ref.current) ref.current.scale.setScalar(coronaPulses[i])
    })

    if (lightRef.current) lightRef.current.intensity = 4 + Math.sin(t * 1.5) * 0.6

    // Gold dot orbits slowly around core
    if (goldDotRef.current) {
      const a = t * 0.5
      goldDotRef.current.position.set(
        Math.cos(a) * 0.9,
        Math.sin(a) * 0.9,
        Math.sin(a * 0.7) * 0.2
      )
    }
  })

  return (
    <group>
      <pointLight ref={lightRef} color={BRAND.teal} distance={15} decay={2} intensity={4} />
      <pointLight position={[0, 0, 0]} color={BRAND.gold} distance={10} decay={2} intensity={1.2} />

      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.85, 64, 64]} />
        <meshStandardMaterial
          emissive={BRAND.teal}
          emissiveIntensity={4.5}
          color={BRAND.tealLight}
          toneMapped={false}
        />
      </mesh>

      {/* Orbiting gold accent dot */}
      <mesh ref={goldDotRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          emissive={BRAND.gold}
          emissiveIntensity={6}
          color={BRAND.gold}
          toneMapped={false}
        />
      </mesh>

      {/* Corona glow */}
      {[
        { size: 1.2, opacity: 0.18, color: BRAND.teal },
        { size: 1.7, opacity: 0.08, color: BRAND.tealLight },
        { size: 2.4, opacity: 0.03, color: BRAND.tealGlow },
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
   WIREFRAME GEODESIC SPHERE
   Low-poly icosahedron cage around the core
   ═══════════════════════════════════════════ */

function GeodesicCage() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const outerMat = useRef<THREE.MeshBasicMaterial>(null)
  const innerMat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!sceneVisible.current) return

    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.08
      outerRef.current.rotation.x = Math.sin(t * 0.05) * 0.08
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.06
      if (outerRef.current) innerRef.current.rotation.z = t * 0.04
    }
    if (outerMat.current) {
      outerMat.current.opacity = 0.18 + Math.sin(t * 0.3) * 0.04
    }
    if (innerMat.current) {
      innerMat.current.opacity = 0.09 + Math.sin(t * 0.4 + 1) * 0.03
    }
  })

  return (
    <group>
      {/* Outer icosahedron wireframe */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.8, 1]} />
        <meshBasicMaterial ref={outerMat} color="#1f4a4a" wireframe transparent opacity={0.18} />
      </mesh>
      {/* Inner dodecahedron wireframe */}
      <mesh ref={innerRef}>
        <dodecahedronGeometry args={[2.0, 0]} />
        <meshBasicMaterial ref={innerMat} color="#1f4a4a" wireframe transparent opacity={0.09} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════
   HORIZONTAL AXIS LINE
   Prominent line through center
   ═══════════════════════════════════════════ */

function AxisLine() {
  const matRef = useRef<THREE.LineBasicMaterial>(null)
  const lineRef = useRef<THREE.Line>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array([-12, 0, 0, 12, 0, 0])
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame(() => {
    if (!sceneVisible.current) return
    if (matRef.current) {
      matRef.current.opacity = 0.12 + Math.sin(Date.now() * 0.001) * 0.04
    }
  })

  return (
    <group rotation={[0, 0, ORBIT_TILT]}>
      <line ref={lineRef as any} geometry={geometry}>
        <lineBasicMaterial ref={matRef} color={BRAND.teal} transparent opacity={0.12} />
      </line>
    </group>
  )
}

/* ═══════════════════════════════════════════
   ACCENT SQUARES
   Small colored squares floating in space
   ═══════════════════════════════════════════ */

function AccentSquares() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const squares = useMemo(() => {
    return ACCENT_COLORS.map((color, i) => {
      const spread = 8
      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * spread * 2,
          (Math.random() - 0.5) * spread * 0.5,
          (Math.random() - 0.5) * spread * 0.8
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotSpeed: (Math.random() - 0.5) * 0.3,
        floatSpeed: Math.random() * 0.2 + 0.05,
        floatAmp: Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 0.08 + 0.04,
        color: new THREE.Color(color),
        index: i,
      }
    })
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current || !sceneVisible.current) return
    const t = clock.getElapsedTime()

    for (let i = 0; i < squares.length; i++) {
      const sq = squares[i]
      dummy.position.set(
        sq.position.x + Math.sin(t * sq.floatSpeed + sq.phase) * 0.3,
        sq.position.y + Math.sin(t * sq.floatSpeed * 0.7 + sq.phase) * sq.floatAmp,
        sq.position.z + Math.cos(t * sq.floatSpeed * 0.5 + sq.phase) * 0.2
      )
      dummy.rotation.set(
        sq.rotation.x + t * sq.rotSpeed,
        sq.rotation.y + t * sq.rotSpeed * 0.7,
        sq.rotation.z
      )
      const s = sq.size * (0.8 + Math.sin(t * 0.5 + sq.phase) * 0.2)
      dummy.scale.setScalar(Math.max(0.01, s))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, squares.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="white" transparent opacity={0.7} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════
   ORBIT RING
   ═══════════════════════════════════════════ */

function OrbitRing({ radius, color, opacity = 0.08 }: {
  radius: number; color: string; opacity?: number
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const entryRef = useRef(0)

  useFrame(() => {
    if (!sceneVisible.current) return
    entryRef.current = Math.min(1, entryRef.current + 0.008)
    if (matRef.current) matRef.current.opacity = opacity * entryRef.current
  })

  return (
    <mesh rotation={[Math.PI / 2 + ORBIT_TILT, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 8, 128]} />
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={0} />
    </mesh>
  )
}

/* ═══════════════════════════════════════════
   PRODUCT PLANET (morphing sphere → product)
   ═══════════════════════════════════════════ */

function ProductPlanet({ config }: { config: ProductPlanet }) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const morphRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const scaleRef = useRef(0.01)
  const morphRef_val = useRef(0)

  useFrame(({ clock }) => {
    if (!sceneVisible.current) return
    const t = clock.getElapsedTime()

    // Entry
    if (t > 1.5) scaleRef.current += (1 - scaleRef.current) * 0.03
    const entry = Math.min(1, scaleRef.current)

    // Morph progress
    if (t > config.morphDelay) {
      morphRef_val.current = Math.min(1, morphRef_val.current + 1 / (config.morphDuration * 60))
    }
    const m = morphRef_val.current
    const smooth = m < 0.5 ? 4 * m * m * m : 1 - Math.pow(-2 * m + 2, 3) / 2

    // Orbit on tilted plane
    const angle = t * config.speed
    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)
    const cosT = Math.cos(ORBIT_TILT)
    const sinT = Math.sin(ORBIT_TILT)
    const r = config.orbitRadius
    const x = cosA * r
    const z = sinA * r
    const y = sinA * r * sinT * 0.3 // slight tilt displacement

    if (groupRef.current) groupRef.current.position.set(x, y, z)

    // Sphere fades out
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.3
      sphereRef.current.scale.setScalar(Math.max(0.001, entry * (1 - smooth)))
      ;(sphereRef.current.material as THREE.MeshStandardMaterial).opacity = 1 - smooth
    }

    // Morph shape fades in
    if (morphRef.current) {
      morphRef.current.rotation.y = t * 0.4
      morphRef.current.scale.setScalar(Math.max(0.001, entry * smooth))
      ;(morphRef.current.material as THREE.MeshStandardMaterial).opacity = smooth
    }

    // Glow
    if (glowRef.current) {
      const gp = Math.sin(t * 2) * 0.08 + 1
      glowRef.current.scale.setScalar(entry * gp * 2)
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.04
    }

    // Ring (Dayn Flow)
    if (ringRef.current && config.hasRing) {
      ringRef.current.rotation.x = Math.PI / 2.5
      ringRef.current.rotation.z = Math.sin(t * 0.2) * 0.05
      ringRef.current.scale.setScalar(entry * (0.5 + smooth * 0.5))
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 * entry
    }
  })

  const morphGeo = () => {
    switch (config.morphType) {
      case 'capsule':
        return <capsuleGeometry args={[config.radius * 0.65, config.radius * 1.2, 16, 32]} />
      case 'octahedron':
        return <octahedronGeometry args={[config.radius, 0]} />
      default:
        return <sphereGeometry args={[config.radius, 48, 48]} />
    }
  }

  return (
    <group ref={groupRef}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[config.radius, 48, 48]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.5}
          transparent opacity={1}
          roughness={0.3}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={morphRef} scale={0.001}>
        {morphGeo()}
        <meshStandardMaterial
          color={config.morphColor}
          emissive={config.morphColor}
          emissiveIntensity={1}
          transparent opacity={0}
          roughness={0.25}
          metalness={0.3}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[config.radius * 1.15, 24, 24]} />
        <meshBasicMaterial
          color={config.color}
          transparent opacity={0.04}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      {config.hasRing && (
        <mesh ref={ringRef}>
          <torusGeometry args={[config.radius * 1.8, 0.02, 8, 64]} />
          <meshBasicMaterial
            color={config.color}
            transparent opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}

/* ═══════════════════════════════════════════
   SOLAR PARTICLES (round spheres)
   ═══════════════════════════════════════════ */

function SolarParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 40 : 80

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: (Math.random() - 0.5) * Math.PI * 0.5,
      radius: 1.1 + Math.random() * 1.3,
      speed: (Math.random() * 0.25 + 0.08) * (Math.random() < 0.5 ? 1 : -1),
      yOffset: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 0.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current || !sceneVisible.current) return
    const t = clock.getElapsedTime()

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const angle = p.theta + t * p.speed
      const r = p.radius + Math.sin(t * 0.5 + p.phase) * 0.12
      dummy.position.set(
        Math.cos(angle) * Math.cos(p.phi) * r,
        p.yOffset + Math.sin(t * 0.3 + p.phase) * 0.08,
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
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial color={BRAND.tealLight} transparent opacity={0.45} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════
   AMBIENT DUST
   ═════════════════════════════════════════ */

function AmbientDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 25 : 50

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 22
      ),
      speed: Math.random() * 0.12 + 0.02,
      offset: Math.random() * Math.PI * 2,
      size: Math.random() * 0.3 + 0.15,
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current || !sceneVisible.current) return
    const t = clock.getElapsedTime()

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      dummy.position.set(
        p.position.x + Math.sin(t * p.speed + p.offset) * 0.3,
        p.position.y + Math.cos(t * p.speed * 0.5 + p.offset) * 0.2,
        p.position.z + Math.sin(t * p.speed * 0.3 + p.offset * 2) * 0.25
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
      <sphereGeometry args={[0.015, 4, 4]} />
      <meshBasicMaterial color={BRAND.teal} transparent opacity={0.2} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════
   SCENE LIGHTING
   ═════════════════════════════════════════ */

function SceneLighting() {
  return <ambientLight intensity={0.06} />
}

/* ═══════════════════════════════════════════
   CAMERA CONTROLLER
   ═══════════════════════════════════════════ */

function CameraController() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef(new THREE.Vector3(0, 0, 8))

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

    const z = THREE.MathUtils.lerp(8, 14, sp)
    const parallaxStrength = 1 - sp * 0.7
    const x = mouse.current.x * 0.5 * parallaxStrength
    const y = -mouse.current.y * 0.3 * parallaxStrength

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
        camera={{ position: [0, 0, 8], fov: 45 }}
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

        {/* Starfield background */}
        <Stars radius={60} depth={70} count={400} factor={3} saturation={0} fade speed={0.2} />

        {/* Wireframe geodesic cage */}
        <GeodesicCage />

        {/* Horizontal axis line */}
        <AxisLine />

        {/* The Sun — Future Labs core */}
        <Sun />

        {/* Solar particles (round spheres) */}
        <SolarParticles />

        {/* Accent squares (colored data points) */}
        <AccentSquares />

        {/* Orbit rings */}
        {PRODUCT_PLANETS.map((p) => (
          <OrbitRing key={`orbit-${p.name}`} radius={p.orbitRadius} color={p.color} opacity={0.08} />
        ))}

        {/* Product planets */}
        {PRODUCT_PLANETS.map((p) => (
          <ProductPlanet key={p.name} config={p} />
        ))}

        {/* Ambient dust */}
        <AmbientDust />
      </Canvas>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,7,0.55) 100%)',
        }}
      />
    </div>
  )
}
