import { AnimatePresence, motion } from 'framer-motion'
import { fullNameLine, identity } from '../../data/identity'
import { planets, type FocusId } from '../../data/planets'
import { useI18n } from '../../i18n/I18nProvider'
import { LegalLinks } from './LegalLinks'

interface Props {
  visible: boolean
  hoveredId: FocusId | null
  onHover: (id: FocusId | null) => void
  onSelect: (id: FocusId) => void
}

const ease = [0.22, 1, 0.36, 1] as const

/** Identity hero (Wendy → Jiayi Fan · 范佳怡 → role → statement) and an accessible dock. */
export function Instructions({ visible, hoveredId, onHover, onSelect }: Props) {
  const { t, l, locale } = useI18n()
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.header
            key={`title-${locale}`}
            className="pointer-events-none fixed inset-x-0 top-[4.75rem] z-10 px-4 text-center sm:top-24"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1.2, delay: 0.5, ease } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.5 } }}
          >
            <p className="hero-eyebrow">{t.hero.siteName}</p>
            <h1 className="hero-brand">
              {identity.brand}
              <span className="sr-only"> — {fullNameLine}</span>
            </h1>
            <p className="hero-names" aria-hidden>
              <span lang="en">{identity.legal}</span>
              <span className="hero-names__dot">·</span>
              <span lang="zh-CN">{identity.chinese}</span>
            </p>
            <p className="hero-role">{t.hero.role}</p>
            <p className="hero-statement">{t.hero.statement}</p>
          </motion.header>

          <motion.nav
            key="dock"
            aria-label={t.planetsAria}
            className="fixed inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1, delay: 1.1, ease } }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.4 } }}
          >
            <p className="hint flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.32em] text-cream/55">
              <span className="hint-dot" aria-hidden /> {t.explore}
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              <li>
                <button
                  type="button"
                  className="dock-btn dock-btn--sun"
                  data-active={hoveredId === 'sun'}
                  style={{ ['--accent' as string]: '#f6c39b', ['--planet' as string]: '#e07a4f' }}
                  onMouseEnter={() => onHover('sun')}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover('sun')}
                  onBlur={() => onHover(null)}
                  onClick={() => onSelect('sun')}
                >
                  <span className="dock-btn__orb" aria-hidden />
                  {identity.brand}
                </button>
              </li>
              {planets.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="dock-btn"
                    data-active={hoveredId === p.id}
                    style={{ ['--accent' as string]: p.accent, ['--planet' as string]: p.color }}
                    onMouseEnter={() => onHover(p.id)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(p.id)}
                    onBlur={() => onHover(null)}
                    onClick={() => onSelect(p.id)}
                  >
                    <span className="dock-btn__orb" aria-hidden />
                    {l(p.name)}
                  </button>
                </li>
              ))}
            </ul>
            <LegalLinks className="mt-1" />
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
