import { memo, useEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { PlanetDef, PlanetId } from '../../data/planets'
import { resolve, type Locale } from '../../i18n/locales'
import { ui } from '../../i18n/ui'
import { createPlanetTexture, createRingTexture } from './textures'
import { useRuntime } from './runtime'

interface Props {
  def: PlanetDef
  rx: number
  rz: number
  sizeScale: number
  textureSize: number
  segments: number
  hovered: boolean
  focused: boolean
  dimmed: boolean
  interactive: boolean
  locale: Locale
  onHover: (id: PlanetId | null) => void
  onSelect: (id: PlanetId) => void
}

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // Back faces of a slightly larger shell: brightest at the planet limb, fading outward.
    float f = pow(abs(dot(vNormal, vView)), 2.2) * 1.4;
    gl_FragColor = vec4(uColor, f * uStrength);
    #include <colorspace_fragment>
  }
`

function ringGeometry(inner: number, outer: number) {
  const g = new THREE.RingGeometry(inner, outer, 128, 1)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5)
  }
  return g
}

function PlanetImpl({
  def,
  rx,
  rz,
  sizeScale,
  textureSize,
  segments,
  hovered,
  focused,
  dimmed,
  interactive,
  locale,
  onHover,
  onSelect,
}: Props) {
  const runtime = useRuntime()
  const orbitRef = useRef<THREE.Group>(null)
  const bodyGroup = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const moonPivot = useRef<THREE.Group>(null)

  const radius = def.size * sizeScale
  const map = useMemo(() => createPlanetTexture(def.id, textureSize), [def.id, textureSize])
  const ringTex = useMemo(() => (def.feature === 'rings' ? createRingTexture() : null), [def.feature])
  const ringGeo = useMemo(() => (def.feature === 'rings' ? ringGeometry(1.35, 2.25) : null), [def.feature])
  const glowColor = useMemo(() => new THREE.Color(def.glow), [def.glow])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map,
        roughness: 0.88,
        metalness: 0,
        emissive: glowColor,
        emissiveIntensity: 0.04,
      }),
    [map, glowColor],
  )
  const ringMat = useMemo(
    () =>
      ringTex
        ? new THREE.MeshStandardMaterial({
            map: ringTex,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            roughness: 1,
            emissive: glowColor,
            emissiveIntensity: 0.12,
          })
        : null,
    [ringTex, glowColor],
  )
  const atmosphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uColor: { value: new THREE.Color(def.feature === 'atmosphere' ? '#c3b8ec' : def.glow) },
          uStrength: { value: def.feature === 'atmosphere' ? 0.8 : 0.3 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    [def.feature, def.glow],
  )

  useEffect(() => {
    runtime.planets[def.id] = orbitRef.current ?? undefined
    return () => {
      delete runtime.planets[def.id]
    }
  }, [runtime, def.id])

  useEffect(
    () => () => {
      map.dispose()
      ringTex?.dispose()
      material.dispose()
      ringMat?.dispose()
      atmosphereMat.dispose()
    },
    [map, ringTex, material, ringMat, atmosphereMat],
  )

  const state = useRef({ scale: 1, bright: 1, glow: 0.04, atmo: atmosphereMat.uniforms.uStrength.value as number })
  const baseAtmo = def.feature === 'atmosphere' ? 0.8 : 0.3

  useFrame((_, dt) => {
    const a = def.orbit.phase + runtime.simTime * def.orbit.speed
    const g = orbitRef.current
    if (g) g.position.set(Math.cos(a) * rx, 0, -Math.sin(a) * rz)
    if (bodyRef.current) bodyRef.current.rotation.y += dt * 0.12 * Math.max(runtime.timeScale, 0.25)
    if (moonPivot.current) moonPivot.current.rotation.y += dt * 0.5 * Math.max(runtime.timeScale, 0.2)

    const s = state.current
    const k = 1 - Math.pow(0.001, dt) // frame-rate independent smoothing
    const targetScale = focused ? 1.08 : hovered ? 1.18 : 1
    const targetBright = dimmed ? 0.16 : 1
    const targetGlow = dimmed ? 0 : hovered || focused ? 0.2 : 0.04
    const targetAtmo = dimmed ? 0 : baseAtmo * (hovered ? 1.6 : 1)
    s.scale += (targetScale - s.scale) * k
    s.bright += (targetBright - s.bright) * k
    s.glow += (targetGlow - s.glow) * k
    s.atmo += (targetAtmo - s.atmo) * k
    if (bodyGroup.current) bodyGroup.current.scale.setScalar(s.scale)
    material.color.setScalar(s.bright)
    material.emissiveIntensity = s.glow
    atmosphereMat.uniforms.uStrength.value = s.atmo
    if (ringMat) {
      ringMat.opacity = 0.25 + 0.75 * s.bright
      ringMat.color.setScalar(s.bright)
    }
  })

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return
    e.stopPropagation()
    onHover(def.id)
    document.body.style.cursor = 'pointer'
  }
  const handleOut = () => {
    onHover(null)
    document.body.style.cursor = ''
  }
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return
    e.stopPropagation()
    document.body.style.cursor = ''
    onSelect(def.id)
  }

  return (
    <group ref={orbitRef}>
      <group ref={bodyGroup}>
        <group rotation={[0.18, 0, def.feature === 'rings' ? 0.22 : 0.12]}>
          <mesh ref={bodyRef} material={material}>
            <sphereGeometry args={[radius, segments, segments]} />
          </mesh>
          <mesh material={atmosphereMat} scale={def.feature === 'atmosphere' ? 1.16 : 1.08}>
            <sphereGeometry args={[radius, 32, 32]} />
          </mesh>
          {ringGeo && ringMat && (
            <mesh geometry={ringGeo} material={ringMat} rotation={[-Math.PI / 2 + 0.06, 0, 0]} scale={radius} />
          )}
        </group>
        {def.feature === 'moon' && (
          <group ref={moonPivot} rotation={[0.35, 0, 0]}>
            <mesh position={[radius * 2.1, 0, 0]}>
              <sphereGeometry args={[radius * 0.27, 24, 24]} />
              <meshStandardMaterial color="#d8cfc4" roughness={1} />
            </mesh>
          </group>
        )}
      </group>

      {/* Generous invisible hit area so small planets are easy to hover and tap. */}
      <mesh onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <sphereGeometry args={[radius * (def.feature === 'rings' ? 2.4 : 2), 12, 12]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} transparent opacity={0} />
      </mesh>

      {hovered && interactive && (
        <Html position={[0, radius * 1.9 + 0.25, 0]} center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
          <div className="planet-tooltip" style={{ ['--accent' as string]: def.accent }}>
            <span className="planet-tooltip__index">0{def.index}</span>
            <span className="planet-tooltip__name">{resolve(def.name, locale)}</span>
            <span className="planet-tooltip__text">{resolve(def.teaser, locale)}</span>
            <span className="planet-tooltip__cta">{ui[locale].clickToExplore}</span>
          </div>
        </Html>
      )}
    </group>
  )
}

export const Planet = memo(PlanetImpl)
