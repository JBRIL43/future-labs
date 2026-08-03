'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

const BRAND = {
  teal: '#0d9488',
  tealLight: '#14b8a6',
  tealBright: '#2dd4bf',
  tealGlow: '#5eead4',
  gold: '#d4af37',
}

// Satellite colors matching the reference: purple, blue, green, red, gold, cyan
const SATELLITE_COLORS = [
  '#a855f7', // purple
  '#3b82f6', // blue
  '#10b981', // emerald/green
  '#ef4444', // red
  '#eab308', // gold/yellow
  '#06b6d4', // cyan
  '#a855f7', // purple
  '#3b82f6', // blue
  '#10b981', // green
  '#ef4444', // red
]

export const sceneVisible = { current: true }
export const mouse3D = { x: 999, y: 0, z: 0 }

/* ═══════ MOUSE TRACKER ═══════ */

function MouseTracker() {
  const { camera } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const target = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera)
      const hit = raycaster.ray.intersectPlane(plane, target)
      if (hit) {
        mouse3D.x += (target.x - mouse3D.x) * 0.3
        mouse3D.y += (target.y - mouse3D.y) * 0.3
        mouse3D.z += (target.z - mouse3D.z) * 0.3
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [camera, raycaster, plane, target])

  return null
}

/* ═══════ WIREFRAME GLOBE ═══════ */

function WireframeGlobe() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!sceneVisible.current) return

    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.06
      outerRef.current.rotation.x = Math.sin(t * 0.03) * 0.05
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.04
      innerRef.current.rotation.z = t * 0.03
    }
  })

  return (
    <group>
      {/* Main geodesic wireframe globe */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[3.0, 2]} />
        <meshBasicMaterial
          color={BRAND.tealBright}
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* Inner layer for depth */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[2.4, 1]} />
        <meshBasicMaterial
          color={BRAND.tealLight}
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}

/* ═══════ GLOWING NUCLEUS ═══════ */

function Nucleus() {
  const coreRef = useRef<THREE.Mesh>(null)
  const glow1Ref = useRef<THREE.Mesh>(null)
  const glow2Ref = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!sceneVisible.current) return

    const pulse = Math.sin(t * 1.2) * 0.08 + 1
    if (coreRef.current) coreRef.current.scale.setScalar(pulse)

    const gp1 = Math.sin(t * 0.8 + 0.5) * 0.06 + 1
    if (glow1Ref.current) glow1Ref.current.scale.setScalar(gp1)

    const gp2 = Math.sin(t * 0.5 + 1.2) * 0.04 + 1
    if (glow2Ref.current) glow2Ref.current.scale.setScalar(gp2)

    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(t * 1.2) * 0.5
    }
  })

  return (
    <group>
      <pointLight ref={lightRef} color={BRAND.teal} distance={12} decay={2} intensity={3} />
      {/* Core sphere - solid glowing teal */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshStandardMaterial
          emissive={BRAND.tealBright}
          emissiveIntensity={5}
          color={BRAND.tealLight}
          toneMapped={false}
        />
      </mesh>
      {/* Inner glow halo */}
      <mesh ref={glow1Ref}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color={BRAND.teal}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Outer glow halo */}
      <mesh ref={glow2Ref}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial
          color={BRAND.tealGlow}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

/* ═══════ ORBITAL RINGS ═══════ */

function OrbitalRings() {
  const ringRefs = useRef<THREE.Mesh[]>([])

  const rings = useMemo(() => [
    { radius: 2.8, tiltX: Math.PI / 2, tiltY: 0, tiltZ: -0.35, opacity: 0.12 },
    { radius: 3.6, tiltX: Math.PI / 2 + 0.4, tiltY: 0.3, tiltZ: 0.2, opacity: 0.07 },
    { radius: 4.2, tiltX: Math.PI / 2 - 0.25, tiltY: -0.2, tiltZ: -0.5, opacity: 0.05 },
    { radius: 2.2, tiltX: Math.PI / 2 + 0.7, tiltY: 0.5, tiltZ: 0.1, opacity: 0.04 },
    { radius: 5.0, tiltX: Math.PI / 2 + 0.15, tiltY: -0.1, tiltZ: -0.15, opacity: 0.03 },
  ], [])

  useFrame(() => {
    if (!sceneVisible.current) return
    ringRefs.current.forEach((ref, i) => {
      if (!ref) return
      const mat = ref.material as THREE.MeshBasicMaterial
      const base = rings[i].opacity
      mat.opacity = base + Math.sin(Date.now() * 0.0008 + i * 1.5) * base * 0.3
    })
  })

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el }}
          rotation={[ring.tiltX, ring.tiltY, ring.tiltZ]}
        >
          <torusGeometry args={[ring.radius, 0.005, 8, 180]} />
          <meshBasicMaterial color={BRAND.teal} transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════ COLORED SATELLITE SHAPES ═══════ */

function SatelliteShapes() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const satellites = useMemo(() => {
    const count = 10
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const orbitRadius = 3.2 + Math.random() * 2.5
      const yOffset = (Math.random() - 0.5) * 3.0
      return {
        angle,
        orbitRadius,
        yOffset,
        baseX: Math.cos(angle) * orbitRadius,
        baseY: yOffset,
        baseZ: Math.sin(angle) * orbitRadius,
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI * 0.25, // slight rotation for diamond shapes
        ),
        rotSpeed: (Math.random() - 0.5) * 0.2,
        floatSpeed: Math.random() * 0.15 + 0.05,
        floatAmp: Math.random() * 0.12 + 0.04,
        phase: Math.random() * Math.PI * 2,
        baseSize: 0.06 + Math.random() * 0.08,
        isDiamond: i % 3 === 0, // every 3rd is a diamond
        color: new THREE.Color(SATELLITE_COLORS[i % SATELLITE_COLORS.length]),
      }
    })
  }, [])

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!meshRef.current || !sceneVisible.current) return

    for (let i = 0; i < satellites.length; i++) {
      const sat = satellites[i]
      const px = sat.baseX + Math.sin(t * sat.floatSpeed + sat.phase) * 0.25
      const py = sat.baseY + Math.sin(t * sat.floatSpeed * 0.7 + sat.phase) * sat.floatAmp
      const pz = sat.baseZ + Math.cos(t * sat.floatSpeed * 0.5 + sat.phase) * 0.15

      const dx = px - mouse3D.x
      const dy = py - mouse3D.y
      const distSq = dx * dx + dy * dy
      const cursorGlow = Math.max(0, 1 - Math.sqrt(distSq) / 3)

      dummy.position.set(px, py, pz)
      dummy.rotation.set(
        sat.rotation.x + t * sat.rotSpeed,
        sat.rotation.y + t * sat.rotSpeed * 0.7,
        sat.isDiamond ? Math.PI / 4 + t * sat.rotSpeed * 0.3 : sat.rotation.z,
      )

      const size = sat.baseSize * (0.85 + Math.sin(t * 0.5 + sat.phase) * 0.15) * (1 + cursorGlow * 1.8)
      dummy.scale.setScalar(Math.max(0.01, size))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      const c = sat.color.clone().lerp(new THREE.Color(1, 1, 1), cursorGlow * 0.5)
      meshRef.current.setColorAt(i, c)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, satellites.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.8} />
    </instancedMesh>
  )
}

/* ═══════ SOLAR PARTICLES (cursor-reactive) ═══════ */

function SolarParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 40 : 80

  const particlesRef = useRef(Array.from({ length: count }, () => ({
    theta: Math.random() * Math.PI * 2,
    phi: (Math.random() - 0.5) * Math.PI * 0.5,
    radius: 1.1 + Math.random() * 1.3,
    speed: (Math.random() * 0.25 + 0.08) * (Math.random() < 0.5 ? 1 : -1),
    yOffset: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 0.4 + 0.2,
    phase: Math.random() * Math.PI * 2,
    vx: 0, vy: 0, vz: 0,
    px: 0, py: 0, pz: 0,
  })))

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!meshRef.current || !sceneVisible.current) return
    const mx = mouse3D.x
    const my = mouse3D.y
    const REPEL_RADIUS = 2.0
    const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS
    const REPEL_FORCE = 0.03
    const particles = particlesRef.current

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const angle = p.theta + t * p.speed
      const r = p.radius + Math.sin(t * 0.5 + p.phase) * 0.12
      const bx = Math.cos(angle) * Math.cos(p.phi) * r
      const by = p.yOffset + Math.sin(t * 0.3 + p.phase) * 0.08
      const bz = Math.sin(angle) * Math.cos(p.phi) * r

      const dx = bx - mx
      const dy = by - my
      const distSq = dx * dx + dy * dy

      if (distSq < REPEL_RADIUS_SQ && distSq > 0.01) {
        const dist = Math.sqrt(distSq)
        const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE
        const fvx = (dx / dist) * force
        const fvy = (dy / dist) * force
        p.vx += fvx
        p.vy += fvy
        p.vz += force * 0.5
      }

      p.vx += (bx - p.px) * 0.02
      p.vy += (by - p.py) * 0.02
      p.vz += (bz - p.pz) * 0.02
      p.vx *= 0.92
      p.vy *= 0.92
      p.vz *= 0.92
      p.px += p.vx
      p.py += p.vy
      p.pz += p.vz

      const dispX = p.px - bx
      const dispY = p.py - by
      const dispSq = dispX * dispX + dispY * dispY
      if (dispSq > 1.5) {
        const d = Math.sqrt(dispSq)
        p.px = bx + (dispX / d) * 1.5
        p.py = by + (dispY / d) * 1.5
      }

      const brightness = Math.max(0, 1 - Math.sqrt(distSq) / REPEL_RADIUS)
      dummy.position.set(p.px, p.py, p.pz)
      const s = p.size * (0.6 + Math.sin(t * 0.8 + p.phase) * 0.4) * (1 + brightness * 1.2)
      dummy.scale.setScalar(Math.max(0.01, s))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      const c = new THREE.Color(BRAND.tealLight).lerp(new THREE.Color(1, 1, 1), brightness * 0.7)
      meshRef.current.setColorAt(i, c)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial transparent opacity={0.45} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  )
}

/* ═══════ AMBIENT DUST ═══════ */

function AmbientDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 25 : 50
  const particles = useMemo(() => Array.from({ length: count }, () => ({
    position: new THREE.Vector3((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 22),
    speed: Math.random() * 0.12 + 0.02,
    offset: Math.random() * Math.PI * 2,
    size: Math.random() * 0.3 + 0.15,
  })), [count])

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!meshRef.current || !sceneVisible.current) return
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      dummy.position.set(
        p.position.x + Math.sin(t * p.speed + p.offset) * 0.3,
        p.position.y + Math.cos(t * p.speed * 0.5 + p.offset) * 0.2,
        p.position.z + Math.sin(t * p.speed * 0.3 + p.offset * 2) * 0.25,
      )
      dummy.scale.setScalar(Math.max(0.01, p.size * (0.5 + Math.sin(t * 0.6 + p.offset) * 0.5)))
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

/* ═══════ CURSOR LIGHT ═══════ */

function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (!sceneVisible.current) return
    if (lightRef.current) lightRef.current.position.set(mouse3D.x, mouse3D.y, mouse3D.z + 0.5)
  })

  return <pointLight ref={lightRef} color={BRAND.tealBright} distance={6} decay={2} intensity={1.5} />
}

/* ═══════ SCENE LIGHTING ═══════ */

function SceneLighting() {
  return <ambientLight intensity={0.06} />
}

/* ═══════ CAMERA CONTROLLER ═══════ */

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
    const x = mouse.current.x * 0.4 * parallaxStrength
    const y = -mouse.current.y * 0.25 * parallaxStrength
    target.current.set(x, y, z)
    camera.position.lerp(target.current, 0.04)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ═══════ MAIN EXPORT ═══════ */

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
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <SceneLighting />
        <MouseTracker />
        <CameraController />
        <CursorLight />
        <Stars radius={60} depth={70} count={400} factor={3} saturation={0} fade speed={0.2} />
        <Nucleus />
        <WireframeGlobe />
        <OrbitalRings />
        <SolarParticles />
        <SatelliteShapes />
        <AmbientDust />
      </Canvas>
      {/* Strong vignette overlay matching the reference */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 25%, rgba(5,5,7,0.45) 60%, rgba(5,5,7,0.85) 100%)',
      }} />
    </div>
  )
}
