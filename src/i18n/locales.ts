export const locales = ['en', 'de', 'zh'] as const
export type Locale = (typeof locales)[number]

/** A piece of text in every supported language. */
export type L = Record<Locale, string>
/** Language-neutral strings (e.g. "React") may stay plain. */
export type Text = string | L

export const localeMeta: Record<Locale, { short: string; name: string; htmlLang: string }> = {
  de: { short: 'DE', name: 'Deutsch', htmlLang: 'de' },
  en: { short: 'EN', name: 'English', htmlLang: 'en' },
  zh: { short: '中文', name: '中文', htmlLang: 'zh-CN' },
}

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (locales as readonly string[]).includes(v)

export const resolve = (text: Text, locale: Locale): string => (typeof text === 'string' ? text : text[locale])

const STORAGE_KEY = 'wendy-locale'

/** ?lang= → the visitor's saved choice → English (the default). */
export function detectLocale(): Locale {
  try {
    const param = new URLSearchParams(window.location.search).get('lang')
    if (isLocale(param)) return param
  } catch {
    /* ignore */
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    /* storage may be blocked */
  }
  return 'en'
}

export function saveLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
}
