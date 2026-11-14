import { Compass } from 'lucide-react'
import { currentlyLearning, exploring, nextProject, type FutureItem, type FutureStatus } from '../../../data/projects'
import { useI18n } from '../../../i18n/I18nProvider'
import { Section, Tags } from './parts'

/** Status chip — keeps "exploring / learning / planned" visibly distinct from finished work. */
function StatusChip({ status }: { status: FutureStatus }) {
  const { t } = useI18n()
  return (
    <span className="status-chip" data-status={status}>
      {t.futureStatus[status]}
    </span>
  )
}

function ItemCard({ item }: { item: FutureItem }) {
  const { l } = useI18n()
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <h4 className="card__title">{l(item.title)}</h4>
        {item.status && <StatusChip status={item.status} />}
      </div>
      <p className="card__text">{l(item.text)}</p>
      {item.tags && (
        <div className="mt-3">
          <Tags items={item.tags} />
        </div>
      )}
    </div>
  )
}

export function FutureContent() {
  const { t, l } = useI18n()
  const p = nextProject
  return (
    <>
      <p className="panel-lead">{t.leads.future}</p>

      <Section title={t.sections.exploring} id="sec-exploring">
        <ul className="grid gap-3">
          {exploring.map((item, i) => (
            <li key={i}>
              <ItemCard item={item} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t.sections.learning} id="sec-learning">
        <ItemCard item={currentlyLearning} />
      </Section>

      <Section title={t.sections.future} id="sec-future">
        <article className="card card--planned">
          <div className="flex items-start justify-between gap-3">
            <h4 className="card__title">{l(p.title)}</h4>
            {p.status && <StatusChip status={p.status} />}
          </div>
          <p className="card__text">{l(p.text)}</p>

          <p className="mb-2 mt-4 text-[0.65rem] uppercase tracking-[0.24em] text-cream/50">{t.currentFocus}</p>
          <ul className="focus-list">
            {p.focus.map((f, i) => (
              <li key={i}>{l(f)}</li>
            ))}
          </ul>

          <div className="planned-note">
            <Compass size={15} aria-hidden className="mt-0.5 shrink-0" />
            <p>
              <span className="font-semibold text-cream">
                {t.stage}: {l(p.stage)}
              </span>
              <br />
              {l(p.note)}
            </p>
          </div>
        </article>
      </Section>
    </>
  )
}
