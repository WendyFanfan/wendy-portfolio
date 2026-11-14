import type { L, Locale } from '../i18n/locales'

/**
 * Site-wide personal details.
 * Every value marked TODO is a placeholder — replace it before launch.
 */
export const site = {
  location: { en: 'Dresden, Germany', de: 'Dresden, Deutschland', zh: '德国德累斯顿' } as L,

  email: 'jiayifan.dev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jiayi-fan-888a25364',
  github: 'https://github.com/WendyFanfan',
}

/**
 * Social profiles (personal brand: Wendy). Share-tracking parameters removed.
 */
export const socials: { id: 'xiaohongshu' | 'instagram' | 'x'; label: L; handle: string; url: string }[] = [
  {
    id: 'xiaohongshu',
    label: { en: 'Xiaohongshu (RED)', de: 'Xiaohongshu (RED)', zh: '小红书' },
    handle: 'Wendy',
    url: 'https://xhslink.cn/o/AmdJkrBcZHS',
  },
  {
    id: 'instagram',
    label: { en: 'Instagram', de: 'Instagram', zh: 'Instagram' },
    handle: '@wendyfanfann',
    url: 'https://www.instagram.com/wendyfanfann',
  },
  {
    id: 'x',
    label: { en: 'X', de: 'X', zh: 'X' },
    handle: '@wendy4wmo22',
    url: 'https://x.com/wendy4wmo22',
  },
]

/** Facts recruiters in Germany look for first (from the CV). */
export const facts = {
  experience: { en: '3+ years at a SaaS company', de: 'über 3 Jahre SaaS', zh: '3 年以上 SaaS 经验' } as L,
  availability: { en: 'Available immediately', de: 'Ab sofort verfügbar', zh: '可立即到岗' } as L,
  drivingLicence: { en: 'Driving licence class B', de: 'Führerschein Klasse B', zh: 'B 类驾照' } as L,
  languagesShort: 'EN C1 · DE B1 · 中文',
}

/**
 * CV per language. A German Lebenslauf usually differs from an English CV,
 * so each language can point at its own PDF. CVs always carry the professional
 * name (Jiayi Fan). Put the files in public/cv/ and
 * flip `ready` to true. German visitors get the Lebenslauf; Chinese visitors get the English CV.
 */
export const cv: Record<Locale, { url: string; file: string; ready: boolean }> = {
  de: { url: '/cv/Jiayi-Fan-Lebenslauf.pdf', file: 'Jiayi-Fan-Lebenslauf.pdf', ready: true },
  en: { url: '/cv/Jiayi-Fan-CV.pdf', file: 'Jiayi-Fan-CV.pdf', ready: true },
  zh: { url: '/cv/Jiayi-Fan-CV.pdf', file: 'Jiayi-Fan-CV.pdf', ready: true },
}

/** True while a link still points at a placeholder value. */
export const isPlaceholderLink = (url: string) =>
  url.includes('your-profile') || url.includes('your-username')
