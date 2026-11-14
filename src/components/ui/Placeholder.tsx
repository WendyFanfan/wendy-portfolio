import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/I18nProvider'

/** Visibly marks content that still needs Wendy's real details. */
export function Placeholder({ children }: { children?: ReactNode }) {
  const { t } = useI18n()
  return (
    <span className="placeholder-chip" title={t.placeholderTitle}>
      {children ?? t.toAdd}
    </span>
  )
}

/** Wraps text that may contain [bracketed placeholders] and styles them. */
export function Ph({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <span key={i} className="placeholder-inline">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
