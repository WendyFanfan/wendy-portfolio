/**
 * Identity system — the single source for every name on the site.
 *
 *   brand   "Wendy"      → website branding, main visual identity, friendly introductions
 *   legal   "Jiayi Fan"  → CV, professional experience, project authorship, contact, SEO
 *   chinese "范佳怡"      → Chinese-language identity, always shown alongside the legal name
 *
 * Never hard-code a name in a component — import it from here so usage stays consistent.
 */
export const identity = {
  brand: 'Wendy',
  legal: 'Jiayi Fan',
  chinese: '范佳怡',
  domain: 'wendyfan.com',
  url: 'https://wendyfan.com/',
} as const

/** "Jiayi Fan · 范佳怡" — the fixed order used for name lines everywhere. */
export const fullNameLine = `${identity.legal} · ${identity.chinese}`
/** "Jiayi Fan (范佳怡)" — inline form for sentences and cards. */
export const fullNameInline = `${identity.legal} (${identity.chinese})`
