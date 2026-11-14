import { ArrowRight } from 'lucide-react'
import { planetById, planets, type PlanetId } from '../../data/planets'
import { PanelShell } from './PanelShell'
import { useI18n } from '../../i18n/I18nProvider'
import { EngineeringContent } from './panels/EngineeringContent'
import { FutureContent } from './panels/FutureContent'
import { JourneyContent } from './panels/JourneyContent'

/** The Creative planet has its own page (/creativity) instead of a panel. */
const content: Record<Exclude<PlanetId, 'creative'>, () => JSX.Element> = {
  engineering: EngineeringContent,
  journey: JourneyContent,
  future: FutureContent,
}

interface Props {
  id: PlanetId
  side: 'right' | 'bottom'
  onClose: () => void
  onSelect: (id: PlanetId) => void
  reducedMotion: boolean
}

export function PlanetPanel({ id, side, onClose, onSelect, reducedMotion }: Props) {
  if (id === 'creative') return null
  return <PlanetPanelInner id={id} side={side} onClose={onClose} onSelect={onSelect} reducedMotion={reducedMotion} />
}

function PlanetPanelInner({ id, side, onClose, onSelect, reducedMotion }: Omit<Props, 'id'> & { id: Exclude<PlanetId, 'creative'> }) {
  const { t, l } = useI18n()
  const def = planetById[id]
  const Content = content[id]
  const next = planets[(def.index) % planets.length]

  return (
    <PanelShell
      side={side}
      accent={def.accent}
      eyebrow={`${t.planetLabel} 0${def.index} · ${l(def.name)}`}
      title={l(def.name)}
      subtitle={l(def.subtitle)}
      onClose={onClose}
      reducedMotion={reducedMotion}
      footer={
        <button type="button" className="next-btn" onClick={() => onSelect(next.id)} style={{ ['--accent' as string]: next.accent }}>
          <span>
            <span className="block text-[0.65rem] uppercase tracking-[0.28em] text-cream/50">{t.nextWorld}</span>
            <span className="font-display text-xl text-cream">{l(next.name)}</span>
          </span>
          <ArrowRight size={18} aria-hidden />
        </button>
      }
    >
      <Content />
    </PanelShell>
  )
}
