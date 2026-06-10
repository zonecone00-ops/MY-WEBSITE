import { useInView } from '../hooks/useInView'
import ShapeGrid from './ShapeGrid/ShapeGrid'

const PROJECTS = [
  {
    num: 'CUT 01',
    className: 'project-card--featured project-card--watch',
    glyph: 'FI',
    tags: ['AI Video', '3DCG', 'Brand'],
    year: '2025 · Filippo Loreti',
    title: 'AI-Driven Brand',
    accent: 'Video Marketing',
    desc: 'A hybrid 3DCG × AI pipeline for luxury-watch campaigns, replacing costly studio shoots with a repeatable visual production system.',
    stat: '80%',
    statLabel: 'Production cost reduction',
  },
  {
    num: 'CUT 02',
    className: 'project-card--half project-card--global',
    glyph: '360',
    tags: ['Global', 'Multilingual', 'Strategy'],
    year: '2025 · Insta360',
    title: 'Global Brand',
    accent: 'Campaign',
    desc: 'AI-assisted multilingual content adaptation for a campaign spanning several markets while preserving one coherent brand voice.',
  },
  {
    num: 'CUT 03',
    className: 'project-card--half project-card--system',
    glyph: 'AI',
    tags: ['Workflow', 'Automation', 'AI'],
    year: '2025 · Internal',
    title: 'AI Production',
    accent: 'Workflow System',
    desc: 'A reusable framework for image generation, video production and multilingual copywriting, documented for team-wide use.',
  },
]

function ProjectCard({ project }) {
  return (
    <article className={`project-card ${project.className}`}>
      <div className="project-card__visual" aria-hidden="true">
        <span className="project-card__cross project-card__cross--one">+</span>
        <span className="project-card__cross project-card__cross--two">+</span>
        <span className="project-card__glyph">{project.glyph}</span>
        <span className="project-card__visual-note">KEY FRAME / {project.num}</span>
      </div>
      <div className="project-card__content">
        <div className="project-card__top">
          <span className="project-card__num">{project.num}</span>
          <div className="project-card__tags">
            {project.tags.map((tag) => <span key={tag} className="project-card__tag">{tag}</span>)}
          </div>
        </div>
        <div className="project-card__bottom">
          <p className="project-card__meta">{project.year}</p>
          <h3 className="project-card__title">
            {project.title}<br /><em>{project.accent}</em>
          </h3>
          <p className="project-card__desc">{project.desc}</p>
          <span className="project-card__link">View Case File <span>→</span></span>
        </div>
      </div>
      {project.stat && (
        <div className="project-card__stat">
          <span className="project-card__stat-num">{project.stat}</span>
          <span className="project-card__stat-label">{project.statLabel}</span>
        </div>
      )}
    </article>
  )
}

export default function Projects() {
  const [ref, inView] = useInView()

  return (
    <section id="projects" className="projects" ref={ref}>
      <div className="projects__shape-grid" aria-hidden="true">
        <ShapeGrid
          speed={0.1}
          squareSize={40}
          direction="diagonal"
          borderColor="#202021"
          hoverFillColor="#222"
          shape="square"
          hoverTrailAmount={5}
        />
      </div>
      <div className="projects__grid-shade" aria-hidden="true" />

      <div className="container">
        <div className={`section-tag reveal ${inView ? 'in-view' : ''}`}>
          <span className="section-tag__label">Selected Works / 絵コンテ</span>
          <span className="section-tag__line" />
          <span className="section-tag__num">02</span>
        </div>

        <div className="projects__heading">
          <h2 className={`reveal ${inView ? 'in-view' : ''}`}>Three stories,<br /><em>one design logic.</em></h2>
          <p className={`reveal reveal-d1 ${inView ? 'in-view' : ''}`}>
            Selected work presented as key frames: context, system and result.
          </p>
        </div>

        <div className="projects__grid">
          {PROJECTS.map((project, index) => (
            <div key={project.num} className={`project-wrap reveal reveal-d${index + 1} ${inView ? 'in-view' : ''}`}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
