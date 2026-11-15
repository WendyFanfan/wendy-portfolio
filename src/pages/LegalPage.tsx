import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { legalContact, legalDocs, legalUpdated, type Block, type LegalKind } from '../data/legal'
import { identity } from '../data/identity'
import { Navigation, type NavTarget } from '../components/ui/Navigation'
import { LegalLinks } from '../components/ui/LegalLinks'
import { Toast } from '../components/ui/Toast'
import { navigate } from '../lib/router'
import { useI18n } from '../i18n/I18nProvider'

const navHref: Record<NavTarget, string> = {
  universe: '/',
  about: '/#about',
  projects: '/#engineering',
  photography: '/creativity',
  contact: '/#contact',
}

/** Turns bare https:// URLs in legal text into links; [bracketed] text is shown as a placeholder. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s,;]+|\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (/^https?:\/\//.test(part))
          return (
            <a key={i} href={part} target="_blank" rel="noreferrer" className="legal-doc__link">
              {part.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
            </a>
          )
        if (part.startsWith('[') && part.endsWith(']'))
          return (
            <span key={i} className="placeholder-inline">
              {part.slice(1, -1)}
            </span>
          )
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export default function LegalPage({ kind }: { kind: LegalKind }) {
  const { t, l, locale } = useI18n()
  const doc = legalDocs[kind][locale]
  const [scrolled, setScrolled] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onNavigate = useCallback((target: NavTarget) => navigate(navHref[target]), [])
  const onCvUnavailable = useCallback(() => {
    setToast(t.cvToast)
    window.setTimeout(() => setToast(null), 3200)
  }, [t])

  const renderBlock = (b: Block, i: number) => {
    switch (b.type) {
      case 'p':
        return (
          <p key={i}>
            <RichText text={b.text} />
          </p>
        )
      case 'list':
        return (
          <ul key={i}>
            {b.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        )
      case 'address':
        return (
          <address key={i} className="legal-doc__address">
            {legalContact.name}
            <br />
            <RichText text={legalContact.street} />
            <br />
            <RichText text={legalContact.city} />
            <br />
            {l(legalContact.country)}
          </address>
        )
      case 'email':
        return (
          <p key={i}>
            <a href={`mailto:${legalContact.email}`} className="legal-doc__link inline-flex items-center gap-2">
              <Mail size={15} aria-hidden /> {legalContact.email}
            </a>
          </p>
        )
    }
  }

  return (
    <div className="legal-page">
      <div className={`page-topbar ${scrolled ? 'page-topbar--solid' : ''}`} aria-hidden />
      <Navigation active={null} onNavigate={onNavigate} onCvUnavailable={onCvUnavailable} />

      <main className="legal-doc">
        <button type="button" className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} aria-hidden /> {t.back}
        </button>
        <h1 className="legal-doc__title">{doc.title}</h1>
        {t.legal.binding && <p className="legal-doc__binding">{t.legal.binding}</p>}
        {doc.intro && <p className="legal-doc__intro">{doc.intro}</p>}

        {doc.sections.map((s) => (
          <section key={s.heading} className="legal-doc__section">
            <h2>{s.heading}</h2>
            {s.blocks.map(renderBlock)}
          </section>
        ))}

        <p className="legal-doc__updated">
          {t.legal.updated}: {l(legalUpdated)}
        </p>
      </main>

      <footer className="creativity-footer">
        <LegalLinks />
        <p className="creativity-footer__copy">
          © {new Date().getFullYear()} {identity.legal} · {identity.domain}
        </p>
      </footer>
      <Toast message={toast} />
    </div>
  )
}
