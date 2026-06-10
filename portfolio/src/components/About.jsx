import { lazy, Suspense } from 'react'
import { useInView } from '../hooks/useInView'
import { useNearViewport } from '../hooks/useNearViewport'

const Silk = lazy(() => import('./Silk/Silk'))

const STATS = [
  ['80%', 'Cost Reduction', 'AI pipeline vs. traditional'],
  ['2+', 'Major Projects', 'Global brand campaigns'],
  ['N1', 'Japanese', 'JLPT N1 proficiency'],
  ['80', 'TOEFL', 'Academic English'],
]

export default function About() {
  const [ref, inView] = useInView()
  const [silkRef, silkActive] = useNearViewport('400px 0px')

  return (
    <section id="about" className="about" ref={ref}>
      <div className="about__silk" ref={silkRef} aria-hidden="true">
        {silkActive && (
          <Suspense fallback={null}>
            <Silk
              speed={5}
              scale={1}
              color="#7B7481"
              noiseIntensity={1.5}
              rotation={0}
            />
          </Suspense>
        )}
      </div>
      <div className="about__silk-overlay" aria-hidden="true" />

      <div className="container">
        <div className={`section-tag reveal ${inView ? 'in-view' : ''}`}>
          <span className="section-tag__label">Character File / About</span>
          <span className="section-tag__line" />
          <span className="section-tag__num">01</span>
        </div>

        <div className="about__grid">
          <div className={`about__avatar reveal ${inView ? 'in-view' : ''}`}>
            <span className="about__avatar-frame">PROFILE / CZ</span>
            <span className="about__avatar-glyph" aria-hidden="true">陳</span>
            <div className="about__avatar-inner">
              <span className="about__avatar-kana">チェン・ジュオイー</span>
              <strong>CZ</strong>
              <span className="about__avatar-label">Visual Designer / Tokyo</span>
            </div>
          </div>

          <div className="about__content">
            <p className={`about__eyebrow reveal reveal-d1 ${inView ? 'in-view' : ''}`}>
              Visual · AI · Brand Designer
            </p>
            <h2 className={`about__name reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
              Logic gives ideas<br /><em>a visible form.</em>
            </h2>
            <p className={`about__roles reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
              CHEN ZHUOYI — 陈卓一
            </p>

            <p className={`about__bio reveal reveal-d3 ${inView ? 'in-view' : ''}`}>
              I design at the intersection of <strong>AI and human creativity</strong>.
              My process starts by finding the real problem, then shaping a clear
              visual system and a repeatable workflow around it.
              <br /><br />
              From a hybrid <strong>3DCG × AI video pipeline</strong> that reduced
              production costs by 80% to multilingual campaigns for global brands,
              I bring a logic-first and aesthetics-driven mindset to every project.
            </p>

            <div className={`about__contacts reveal reveal-d4 ${inView ? 'in-view' : ''}`}>
              <a href="mailto:zonecone00@gmail.com" className="about__contact-item">
                <span>MAIL</span> zonecone00@gmail.com
              </a>
              <a href="tel:+817094492998" className="about__contact-item">
                <span>TEL</span> 070-9449-2998
              </a>
            </div>

            <div className={`about__edu reveal reveal-d5 ${inView ? 'in-view' : ''}`}>
              <p className="about__edu-label">Education / 学歴</p>
              <p className="about__edu-text">
                Shanghai Normal University · Japanese Language Department<br />
                September 2022 — June 2026 (Expected)
              </p>
            </div>
          </div>
        </div>

        <div className="about__stats">
          {STATS.map(([num, label, desc], index) => (
            <div key={label} className={`about__stat reveal reveal-d${index + 1} ${inView ? 'in-view' : ''}`}>
              <span className="about__stat-num">{num}</span>
              <span className="about__stat-label">{label}</span>
              <span className="about__stat-desc">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
