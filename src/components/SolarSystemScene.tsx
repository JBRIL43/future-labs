'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Html } from '@react-three/drei'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { PRODUCTS } from '@/lib/products'

export const sceneVisible = { current: true }
export const mouse3D = { x: 999, y: 0, z: 0 }

/* ─── Atom colour palette ─────────────────────────────────── */
const TEAL = '#00C9A7'

/* ─── Electron / product definitions ──────────────────────── */
const ELECTRONS = PRODUCTS
  .filter((p) => p.orbit?.showInOrbit !== false)
  .map((p) => ({
    id: p.id,
    label: p.name,
    tagline: p.tagline,
    color: p.accentColor,
    logo: p.logo,
    speed: p.orbit.speed,
    startAngle: p.orbit.startAngle || 0,
  }))

// Fixed orbital ellipse size
const ORBIT_A = 2.4 // semi-major
const ORBIT_B = 0.65 // semi-minor

// Auto-compute evenly spaced tilts for products
const ORBIT_TILTS = ELECTRONS.map((_, i) => ({
  rotZ: (i / Math.max(ELECTRONS.length, 1)) * Math.PI,
}))

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
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [camera, raycaster, plane, target])

  return null
}

/* ═══════ NUCLEUS — Future Labs logo mark ═══════ */
function Nucleus() {
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((s) => {
    if (!glowRef.current || !sceneVisible.current) return
    const t = s.clock.getElapsedTime()
    const pulse = Math.sin(t * 1.1) * 0.08 + 1
    glowRef.current.scale.setScalar(pulse)
    ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.12 + Math.sin(t * 0.7) * 0.04
  })

  return (
    <group>
      {/* Point light so orbits catch light */}
      <pointLight color={TEAL} distance={10} decay={2} intensity={3} />

      {/* Soft teal glow sphere behind the logo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshBasicMaterial
          color={TEAL}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer halo ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.68, 0.006, 8, 80]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.18} />
      </mesh>

      {/* FL SVG mark — rendered as HTML overlay at world origin */}
      <Html center distanceFactor={10} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 14,
          background: 'rgba(0,201,167,0.08)',
          border: '1.5px solid rgba(0,201,167,0.35)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 28px rgba(0,201,167,0.25), 0 0 60px rgba(0,201,167,0.1)',
        }}>
          <svg width="44" height="44" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 14 L14 42 M14 14 L32 14 M14 26 L26 26"
              stroke="#00C9A7"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M34 20 L34 42 L46 42"
              stroke="#00C9A7"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="34" cy="26" r="2.5" fill="#F5A623" />
          </svg>
        </div>
      </Html>
    </group>
  )
}

/* ═══════ ONE ORBITAL RING ═══════ */
function OrbitalRing({ electron, tilt }: { electron: typeof ELECTRONS[number]; tilt: { rotZ: number } }) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!ringRef.current || !sceneVisible.current) return
    const mat = ringRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.28 + Math.sin(Date.now() * 0.0009) * 0.07
  })

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 120; i++) {
      const θ = (i / 120) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(θ) * ORBIT_A, Math.sin(θ) * ORBIT_B, 0))
    }
    return pts
  }, [])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, true), [points])

  return (
    <group rotation={[0, 0, tilt.rotZ]}>
      <mesh ref={ringRef}>
        <tubeGeometry args={[curve, 80, 0.009, 5, true]} />
        <meshBasicMaterial color={electron.color} transparent opacity={0.28} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 40, 0.028, 5, true]} />
        <meshBasicMaterial color={electron.color} transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

/* ═══════ ONE ELECTRON (ORBITING LOGO SPHERE) ═══════ */
function Electron({ electron, tilt }: { electron: typeof ELECTRONS[number]; tilt: { rotZ: number } }) {
  const nodeRef = useRef<THREE.Group>(null)
  const angleRef = useRef(electron.startAngle)

  useFrame((_, delta) => {
    if (!sceneVisible.current) return
    angleRef.current += delta * electron.speed

    const θ = angleRef.current
    const localPos = new THREE.Vector3(
      Math.cos(θ) * ORBIT_A,
      Math.sin(θ) * ORBIT_B,
      0,
    )
    localPos.applyEuler(new THREE.Euler(0, 0, tilt.rotZ))

    if (nodeRef.current) {
      nodeRef.current.position.copy(localPos)
    }
  })

  return (
    <group ref={nodeRef}>
      {/* Light emitted at node position */}
      <pointLight color={electron.color} distance={2.5} decay={2} intensity={1.5} />

      {/* Orbiting Logo Sphere Badge */}
      <Html center distanceFactor={10} style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}>
          {/* Logo Sphere Badge */}
          <div style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: 'rgba(18, 18, 21, 0.92)',
            border: `1.5px solid ${electron.color}`,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            overflow: 'hidden',
            boxShadow: `0 0 18px ${electron.color}66, 0 0 35px ${electron.color}33`,
          }}>
            {electron.logo ? (
              <img
                src={electron.logo}
                alt={electron.label}
                style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.15)' }}
              />
            ) : (
              <span style={{ fontSize: 13, fontWeight: 700, color: electron.color }}>
                {electron.label.charAt(0)}
              </span>
            )}
          </div>

          {/* Product Label Badge */}
          <div style={{
            padding: '2px 8px',
            borderRadius: 6,
            background: 'rgba(18, 18, 21, 0.85)',
            border: `1px solid ${electron.color}40`,
            backdropFilter: 'blur(6px)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '0.04em', color: electron.color, display: 'block' }}>
              {electron.label}
            </span>
            <span style={{ fontSize: 7, fontFamily: "'Inter', sans-serif", letterSpacing: '0.06em', color: `${electron.color}aa`, textTransform: 'uppercase', display: 'block' }}>
              {electron.tagline}
            </span>
          </div>
        </div>
      </Html>
    </group>
  )
}

/* ═══════ AMBIENT DUST ═══════ */
function AmbientDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 20 : 40
  const pts = useMemo(() => Array.from({ length: count }, () => ({
    pos: new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 14),
    speed: Math.random() * 0.08 + 0.02,
    offset: Math.random() * Math.PI * 2,
    size: Math.random() * 0.25 + 0.1,
  })), [count])

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (!meshRef.current || !sceneVisible.current) return
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]
      dummy.position.set(
        p.pos.x + Math.sin(t * p.speed + p.offset) * 0.3,
        p.pos.y + Math.cos(t * p.speed * 0.5 + p.offset) * 0.2,
        p.pos.z + Math.sin(t * p.speed * 0.3 + p.offset * 2) * 0.25,
      )
      dummy.scale.setScalar(Math.max(0.01, p.size * (0.5 + Math.sin(t * 0.6 + p.offset) * 0.5)))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.012, 4, 4]} />
      <meshBasicMaterial color={TEAL} transparent opacity={0.18} />
    </instancedMesh>
  )
}

/* ═══════ CURSOR LIGHT ═══════ */
function CursorLight() {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(() => {
    if (ref.current && sceneVisible.current)
      ref.current.position.set(mouse3D.x, mouse3D.y, 1)
  })
  return <pointLight ref={ref} color={TEAL} distance={5} decay={2} intensity={1.2} />
}

/* ═══════ CAMERA CONTROLLER ═══════ */
function CameraController() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef(new THREE.Vector3(0, 0, 7))

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
    const sp = Math.min(1, window.scrollY / (window.innerHeight * 2.5))
    const z = THREE.MathUtils.lerp(7, 11, sp)
    const str = 1 - sp * 0.7
    target.current.set(mouse.current.x * 0.3 * str, -mouse.current.y * 0.2 * str, z)
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
      const opacity = Math.max(0, 1 - window.scrollY / (window.innerHeight * 2.8))
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
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={1}
        frameloop="always"
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.05} />
        <MouseTracker />
        <CameraController />
        <CursorLight />
        <Stars radius={80} depth={60} count={800} factor={2} saturation={0} fade speed={0.08} />

        {/* ── Atom structure ── */}
        <Nucleus />
        {ELECTRONS.map((e, i) => (
          <group key={e.id}>
            <OrbitalRing electron={e} tilt={ORBIT_TILTS[i]} />
            <Electron electron={e} tilt={ORBIT_TILTS[i]} />
          </group>
        ))}

        <AmbientDust />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 45%, rgba(10,10,15,0.35) 70%, rgba(10,10,15,0.75) 100%)',
      }} />
    </div>
  )
}
