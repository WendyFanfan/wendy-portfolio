import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import { fullNameInline, identity } from '../../data/identity'
import { useI18n } from '../../i18n/I18nProvider'
import { CvLink } from './CvLink'
import { facts, site } from '../../data/site'

interface Props {
  side: 'right' | 'bottom'
  reducedMotion: boolean
  onClose: () => void
  onJourney: () => void
  onContact: () => void
  onCvUnavailable: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The person behind the universe — opened by clicking the sun (or "About").
 * Deliberately quiet: name, one sentence, and the two next steps a visitor wants.
 */
export function SunCard({ side, reducedMotion, onClose, onJourney, onContact, onCvUnavailable }: Props) {
  const { t, l, locale } = useI18n()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const id = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 400)
    return () => clearTimeout(id)
  }, [])

  const offscreen = side === 'right' ? { x: 40, y: 0 } : { x: 0, y: 60 }
  const variants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { ...offscreen, opacity: 0 },
        animate: { x: 0, y: 0, opacity: 1, transition: { duration: 0.9, ease, delay: 0.55 } },
        exit: { ...offscreen, opacity: 0, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
      }
  // Staggered reveal of the name lines.
  const line = (i: number) =>
    reducedMotion ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.8 + i * 0.12 } } }

  return (
    <div className={`sun-card-layer sun-card-layer--${side}`}>
      <motion.aside role="dialog" aria-modal="false" aria-labelledby="sun-card-name" className={`sun-card sun-card--${side}`} {...variants}>
        <div className="sun-card__glow" aria-hidden />
        <button ref={closeRef} type="button" className="back-btn" onClick={onClose}>
          <ArrowLeft size={16} aria-hidden /> {t.back}
        </button>

        <motion.p className="panel__eyebrow" {...line(0)}>
          {t.sun.eyebrow}
        </motion.p>
        <div className="sun-card__identity">
          <motion.div
            className="sun-card__portrait"
            {...(reducedMotion
              ? {}
              : { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1, transition: { duration: 0.9, ease, delay: 0.85 } } })}
          >
            <picture>
              <source srcSet="/images/wendy-portrait.webp" type="image/webp" />
              <img src="/images/wendy-portrait.jpg" alt={t.sun.portraitAlt} width={384} height={384} decoding="async" />
            </picture>
          </motion.div>
          <div className="min-w-0">
            <motion.h2 id="sun-card-name" className="sun-card__brand" {...line(1)}>
              {identity.brand}
            </motion.h2>
            <motion.p className="sun-card__names" {...line(2)}>
              <span lang="en">{identity.legal}</span> <span lang="zh-CN">({identity.chinese})</span>
            </motion.p>
          </div>
        </div>
        <motion.p className="sun-card__tagline" {...line(3)}>
          {t.sun.tagline}
        </motion.p>

        <motion.div key={locale} className="sun-card__body" {...line(4)}>
          <p className="sun-card__about">{t.sun.about}</p>
          <p className="sun-card__role">{t.hero.role}</p>
          <ul className="sun-card__facts">
            <li>{l(site.location)}</li>
            <li>{l(facts.experience)}</li>
            <li>{facts.languagesShort}</li>
            <li>{l(facts.availability)}</li>
          </ul>
        </motion.div>

        <motion.div className="sun-card__actions" {...line(5)}>
          <button type="button" className="sun-card__primary" onClick={onJourney}>
            {t.sun.journey} <ArrowRight size={16} aria-hidden />
          </button>
          <button type="button" className="sun-card__secondary" onClick={onContact}>
            <Mail size={15} aria-hidden /> {t.sun.contact}
          </button>
          <CvLink onUnavailable={onCvUnavailable} label={t.nav.cv} className="sun-card__secondary" />
        </motion.div>
        <span className="sr-only">{fullNameInline}</span>
      </motion.aside>
    </div>
  )
}
