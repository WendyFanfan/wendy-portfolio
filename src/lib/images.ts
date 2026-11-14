import manifest from '../data/image-manifest.json'

export interface ImageAsset {
  width: number
  height: number
  ratio: number
  /** Dominant colour — painted behind the image while it loads. */
  color: string
  /** Smallest variant, used as plain `src`. */
  src: string
  /** All variants, for the lightbox / detail view. */
  srcSet: string
  /** Only the small variants (≤ 960 px), so grids never pull full-resolution files. */
  thumbSrcSet: string
  largest: string
}

type Entry = { width: number; height: number; color: string; widths: number[] }
const entries = manifest as Record<string, Entry>

export type Collection = 'photography' | 'paintings'

export function getImage(collection: Collection, key?: string): ImageAsset | null {
  if (!key) return null
  const e = entries[`${collection}/${key}`]
  if (!e) {
    if (import.meta.env.DEV) console.warn(`[images] "${collection}/${key}" not in manifest — run \`npm run images\`.`)
    return null
  }
  const url = (w: number) => `/images/${collection}/${key}-${w}.webp`
  const thumbs = e.widths.filter((w) => w <= 960)
  return {
    width: e.width,
    height: e.height,
    ratio: e.width / e.height,
    color: e.color,
    src: url(e.widths[0]),
    srcSet: e.widths.map((w) => `${url(w)} ${w}w`).join(', '),
    thumbSrcSet: (thumbs.length ? thumbs : [e.widths[0]]).map((w) => `${url(w)} ${w}w`).join(', '),
    largest: url(e.widths[e.widths.length - 1]),
  }
}
