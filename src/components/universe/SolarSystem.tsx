import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { planets, type FocusId } from '../../data/planets'
import type { Locale } from '../../i18n/locales'
import { ui } from '../../i18n/ui'
import { CameraController } from './CameraController'
import { Orbit } from './Orbit'
import { Planet } from './Planet'
import { RuntimeContext, computeLayout, createRuntime, useRuntime } from './runtime'
import { StarField } from './StarField'
import { Sun } from './Sun'

export interface SolarSystemProps {
  focusId: FocusId | null
  hoveredId: FocusId | null
  onHover: (id: FocusId | null) => void
  onSelect: (id: FocusId) => void
  onReady: () => void
  reducedMotion: boolean
  lowPower: boolean
  panelSide: 'right' | 'bottom'
  locale: Locale
}

/** Advances simulated orbital time; eases to a halt while a planet is focused. */
function Clockwork({ speed, reducedMotion, onReady }: { speed: number; reducedMotion: boolean; onReady: () => void }) {
  const runtime = useRuntime()
  const readyFired = useRef(false)
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    const target = reducedMotion ? 0 : speed
    runtime.timeScale += (target - runtime.timeScale) * (1 - Math.pow(0.02, dt))
    runtime.simTime += dt * runtime.timeScale
    if (!readyFired.current) {
      readyFired.current = true
      requestAnimationFrame(onReady)
    }
  })
  return null
}

function Scene(props: SolarSystemProps) {
  const { focusId, hoveredId, onHover, onSelect, reducedMotion, lowPower, panelSide, locale } = props
  const size = useThree((s) => s.size)
  const aspect = size.width / Math.max(size.height, 1)
  const portrait = aspect < 0.9
  const layout = useMemo(() => computeLayout(aspect), [portrait]) // eslint-disable-line react-hooks/exhaustive-deps

  const orbits = useMemo(
    () => planets.map((p) => layout.orbitRadii(p.orbit.radius, p.orbit.flatten)),
    [layout],
  )
  const extent = useMemo<[number, number]>(
    () => [Math.max(...orbits.map((o) => o[0])) + 0.8, Math.max(...orbits.map((o) => o[1])) + 0.8],
    [orbits],
  )

  // Approximate on-screen sun diameter → label size.
  const labelSize = useMemo(() => {
    const fov = layout.portrait ? 52 : 42
    const tanV = Math.tan(THREE.MathUtils.degToRad(fov / 2))
    const elev = THREE.MathUtils.degToRad(layout.portrait ? 54 : 24)
    const d = Math.max(
      (extent[0] + 1.3) / (tanV * aspect),
      (extent[1] * Math.sin(elev) + 1.3) / tanV,
    ) * 1.06
    const sunPx = ((1.6 * 2 * layout.sunScale) / (2 * d * tanV)) * size.height
    return Math.max(11, Math.min(30, sunPx * 0.15))
  }, [layout, extent, aspect, size.height])

  const interactive = focusId === null
  const planetFocused = focusId !== null && focusId !== 'sun'
  const onSunHover = useCallback((h: boolean) => onHover(h ? 'sun' : null), [onHover])
  const onSunSelect = useCallback(() => onSelect('sun'), [onSelect])

  return (
    <>
      <ambientLight intensity={0.38} color="#c4b5d4" />
      <hemisphereLight args={['#f4ead9', '#3a3046', 0.18]} />
      <StarField count={lowPower ? 650 : 1500} dustCount={lowPower ? 140 : 360} animate={!reducedMotion} />
      <Sun
        scale={layout.sunScale}
        animate={!reducedMotion}
        dimmed={planetFocused}
        showLabel={focusId === null}
        labelSize={labelSize}
        segments={lowPower ? 40 : 64}
        hovered={hoveredId === 'sun'}
        focused={focusId === 'sun'}
        interactive={interactive}
        hoverHint={ui[locale].sun.hoverHint}
        onHover={onSunHover}
        onSelect={onSunSelect}
      />
      {planets.map((p, i) => {
        const [rx, rz] = orbits[i]
        return (
          <group key={p.id} rotation={[p.orbit.tilt, 0, 0]}>
            <Orbit
              rx={rx}
              rz={rz}
              color={p.accent}
              highlighted={hoveredId === p.id || focusId === p.id}
              dimmed={planetFocused && focusId !== p.id}
            />
            <Planet
              def={p}
              rx={rx}
              rz={rz}
              sizeScale={layout.planetScale}
              textureSize={lowPower ? 256 : 512}
              segments={lowPower ? 32 : 56}
              hovered={hoveredId === p.id}
              focused={focusId === p.id}
              dimmed={planetFocused && focusId !== p.id}
              interactive={interactive}
              locale={locale}
              onHover={onHover}
              onSelect={onSelect}
            />
          </group>
        )
      })}
      <CameraController
        focusId={focusId}
        layout={layout}
        extent={extent}
        reducedMotion={reducedMotion}
        parallax={!reducedMotion && !lowPower}
        panelSide={panelSide}
      />
      {/* Orbits halt for a planet, but keep drifting slowly around the sun while Wendy is in focus. */}
      <Clockwork speed={focusId === null ? 1 : focusId === 'sun' ? 0.3 : 0} reducedMotion={reducedMotion} onReady={props.onReady} />
    </>
  )
}

export default function SolarSystem(props: SolarSystemProps) {
  const runtime = useMemo(createRuntime, [])
  useEffect(() => () => {
    document.body.style.cursor = ''
  }, [])

  return (
    <Canvas
      className="universe-canvas"
      flat
      dpr={props.lowPower ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !props.lowPower, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 400, position: [0, 20, 40] }}
      onPointerMissed={() => props.onHover(null)}
      aria-hidden
    >
      <RuntimeContext.Provider value={runtime}>
        <Scene {...props} />
      </RuntimeContext.Provider>
    </Canvas>
  )
}
