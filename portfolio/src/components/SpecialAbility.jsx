import { useInView } from '../hooks/useInView'

const PHASES = [
  {
    num: '01',
    title: 'Deconstruct',
    jp: '広告分解',
    text: 'Break down leading Chinese smartphone commercials into shot scale, camera movement, rhythm and product-message beats.',
  },
  {
    num: '02',
    title: 'Interpret',
    jp: '製品理解',
    text: 'Combine the designer’s understanding of product structure, selling points and visual hierarchy.',
  },
  {
    num: '03',
    title: 'Generate',
    jp: '鏡頭生成',
    text: 'Use AI to rapidly generate candidate shots together with descriptions of camera and object movement.',
  },
  {
    num: '04',
    title: 'Previsualize',
    jp: '制作基準',
    text: 'Establish an early visual impression and create still-frame references for later motion production.',
  },
]

export default function SpecialAbility() {
  const [ref, inView] = useInView(0.08)

  return (
    <section id="ability-case" className="ability-case" ref={ref}>
      <div className="ability-case__scan" aria-hidden="true" />
      <span className="ability-case__side-index" aria-hidden="true">
        PROJECT ARCHIVE / 01
      </span>

      <div className="container">
        <div className={`section-tag reveal ${inView ? 'in-view' : ''}`}>
          <span className="section-tag__label">Project Archive 01 / プロジェクト記録</span>
          <span className="section-tag__line" />
          <span className="section-tag__num">01</span>
        </div>

        <header className="ability-case__header">
          <div>
            <p className={`ability-case__code reveal ${inView ? 'in-view' : ''}`}>
              CODE NAME — AD DECONSTRUCTION
            </p>
            <h2 className={`ability-case__title reveal reveal-d1 ${inView ? 'in-view' : ''}`}>
              Turning references<br />
              <em>into producible frames.</em>
            </h2>
          </div>
          <p className={`ability-case__lead reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
            A practical AI-assisted previsualization method: analyze the visual
            grammar of top-tier smartphone advertising, combine it with product
            understanding, and rapidly translate ideas into shots that a production
            team can discuss and develop.
          </p>
        </header>

        <div className="ability-case__body">
          <div className="ability-case__phases">
            {PHASES.map((phase, index) => (
              <article
                key={phase.num}
                className={`ability-phase reveal reveal-d${index + 1} ${inView ? 'in-view' : ''}`}
              >
                <span className="ability-phase__num">{phase.num}</span>
                <div>
                  <p className="ability-phase__jp">{phase.jp}</p>
                  <h3>{phase.title}</h3>
                  <p>{phase.text}</p>
                </div>
              </article>
            ))}
          </div>

          <figure className={`ability-case__board reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
            <div className="ability-case__image">
              <img
                src="/case-study/mobile-ad-storyboard.jpg"
                alt="AI-assisted smartphone advertising storyboard exploration"
                loading="lazy"
                decoding="async"
                width="1448"
                height="1086"
              />
              <span className="ability-case__corner ability-case__corner--tl" />
              <span className="ability-case__corner ability-case__corner--tr" />
              <span className="ability-case__corner ability-case__corner--bl" />
              <span className="ability-case__corner ability-case__corner--br" />
              <span className="ability-case__reticle" aria-hidden="true">+</span>
            </div>
            <figcaption>
              <span>OUTPUT / 12 FRAME STUDY</span>
              <strong>Mobile Product Visualization</strong>
              <small>AI-generated previsualization · static-frame reference</small>
            </figcaption>
          </figure>
        </div>

        <footer className={`ability-case__result reveal reveal-d3 ${inView ? 'in-view' : ''}`}>
          <span>RESULT</span>
          <p>
            Faster concept alignment before production, clearer motion intent,
            and a reusable visual foundation for designers, directors and 3D artists.
          </p>
          <div className="ability-case__tags">
            <span>SHOT DESIGN</span>
            <span>AI PREVIS</span>
            <span>PRODUCT CGI</span>
            <span>MOTION DIRECTION</span>
          </div>
        </footer>
      </div>
    </section>
  )
}
