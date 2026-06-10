import { useInView } from '../hooks/useInView'
import './NoCodeConcept.css'

const conceptSteps = [
  {
    number: '01',
    symbol: 'X',
    title: 'Resistance',
    copy: 'The X represents people who see programming as a closed territory: complex, technical and not made for them.',
  },
  {
    number: '02',
    symbol: '◎',
    title: 'Defense',
    copy: 'Concentric rings visualize the invisible layers of hesitation built by jargon, error messages and past frustration.',
  },
  {
    number: '03',
    symbol: '→',
    title: 'Access',
    copy: 'A no-code interface translates syntax into direct manipulation, giving curiosity a clear path through the barrier.',
  },
  {
    number: '04',
    symbol: 'O',
    title: 'Openness',
    copy: 'The closed mark becomes an open circle: the user is no longer observing programming, but participating in creation.',
  },
]

const shifts = [
  ['Emotion', 'Fear', 'Curiosity'],
  ['Interaction', 'Syntax', 'Visual control'],
  ['Identity', 'Outsider', 'Creator'],
]

function Cross({ x, y, size = 18, active = false }) {
  return (
    <g
      className={`no-code-concept__cross${active ? ' no-code-concept__cross--active' : ''}`}
      transform={`translate(${x} ${y})`}
    >
      <line x1={-size} y1={-size} x2={size} y2={size} />
      <line x1={size} y1={-size} x2={-size} y2={size} />
    </g>
  )
}

export default function NoCodeConcept() {
  const [sectionRef, isVisible] = useInView(0.08)

  return (
    <section
      id="no-code-concept"
      ref={sectionRef}
      className={`no-code-concept${isVisible ? ' is-visible' : ''}`}
      aria-labelledby="no-code-concept-title"
    >
      <div className="no-code-concept__ambient" aria-hidden="true" />

      <div className="container no-code-concept__container">
        <div className="section-tag no-code-concept__tag">
          <span className="section-tag__num">07</span>
          <span className="section-tag__line" />
          <span className="section-tag__text">CONCEPT FILE / 思考設計</span>
        </div>

        <header className="no-code-concept__header">
          <div>
            <p className="no-code-concept__eyebrow">CODE NAME — OPEN THE LOOP</p>
            <h2 id="no-code-concept-title">
              Fear draws an <em>X.</em>
              <br />
              Access turns it into an <em>O.</em>
            </h2>
          </div>

          <div className="no-code-concept__intro">
            <p>
              For people intimidated by code, the first design task is not teaching syntax.
              It is lowering the psychological barrier enough for curiosity to enter.
            </p>
            <span>コードへの恐れを、創造への入口に変える。</span>
          </div>
        </header>

        <div className="no-code-concept__stage">
          <div className="no-code-concept__stage-meta" aria-hidden="true">
            <span>STATE TRANSITION / 00—04</span>
            <span>NO-CODE CONCEPT MODEL</span>
          </div>

          <svg
            className="no-code-concept__diagram"
            viewBox="0 0 1200 510"
            role="img"
            aria-label="A diagram showing crosses passing through concentric psychological barriers and becoming an open circle"
          >
            <defs>
              <linearGradient id="concept-flow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#77747a" />
                <stop offset="0.45" stopColor="#f0eee8" />
                <stop offset="0.72" stopColor="#ba3846" />
                <stop offset="1" stopColor="#596fe8" />
              </linearGradient>
              <linearGradient id="concept-open" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f0eee8" />
                <stop offset="0.48" stopColor="#ba3846" />
                <stop offset="1" stopColor="#596fe8" />
              </linearGradient>
            </defs>

            <g className="no-code-concept__grid-lines" aria-hidden="true">
              <line x1="0" y1="102" x2="1200" y2="102" />
              <line x1="0" y1="204" x2="1200" y2="204" />
              <line x1="0" y1="306" x2="1200" y2="306" />
              <line x1="0" y1="408" x2="1200" y2="408" />
              <line x1="200" y1="0" x2="200" y2="510" />
              <line x1="400" y1="0" x2="400" y2="510" />
              <line x1="600" y1="0" x2="600" y2="510" />
              <line x1="800" y1="0" x2="800" y2="510" />
              <line x1="1000" y1="0" x2="1000" y2="510" />
            </g>

            <g className="no-code-concept__cross-field">
              <Cross x={104} y={118} size={12} />
              <Cross x={208} y={188} size={18} />
              <Cross x={116} y={302} size={22} />
              <Cross x={262} y={352} size={13} />
              <Cross x={338} y={122} size={10} />
              <Cross x={364} y={264} size={28} active />
              <Cross x={260} y={82} size={7} />
            </g>

            <g className="no-code-concept__barrier" transform="translate(585 255)">
              <circle r="58" />
              <circle r="86" />
              <circle r="116" />
              <circle r="148" />
              <circle r="180" />
              <Cross x={0} y={0} size={31} active />
            </g>

            <path
              className="no-code-concept__flow-line no-code-concept__flow-line--soft"
              d="M 32 360 C 220 245, 352 358, 478 274 S 662 192, 790 246 S 950 315, 1168 192"
            />
            <path
              className="no-code-concept__flow-line"
              d="M 32 360 C 220 245, 352 358, 478 274 S 662 192, 790 246 S 950 315, 1168 192"
            />

            <g className="no-code-concept__open-symbol" transform="translate(1015 255)">
              <circle r="102" />
              <circle className="no-code-concept__open-symbol-core" r="72" />
            </g>

            <g className="no-code-concept__diagram-labels" aria-hidden="true">
              <text x="74" y="460">CLOSED / I CANNOT CODE</text>
              <text x="510" y="474">PSYCHOLOGICAL DEFENSE</text>
              <text x="940" y="430">OPEN / I CAN CREATE</text>
            </g>
          </svg>

          <div className="no-code-concept__equation" aria-hidden="true">
            <span>X / CLOSED</span>
            <i />
            <span>VISUAL ACCESS</span>
            <i />
            <span>O / OPEN</span>
          </div>
        </div>

        <div className="no-code-concept__steps">
          {conceptSteps.map((step) => (
            <article className="no-code-concept__step" key={step.number}>
              <div className="no-code-concept__step-top">
                <span>{step.number}</span>
                <strong aria-hidden="true">{step.symbol}</strong>
              </div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>

        <div className="no-code-concept__strategy">
          <div className="no-code-concept__strategy-copy">
            <p className="no-code-concept__eyebrow">DESIGN HYPOTHESIS</p>
            <h3>The interface is not the destination. It is the bridge.</h3>
            <p>
              No-code design succeeds when it changes the user&apos;s emotional state before
              it changes their workflow. Direct manipulation, immediate feedback and
              reversible actions make experimentation feel safe.
            </p>
          </div>

          <div className="no-code-concept__shift-table">
            <div className="no-code-concept__shift-head">
              <span>Layer</span>
              <span>Before</span>
              <span>After</span>
            </div>
            {shifts.map(([layer, before, after]) => (
              <div className="no-code-concept__shift-row" key={layer}>
                <span>{layer}</span>
                <span>{before}</span>
                <strong>{after}</strong>
              </div>
            ))}
          </div>
        </div>

        <figure className="no-code-concept__board">
          <div className="no-code-concept__board-heading">
            <div>
              <p className="no-code-concept__eyebrow">12-FRAME VISUAL EXPLORATION</p>
              <h3>From closed marks to creative loops.</h3>
            </div>
            <span>CONCEPT STORYBOARD / V.01</span>
          </div>
          <img
            src="/case-study/no-code-concept-board.jpg"
            alt="Twelve visual studies showing X symbols, concentric barriers, flowing light and open circles"
            loading="lazy"
            decoding="async"
            width="1600"
            height="676"
          />
          <figcaption>
            The storyboard tests one narrative with increasing warmth: isolation, contact,
            transformation, participation.
          </figcaption>
        </figure>

        <footer className="no-code-concept__principle">
          <span>CORE PRINCIPLE</span>
          <p>
            Make the first successful creation happen before the user has time to say,
            “I am not a programmer.”
          </p>
        </footer>
      </div>
    </section>
  )
}
