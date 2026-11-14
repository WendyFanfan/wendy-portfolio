import { ArrowUpRight, Github } from 'lucide-react'
import { experience, skills } from '../../../data/experience'
import { projects } from '../../../data/projects'
import { useI18n } from '../../../i18n/I18nProvider'
import { Section, Tags } from './parts'

export function EngineeringContent() {
  const { t, l } = useI18n()
  return (
    <>
      <p className="panel-lead">{t.leads.engineering}</p>

      <Section title={t.sections.experience} id="sec-experience">
        <ol className="space-y-5">
          {experience.map((job, i) => (
            <li key={i} className="card">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="card__title">{l(job.role)}</h4>
                <span className="card__meta">{l(job.period)}</span>
              </div>
              <p className="card__sub">
                {l(job.company)}
                {job.location && <> · {l(job.location)}</>}
              </p>
              {job.context && <p className="card__context">{l(job.context)}</p>}
              {job.highlights.length > 0 && (
                <ul className="card__list">
                  {job.highlights.map((h, j) => (
                    <li key={j}>{l(h)}</li>
                  ))}
                </ul>
              )}
              {job.achievements && (
                <div className="mb-4">
                  <p className="mb-2 text-[0.65rem] uppercase tracking-[0.24em] text-cream/50">{t.sections.achievements}</p>
                  <ul className="metrics">
                    {job.achievements.map((a, j) => (
                      <li key={j} className="metric">
                        <span className="metric__value">{l(a.value)}</span>
                        <span className="metric__label">{l(a.label)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {job.stack.length > 0 && <Tags items={job.stack} />}
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t.sections.projects} id="sec-projects">
        <ul className="grid gap-4">
          {projects.map((p, i) => {
            const title = l(p.title)
            return (
              <li key={i} className="card">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="card__title">{title}</h4>
                  {p.repo && (
                    <a className="icon-btn icon-btn--sm" href={p.repo} target="_blank" rel="noreferrer" aria-label={`${title} — ${t.sourceCode}`}>
                      <Github size={15} />
                    </a>
                  )}
                </div>
                <p className="card__sub">{l(p.role)}</p>
                {p.description && <p className="card__text">{l(p.description)}</p>}
                {p.highlights && (
                  <ul className="card__list">
                    {p.highlights.map((h, j) => (
                      <li key={j}>{l(h)}</li>
                    ))}
                  </ul>
                )}
                <Tags items={p.stack} />
                {p.href && (
                  <a className="text-link mt-3" href={p.href} target="_blank" rel="noreferrer">
                    {p.domain ?? t.liveSite} <ArrowUpRight size={14} aria-hidden />
                  </a>
                )}
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-xs text-cream/45">{t.credit}</p>
      </Section>

      <Section title={t.sections.skills} id="sec-skills">
        <dl className="space-y-4">
          {skills.map((s, i) => (
            <div key={i} className="grid grid-cols-[7.5rem_1fr] items-start gap-3">
              <dt className="pt-1 text-xs uppercase leading-snug tracking-[0.16em] text-cream/50">{l(s.group)}</dt>
              <dd>
                <Tags items={s.items} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  )
}
