import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { localeMeta, locales, type Locale } from '../../i18n/locales'

/**
 * Quiet language picker for the top-right corner: globe + code, opens a small menu.
 * Keyboard: Enter/Space/↓ opens, ↑/↓ move, Enter selects, Esc closes and returns focus.
 */
export function LanguageMenu() {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const openMenu = () => {
    setActive(Math.max(0, locales.indexOf(locale)))
    setOpen(true)
  }
  const close = (focusButton = true) => {
    setOpen(false)
    if (focusButton) buttonRef.current?.focus()
  }
  const choose = (code: Locale) => {
    setLocale(code)
    close()
  }

  // Focus the highlighted option while open.
  useEffect(() => {
    if (open) itemRefs.current[active]?.focus()
  }, [open, active])

  // Click outside closes.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [open])

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      openMenu()
    }
  }
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation() // don't also close panels behind
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % locales.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + locales.length) % locales.length)
    } else if (e.key === 'Tab') {
      close(false)
    }
  }

  return (
    <div ref={rootRef} className="lang-menu">
      <button
        ref={buttonRef}
        type="button"
        className="lang-menu__button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t.nav.language}: ${localeMeta[locale].name}`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKey}
      >
        <Globe size={14} aria-hidden />
        <span>{locale === 'zh' ? '中' : localeMeta[locale].short}</span>
        <ChevronDown size={12} aria-hidden className="lang-menu__chevron" data-open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            aria-label={t.nav.language}
            className="lang-menu__list"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            onKeyDown={onMenuKey}
          >
            {locales.map((code, i) => (
              <li key={code} role="none">
                <button
                  ref={(el) => (itemRefs.current[i] = el)}
                  type="button"
                  role="menuitemradio"
                  aria-checked={locale === code}
                  lang={localeMeta[code].htmlLang}
                  tabIndex={i === active ? 0 : -1}
                  className="lang-menu__item"
                  onClick={() => choose(code)}
                  onMouseEnter={() => setActive(i)}
                >
                  <span>{localeMeta[code].name}</span>
                  {locale === code && <Check size={14} aria-hidden />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
