'use client'
/* eslint-disable @typescript-eslint/no-restricted-syntax */

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
  daynFlow: '#c4a35a',
}

const ACCENT_COLORS = [
  '#9b59b6', '#5dade2', '#f1c40f',
  '#85c1e9', '#2ecc71', '#e74c3c',
]

export const sceneVisible = { current: true }
export const mouse3D = { x: 999, y: 0, z: 0 }

interface ProductPlanet {
  name: string; radius: number; orbitRadius: number
  speed: number; color: string; morphColor: string
  morphType: 'capsule' | 'sphere' | 'octahedron'
  morphDelay: number; morphDuration: number; hasRing: boolean
}

const PRODUCT_PLANETS: ProductPlanet[] = [
  { name: 'dayn-flow', radius: 0.32, orbitRadius: 3.8, speed: 0.1, color: BRAND.daynFlow, morphColor: '#e0c068', morphType: 'capsule', morphDelay: 2.5, morphDuration: 3.0, hasRing: true },
  { name: 'ai-engine', radius: 0.18, orbitRadius: 5.4, speed: -0.065, color: '#06b6d4', morphColor: '#22d3ee', morphType: 'octahedron', morphDelay: 4.0, morphDuration: 3.5, hasRing: false },
  { name: 'cloud-platform', radius: 0.15, orbitRadius: 6.8, speed: 0.045, color: '#a855f7', morphColor: '#c084fc', morphType: 'sphere', morphDelay: 5.5, morphDuration: 4.0, hasRing: false },
]

const ORBIT_TILT = -0.35

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

/* ═══════ CRYSTAL SHADER ═══════ */

const crystalVert = `
varying vec3 vWorldPos;
varying vec3 vNorm;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vNorm = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const crystalFrag = `
uniform vec3 uCursor;
uniform float uTime;
uniform float uBaseAlpha;
uniform vec3 uBaseColor;
varying vec3 vWorldPos;
varying vec3 vNorm;
void main() {
  float dist = distance(vWorldPos, uCursor);
  float glow = smoothstep(3.5, 0.0, dist);
  float prism = dot(vNorm, normalize(vec3(1.0, 0.6, 0.4))) * 0.5 + 0.5;
  vec3 crystalTeal = vec3(0.08, 0.78, 0.65);
  vec3 crystalBlue = vec3(0.35, 0.68, 0.95);
  vec3 crystalGold = vec3(0.83, 0.69, 0.22);
  vec3 prismColor = mix(crystalTeal, crystalBlue, prism);
  prismColor = mix(prismColor, crystalGold, glow * 0.35);
  vec3 color = mix(uBaseColor, prismColor, glow);
  color += vec3(1.0, 0.98, 0.95) * glow * glow * 0.4;
  float alpha = mix(uBaseAlpha, 0.85, glow) + sin(uTime * 0.4) * 0.02;
  gl_FragColor = vec4(color, alpha);
}
`

/* ═══════ CRYSTAL CAGE ═══════ */

function CrystalCage() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const outerU = useMemo(() => ({
    uCursor: { value: new THREE.Vector3(999, 0, 0) },
    uTime: { value: 0 },
    uBaseAlpha: { value: 0.18 },
    uBaseColor: { value: new THREE.Vector3(0.12, 0.29, 0.27) },
    uGlowColor: { value: new THREE.Vector3(0.08, 0.72, 0.65) },
  }), [])
  const innerU = useMemo(() => ({
    uCursor: { value: new THREE.Vector3(999, 0, 0) },
    uTime: { value: 0 },
    uBaseAlpha: { value: 0.1 },
    uBaseColor: { value: new THREE.Vector3(0.12, 0.29, 0.27) },
    uGlowColor: { value: new THREE.Vector3(0.08, 0.72, 0.65) },
  }), [])

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!sceneVisible.current) return

    const cursor = new THREE.Vector3(mouse3D.x, mouse3D.y, mouse3D.z)
    outerU.uCursor.value.lerp(cursor, 0.08)
    innerU.uCursor.value.lerp(cursor, 0.08)
    outerU.uTime.value = t
    innerU.uTime.value = t

    const baseOuter = 0.18 + Math.sin(t * 0.3) * 0.03
    const baseInner = 0.1 + Math.sin(t * 0.4 + 1) * 0.02
    const cursorDist = Math.sqrt(mouse3D.x * mouse3D.x + mouse3D.y * mouse3D.y)
    const cursorBoost = Math.max(0, 1 - cursorDist / 3.5) * 0.15
    outerU.uBaseAlpha.value = baseOuter + cursorBoost
    innerU.uBaseAlpha.value = baseInner + cursorBoost * 0.5

    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.08
      outerRef.current.rotation.x = Math.sin(t * 0.05) * 0.08
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.06
      innerRef.current.rotation.z = t * 0.04
    }
  })

  return (
    <group>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.8, 1]} />
        <shaderMaterial vertexShader={crystalVert} fragmentShader={crystalFrag} uniforms={outerU} wireframe transparent depthWrite={false} />
      </mesh>
      <mesh ref={innerRef}>
        <dodecahedronGeometry args={[2.0, 0]} />
        <shaderMaterial vertexShader={crystalVert} fragmentShader={crystalFrag} uniforms={innerU} wireframe transparent depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ═══════ CURSOR LIGHT ═══════ */

function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!sceneVisible.current) return
    if (lightRef.current) lightRef.current.position.set(mouse3D.x, mouse3D.y, mouse3D.z + 0.5)
    if (glowRef.current) glowRef.current.position.set(mouse3D.x, mouse3D.y, mouse3D.z)
  })

  return (
    <group>
      <pointLight ref={lightRef} color={BRAND.tealBright} distance={6} decay={2} intensity={2} />
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color={BRAND.tealGlow} transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

/* ═══════ SUN ═══════ */

function Sun() {
  const coreRef = useRef<THREE.Mesh>(null)
  const coronaRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)]
  const lightRef = useRef<THREE.PointLight>(null)
  const goldDotRef = useRef<THREE.Mesh>(null)

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!sceneVisible.current) return
    const pulse = Math.sin(t * 1.5) * 0.05 + 1
    if (coreRef.current) coreRef.current.scale.setScalar(pulse)
    const cp = [Math.sin(t * 1.2 + 0.5) * 0.04 + 1, Math.sin(t * 0.9 + 1.2) * 0.03 + 1, Math.sin(t * 0.6 + 2.0) * 0.05 + 1]
    coronaRefs.forEach((ref, i) => { if (ref.current) ref.current.scale.setScalar(cp[i]) })
    if (lightRef.current) lightRef.current.intensity = 4 + Math.sin(t * 1.5) * 0.6
    if (goldDotRef.current) {
      const a = t * 0.5
      goldDotRef.current.position.set(Math.cos(a) * 0.9, Math.sin(a) * 0.9, Math.sin(a * 0.7) * 0.2)
    }
  })

  return (
    <group>
      <pointLight ref={lightRef} color={BRAND.teal} distance={15} decay={2} intensity={4} />
      <pointLight position={[0, 0, 0]} color={BRAND.gold} distance={10} decay={2} intensity={1.2} />
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.85, 64, 64]} />
        <meshStandardMaterial emissive={BRAND.teal} emissiveIntensity={4.5} color={BRAND.tealLight} toneMapped={false} />
      </mesh>
      <mesh ref={goldDotRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial emissive={BRAND.gold} emissiveIntensity={6} color={BRAND.gold} toneMapped={false} />
      </mesh>
      {[{ size: 1.2, opacity: 0.18, color: BRAND.teal }, { size: 1.7, opacity: 0.08, color: BRAND.tealLight }, { size: 2.4, opacity: 0.03, color: BRAND.tealGlow }].map((g, i) => (
        <mesh key={i} ref={coronaRefs[i]}>
          <sphereGeometry args={[g.size, 32, 32]} />
          <meshBasicMaterial color={g.color} transparent opacity={g.opacity} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════ AXIS LINE ═══════ */

function AxisLine() {
  const matRef = useRef<THREE.LineBasicMaterial>(null)
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-12, 0, 0, 12, 0, 0]), 3))
    return geo
  }, [])

  useFrame(() => {
    if (!sceneVisible.current) return
    if (matRef.current) matRef.current.opacity = 0.12 + Math.sin(Date.now() * 0.001) * 0.04
  })

  return (
    <group rotation={[0, 0, ORBIT_TILT]}>
      <line geometry={geometry}>
        <lineBasicMaterial ref={matRef} color={BRAND.teal} transparent opacity={0.12} />
      </line>
    </group>
  )
}

/* ═══════ ACCENT SQUARES ═══════ */

function AccentSquares() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const squares = useMemo(() => ACCENT_COLORS.map((color, i) => ({
    position: new THREE.Vector3((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 6.4),
    rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
    rotSpeed: (Math.random() - 0.5) * 0.3,
    floatSpeed: Math.random() * 0.2 + 0.05,
    floatAmp: Math.random() * 0.15 + 0.05,
    phase: Math.random() * Math.PI * 2,
    baseSize: Math.random() * 0.08 + 0.04,
    color: new THREE.Color(color),
  })), [])

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!meshRef.current || !sceneVisible.current) return
    for (let i = 0; i < squares.length; i++) {
      const sq = squares[i]
      const px = sq.position.x + Math.sin(t * sq.floatSpeed + sq.phase) * 0.3
      const py = sq.position.y + Math.sin(t * sq.floatSpeed * 0.7 + sq.phase) * sq.floatAmp
      const pz = sq.position.z + Math.cos(t * sq.floatSpeed * 0.5 + sq.phase) * 0.2
      const dx = px - mouse3D.x
      const dy = py - mouse3D.y
      const distSq = dx * dx + dy * dy
      const cursorGlow = Math.max(0, 1 - Math.sqrt(distSq) / 3)
      dummy.position.set(px, py, pz)
      dummy.rotation.set(sq.rotation.x + t * sq.rotSpeed, sq.rotation.y + t * sq.rotSpeed * 0.7, sq.rotation.z)
      const s = sq.baseSize * (0.8 + Math.sin(t * 0.5 + sq.phase) * 0.2) * (1 + cursorGlow * 1.5)
      dummy.scale.setScalar(Math.max(0.01, s))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      const c = sq.color.clone().lerp(new THREE.Color(1, 1, 1), cursorGlow * 0.6)
      meshRef.current.setColorAt(i, c)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, squares.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.7} />
    </instancedMesh>
  )
}

/* ═══════ ORBIT RING ═══════ */

function OrbitRing({ radius, color, opacity = 0.08 }: { radius: number; color: string; opacity?: number }) {
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

/* ═══════ PRODUCT PLANET ═══════ */

function ProductPlanet({ config }: { config: ProductPlanet }) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const morphRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const scaleRef = useRef(0.01)
  const morphVal = useRef(0)

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!sceneVisible.current) return
    if (t > 1.5) scaleRef.current += (1 - scaleRef.current) * 0.03
    const entry = Math.min(1, scaleRef.current)
    if (t > config.morphDelay) morphVal.current = Math.min(1, morphVal.current + 1 / (config.morphDuration * 60))
    const m = morphVal.current
    const smooth = m < 0.5 ? 4 * m * m * m : 1 - Math.pow(-2 * m + 2, 3) / 2

    const gx = groupRef.current?.position.x ?? 0
    const gy = groupRef.current?.position.y ?? 0
    const cdx = gx - mouse3D.x
    const cdy = gy - mouse3D.y
    const cDist = Math.sqrt(cdx * cdx + cdy * cdy)
    const cursorBoost = Math.max(0, 1 - cDist / 2) * 0.8

    const angle = t * config.speed
    const r = config.orbitRadius
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    const y = Math.sin(angle) * Math.sin(ORBIT_TILT) * 0.3
    if (groupRef.current) groupRef.current.position.set(x, y, z)

    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.3
      sphereRef.current.scale.setScalar(Math.max(0.001, entry * (1 - smooth) * (1 + cursorBoost * 0.3)))
      const sm = sphereRef.current.material as THREE.MeshStandardMaterial
      sm.opacity = 1 - smooth
      sm.emissiveIntensity = 0.5 + cursorBoost * 3
    }
    if (morphRef.current) {
      morphRef.current.rotation.y = t * 0.4
      morphRef.current.scale.setScalar(Math.max(0.001, entry * smooth * (1 + cursorBoost * 0.4)))
      const mm = morphRef.current.material as THREE.MeshStandardMaterial
      mm.opacity = smooth
      mm.emissiveIntensity = 1 + cursorBoost * 4
    }
    if (glowRef.current) {
      const gp = Math.sin(t * 2) * 0.08 + 1
      glowRef.current.scale.setScalar(entry * gp * 2 * (1 + cursorBoost))
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.04 + cursorBoost * 0.15
    }
    if (ringRef.current && config.hasRing) {
      ringRef.current.rotation.x = Math.PI / 2.5
      ringRef.current.rotation.z = Math.sin(t * 0.2) * 0.05
      ringRef.current.scale.setScalar(entry * (0.5 + smooth * 0.5))
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = (0.15 + cursorBoost * 0.2) * entry
    }
  })

  const morphGeo = () => {
    switch (config.morphType) {
      case 'capsule': return <capsuleGeometry args={[config.radius * 0.65, config.radius * 1.2, 16, 32]} />
      case 'octahedron': return <octahedronGeometry args={[config.radius, 0]} />
      default: return <sphereGeometry args={[config.radius, 48, 48]} />
    }
  }

  return (
    <group ref={groupRef}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[config.radius, 48, 48]} />
        <meshStandardMaterial color={config.color} emissive={config.color} emissiveIntensity={0.5} transparent opacity={1} roughness={0.3} metalness={0.2} toneMapped={false} />
      </mesh>
      <mesh ref={morphRef} scale={0.001}>
        {morphGeo()}
        <meshStandardMaterial color={config.morphColor} emissive={config.morphColor} emissiveIntensity={1} transparent opacity={0} roughness={0.25} metalness={0.3} toneMapped={false} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[config.radius * 1.15, 24, 24]} />
        <meshBasicMaterial color={config.color} transparent opacity={0.04} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
      {config.hasRing && (
        <mesh ref={ringRef}>
          <torusGeometry args={[config.radius * 1.8, 0.02, 8, 64]} />
          <meshBasicMaterial color={config.color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
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
    const x = mouse.current.x * 0.5 * parallaxStrength
    const y = -mouse.current.y * 0.3 * parallaxStrength
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
        <CrystalCage />
        <AxisLine />
        <Sun />
        <SolarParticles />
        <AccentSquares />
        {PRODUCT_PLANETS.map((p) => (
          <OrbitRing key={`orbit-${p.name}`} radius={p.orbitRadius} color={p.color} opacity={0.08} />
        ))}
        {PRODUCT_PLANETS.map((p) => (
          <ProductPlanet key={p.name} config={p} />
        ))}
        <AmbientDust />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,7,0.55) 100%)' }} />
    </div>
  )
}
