import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Instagram, MapPin } from 'lucide-react'
import { paintings as allPaintings } from '../data/paintings'
import { photoCategories, photoPlaces, photos as allPhotos, type PhotoCategory, type PhotoPlace } from '../data/photography'
import { identity } from '../data/identity'
import { socials } from '../data/site'
import { Navigation, type NavTarget } from '../components/ui/Navigation'
import { Toast } from '../components/ui/Toast'
import { LegalLinks } from '../components/ui/LegalLinks'
import { SocialIcon } from '../components/ui/SocialIcon'
import { PhotoGallery, usePhotoMeta } from '../components/creativity/PhotoGallery'
import { PaintingGallery, usePaintingMeta } from '../components/creativity/PaintingGallery'
import { Lightbox, type LightboxItem } from '../components/creativity/Lightbox'
import { getImage } from '../lib/images'
import { navigate } from '../lib/router'
import { useMediaQuery } from '../lib/useMediaQuery'
import { useI18n } from '../i18n/I18nProvider'

type Filter = 'all' | 'photography' | 'painting'
type Open = { kind: 'photo' | 'painting'; index: number } | null

/** Menu targets on this page lead back into the universe's panels. */
const navHref: Record<NavTarget, string> = {
  universe: '/',
  about: '/#about',
  projects: '/#engineering',
  photography: '/creativity',
  contact: '/#contact',
}

const ease = [0.22, 1, 0.36, 1] as const

/** Placeholders only fill a collection until its first real piece is added. */
const withoutPlaceholdersOnceReal = <T extends { placeholder?: unknown }>(list: T[]) =>
  list.some((x) => !x.placeholder) ? list.filter((x) => !x.placeholder) : list
const photos = withoutPlaceholdersOnceReal(allPhotos)
const paintings = withoutPlaceholdersOnceReal(allPaintings)
const hasRealPhotos = photos.some((p) => !p.placeholder)
const hasRealPaintings = paintings.some((p) => !p.placeholder)
/** Once one collection has real work, an empty collection is hidden instead of showing empty frames. */
const anyReal = hasRealPhotos || hasRealPaintings
const photosListed = hasRealPhotos || !anyReal
const paintingsListed = hasRealPaintings || !anyReal
/** The filter only makes sense when both collections are on the page. */
const showFilter = photosListed && paintingsListed
/** Only offer categories that actually have photos (placeholders count until real ones exist). */
const usedPlaces = (Object.keys(photoPlaces) as PhotoPlace[]).filter((pl) => photos.some((p) => p.place === pl))

export default function CreativityPage() {
  const { t, l } = useI18n()
  const c = t.creativity
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [filter, setFilter] = useState<Filter>('all')
  const [category, setCategory] = useState<PhotoCategory | 'all'>('all')
  const [place, setPlace] = useState<PhotoPlace | 'all'>('all')
  const [open, setOpen] = useState<Open>(null)
  const [scrolled, setScrolled] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const photoMeta = usePhotoMeta()
  const paintingMeta = usePaintingMeta()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const inPlace = useMemo(() => (place === 'all' ? photos : photos.filter((p) => p.place === place)), [place])
  /** Only offer categories that have photos in the chosen place (placeholders count until real ones exist). */
  const usedCategories = useMemo(() => photoCategories.filter((cat) => inPlace.some((p) => p.category === cat)), [inPlace])
  const visiblePhotos = useMemo(() => (category === 'all' ? inPlace : inPlace.filter((p) => p.category === category)), [category, inPlace])
  const choosePlace = (pl: PhotoPlace | 'all') => {
    setPlace(pl)
    // Drop a category that doesn't exist in the new place.
    const next = pl === 'all' ? photos : photos.filter((p) => p.place === pl)
    if (category !== 'all' && !next.some((p) => p.category === category)) setCategory('all')
  }
  const showPhotos = photosListed && filter !== 'painting'
  const showPaintings = paintingsListed && filter !== 'photography'
  const hasPlaceholders = (showPhotos && !hasRealPhotos) || (showPaintings && !hasRealPaintings)
  const realCount = (list: { placeholder?: unknown }[]) => list.filter((x) => !x.placeholder).length

  const photoItems = useMemo<LightboxItem[]>(
    () =>
      visiblePhotos.map((p) => {
        const m = photoMeta(p)
        return {
          key: p.id,
          asset: getImage('photography', p.image),
          alt: [m.title, m.meta].filter(Boolean).join(' — '),
          placeholderRatio: p.placeholder?.ratio,
          placeholderLabel: c.photoSoon,
          content: (
            <>
              <span className="lb-cap__category">{m.category}</span>
              {!p.placeholder && <span className="lb-cap__title">{m.title}</span>}
              {m.meta && <span className="lb-cap__meta">{m.meta}</span>}
              {p.description && <span className="lb-cap__desc">{l(p.description)}</span>}
            </>
          ),
        }
      }),
    [visiblePhotos, photoMeta, c, l],
  )

  const paintingItems = useMemo<LightboxItem[]>(
    () =>
      paintings.map((p) => {
        const m = paintingMeta(p)
        return {
          key: p.id,
          asset: getImage('paintings', p.image),
          alt: p.alt ? l(p.alt) : m.title,
          placeholderRatio: p.placeholder?.ratio,
          placeholderLabel: c.paintingSoon,
          content: (
            <div className="lb-detail">
              <p className="lb-detail__title">{m.title}</p>
              <dl className="lb-detail__facts">
                {p.year && (
                  <>
                    <dt>{c.year}</dt>
                    <dd>{p.year}</dd>
                  </>
                )}
                {p.medium && (
                  <>
                    <dt>{c.medium}</dt>
                    <dd>{l(p.medium)}</dd>
                  </>
                )}
                {p.dimensions && (
                  <>
                    <dt>{c.dimensions}</dt>
                    <dd>{p.dimensions}</dd>
                  </>
                )}
              </dl>
              {m.description && <p className="lb-detail__desc">{m.description}</p>}
            </div>
          ),
        }
      }),
    [paintingMeta, c, l],
  )

  const onNavigate = useCallback((target: NavTarget) => navigate(navHref[target]), [])
  const onCvUnavailable = useCallback(() => {
    setToast(t.cvToast)
    window.setTimeout(() => setToast(null), 3200)
  }, [t])

  const reveal = (i: number) =>
    reducedMotion ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.15 + i * 0.1 } } }

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: c.all, count: realCount(photos) + realCount(paintings) },
    { id: 'photography', label: c.photography, count: realCount(photos) },
    { id: 'painting', label: c.painting, count: realCount(paintings) },
  ]

  return (
    <div className="creativity">
      {/* Arrival: the dusty-pink glow of the planet dissolving into the page. */}
      {!reducedMotion && (
        <motion.div
          className="planet-glow-veil"
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] } }}
        />
      )}

      <div className={`page-topbar ${scrolled ? 'page-topbar--solid' : ''}`} aria-hidden />
      <Navigation active="photography" onNavigate={onNavigate} onCvUnavailable={onCvUnavailable} />

      <main>
        <header className="creativity-hero">
          <div className="creativity-hero__planet" aria-hidden />
          <div className="creativity-hero__inner">
            <motion.button type="button" className="back-btn" onClick={() => navigate('/')} {...reveal(0)}>
              <ArrowLeft size={16} aria-hidden /> {t.back}
            </motion.button>
            <motion.p className="creativity-hero__eyebrow" {...reveal(1)}>
              {c.eyebrow} · 02
            </motion.p>
            <motion.h1 className="creativity-hero__title" {...reveal(2)}>
              {c.title}
            </motion.h1>
            <motion.p className="creativity-hero__subtitle" {...reveal(3)}>
              {c.subtitle}
            </motion.p>
            <motion.p className="creativity-hero__intro" {...reveal(4)}>
              {c.intro}
            </motion.p>
          </div>
        </header>

        {showFilter && (
          <div className="filter-bar-wrap">
            <div role="group" aria-label={c.filtersLabel} className="filter-bar">
              {filters.map((f) => (
                <button key={f.id} type="button" className="filter-bar__btn" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                  {f.label}
                  {f.count > 0 && <span className="filter-bar__count">{f.count}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasPlaceholders && <p className="placeholder-note">{c.placeholderNote}</p>}

        {showPhotos && (
          <section className="gallery-section" aria-labelledby="photo-heading">
            <div className="gallery-section__head">
              <h2 id="photo-heading" className="gallery-section__title">
                {c.photography}
              </h2>
              <div className="chip-filters">
                {usedPlaces.length > 1 && (
                  <div role="group" aria-label={c.place} className="chip-row">
                    <MapPin size={14} className="chip-row__icon" aria-hidden />
                    {(['all', ...usedPlaces] as const).map((pl) => (
                      <button key={pl} type="button" className="chip" aria-pressed={place === pl} onClick={() => choosePlace(pl)}>
                        {pl === 'all' ? c.allPlaces : l(photoPlaces[pl])}
                      </button>
                    ))}
                  </div>
                )}
                <div role="group" aria-label={c.category} className="chip-row">
                  {(['all', ...usedCategories] as const).map((cat) => (
                    <button key={cat} type="button" className="chip" aria-pressed={category === cat} onClick={() => setCategory(cat)}>
                      {cat === 'all' ? c.allMoments : c.categories[cat]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <PhotoGallery photos={visiblePhotos} onOpen={(index) => setOpen({ kind: 'photo', index })} />
          </section>
        )}

        {showPaintings && (
          <section className="paper-section" aria-labelledby="painting-heading">
            <div className="paper-section__inner">
              <div className="gallery-section__head">
                <h2 id="painting-heading" className="gallery-section__title gallery-section__title--paper">
                  {c.painting}
                </h2>
              </div>
              <PaintingGallery paintings={paintings} onOpen={(index) => setOpen({ kind: 'painting', index })} />
            </div>
          </section>
        )}
      </main>

      <footer className={`creativity-footer ${showPaintings ? 'creativity-footer--paper' : ''}`}>
        <p className="creativity-footer__social">
          <span>{c.moreOn}</span>
          {socials
            .filter((s) => s.id === 'instagram' || s.id === 'xiaohongshu')
            .map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer me" className="creativity-footer__link">
                {s.id === 'instagram' ? <Instagram size={15} aria-hidden /> : <SocialIcon id={s.id} size={15} />}
                {s.id === 'instagram' ? 'Instagram' : l(s.label)}
              </a>
            ))}
        </p>
        <p className="creativity-footer__copy">
          © {new Date().getFullYear()} {identity.legal} · {identity.domain}
        </p>
        <LegalLinks className="mt-2 justify-center" tone={showPaintings ? 'paper' : 'dark'} />
      </footer>

      <AnimatePresence>
        {open && (
          <Lightbox
            key={open.kind}
            variant={open.kind}
            items={open.kind === 'photo' ? photoItems : paintingItems}
            index={open.index}
            onIndex={(index) => setOpen((o) => (o ? { ...o, index } : o))}
            onClose={() => setOpen(null)}
            reducedMotion={reducedMotion}
          />
        )}
      </AnimatePresence>
      <Toast message={toast} />
    </div>
  )
}
