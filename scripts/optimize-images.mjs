/**
 * Turns original artwork files into web-ready images.
 *
 *   content/photography/*.jpg  →  public/images/photography/<key>-<width>.webp
 *   content/paintings/*.jpg    →  public/images/paintings/<key>-<width>.webp
 *
 * and writes src/data/image-manifest.json (dimensions + dominant colour per image),
 * which the gallery uses for responsive srcsets and layout without shift.
 *
 * - EXIF orientation is applied, then ALL metadata (incl. GPS location) is stripped.
 * - Only re-processes files whose outputs are missing or older than the source.
 *
 * Usage: npm run images
 */
import { readdir, stat, mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST = path.join(root, 'src/data/image-manifest.json')
const SOURCES = /\.(jpe?g|png|webp|tiff?)$/i

const collections = {
  // Grid thumbnails use the small sizes; the lightbox picks the largest.
  photography: { widths: [480, 960, 1600, 2400], quality: 80 },
  paintings: { widths: [480, 960, 1600, 2400], quality: 82 },
}

/** "Dresden Altstadt 01.JPG" → "dresden-altstadt-01" */
const toKey = (file) =>
  path
    .parse(file)
    .name.normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const exists = async (p) => stat(p).then(() => true, () => false)
const hex = ({ r, g, b }) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

let manifest = {}
try {
  manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
} catch {
  /* first run */
}

let processed = 0
let skipped = 0
for (const [name, cfg] of Object.entries(collections)) {
  const srcDir = path.join(root, 'content', name)
  const outDir = path.join(root, 'public/images', name)
  await mkdir(outDir, { recursive: true })
  const files = (await readdir(srcDir).catch(() => [])).filter((f) => SOURCES.test(f))
  const liveKeys = new Set()

  for (const file of files) {
    const key = toKey(file)
    liveKeys.add(`${name}/${key}`)
    const src = path.join(srcDir, file)
    const srcTime = (await stat(src)).mtimeMs

    const base = sharp(src, { failOn: 'none' }).rotate() // apply EXIF orientation
    const { width, height } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info)
    const widths = cfg.widths.filter((w) => w < width).concat(width > cfg.widths.at(-1) ? [] : [width])
    const unique = [...new Set(widths.length ? widths : [width])].sort((a, b) => a - b)

    const outputs = unique.map((w) => path.join(outDir, `${key}-${w}.webp`))
    const fresh = await Promise.all(outputs.map(async (o) => (await exists(o)) && (await stat(o)).mtimeMs >= srcTime))
    if (fresh.every(Boolean) && manifest[`${name}/${key}`]) {
      skipped++
      continue
    }

    for (const [i, w] of unique.entries()) {
      // sharp drops metadata by default; we never call withMetadata(), so GPS/EXIF is not kept.
      await base.clone().resize({ width: w, withoutEnlargement: true }).webp({ quality: cfg.quality, effort: 5 }).toFile(outputs[i])
    }
    const { dominant } = await base.clone().resize(64).stats()
    manifest[`${name}/${key}`] = { width, height, color: hex(dominant), widths: unique }
    processed++
    console.log(`✓ ${name}/${file} → ${key} (${width}×${height}, ${unique.join('/')}px)`)
  }

  // Drop manifest entries whose source file was removed.
  for (const k of Object.keys(manifest)) if (k.startsWith(`${name}/`) && !liveKeys.has(k)) delete manifest[k]
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + '\n')
console.log(`\nDone: ${processed} processed, ${skipped} up to date. Manifest: src/data/image-manifest.json`)
console.log('Reference images in src/data/photography.ts / paintings.ts by their key, e.g. image: "dresden-altstadt-01".')
