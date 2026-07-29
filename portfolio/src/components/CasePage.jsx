import { Suspense } from 'react'
import { CASE_STUDIES } from '../data/caseStudies'

export default function CasePage({ caseStudy, component: CaseComponent }) {
  const index = CASE_STUDIES.findIndex((item) => item.slug === caseStudy.slug)
  const previous = CASE_STUDIES[(index - 1 + CASE_STUDIES.length) % CASE_STUDIES.length]
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length]

  return (
    <div className="case-page">
      <nav className="case-page__toolbar" aria-label="Case study navigation">
        <a href="#cases">&lt;- All Cases</a>
        <span>{caseStudy.number} / {String(CASE_STUDIES.length).padStart(2, '0')}</span>
        <div>
          <a href={`#case/${previous.slug}`} aria-label={`Previous case: ${previous.title}`}>Prev</a>
          <a href={`#case/${next.slug}`} aria-label={`Next case: ${next.title}`}>Next</a>
        </div>
      </nav>

      <Suspense fallback={<div className="case-page__loading">Loading case file...</div>}>
        <CaseComponent />
      </Suspense>

      <footer className="case-page__next">
        <div className="container">
          <span>NEXT CASE / {next.number}</span>
          <a href={`#case/${next.slug}`}>
            <strong>{next.title}</strong>
            <i>-&gt;</i>
          </a>
          <p>{next.subtitle}</p>
        </div>
      </footer>
    </div>
  )
}
