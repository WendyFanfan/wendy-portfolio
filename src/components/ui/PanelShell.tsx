import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'

interface Props {
  side: 'right' | 'bottom'
  accent: string
  eyebrow: string
  title: string
  subtitle: string
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
  reducedMotion: boolean
}

const ease = [0.22, 1, 0.36, 1] as const

export function PanelShell({ side, accent, eyebrow, title, subtitle, onClose, footer, children, reducedMotion }: Props) {
  const { t, locale } = useI18n()
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 350)
    scrollRef.current?.scrollTo({ top: 0 })
    return () => clearTimeout(t)
  }, [title])

  const offscreen = side === 'right' ? { x: '104%', y: 0 } : { x: 0, y: '104%' }
  const variants = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { ...offscreen, opacity: 0 },
        animate: { x: 0, y: 0, opacity: 1, transition: { duration: 0.85, ease, delay: 0.45 } },
        exit: { ...offscreen, opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 1, 1] } },
      }

  return (
    <motion.aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="panel-title"
      className={`panel panel--${side}`}
      style={{ ['--accent' as string]: accent }}
      {...variants}
    >
      <div className="panel__glow" aria-hidden />
      <div className="panel__head">
        <button ref={closeRef} type="button" className="back-btn" onClick={onClose}>
          <ArrowLeft size={16} aria-hidden /> {t.back}
        </button>
        <p className="panel__eyebrow">{eyebrow}</p>
        <h2 id="panel-title" className="panel__title">
          {title}
        </h2>
        <p className="panel__subtitle">{subtitle}</p>
      </div>
      {/* Re-keyed on language change for a soft cross-fade instead of a hard text swap. */}
      <motion.div
        key={locale}
        ref={scrollRef}
        className="panel__body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.35 } }}
      >
        {children}
        {footer && <div className="panel__footer">{footer}</div>}
      </motion.div>
    </motion.aside>
  )
}
