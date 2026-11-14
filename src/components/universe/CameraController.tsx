import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { planetById, type FocusId, type PlanetId } from '../../data/planets'
import { useRuntime, type SceneLayout } from './runtime'

interface Props {
  focusId: FocusId | null
  layout: SceneLayout
  /** Largest orbit radii in the current layout, used to frame the whole system. */
  extent: [number, number]
  reducedMotion: boolean
  parallax: boolean
  /** Panel docks on the right (desktop) or as a bottom sheet (mobile). */
  panelSide: 'right' | 'bottom'
}

const UP = new THREE.Vector3(0, 1, 0)

/**
 * Owns the camera. Every transition interpolates from a snapshot of the current
 * camera to a *live* destination, so moving planets are tracked smoothly.
 */
export function CameraController({ focusId, layout, extent, reducedMotion, parallax, panelSide }: Props) {
  const { camera, size } = useThree()
  const runtime = useRuntime()
  const persp = camera as THREE.PerspectiveCamera

  const fromPos = useRef(new THREE.Vector3())
  const fromTarget = useRef(new THREE.Vector3())
  const curPos = useRef(new THREE.Vector3())
  const curTarget = useRef(new THREE.Vector3())
  const destPos = useRef(new THREE.Vector3())
  const destTarget = useRef(new THREE.Vector3())
  const progress = useRef({ t: 0 })
  const parallaxVec = useRef(new THREE.Vector2())
  const introDone = useRef(false)
  const tmp = useRef({ p: new THREE.Vector3(), out: new THREE.Vector3(), side: new THREE.Vector3(), fwd: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3() })

  const fov = layout.portrait ? 52 : 42
  const elevation = THREE.MathUtils.degToRad(layout.portrait ? 54 : 24)

  /** Distance that keeps the full system in frame for the current viewport. */
  const overviewDistance = () => {
    const aspect = size.width / Math.max(size.height, 1)
    const tanV = Math.tan(THREE.MathUtils.degToRad(fov / 2))
    const margin = 1.3
    const dW = (extent[0] + margin) / (tanV * aspect)
    const dH = (extent[1] * Math.sin(elevation) + margin) / tanV
    return Math.max(dW, dH) * 1.06
  }

  const computeOverview = (pos: THREE.Vector3, target: THREE.Vector3, zoom = 1) => {
    const d = overviewDistance() * zoom
    // Slightly raised look-at point leaves room for the identity hero above the system.
    target.set(0, layout.portrait ? -0.45 : 0.15, 0)
    pos.set(0, Math.sin(elevation) * d, Math.cos(elevation) * d).add(target)
  }

  const computePlanetView = (id: PlanetId, pos: THREE.Vector3, target: THREE.Vector3) => {
    const obj = runtime.planets[id]
    const def = planetById[id]
    const t = tmp.current
    if (!obj) return computeOverview(pos, target)
    obj.getWorldPosition(t.p)
    const R = def.size * layout.planetScale
    const d = R * (layout.portrait ? 11.5 : 7.2) * def.focusDistance
    t.out.set(t.p.x, 0, t.p.z).normalize()
    t.side.set(-t.out.z, 0, t.out.x)
    // View from the sun-lit side, a little above and to the side → 3/4 lit planet.
    pos.copy(t.out).multiplyScalar(-0.5).addScaledVector(t.side, 0.78).addScaledVector(UP, 0.62).normalize().multiplyScalar(d).add(t.p)
    t.fwd.subVectors(t.p, pos).normalize()
    t.right.crossVectors(t.fwd, UP).normalize()
    t.up.crossVectors(t.right, t.fwd).normalize()
    target.copy(t.p)
    // Shift the look-at point so the planet sits in the space the panel leaves free.
    if (panelSide === 'right') target.addScaledVector(t.right, d * 0.26)
    else target.addScaledVector(t.up, -d * 0.29)
  }

  /** Gentle approach to the sun: frontal and slightly above, leaving room for the intro card. */
  const computeSunView = (pos: THREE.Vector3, target: THREE.Vector3) => {
    const R = 1.6 * layout.sunScale
    const d = R * (layout.portrait ? 11.5 : 7)
    const elev = THREE.MathUtils.degToRad(16)
    pos.set(0, Math.sin(elev) * d, Math.cos(elev) * d)
    target.set(0, 0, 0)
    const t = tmp.current
    t.fwd.subVectors(target, pos).normalize()
    t.right.crossVectors(t.fwd, UP).normalize()
    t.up.crossVectors(t.right, t.fwd).normalize()
    if (panelSide === 'right') target.addScaledVector(t.right, d * 0.2)
    else target.addScaledVector(t.up, -d * 0.26)
  }

  // Intro: start far out and drift into the overview.
  useEffect(() => {
    computeOverview(fromPos.current, fromTarget.current, reducedMotion ? 1 : 1.9)
    fromPos.current.y += reducedMotion ? 0 : 6
    curPos.current.copy(fromPos.current)
    curTarget.current.copy(fromTarget.current)
    progress.current.t = 0
    const tw = gsap.to(progress.current, {
      t: 1,
      duration: reducedMotion ? 0.01 : 3.2,
      ease: 'power3.out',
      delay: reducedMotion ? 0 : 0.25,
      onComplete: () => {
        introDone.current = true
      },
    })
    return () => {
      tw.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Focus changes: snapshot current camera, tween to the live destination.
  const firstFocus = useRef(true)
  useEffect(() => {
    if (firstFocus.current) {
      firstFocus.current = false
      return
    }
    fromPos.current.copy(curPos.current)
    fromTarget.current.copy(curTarget.current)
    gsap.killTweensOf(progress.current)
    progress.current.t = 0
    introDone.current = true
    const tw = gsap.to(progress.current, {
      t: 1,
      duration: reducedMotion ? 0.35 : focusId ? 1.9 : 1.6,
      ease: 'power3.inOut',
    })
    return () => {
      tw.kill()
    }
  }, [focusId, reducedMotion])

  useFrame((state, dt) => {
    if (persp.fov !== fov) {
      persp.fov = fov
      persp.updateProjectionMatrix()
    }
    if (focusId === 'sun') computeSunView(destPos.current, destTarget.current)
    else if (focusId) computePlanetView(focusId, destPos.current, destTarget.current)
    else computeOverview(destPos.current, destTarget.current)

    const e = progress.current.t
    curPos.current.lerpVectors(fromPos.current, destPos.current, e)
    curTarget.current.lerpVectors(fromTarget.current, destTarget.current, e)

    // Subtle mouse parallax, strongest in the overview.
    const k = 1 - Math.pow(0.02, dt)
    const strength = parallax ? (focusId ? 0.12 : 0.9) : 0
    parallaxVec.current.x += (state.pointer.x * strength - parallaxVec.current.x) * k
    parallaxVec.current.y += (state.pointer.y * strength - parallaxVec.current.y) * k

    camera.position.copy(curPos.current)
    camera.position.x += parallaxVec.current.x
    camera.position.y += parallaxVec.current.y * 0.6
    camera.lookAt(curTarget.current)
  })

  return null
}
