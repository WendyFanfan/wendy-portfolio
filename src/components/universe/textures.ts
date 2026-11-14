import * as THREE from 'three'
import type { PlanetId } from '../../data/planets'

/* ---------- tiny seeded 3D value noise (CPU, used once at start-up) ---------- */

function makeNoise(seed: number) {
  const perm = new Uint8Array(512)
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  let s = seed >>> 0
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
    const t = p[i]
    p[i] = p[j]
    p[j] = t
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  const h = (x: number, y: number, z: number) => perm[perm[perm[x & 255] + (y & 255)] + (z & 255)] / 255
  const fade = (t: number) => t * t * (3 - 2 * t)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  return (x: number, y: number, z: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
    const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi)
    const x0 = lerp(h(xi, yi, zi), h(xi + 1, yi, zi), xf)
    const x1 = lerp(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), xf)
    const x2 = lerp(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), xf)
    const x3 = lerp(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), xf)
    return lerp(lerp(x0, x1, yf), lerp(x2, x3, yf), zf)
  }
}

type Noise = ReturnType<typeof makeNoise>
const fbm = (n: Noise, x: number, y: number, z: number, oct = 4) => {
  let v = 0, a = 0.5, f = 1
  for (let i = 0; i < oct; i++) {
    v += a * n(x * f, y * f, z * f)
    f *= 2.03
    a *= 0.5
  }
  return v / (1 - Math.pow(0.5, oct))
}

type RGB = [number, number, number]
// THREE.Color(hex) is linear when colour management is on; convert back to sRGB bytes.
const srgb = (h: string): RGB => {
  const c = new THREE.Color(h).convertLinearToSRGB()
  return [c.r * 255, c.g * 255, c.b * 255]
}
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const ramp = (stops: RGB[], t: number): RGB => {
  const x = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1)
  const i = Math.floor(x)
  return mix(stops[i], stops[i + 1], x - i)
}
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

type Shader = (x: number, y: number, z: number, n: Noise) => RGB

const shaders: Record<PlanetId, Shader> = {
  // Terracotta gas-giant bands
  engineering: (() => {
    const stops = ['#7d3423', '#b4573d', '#c8664a', '#e08e68', '#f2b48d', '#c8664a', '#9a4630'].map(srgb)
    return (x, y, z, n) => {
      const warp = fbm(n, x * 2.2, y * 2.2, z * 2.2, 4)
      const band = y * 2.6 + warp * 0.9
      const t = 0.5 + 0.5 * Math.sin(band * 5.2)
      const fine = fbm(n, x * 9, y * 26, z * 9, 2)
      let c = ramp(stops, t * 0.85 + fine * 0.15)
      c = mix(c, srgb('#f6d2b3'), smooth(0.72, 0.95, fine) * 0.25)
      return c
    }
  })(),
  // Dusty-pink marbled, painterly
  creative: (() => {
    const stops = ['#8f5a6a', '#b97a86', '#d9a0a6', '#efc9c4', '#f7e3da'].map(srgb)
    return (x, y, z, n) => {
      const q = fbm(n, x * 1.4, y * 1.4, z * 1.4, 4)
      const r = fbm(n, x * 1.6 + q * 2.8, y * 1.6 + q * 2.2, z * 1.6 - q * 2.4, 5)
      let c = ramp(stops, smooth(0.2, 0.85, r))
      c = mix(c, srgb('#c9a3c4'), smooth(0.55, 0.8, q) * 0.22)
      return c
    }
  })(),
  // Warm cream / beige with soft continents and freckles
  journey: (() => {
    const stops = ['#b49a77', '#cdb592', '#e2d1b4', '#efe3cd', '#f8f1e4'].map(srgb)
    return (x, y, z, n) => {
      const land = fbm(n, x * 2.4, y * 2.4, z * 2.4, 5)
      const spots = fbm(n, x * 11, y * 11, z * 11, 2)
      let c = ramp(stops, smooth(0.3, 0.75, land))
      c = mix(c, srgb('#a88d6b'), smooth(0.68, 0.82, spots) * 0.35)
      const polar = smooth(0.78, 0.95, Math.abs(y))
      return mix(c, srgb('#fbf7ef'), polar * 0.7)
    }
  })(),
  // Lavender / grey-blue storms
  future: (() => {
    const stops = ['#5d6787', '#7a85a6', '#9a9cc4', '#b7a6d1', '#d4cbe6'].map(srgb)
    return (x, y, z, n) => {
      const warp = fbm(n, x * 1.8, y * 1.8, z * 1.8, 4)
      const band = y * 1.8 + warp * 1.6
      const t = 0.5 + 0.5 * Math.sin(band * 3.4)
      const swirl = fbm(n, x * 4 + warp, y * 4, z * 4 - warp, 3)
      return ramp(stops, t * 0.65 + swirl * 0.35)
    }
  })(),
}

const seeds: Record<PlanetId, number> = { engineering: 11, creative: 27, journey: 43, future: 71 }

/** Equirectangular procedural texture sampled on the unit sphere (seamless, no pole pinch). */
export function createPlanetTexture(id: PlanetId, width = 512): THREE.CanvasTexture {
  const height = width / 2
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(width, height)
  const noise = makeNoise(seeds[id])
  const shade = shaders[id]
  for (let j = 0; j < height; j++) {
    const phi = (j / (height - 1)) * Math.PI
    const sy = Math.cos(phi)
    const sr = Math.sin(phi)
    for (let i = 0; i < width; i++) {
      const theta = (i / width) * Math.PI * 2
      const c = shade(sr * Math.cos(theta), sy, sr * Math.sin(theta), noise)
      const k = (j * width + i) * 4
      img.data[k] = c[0]
      img.data[k + 1] = c[1]
      img.data[k + 2] = c[2]
      img.data[k + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** Radial strip texture for Saturn-style rings (u = radius). */
export function createRingTexture(): THREE.CanvasTexture {
  const w = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = 4
  const ctx = canvas.getContext('2d')!
  const noise = makeNoise(5)
  const peach = srgb('#f2b48d'), cream = srgb('#f4ead9'), terra = srgb('#c8664a')
  for (let i = 0; i < w; i++) {
    const u = i / w
    const n = fbm(noise, u * 40, 0.5, 0.5, 3)
    const gap = smooth(0.46, 0.5, u) * (1 - smooth(0.52, 0.56, u))
    const edge = smooth(0, 0.08, u) * (1 - smooth(0.9, 1, u))
    const a = edge * (0.25 + 0.6 * n) * (1 - gap * 0.85)
    const c = mix(mix(terra, peach, u), cream, n * 0.6)
    ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`
    ctx.fillRect(i, 0, 1, 4)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Soft radial glow used for sprites (sun halo, dust). */
export function createGlowTexture(inner = 'rgba(255,255,255,1)', size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, inner)
  g.addColorStop(0.2, 'rgba(255,255,255,0.55)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.14)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
