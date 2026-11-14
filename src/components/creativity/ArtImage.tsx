import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import type { ImageAsset } from '../../lib/images'

interface Props {
  asset: ImageAsset | null
  alt: string
  /** `thumb` uses only small variants; `full` lets the browser pick large ones (lightbox). */
  variant: 'thumb' | 'full'
  sizes: string
  /** Used when there is no real image yet. */
  placeholderRatio?: number
  placeholderLabel: string
  tone?: 'dark' | 'paper'
  eager?: boolean
  className?: string
}

/**
 * Aspect-ratio-locked image: never crops, never shifts layout. While loading it shows
 * the image's dominant colour; without an asset it renders a clearly labelled empty frame.
 */
export function ArtImage({ asset, alt, variant, sizes, placeholderRatio = 4 / 5, placeholderLabel, tone = 'dark', eager, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false)
  const ratio = asset?.ratio ?? placeholderRatio

  if (!asset) {
    return (
      <div className={`art-media art-media--empty art-media--${tone} ${className}`} style={{ aspectRatio: String(ratio) }}>
        <span className="art-media__empty-label">
          <ImageIcon size={18} aria-hidden />
          {placeholderLabel}
        </span>
      </div>
    )
  }

  return (
    <div className={`art-media ${className}`} style={{ aspectRatio: String(ratio), backgroundColor: asset.color }}>
      <img
        src={asset.src}
        srcSet={variant === 'thumb' ? asset.thumbSrcSet : asset.srcSet}
        sizes={sizes}
        width={asset.width}
        height={asset.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        data-loaded={loaded}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
