import { useInView } from '../hooks/useInView'
import { CASE_STUDIES } from '../data/caseStudies'
import './CaseCatalog.css'

function CaseVisual({ caseStudy }) {
  if (caseStudy.image) {
    return (
      <img
        src={caseStudy.image}
        alt=""
        loading="lazy"
        decoding="async"
      />
    )
  }

  if (caseStudy.visual === 'motion') {
    return (
      <div className="case-card__motion-visual" aria-hidden="true">
        <span className="case-card__motion-frame case-card__motion-frame--one" />
        <span className="case-card__motion-frame case-card__motion-frame--two" />
        <span className="case-card__motion-frame case-card__motion-frame--three" />
        <span className="case-card__motion-wave" />
        <span className="case-card__motion-play" />
      </div>
    )
  }

  return (
    <div className="case-card__editor-visual" aria-hidden="true">
      <span className="case-card__editor-sidebar" />
      <span className="case-card__editor-track case-card__editor-track--1" />
      <span className="case-card__editor-track case-card__editor-track--2" />
      <span className="case-card__editor-curve" />
      <span className="case-card__editor-orb" />
    </div>
  )
}

function CaseCard({ caseStudy, compact = false }) {
  return (
    <a
      className={`case-card case-card--${caseStudy.tone}${compact ? ' case-card--compact' : ''}`}
      href={`#case/${caseStudy.slug}`}
    >
      <div className="case-card__visual">
        <CaseVisual caseStudy={caseStudy} />
        <span className="case-card__wash" />
      </div>
      <div className="case-card__content">
        <div className="case-card__meta">
          <span>CASE / {caseStudy.number}</span>
          <span>{caseStudy.subtitle}</span>
        </div>
        <div>
          <h3>{caseStudy.title}</h3>
          {!compact && <p>{caseStudy.description}</p>}
        </div>
        <div className="case-card__footer">
          <div>
            {caseStudy.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <strong>View Case <i>-&gt;</i></strong>
        </div>
      </div>
    </a>
  )
}

export function SelectedCases() {
  const [ref, inView] = useInView(0.08)
  const caseCount = CASE_STUDIES.length

  return (
    <section id="selected-cases" className="selected-cases" ref={ref}>
      <div className="container">
        <div className={`section-tag reveal ${inView ? 'in-view' : ''}`}>
          <span className="section-tag__label">Selected Cases / Case Files</span>
          <span className="section-tag__line" />
          <span className="section-tag__num">{String(caseCount).padStart(2, '0')} FILES</span>
        </div>

        <header className="selected-cases__header">
          <h2 className={`reveal ${inView ? 'in-view' : ''}`}>
            {caseCount} project files.<br /><em>Choose a case study.</em>
          </h2>
          <div className={`reveal reveal-d1 ${inView ? 'in-view' : ''}`}>
            <p>
              Each case opens as an independent presentation, so interviewers can
              move directly to the thinking, process and outcome they want to inspect.
            </p>
            <a href="#cases">Open Case Archive <span>-&gt;</span></a>
          </div>
        </header>

        <div className={`selected-cases__list reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
          {CASE_STUDIES.map((caseStudy) => (
            <a href={`#case/${caseStudy.slug}`} key={caseStudy.slug}>
              <span>{caseStudy.number}</span>
              <strong>{caseStudy.title}</strong>
              <small>{caseStudy.subtitle}</small>
              <i>-&gt;</i>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CaseArchive() {
  const caseCount = CASE_STUDIES.length

  return (
    <section className="case-archive" aria-labelledby="case-archive-title">
      <div className="case-archive__grid" aria-hidden="true" />
      <div className="container case-archive__inner">
        <header className="case-archive__header">
          <div>
            <p>CASE ARCHIVE / 01-{String(caseCount).padStart(2, '0')}</p>
            <h1 id="case-archive-title">Select a<br /><em>project file.</em></h1>
          </div>
          <div className="case-archive__intro">
            <span>INTERVIEW MODE</span>
            <p>
              Independent case studies covering AI previsualization,
              character assetization, no-code product UI, concept storytelling
              and motion experiments.
            </p>
            <a href="#home">Return Home <i>&lt;-</i></a>
          </div>
        </header>

        <div className="case-archive__cards">
          {CASE_STUDIES.map((caseStudy) => (
            <CaseCard caseStudy={caseStudy} key={caseStudy.slug} />
          ))}
        </div>
      </div>
    </section>
  )
}
