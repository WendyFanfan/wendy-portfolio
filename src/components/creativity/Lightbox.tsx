import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ImageAsset } from '../../lib/images'
import { useI18n } from '../../i18n/I18nProvider'
import { ArtImage } from './ArtImage'

export interface LightboxItem {
  key: string
  asset: ImageAsset | null
  alt: string
  placeholderRatio?: number
  placeholderLabel: string
  /** Short caption under the image (photo) or the detail panel (painting). */
  content: ReactNode
}

interface Props {
  items: LightboxItem[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
  variant: 'photo' | 'painting'
  reducedMotion: boolean
}

const SWIPE_PX = 50

/**
 * Full-screen viewer. Photos: dark stage + caption. Paintings: warm "gallery room" with a
 * detail panel. Keyboard (←/→/Esc), swipe, focus trap, scroll lock, focus restore.
 */
export function Lightbox({ items, index, onIndex, onClose, variant, reducedMotion }: Props) {
  const { t } = useI18n()
  const c = t.creativity
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const opener = useRef<Element | null>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const item = items[index]
  const many = items.length > 1

  const go = useCallback((d: number) => onIndex((index + d + items.length) % items.length), [index, items.length, onIndex])

  // Focus management + scroll lock.
  useEffect(() => {
    opener.current = document.activeElement
    closeRef.current?.focus({ preventScroll: true })
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
      if (opener.current instanceof HTMLElement) opener.current.focus({ preventScroll: true })
    }
  }, [])

  // Keyboard: Esc, arrows, and a simple focus trap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === 'ArrowRight' && many) go(1)
      else if (e.key === 'ArrowLeft' && many) go(-1)
      else if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [go, many, onClose])

  // Preload neighbours so prev/next feel instant.
  useEffect(() => {
    if (!many) return
    for (const d of [1, -1]) {
      const a = items[(index + d + items.length) % items.length].asset
      if (a) {
        const img = new Image()
        img.sizes = variant === 'painting' ? '60vw' : '92vw'
        img.srcset = a.srcSet
      }
    }
  }, [index, items, many, variant])

  const onTouchStart = (e: React.TouchEvent) => {
    const p = e.touches[0]
    touch.current = { x: p.clientX, y: p.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current || !many) return
    const p = e.changedTouches[0]
    const dx = p.clientX - touch.current.x
    const dy = p.clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1)
    else if (dy > SWIPE_PX * 2 && Math.abs(dy) > Math.abs(dx) * 1.5) onClose() // swipe down to close
  }

  const fade = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } }
    : { initial: { opacity: 0, scale: 0.985 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.985 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className={`lightbox lightbox--${variant}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.3 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lightbox__bar">
        <span className="lightbox__count" aria-live="polite">
          {index + 1} {c.of} {items.length}
        </span>
        <button ref={closeRef} type="button" className="lightbox__btn" onClick={onClose} aria-label={c.close}>
          <X size={20} />
        </button>
      </div>

      {/* Clicking the empty backdrop closes; clicks on content don't bubble. */}
      <div className="lightbox__stage" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {many && (
          <button type="button" className="lightbox__btn lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label={c.previous}>
            <ChevronLeft size={22} />
          </button>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.figure key={item.key} className="lightbox__figure" {...fade}>
            <div className="lightbox__media" style={{ ['--r' as string]: String(item.asset?.ratio ?? item.placeholderRatio ?? 0.8) }}>
              <ArtImage
                asset={item.asset}
                alt={item.alt}
                variant="full"
                sizes={variant === 'painting' ? '(min-width: 1024px) 60vw, 92vw' : '92vw'}
                placeholderRatio={item.placeholderRatio}
                placeholderLabel={item.placeholderLabel}
                tone={variant === 'painting' ? 'paper' : 'dark'}
                eager
              />
            </div>
            <figcaption className="lightbox__caption">{item.content}</figcaption>
          </motion.figure>
        </AnimatePresence>

        {many && (
          <button type="button" className="lightbox__btn lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label={c.next}>
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
