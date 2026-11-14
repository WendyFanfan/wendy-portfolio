import type { ReactNode } from 'react'
import { Ph } from '../Placeholder'
import { useI18n } from '../../../i18n/I18nProvider'
import type { Text } from '../../../i18n/locales'

export function Section({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section className="panel-section" aria-labelledby={id}>
      <h3 id={id} className="panel-section__title">
        {title}
      </h3>
      {children}
    </section>
  )
}

export function Tags({ items }: { items: readonly Text[] }) {
  const { l } = useI18n()
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t, i) => (
        <li key={i} className="tag">
          <Ph text={l(t)} />
        </li>
      ))}
    </ul>
  )
}
