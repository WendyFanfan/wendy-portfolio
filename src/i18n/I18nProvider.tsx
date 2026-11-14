import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { detectLocale, localeMeta, resolve, saveLocale, type Locale, type Text } from './locales'
import { ui, type Dict } from './ui'

interface I18n {
  locale: Locale
  setLocale: (l: Locale) => void
  /** UI dictionary for the active locale. */
  t: Dict
  /** Resolve a localized data value. */
  l: (text: Text) => string
}

const I18nContext = createContext<I18n | null>(null)

const CJK_FONTS_ID = 'cjk-fonts'

/** Chinese glyphs: load Noto SC on demand (Google serves only the unicode-range slices actually used). */
function ensureCjkFonts() {
  if (document.getElementById(CJK_FONTS_ID)) return
  const link = document.createElement('link')
  link.id = CJK_FONTS_ID
  link.rel = 'stylesheet'
  link.href =
    'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&family=Noto+Serif+SC:wght@400;500&display=swap'
  document.head.appendChild(link)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    saveLocale(next)
    // Keep an explicit ?lang= in the URL in sync so shared links match what's on screen.
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', next)
      history.replaceState(null, '', url)
    }
  }, [])

  useEffect(() => {
    // Title/description are set per route in App.tsx.
    document.documentElement.lang = localeMeta[locale].htmlLang
    if (locale === 'zh') ensureCjkFonts()
  }, [locale])

  const value = useMemo<I18n>(
    () => ({ locale, setLocale, t: ui[locale], l: (text: Text) => resolve(text, locale) }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
