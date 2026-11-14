import { memo, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { createGlowTexture } from './textures'

const vertex = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uHot;
  uniform vec3 uRim;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec3 vView;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 p = normalize(vPos) * 2.4;
    float n = fbm(p + vec3(uTime * 0.05, uTime * 0.03, -uTime * 0.02));
    float n2 = fbm(p * 2.2 - vec3(0.0, uTime * 0.04, 0.0) + n * 1.5);
    vec3 c = mix(uDeep, uMid, smoothstep(0.25, 0.7, n2));
    c = mix(c, uHot, smoothstep(0.5, 0.85, n) * 0.75);
    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
    c = mix(c, uRim, fres * 0.85);
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`

interface Props {
  scale: number
  animate: boolean
  dimmed: boolean
  showLabel: boolean
  labelSize: number
  segments: number
  hovered: boolean
  focused: boolean
  interactive: boolean
  hoverHint: string
  onHover: (hovering: boolean) => void
  onSelect: () => void
}

function SunImpl({ scale, animate, dimmed, showLabel, labelSize, segments, hovered, focused, interactive, hoverHint, onHover, onSelect }: Props) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uDeep: { value: new THREE.Color('#e07a4f') },
          uMid: { value: new THREE.Color('#f2a679') },
          uHot: { value: new THREE.Color('#ffd9a8') },
          uRim: { value: new THREE.Color('#fff1d6') },
        },
      }),
    [],
  )
  const glowTex = useMemo(() => createGlowTexture(), [])
  const haloInner = useRef<THREE.Sprite>(null)
  const haloOuter = useRef<THREE.Sprite>(null)
  const elapsed = useRef(0)

  useFrame((_, dt) => {
    if (animate) elapsed.current += dt
    const t = elapsed.current
    material.uniforms.uTime.value = t
    const pulse = 1 + Math.sin(t * 0.8) * 0.025
    const dim = dimmed ? 0.55 : hovered || focused ? 1.25 : 1
    if (haloInner.current) {
      haloInner.current.scale.setScalar(scale * 5.2 * pulse)
      const m = haloInner.current.material
      m.opacity += (0.75 * dim - m.opacity) * 0.06
    }
    if (haloOuter.current) {
      haloOuter.current.scale.setScalar(scale * 11 * (2 - pulse))
      const m = haloOuter.current.material
      m.opacity += (0.32 * dim - m.opacity) * 0.06
    }
  })

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return
    e.stopPropagation()
    onHover(true)
    document.body.style.cursor = 'pointer'
  }
  const handleOut = () => {
    onHover(false)
    document.body.style.cursor = ''
  }
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return
    e.stopPropagation()
    document.body.style.cursor = ''
    onSelect()
  }

  return (
    <group scale={scale}>
      <mesh material={material} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <sphereGeometry args={[1.6, segments, segments]} />
      </mesh>
      <sprite ref={haloInner} scale={0}>
        <spriteMaterial map={glowTex} color="#f6b27f" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite ref={haloOuter} scale={0}>
        <spriteMaterial map={glowTex} color="#e8c27a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <pointLight color="#ffe1c2" intensity={60} distance={0} decay={1.6} />
      <Html center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <div aria-hidden className="sun-label-wrap" style={{ opacity: showLabel ? 1 : 0 }} data-hovered={hovered && interactive}>
          <div className="sun-label" style={{ fontSize: `${labelSize}px` }}>
            WENDY
          </div>
          <div className="sun-hint" style={{ fontSize: `${Math.max(10, labelSize * 0.42)}px` }}>
            {hoverHint}
          </div>
        </div>
      </Html>
    </group>
  )
}

export const Sun = memo(SunImpl)
