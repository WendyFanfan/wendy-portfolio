import { useI18n } from '../../i18n/I18nProvider'
import { navigate } from '../../lib/router'
import { legalPublished } from '../../data/legal'

/** "Imprint · Privacy" — required to be reachable from every page, kept visually quiet. */
export function LegalLinks({ className = '', tone = 'dark' }: { className?: string; tone?: 'dark' | 'paper' }) {
  const { t } = useI18n()
  if (!legalPublished) return null
  const go = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(path)
  }
  return (
    <p className={`legal-links legal-links--${tone} ${className}`}>
      <a href="/impressum" onClick={go('/impressum')}>
        {t.legal.imprint}
      </a>
      <span aria-hidden>·</span>
      <a href="/datenschutz" onClick={go('/datenschutz')}>
        {t.legal.privacy}
      </a>
    </p>
  )
}
