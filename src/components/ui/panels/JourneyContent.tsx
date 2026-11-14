import { CalendarCheck, Car, MapPin } from 'lucide-react'
import { education, languageSkills, timeline } from '../../../data/experience'
import { facts, site } from '../../../data/site'
import { useI18n } from '../../../i18n/I18nProvider'
import { Ph } from '../Placeholder'
import { Section } from './parts'

export function JourneyContent() {
  const { t, l } = useI18n()
  return (
    <>
      <p className="panel-lead">{t.leads.journey}</p>

      <div className="card mb-8 flex items-center gap-3">
        <span className="icon-btn icon-btn--sm pointer-events-none" aria-hidden>
          <MapPin size={15} />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cream/50">{t.currentlyBased}</p>
          <p className="font-display text-lg text-cream">{l(site.location)}</p>
        </div>
      </div>

      <Section title={t.sections.goodToKnow} id="sec-facts">
        <ul className="grid gap-2 text-sm text-cream/80">
          <li className="flex items-center gap-2.5">
            <CalendarCheck size={16} className="text-[var(--accent)]" aria-hidden /> {l(facts.availability)}
          </li>
          <li className="flex items-center gap-2.5">
            <Car size={16} className="text-[var(--accent)]" aria-hidden /> {l(facts.drivingLicence)}
          </li>
        </ul>
      </Section>

      <Section title={t.sections.languages} id="sec-languages">
        <ul className="grid gap-3">
          {languageSkills.map((lang) => (
            <li key={lang.name.en} className="lang-row">
              <span className="text-sm text-cream">{l(lang.name)}</span>
              <span className="cefr" aria-hidden>
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="cefr__dot" data-on={i < Math.min(lang.cefr, 6)} />
                ))}
              </span>
              <span className="text-right text-xs text-[var(--accent)]">{l(lang.level)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t.sections.timeline} id="sec-timeline">
        <ol className="timeline">
          {timeline.map((item, i) => (
            <li key={i} className="timeline__item">
              <span className="timeline__period">
                <Ph text={l(item.period)} />
              </span>
              <h4 className="card__title">
                <Ph text={l(item.title)} />
              </h4>
              <p className="card__text">
                <Ph text={l(item.text)} />
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t.sections.education} id="sec-education">
        <ul className="space-y-4">
          {education.map((e, i) => (
            <li key={i} className="card">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="card__title">
                  <Ph text={l(e.degree)} />
                </h4>
                <span className="card__meta">
                  <Ph text={l(e.period)} />
                </span>
              </div>
              <p className="card__sub">
                <Ph text={l(e.school)} />
                {e.location && <> · {l(e.location)}</>}
              </p>
              {e.note && (
                <p className="card__text">
                  <Ph text={l(e.note)} />
                </p>
              )}
              {e.coursework && <p className="card__text mt-1 text-cream/60">{l(e.coursework)}</p>}
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
