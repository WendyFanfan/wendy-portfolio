import { createContext, useContext } from 'react'
import type * as THREE from 'three'
import type { PlanetId } from '../../data/planets'

/**
 * Mutable per-frame scene state shared between scene components.
 * Lives in a ref so that animation never triggers React re-renders.
 */
export interface SceneRuntime {
  simTime: number
  timeScale: number
  planets: Partial<Record<PlanetId, THREE.Object3D>>
}

export const createRuntime = (): SceneRuntime => ({ simTime: 0, timeScale: 1, planets: {} })

export const RuntimeContext = createContext<SceneRuntime | null>(null)

export function useRuntime(): SceneRuntime {
  const ctx = useContext(RuntimeContext)
  if (!ctx) throw new Error('useRuntime must be used inside <SolarSystem>')
  return ctx
}

/** Layout values that depend on the viewport (portrait screens get a taller system). */
export interface SceneLayout {
  portrait: boolean
  sunScale: number
  planetScale: number
  /** Returns x/z radii for an orbit. */
  orbitRadii: (radius: number, flatten: number) => [number, number]
}

export function computeLayout(aspect: number): SceneLayout {
  const portrait = aspect < 0.9
  return {
    portrait,
    sunScale: portrait ? 0.8 : 1,
    planetScale: portrait ? 1.2 : 1,
    orbitRadii: portrait
      ? (r) => [2.9 + (r - 4.3) * 0.42, r * 0.95]
      : (r, flatten) => [r, r * flatten],
  }
}
