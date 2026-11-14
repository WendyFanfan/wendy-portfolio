import { Download } from 'lucide-react'
import { cv } from '../../data/site'
import { useI18n } from '../../i18n/I18nProvider'

interface Props {
  className: string
  label: string
  onUnavailable: () => void
  iconSize?: number
}

/** Downloads the CV for the active language, or explains it is coming. */
export function CvLink({ className, label, onUnavailable, iconSize = 15 }: Props) {
  const { locale } = useI18n()
  const file = cv[locale]
  return (
    <a
      href={file.url}
      download={file.ready ? file.file : undefined}
      className={className}
      onClick={(e) => {
        if (!file.ready) {
          e.preventDefault()
          onUnavailable()
        }
      }}
    >
      <Download size={iconSize} aria-hidden /> {label}
    </a>
  )
}
