import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { identity } from '../../data/identity'
import { useI18n } from '../../i18n/I18nProvider'
import { CvLink } from './CvLink'
import { LanguageMenu } from './LanguageMenu'
import { LegalLinks } from './LegalLinks'

export type NavTarget = 'universe' | 'about' | 'projects' | 'photography' | 'contact'

interface Props {
  active: NavTarget | null
  onNavigate: (target: NavTarget) => void
  onCvUnavailable: () => void
}

const items: NavTarget[] = ['universe', 'about', 'projects', 'photography', 'contact']

export function Navigation({ active, onNavigate, onCvUnavailable }: Props) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (target: NavTarget) => {
    setOpen(false)
    onNavigate(target)
  }

  return (
    <>
      <nav
        aria-label={t.nav.main}
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-4 pt-[max(0.9rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6"
      >
        <button type="button" onClick={() => go('universe')} className="brand" aria-label={t.nav.brandAria}>
          <span className="brand__sun" aria-hidden />
          <span className="font-display text-[1.05rem] tracking-wide text-cream max-[339px]:sr-only">{identity.brand}</span>
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex items-center gap-1 rounded-full border border-cream/10 bg-space-900/50 p-1 pl-2 backdrop-blur-md">
            {items.map((id) => (
              <button
                key={id}
                type="button"
                className="nav-link"
                aria-current={active === id ? 'page' : undefined}
                onClick={() => go(id)}
              >
                {t.nav[id]}
              </button>
            ))}
            <CvLink onUnavailable={onCvUnavailable} label={t.nav.cv} className="cv-btn ml-1" />
          </div>
          <LanguageMenu />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="icon-btn"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <LanguageMenu />
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 flex flex-col justify-center bg-space-950/90 px-8 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-2">
              {items.map((id, i) => (
                <motion.li key={id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.05 * i } }}>
                  <button
                    type="button"
                    className="font-display text-4xl font-light text-cream/90 hover:text-peach focus-visible:text-peach"
                    aria-current={active === id ? 'page' : undefined}
                    onClick={() => go(id)}
                  >
                    {t.nav[id]}
                  </button>
                </motion.li>
              ))}
            </ul>
            <CvLink
              onUnavailable={onCvUnavailable}
              label={t.contact.cv}
              iconSize={16}
              className="cv-btn mt-10 self-start px-5 py-3 text-base"
            />
            <LegalLinks className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
