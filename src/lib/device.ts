export function hasWebGL(): boolean {
  // `?2d` forces the lightweight CSS universe (useful for testing the fallback).
  if (new URLSearchParams(window.location.search).has('2d')) return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return false
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = Math.min(window.innerWidth, window.innerHeight) < 600
  const cores = navigator.hardwareConcurrency ?? 8
  return coarse || small || cores <= 4
}
