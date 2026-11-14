import { Github, Linkedin, Mail, MapPin, UserRound } from 'lucide-react'
import { identity } from '../../data/identity'
import { isPlaceholderLink, site, socials } from '../../data/site'
import { SocialIcon } from './SocialIcon'
import { useI18n } from '../../i18n/I18nProvider'
import { CvLink } from './CvLink'
import { PanelShell } from './PanelShell'
import { Placeholder } from './Placeholder'

interface Props {
  side: 'right' | 'bottom'
  onClose: () => void
  onCvUnavailable: () => void
  reducedMotion: boolean
}

export function ContactPanel({ side, onClose, onCvUnavailable, reducedMotion }: Props) {
  const { t, l } = useI18n()
  const links = [
    { icon: Mail, label: t.contact.email, value: site.email, href: `mailto:${site.email}`, placeholder: false },
    { icon: Linkedin, label: 'LinkedIn', value: t.contact.linkedin, href: site.linkedin, placeholder: isPlaceholderLink(site.linkedin) },
    { icon: Github, label: 'GitHub', value: t.contact.github, href: site.github, placeholder: isPlaceholderLink(site.github) },
  ]

  return (
    <PanelShell
      side={side}
      accent="#e8c27a"
      eyebrow={t.contact.eyebrow}
      title={t.contact.title}
      subtitle={t.contact.subtitle}
      onClose={onClose}
      reducedMotion={reducedMotion}
    >
      <h3 className="panel-section__title">{t.contact.professional}</h3>
      <ul className="grid gap-3">
        <li className="contact-link pointer-events-none">
          <span className="icon-btn icon-btn--sm" aria-hidden>
            <UserRound size={16} />
          </span>
          <span>
            <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-cream/50">{t.contact.name}</span>
            <span className="block text-cream">
              {identity.legal} <span className="text-cream/60" lang="zh-CN">({identity.chinese})</span>
            </span>
          </span>
        </li>
        {links.map(({ icon: Icon, label, value, href, placeholder }) => (
          <li key={label}>
            <a className="contact-link" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <span className="icon-btn icon-btn--sm pointer-events-none" aria-hidden>
                <Icon size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-cream/50">{label}</span>
                <span className="block truncate text-cream">
                  {value} {placeholder && <Placeholder>{t.urlToAdd}</Placeholder>}
                </span>
              </span>
            </a>
          </li>
        ))}
        <li className="contact-link pointer-events-none">
          <span className="icon-btn icon-btn--sm" aria-hidden>
            <MapPin size={16} />
          </span>
          <span>
            <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-cream/50">{t.contact.location}</span>
            <span className="block text-cream">{l(site.location)}</span>
          </span>
        </li>
      </ul>

      <h3 className="panel-section__title mt-9">{t.contact.social}</h3>
      <ul className="grid gap-3">
        {socials.map((s) => (
          <li key={s.id}>
            <a className="contact-link" href={s.url} target="_blank" rel="noreferrer me">
              <span className="icon-btn icon-btn--sm pointer-events-none" aria-hidden>
                <SocialIcon id={s.id} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-cream/50">{l(s.label)}</span>
                <span className="block truncate text-cream">{s.handle}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <CvLink
        onUnavailable={onCvUnavailable}
        label={t.contact.cv}
        iconSize={16}
        className="cv-btn mt-8 w-full justify-center py-3 text-sm"
      />
      <p className="mt-8 text-center text-[0.7rem] tracking-wide text-cream/40">
        © {new Date().getFullYear()} {identity.legal} · {identity.domain}
      </p>
    </PanelShell>
  )
}
