import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '../../i18n/I18nProvider'

export function LoadingScreen({ visible }: { visible: boolean }) {
  const { t } = useI18n()
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-space-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }}
          role="status"
          aria-live="polite"
        >
          <div className="loader-sun" aria-hidden />
          <p className="mt-8 font-display text-sm italic tracking-wide text-cream/70">{t.loading}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
