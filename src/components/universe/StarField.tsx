import { memo, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.65 + 0.35 * sin(uTime * (0.6 + aPhase * 0.8) + aPhase * 6.2831);
    vAlpha = tw;
    vColor = aColor;
    gl_PointSize = aSize * uPixelRatio * (90.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`

interface Props {
  count: number
  dustCount: number
  animate: boolean
}

const palette = ['#f4ead9', '#f2c9a8', '#d9c6e6', '#c9d3ea', '#ffffff']

function buildPoints(count: number, kind: 'stars' | 'dust') {
  const pos = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const phase = new Float32Array(count)
  const color = new Float32Array(count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < count; i++) {
    if (kind === 'stars') {
      // shell around the scene
      const u = Math.random() * 2 - 1
      const t = Math.random() * Math.PI * 2
      const r = 55 + Math.random() * 55
      const s = Math.sqrt(1 - u * u)
      pos.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3)
      size[i] = Math.random() < 0.06 ? 3.4 + Math.random() * 2 : 1.1 + Math.random() * 1.6
    } else {
      // dust disk in the orbital plane
      const r = 2.5 + Math.pow(Math.random(), 0.8) * 14
      const t = Math.random() * Math.PI * 2
      pos.set([r * Math.cos(t), (Math.random() - 0.5) * 1.6, r * Math.sin(t)], i * 3)
      size[i] = 0.25 + Math.random() * 0.45
    }
    phase[i] = Math.random()
    c.set(kind === 'dust' ? (Math.random() < 0.5 ? '#f2b48d' : '#d9a0a6') : palette[(Math.random() * palette.length) | 0])
    color.set([c.r, c.g, c.b], i * 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
  g.setAttribute('aColor', new THREE.BufferAttribute(color, 3))
  return g
}

function makeMaterial(opacityBoost = 1) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment.replace('a * vAlpha', `a * vAlpha * ${opacityBoost.toFixed(2)}`),
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

function StarFieldImpl({ count, dustCount, animate }: Props) {
  const stars = useMemo(() => buildPoints(count, 'stars'), [count])
  const dust = useMemo(() => buildPoints(dustCount, 'dust'), [dustCount])
  const starMat = useMemo(() => makeMaterial(1), [])
  const dustMat = useMemo(() => makeMaterial(0.35), [])
  const dustRef = useRef<THREE.Points>(null)

  useFrame((_, dt) => {
    if (!animate) return
    starMat.uniforms.uTime.value += dt
    dustMat.uniforms.uTime.value += dt
    if (dustRef.current) dustRef.current.rotation.y += dt * 0.004
  })

  return (
    <group>
      <points geometry={stars} material={starMat} frustumCulled={false} />
      <points ref={dustRef} geometry={dust} material={dustMat} frustumCulled={false} />
    </group>
  )
}

export const StarField = memo(StarFieldImpl)
