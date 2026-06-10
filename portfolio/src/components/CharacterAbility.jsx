import { useInView } from '../hooks/useInView'

const POSTERS = [
  {
    src: '/case-study/character-posters/scarlet-phantom.jpg',
    title: 'Scarlet Phantom',
    direction: 'Eclipse / Editorial',
    code: 'VAR-A',
  },
  {
    src: '/case-study/character-posters/vermilion-oracle.jpg',
    title: 'Vermilion Oracle',
    direction: 'Cathedral / Narrative',
    code: 'VAR-B',
  },
  {
    src: '/case-study/character-posters/ruby-nocturne.jpg',
    title: 'Ruby Nocturne',
    direction: 'Nocturne / Fashion',
    code: 'VAR-C',
  },
]

const OUTPUTS = [
  ['01', 'Rapid Comparison', 'Generate several art directions in parallel before committing production resources.'],
  ['02', 'Visual Language', 'Compare typography, composition, color rhythm and character-world relationships.'],
  ['03', 'Asset System', 'Extract reusable character poses, costume rules, motifs and campaign layouts.'],
]

export default function CharacterAbility() {
  const [ref, inView] = useInView(0.08)

  return (
    <section id="character-case" className="character-case" ref={ref}>
      <div className="character-case__orbit" aria-hidden="true" />
      <span className="character-case__vertical" aria-hidden="true">
        PROJECT ARCHIVE / 02
      </span>

      <div className="container">
        <div className={`section-tag reveal ${inView ? 'in-view' : ''}`}>
          <span className="section-tag__label">Project Archive 02 / プロジェクト記録</span>
          <span className="section-tag__line" />
          <span className="section-tag__num">02</span>
        </div>

        <header className="character-case__header">
          <div>
            <p className={`character-case__code reveal ${inView ? 'in-view' : ''}`}>
              CODE NAME — CHARACTER MULTIVERSE
            </p>
            <h2 className={`character-case__title reveal reveal-d1 ${inView ? 'in-view' : ''}`}>
              One character.<br />
              <em>Multiple visual worlds.</em>
            </h2>
          </div>
          <div className={`character-case__statement reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
            <span>PROJECT SUMMARY</span>
            <p>
              Generate and compare distinct poster directions in a short cycle,
              helping the art team discover the strongest visual language before
              turning it into a reusable character asset system.
            </p>
          </div>
        </header>

        <div className="character-case__gallery">
          {POSTERS.map((poster, index) => (
            <figure
              key={poster.code}
              className={`character-poster character-poster--${index + 1} reveal reveal-d${index + 1} ${inView ? 'in-view' : ''}`}
            >
              <div className="character-poster__image">
                <img
                  src={poster.src}
                  alt={`${poster.title} character poster exploration`}
                  loading="lazy"
                  decoding="async"
                  width="1086"
                  height="1448"
                />
                <span className="character-poster__code">{poster.code}</span>
                <span className="character-poster__mark" aria-hidden="true">+</span>
              </div>
              <figcaption>
                <span>STYLE STUDY / 0{index + 1}</span>
                <strong>{poster.title}</strong>
                <small>{poster.direction}</small>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="character-case__system">
          <div className={`character-case__system-title reveal ${inView ? 'in-view' : ''}`}>
            <span>ASSETIZATION PROTOCOL</span>
            <h3>From exploration<br />to art assets.</h3>
          </div>
          <div className="character-case__outputs">
            {OUTPUTS.map(([num, title, text], index) => (
              <article
                key={num}
                className={`character-output reveal reveal-d${index + 1} ${inView ? 'in-view' : ''}`}
              >
                <span>{num}</span>
                <h4>{title}</h4>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>

        <footer className={`character-case__footer reveal reveal-d3 ${inView ? 'in-view' : ''}`}>
          <p>
            The value is not a single generated poster. It is the ability to test
            visual hypotheses quickly, document what works, and convert the result
            into repeatable direction for future campaigns.
          </p>
          <div>
            <span>CHARACTER DESIGN</span>
            <span>STYLE EXPLORATION</span>
            <span>ART DIRECTION</span>
            <span>ASSET SYSTEM</span>
          </div>
        </footer>
      </div>
    </section>
  )
}
