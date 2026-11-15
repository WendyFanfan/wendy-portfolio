import type { Photo } from '../../data/photography'
import { getImage } from '../../lib/images'
import { useI18n } from '../../i18n/I18nProvider'
import { ArtImage } from './ArtImage'

interface Props {
  photos: Photo[]
  onOpen: (index: number) => void
}

/** "Dresden · 2024" — only the parts that exist. */
export function usePhotoMeta() {
  const { t, l } = useI18n()
  return (p: Photo) => ({
    // Without a title the place becomes the label, rather than a row of "Untitled".
    title: p.title ? l(p.title) : p.placeholder ? t.creativity.photoSoon : p.location ? l(p.location) : t.creativity.untitled,
    meta: [p.title && p.location && l(p.location), p.year].filter(Boolean).join(' · '),
    category: t.creativity.categories[p.category],
  })
}

/** Masonry via CSS columns: keeps every photo's true aspect ratio, no cropping. */
export function PhotoGallery({ photos, onOpen }: Props) {
  const { t } = useI18n()
  const meta = usePhotoMeta()

  return (
    <ul className="masonry-gallery" role="list">
      {photos.map((p, i) => {
        const m = meta(p)
        const asset = getImage('photography', p.thumbnail ?? p.image)
        return (
          <li key={p.id} className="masonry-gallery__item">
            <button
              type="button"
              className="photo-tile"
              onClick={() => onOpen(i)}
              aria-label={`${t.creativity.open}: ${m.title}${m.meta ? `, ${m.meta}` : ''}`}
            >
              <ArtImage
                asset={asset}
                alt=""
                variant="thumb"
                sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 92vw"
                placeholderRatio={p.placeholder?.ratio}
                placeholderLabel={t.creativity.photoSoon}
              />
              <span className="photo-tile__caption" aria-hidden>
                <span className="photo-tile__category">{m.category}</span>
                {!p.placeholder && <span className="photo-tile__title">{m.title}</span>}
                {m.meta && <span className="photo-tile__meta">{m.meta}</span>}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
