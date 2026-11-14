import { identity } from '../../data/identity'
import { planets, type FocusId } from '../../data/planets'
import { useI18n } from '../../i18n/I18nProvider'

interface Props {
  onSelect: (id: FocusId) => void
  dimmed: boolean
}

/**
 * Lightweight CSS-only solar system for devices without WebGL
 * (or if the 3D scene fails). Planets are real buttons.
 */
export function FallbackUniverse({ onSelect, dimmed }: Props) {
  const { l, t } = useI18n()
  return (
    <div className={`fallback ${dimmed ? 'fallback--dimmed' : ''}`}>
      <div className="fallback__system">
        <button type="button" className="fallback__sun" onClick={() => onSelect('sun')} aria-label={`${identity.brand} — ${t.sun.tagline}`}>
          <span>WENDY</span>
        </button>
        {planets.map((p, i) => (
          <div
            key={p.id}
            className="fallback__orbit"
            style={{
              ['--r' as string]: `${21 + i * 9.5}%`,
              ['--dur' as string]: `${60 + i * 30}s`,
              ['--start' as string]: `${-(p.orbit.phase / (Math.PI * 2)) * (60 + i * 30)}s`,
            }}
          >
            <button
              type="button"
              className="fallback__planet"
              style={{ ['--planet' as string]: p.color, ['--accent' as string]: p.accent, ['--size' as string]: `${p.size * 3.4}rem` }}
              onClick={() => onSelect(p.id)}
              aria-label={`${l(p.name)} — ${l(p.teaser)}`}
            >
              <span className="fallback__label">{l(p.name)}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
