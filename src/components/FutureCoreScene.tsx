'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Stars } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

/* ═══════════════════════════════════════════
   CONSTANTS & TYPES
   ═══════════════════════════════════════════ */

const TECH_MODULES = [
  { name: 'Artificial Intelligence', icon: '🤖', color: '#10b981', desc: 'Intelligent systems & ML' },
  { name: 'Software Engineering', icon: '🌐', color: '#06b6d4', desc: 'Full-stack development' },
  { name: 'Mobile Development', icon: '📱', color: '#a855f7', desc: 'Native & cross-platform' },
  { name: 'Blockchain', icon: '⛓️', color: '#f59e0b', desc: 'Decentralized solutions' },
  { name: 'Cloud Computing', icon: '☁️', color: '#38bdf8', desc: 'Scalable infrastructure' },
  { name: 'Automation', icon: '⚡', color: '#f43f5e', desc: 'AI-powered workflows' },
] as const

const MODULE_COUNT = TECH_MODULES.length
const ORBIT_RADIUS = 3.0
const ENTRY_DURATION = 3.5

export const sceneVisible = { current: true }

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)
}

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * Math.min(1, Math.max(0, t)))
}

function getModulePos(index: number, time: number, radius: number) {
  const baseAngle = (index / MODULE_COUNT) * Math.PI * 2
  const speed = 0.12 + index * 0.015
  const angle = baseAngle + time * speed
  const yBase = Math.sin(index * 1.7) * 0.25
  const yFloat = Math.sin(time * 0.4 + index * 0.8) * 0.15
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    yBase + yFloat,
    Math.sin(angle) * radius
  )
}

/* ═══════════════════════════════════════════
   ENERGY CORE
   The glowing heart of Ethiopia's digital future
   ═══════════════════════════════════════════ */

function EnergyCore() {
  const coreRef = useRef<THREE.Mesh>(null)
  const glowRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ]
  const innerLightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!sceneVisible.current) return

    const entry = easeOutExpo(t / 1.0)
    const pulse = Math.sin(t * 2) * 0.06 + 1

    if (coreRef.current) {
      coreRef.current.scale.setScalar(entry * pulse)
    }

    const glowPulses = [
      Math.sin(t * 1.5 + 0.5) * 0.05 + 1,
      Math.sin(t * 1.2 + 1.0) * 0.04 + 1,
      Math.sin(t * 0.8 + 2.0) * 0.03 + 1,
    ]

    glowRefs.forEach((ref, i) => {
      if (!ref.current) return
      ref.current.scale.setScalar(entry * glowPulses[i])
    })

    if (innerLightRef.current) {
      innerLightRef.current.intensity = 3 * entry + Math.sin(t * 2) * 0.5
    }
  })

  return (
    <group>
      <pointLight ref={innerLightRef} color="#10b981" distance={8} decay={2} intensity={0} />
      {/* Bright inner core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          emissive="#10b981"
          emissiveIntensity={5}
          color="#34d399"
          toneMapped={false}
        />
      </mesh>
      {/* Glow layers */}
      {[
        { size: 0.65, opacity: 0.18, color: '#10b981', additive: false },
        { size: 0.9, opacity: 0.07, color: '#34d399', additive: false },
        { size: 1.3, opacity: 0.03, color: '#6ee7b7', additive: true },
      ].map((g, i) => (
        <mesh key={i} ref={glowRefs[i]}>
          <sphereGeometry args={[g.size, 32, 32]} />
          <meshBasicMaterial
            color={g.color}
            transparent
            opacity={g.opacity}
            blending={g.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
            side={THREE.BackSide}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ═══════════════════════════════════════════
   CRYSTALLINE SHELL
   Transparent icosahedron + inner dodecahedron
   ═══════════════════════════════════════════ */

function CrystallineShell() {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const outerMat = useRef<THREE.MeshBasicMaterial>(null)
  const innerMat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!sceneVisible.current) return

    const entry = easeOutCubic((t - 0.3) / 1.4)

    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.1
      outerRef.current.rotation.x = Math.sin(t * 0.07) * 0.1
      outerRef.current.scale.setScalar(entry)
    }
    if (outerMat.current) {
      outerMat.current.opacity = 0.14 * entry
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.07
      innerRef.current.rotation.z = t * 0.05
      innerRef.current.scale.setScalar(entry)
    }
    if (innerMat.current) {
      innerMat.current.opacity = 0.06 * entry
    }
  })

  return (
    <group>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial ref={outerMat} color="#10b981" wireframe transparent opacity={0} />
      </mesh>
      <mesh ref={innerRef}>
        <dodecahedronGeometry args={[1.15, 0]} />
        <meshBasicMaterial ref={innerMat} color="#06b6d4" wireframe transparent opacity={0} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════
   HOLOGRAPHIC RINGS
   Three rotating orbital rings at different angles
   ═══════════════════════════════════════════ */

function HolographicRings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)
  const mat1 = useRef<THREE.MeshBasicMaterial>(null)
  const mat2 = useRef<THREE.MeshBasicMaterial>(null)
  const mat3 = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!sceneVisible.current) return

    const entry = easeOutExpo((t - 0.6) / 1.2)

    // Ring 1: XZ plane, clockwise
    if (ring1.current) {
      ring1.current.rotation.z = t * 0.25
      ring1.current.scale.setScalar(entry)
    }
    if (mat1.current) mat1.current.opacity = 0.4 * entry

    // Ring 2: tilted
    if (ring2.current) {
      ring2.current.rotation.z = t * -0.2
      ring2.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.15) * 0.08
      ring2.current.scale.setScalar(entry)
    }
    if (mat2.current) mat2.current.opacity = 0.25 * entry

    // Ring 3: other tilt, gold accent
    if (ring3.current) {
      ring3.current.rotation.z = t * 0.15
      ring3.current.rotation.y = Math.PI / 3 + Math.cos(t * 0.1) * 0.08
      ring3.current.scale.setScalar(entry)
    }
    if (mat3.current) mat3.current.opacity = 0.15 * entry
  })

  return (
    <group>
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.018, 16, 128]} />
        <meshBasicMaterial ref={mat1} color="#10b981" transparent opacity={0} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.55, 0.013, 16, 100]} />
        <meshBasicMaterial ref={mat2} color="#06b6d4" transparent opacity={0} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 4, 0, Math.PI / 3]}>
        <torusGeometry args={[2.85, 0.009, 16, 100]} />
        <meshBasicMaterial ref={mat3} color="#f59e0b" transparent opacity={0} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════
   ORBITING TECH MODULES
   Six domains orbiting the core
   ═══════════════════════════════════════════ */

function OrbitingModule({ index }: { index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const scaleRef = useRef(1)
  const mod = TECH_MODULES[index]

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!sceneVisible.current) return

    // Entry: orbit from center outward
    const entryDelay = 1.5 + index * 0.18
    const entryProgress = easeOutCubic((t - entryDelay) / 0.9)
    const currentRadius = ORBIT_RADIUS * entryProgress

    const pos = getModulePos(index, t, currentRadius)

    if (groupRef.current) {
      groupRef.current.position.copy(pos)
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.4 + index
      meshRef.current.rotation.y = t * 0.6 + index * 2
      scaleRef.current += ((hovered ? 1.8 : 1) - scaleRef.current) * 0.1
      meshRef.current.scale.setScalar(scaleRef.current * entryProgress)
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(scaleRef.current * entryProgress * 1.8)
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = hovered ? 0.12 : 0.04
    }
  })

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={mod.color}
          emissive={mod.color}
          emissiveIntensity={hovered ? 3 : 0.5}
          toneMapped={false}
        />
      </mesh>
      {/* Module glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial
          color={mod.color}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Hover tooltip */}
      {hovered && (
        <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div
            className="px-3 py-2 rounded-lg text-center whitespace-nowrap"
            style={{
              background: 'rgba(5,5,7,0.92)',
              border: `1px solid ${mod.color}40`,
              backdropFilter: 'blur(12px)',
              boxShadow: `0 0 30px ${mod.color}25, 0 0 60px ${mod.color}10`,
            }}
          >
            <div className="text-base mb-0.5">{mod.icon}</div>
            <div className="text-xs font-semibold" style={{ color: mod.color }}>
              {mod.name}
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">{mod.desc}</div>
          </div>
        </Html>
      )}
    </group>
  )
}

/* ═══════════════════════════════════════════
   ENERGY BEAMS
   Lines connecting core to each module
   ═══════════════════════════════════════════ */

/* Pre-allocated buffers & objects for energy beams (module-level, lint-safe) */
const BEAM_POS = new Float32Array(MODULE_COUNT * 6)
const PARTICLE_POS = new Float32Array(MODULE_COUNT * 3 * 3)
let BEAM_ATTR: THREE.BufferAttribute | null = null
let PARTICLE_ATTR: THREE.BufferAttribute | null = null
const LINE_MAT = new THREE.LineBasicMaterial({
  color: '#10b981', transparent: true, opacity: 0, blending: THREE.AdditiveBlending,
})
const POINT_MAT = new THREE.PointsMaterial({
  color: '#34d399', size: 0.04, transparent: true, opacity: 0,
  blending: THREE.AdditiveBlending, sizeAttenuation: true,
})

function EnergyBeams() {
  const [lineObj] = useState(() => {
    const g = new THREE.BufferGeometry()
    const attr = new THREE.BufferAttribute(BEAM_POS, 3)
    g.setAttribute('position', attr)
    BEAM_ATTR = attr
    return new THREE.LineSegments(g, LINE_MAT)
  })
  const [pointsObj] = useState(() => {
    const g = new THREE.BufferGeometry()
    const attr = new THREE.BufferAttribute(PARTICLE_POS, 3)
    g.setAttribute('position', attr)
    PARTICLE_ATTR = attr
    return new THREE.Points(g, POINT_MAT)
  })

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!sceneVisible.current) return

    let anyVisible = false

    for (let i = 0; i < MODULE_COUNT; i++) {
      const entryDelay = 1.5 + i * 0.18
      const entryProgress = easeOutCubic((t - entryDelay) / 0.9)
      const currentRadius = ORBIT_RADIUS * entryProgress
      const pos = getModulePos(i, t, currentRadius)

      const idx = i * 6
      BEAM_POS[idx] = 0
      BEAM_POS[idx + 1] = 0
      BEAM_POS[idx + 2] = 0
      BEAM_POS[idx + 3] = pos.x
      BEAM_POS[idx + 4] = pos.y
      BEAM_POS[idx + 5] = pos.z

      if (entryProgress > 0.1) anyVisible = true

      for (let p = 0; p < 3; p++) {
        const pIdx = (i * 3 + p) * 3
        const progress = ((t * 0.8 + p * 0.33 + i * 0.17) % 1)
        PARTICLE_POS[pIdx] = pos.x * progress
        PARTICLE_POS[pIdx + 1] = pos.y * progress
        PARTICLE_POS[pIdx + 2] = pos.z * progress
      }
    }

    if (BEAM_ATTR) BEAM_ATTR.needsUpdate = true
    if (PARTICLE_ATTR) PARTICLE_ATTR.needsUpdate = true

    LINE_MAT.opacity = anyVisible ? 0.06 + Math.sin(t * 1.5) * 0.02 : 0
    POINT_MAT.opacity = anyVisible ? 0.6 : 0
  })

  return (
    <group>
      <primitive object={lineObj} />
      <primitive object={pointsObj} />
    </group>
  )
}

/* ═══════════════════════════════════════════
   AMBIENT PARTICLES
   Instanced mesh for performance
   ═══════════════════════════════════════════ */

function AmbientParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 160

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 18
      ),
      speed: Math.random() * 0.25 + 0.05,
      offset: Math.random() * Math.PI * 2,
      size: Math.random() * 0.6 + 0.4,
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current || !sceneVisible.current) return
    const t = clock.getElapsedTime()

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      dummy.position.set(
        p.position.x + Math.sin(t * p.speed + p.offset) * 0.5,
        p.position.y + Math.cos(t * p.speed * 0.6 + p.offset) * 0.35,
        p.position.z + Math.sin(t * p.speed * 0.4 + p.offset * 2) * 0.4
      )
      const s = p.size * (0.6 + Math.sin(t * 0.7 + p.offset) * 0.4)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial color="#10b981" transparent opacity={0.35} />
    </instancedMesh>
  )
}

/* ═══════════════════════════════════════════
   ETHIOPIAN PLATFORM
   Hexagonal platform with geometric patterns
   ═══════════════════════════════════════════ */

function EthiopianPlatform() {
  const groupRef = useRef<THREE.Group>(null)
  const platformMat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current || !sceneVisible.current) return
    const entry = easeOutCubic((t - 0.8) / 1.5)
    groupRef.current.scale.setScalar(entry)
    groupRef.current.rotation.y = t * 0.025
    if (platformMat.current) {
      platformMat.current.opacity = 0.035 * entry
    }
  })

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape()
    const r = 3.8
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6 - Math.PI / 6
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    return shape
  }, [])

  return (
    <group ref={groupRef} position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <shapeGeometry args={[hexShape]} />
        <meshBasicMaterial ref={platformMat} color="#10b981" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      {/* Ethiopian-inspired hexagonal rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.85, 6]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.04, 6]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.035} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner cross pattern (Axumite-inspired) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.23, 4]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════
   NETWORK NODES (Stage 3 — scroll expansion)
   Additional nodes that appear as camera zooms out
   ═══════════════════════════════════════════ */

function NetworkNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const lineRef = useRef<THREE.LineSegments>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const extraNodes = useMemo(() => {
    const nodes: THREE.Vector3[] = []
    for (let i = 0; i < 20; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = 4.5 + Math.random() * 3
      nodes.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        (Math.random() - 0.5) * 4,
        r * Math.sin(phi) * Math.sin(theta)
      ))
    }
    return nodes
  }, [])

  // Connection lines between nearby extra nodes
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions: number[] = []
    for (let i = 0; i < extraNodes.length; i++) {
      for (let j = i + 1; j < extraNodes.length; j++) {
        if (extraNodes[i].distanceTo(extraNodes[j]) < 4.5) {
          positions.push(
            extraNodes[i].x, extraNodes[i].y, extraNodes[i].z,
            extraNodes[j].x, extraNodes[j].y, extraNodes[j].z
          )
        }
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geo
  }, [extraNodes])

  useFrame(({ clock }) => {
    if (!sceneVisible.current) return
    const t = clock.getElapsedTime()

    // Network nodes appear at scroll progress > 0.3
    const scrollY = window.scrollY
    const vh = window.innerHeight
    const scrollProgress = Math.min(1, scrollY / (vh * 2.5))
    const networkAlpha = Math.max(0, (scrollProgress - 0.2) / 0.5)

    if (meshRef.current) {
      for (let i = 0; i < extraNodes.length; i++) {
        const p = extraNodes[i]
        dummy.position.set(
          p.x + Math.sin(t * 0.2 + i) * 0.1,
          p.y + Math.cos(t * 0.15 + i * 0.7) * 0.08,
          p.z + Math.sin(t * 0.18 + i * 1.3) * 0.1
        )
        const s = networkAlpha * (0.5 + Math.sin(t * 0.5 + i) * 0.3)
        dummy.scale.setScalar(Math.max(0.01, s))
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }

    if (matRef.current) {
      matRef.current.opacity = networkAlpha * 0.5
    }
    if (lineMatRef.current) {
      lineMatRef.current.opacity = networkAlpha * 0.06
    }
  })

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, extraNodes.length]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <pointsMaterial ref={matRef} color="#06b6d4" size={0.08} transparent opacity={0} sizeAttenuation />
      </instancedMesh>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          ref={lineMatRef}
          color="#06b6d4"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

/* ═══════════════════════════════════════════
   DAYN FLOW NODE (Stage 4 — product reveal)
   ═══════════════════════════════════════════ */

function DaynFlowNode() {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const htmlRef = useRef<HTMLDivElement>(null)
  const [showLabel, setShowLabel] = useState(false)

  useFrame(({ clock }) => {
    if (!sceneVisible.current) return
    const t = clock.getElapsedTime()

    const scrollY = window.scrollY
    const vh = window.innerHeight
    const scrollProgress = Math.min(1, scrollY / (vh * 2.5))
    const revealAlpha = Math.max(0, (scrollProgress - 0.5) / 0.4)

    if (groupRef.current) {
      const angle = t * 0.08
      groupRef.current.position.set(
        Math.cos(angle) * 5.5,
        1.2 + Math.sin(t * 0.3) * 0.2,
        Math.sin(angle) * 5.5
      )
      groupRef.current.scale.setScalar(Math.max(0.01, revealAlpha))
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5
      meshRef.current.rotation.x = t * 0.3
    }
    if (glowRef.current) {
      const pulse = Math.sin(t * 2) * 0.1 + 1
      glowRef.current.scale.setScalar(Math.max(0.01, revealAlpha * pulse * 1.5))
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = revealAlpha * 0.08
    }

    setShowLabel(revealAlpha > 0.5)
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          emissive="#f59e0b"
          emissiveIntensity={3}
          color="#f59e0b"
          toneMapped={false}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
      {showLabel && (
        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div
            className="px-3 py-1.5 rounded-full text-center whitespace-nowrap"
            style={{
              background: 'rgba(5,5,7,0.9)',
              border: '1px solid rgba(245,158,11,0.4)',
              boxShadow: '0 0 20px rgba(245,158,11,0.15)',
            }}
          >
            <span className="text-xs font-bold text-amber-400 tracking-wider">DAYN FLOW</span>
          </div>
        </Html>
      )}
    </group>
  )
}

/* ═══════════════════════════════════════════
   SCENE LIGHTING
   ═══════════════════════════════════════════ */

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#10b981" distance={12} decay={2} />
      <pointLight position={[4, 3, 4]} intensity={0.25} color="#06b6d4" distance={18} />
      <pointLight position={[-4, -2, -4]} intensity={0.12} color="#f59e0b" distance={18} />
    </>
  )
}

/* ═══════════════════════════════════════════
   CAMERA CONTROLLER
   Mouse parallax + scroll-driven zoom
   ═══════════════════════════════════════════ */

function CameraController() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef(new THREE.Vector3(0, 0, 7.5))

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
    const z = THREE.MathUtils.lerp(7.5, 13, sp)
    // Mouse parallax reduces with scroll
    const parallaxStrength = 1 - sp * 0.6
    const x = mouse.current.x * 0.7 * parallaxStrength
    const y = -mouse.current.y * 0.4 * parallaxStrength

    target.current.set(x, y, z)
    camera.position.lerp(target.current, 0.04)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════ */

export function FutureCoreScene() {
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
        camera={{ position: [0, 0, 7.5], fov: 45 }}
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
        <EnergyCore />
        <CrystallineShell />
        <HolographicRings />
        {TECH_MODULES.map((_, i) => (
          <OrbitingModule key={i} index={i} />
        ))}
        <EnergyBeams />
        <AmbientParticles />
        <EthiopianPlatform />
        <NetworkNodes />
        <DaynFlowNode />
        <Stars
          radius={50}
          depth={60}
          count={600}
          factor={3}
          saturation={0}
          fade
          speed={0.4}
        />
      </Canvas>
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(5,5,7,0.5) 100%)',
        }}
      />
    </div>
  )
}
