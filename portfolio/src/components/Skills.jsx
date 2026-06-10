import { lazy, Suspense } from 'react'
import { useInView } from '../hooks/useInView'
import { useNearViewport } from '../hooks/useNearViewport'

const Threads = lazy(() => import('./Threads/Threads'))

const SKILLS = [
  {
    num: '01',
    kana: '設計',
    title: 'AI Workflow Architecture',
    desc: 'End-to-end production pipelines that turn new AI tools into repeatable, scalable systems.',
    tools: ['ChatGPT', 'Gemini', 'Claude', 'Midjourney'],
  },
  {
    num: '02',
    kana: '映像',
    title: 'Motion & Visual Design',
    desc: 'Visual storytelling through motion graphics, compositing and carefully directed 3D frames.',
    tools: ['After Effects', 'Cavalry', 'Blender', 'CINEMA 4D'],
  },
  {
    num: '03',
    kana: '戦略',
    title: 'Brand Strategy',
    desc: 'Research frameworks translated into a clear creative direction for brands and campaigns.',
    tools: ['VRIO', 'SWOT', 'PEST', 'RBV'],
  },
  {
    num: '04',
    kana: '言語',
    title: 'Multilingual Communication',
    desc: 'Cross-cultural writing and localization that keep the original brand voice intact.',
    tools: ['Japanese N1', 'English TOEFL 80', 'Copywriting'],
  },
  {
    num: '05',
    kana: '指示',
    title: 'Prompt Engineering',
    desc: 'Standardized prompt libraries for consistent text, image and video generation.',
    tools: ['ChatGPT', 'Gemini', 'Claude', 'Codex'],
  },
  {
    num: '06',
    kana: '造形',
    title: '3DCG & AI Rendering',
    desc: 'Hybrid 3D and AI rendering for precise subjects that generation alone cannot reproduce.',
    tools: ['Blender', 'CINEMA 4D', 'Seedance'],
  },
]

export default function Skills() {
  const [ref, inView] = useInView()
  const [threadsRef, threadsActive] = useNearViewport('400px 0px')

  return (
    <section id="skills" className="skills" ref={ref}>
      <div className="skills__threads" ref={threadsRef} aria-hidden="true">
        {threadsActive && (
          <Suspense fallback={null}>
            <Threads
              color={[0.66, 0.13, 0.18]}
              amplitude={1}
              distance={0}
              enableMouseInteraction
            />
          </Suspense>
        )}
      </div>
      <div className="skills__threads-shade" aria-hidden="true" />

      <div className="container">
        <div className={`section-tag reveal ${inView ? 'in-view' : ''}`}>
          <span className="section-tag__label">Ability Chart / 能力設定</span>
          <span className="section-tag__line" />
          <span className="section-tag__num">03</span>
        </div>

        <div className="skills__intro">
          <h2 className={`skills__heading reveal ${inView ? 'in-view' : ''}`}>
            What I<br /><em>bring to frame.</em>
          </h2>
          <p className={`skills__intro-text reveal reveal-d1 ${inView ? 'in-view' : ''}`}>
            My strength is logical problem decomposition: turning unfamiliar
            challenges into clear stages that can be built, tested and improved.
          </p>
        </div>

        <div className="skills__grid">
          {SKILLS.map((skill, index) => (
            <article
              key={skill.num}
              className={`skill-card reveal reveal-d${(index % 3) + 1} ${inView ? 'in-view' : ''}`}
            >
              <span className="skill-card__kana" aria-hidden="true">{skill.kana}</span>
              <span className="skill-card__num">SKILL / {skill.num}</span>
              <h3 className="skill-card__title">{skill.title}</h3>
              <p className="skill-card__desc">{skill.desc}</p>
              <div className="skill-card__tools">
                {skill.tools.map((tool) => <span key={tool} className="skill-card__tool">{tool}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
