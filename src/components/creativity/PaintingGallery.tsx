import type { Painting } from '../../data/paintings'
import { getImage } from '../../lib/images'
import { useI18n } from '../../i18n/I18nProvider'
import { ArtImage } from './ArtImage'

interface Props {
  paintings: Painting[]
  onOpen: (index: number) => void
}

export function usePaintingMeta() {
  const { t, l } = useI18n()
  return (p: Painting) => ({
    title: p.title ? l(p.title) : p.placeholder ? t.creativity.paintingSoon : t.creativity.untitled,
    line: [p.year, p.medium && l(p.medium)].filter(Boolean).join(' · '),
    dimensions: p.dimensions,
    description: p.description ? l(p.description) : undefined,
    alt: p.alt ? l(p.alt) : undefined,
  })
}

/**
 * Paintings hung on a warm wall with museum-style labels. Landscape works span two columns,
 * so they are shown about as tall as the portrait works next to them instead of tiny.
 */
export function PaintingGallery({ paintings, onOpen }: Props) {
  const { t } = useI18n()
  const meta = usePaintingMeta()

  return (
    <ul className="painting-wall" role="list">
      {paintings.map((p, i) => {
        const m = meta(p)
        const asset = getImage('paintings', p.thumbnail ?? p.image)
        const ratio = asset?.ratio ?? p.placeholder?.ratio ?? 0.8
        return (
          <li
            key={p.id}
            className={`painting-wall__item ${ratio > 1.15 ? 'painting-wall__item--wide' : ''}`}
            style={{ ['--r' as string]: String(ratio) }}
          >
            <button
              type="button"
              className="painting"
              onClick={() => onOpen(i)}
              aria-label={`${t.creativity.open}: ${[m.title, m.alt].filter(Boolean).join(' — ')}`}
            >
              <span className="painting__canvas">
                <ArtImage
                  asset={asset}
                  alt=""
                  variant="thumb"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 44vw, 86vw"
                  placeholderRatio={p.placeholder?.ratio}
                  placeholderLabel={t.creativity.paintingSoon}
                  tone="paper"
                />
              </span>
            </button>
            <div className="painting__label">
              <p className="painting__title">{m.title}</p>
              {m.line && <p className="painting__line">{m.line}</p>}
              {m.dimensions && <p className="painting__line">{m.dimensions}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
