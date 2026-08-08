import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import './MotionGallery.css'

const motionWorks = [
  {
    id: 'magnetic',
    number: '01',
    title: 'Magnetic Field',
    label: 'Field Attraction Study',
    src: '/motion-gallery/01-magnetic-field.mp4',
    aspect: 'wide',
    tags: ['PARTICLES', 'MAGNETIC', 'SYSTEM'],
    copy: 'A black-and-white force field study where particles gather, resist and lock into a magnetic visual rhythm.',
  },
  {
    id: 'bloom',
    number: '02',
    title: 'Bloom System',
    label: 'Organic Growth Motion',
    src: '/motion-gallery/02-bloom-system.mp4',
    aspect: 'wide',
    tags: ['BLOOM', 'LIGHT', 'FLOW'],
    copy: 'A soft expansion experiment built around luminous growth, controlled blur and elegant visual emergence.',
  },
  {
    id: 'zero-gravity',
    number: '03',
    title: 'Zero Gravity',
    label: 'Floating Object Sequence',
    src: '/motion-gallery/03-zero-gravity.mp4',
    aspect: 'wide',
    tags: ['SPACE', 'FLOATING', 'AIGC'],
    copy: 'A weightless composition test focused on suspended objects, layered depth and slow cinematic movement.',
  },
  {
    id: 'portal',
    number: '04',
    title: 'Portal Core',
    label: 'Energy Gate Visual',
    src: '/motion-gallery/04-portal-core.mp4',
    aspect: 'wide',
    tags: ['PORTAL', 'CORE', 'ENERGY'],
    copy: 'A circular gateway concept using concentric motion, glow and contrast to create a strong sci-fi focal point.',
  },
  {
    id: 'composition',
    number: '05',
    title: 'Composition Practice',
    label: 'Personal Motion Exercise',
    src: '/motion-gallery/05-composition-practice.mp4',
    aspect: 'cinema',
    tags: ['AFTER EFFECTS', 'COMPOSITING', 'PRACTICE'],
    copy: 'A personal compositing exercise treated as a film frame: timing, atmosphere and transition control.',
  },
  {
    id: 'growth',
    number: '06',
    title: 'Growth Composite',
    label: 'Generative Growth Scene',
    src: '/motion-gallery/06-growth-composite.mp4',
    aspect: 'cinema',
    tags: ['GROWTH', 'COMPOSITE', 'SCENE'],
    copy: 'A growth-themed motion scene exploring material change, spatial rhythm and environmental build-up.',
  },
  {
    id: 'abstract-cloth',
    number: '07',
    title: 'Abstract Cloth',
    label: 'Blender Cloth Simulation',
    src: '/motion-gallery/07-abstract-cloth.mp4',
    aspect: 'cinema',
    tags: ['BLENDER', 'CLOTH', 'SIMULATION'],
    copy: 'An abstract cloth simulation study focused on fabric motion, gravity, folds and material rhythm.',
  },
]

function LazyMotionVideo({ src, title, active = true, controls = false }) {
  const videoRef = useRef(null)
  const wrapperRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = wrapperRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShouldLoad(true)
      setIsVisible(entry.isIntersecting)
    }, { rootMargin: '360px 0px', threshold: 0.12 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad) return undefined

    const play = () => {
      if (active && isVisible && !document.hidden) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }

    play()
    document.addEventListener('visibilitychange', play)
    return () => document.removeEventListener('visibilitychange', play)
  }, [active, isVisible, shouldLoad])

  return (
    <div className="motion-gallery__video-shell" ref={wrapperRef}>
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          title={title}
          muted
          loop
          playsInline
          preload="metadata"
          controls={controls}
        />
      ) : (
        <span className="motion-gallery__video-placeholder">LOAD ON VIEW</span>
      )}
    </div>
  )
}

export default function MotionGallery() {
  const [sectionRef, isVisible] = useInView(0.06)
  const [activeId, setActiveId] = useState(motionWorks[0].id)
  const activeWork = motionWorks.find((work) => work.id === activeId) || motionWorks[0]

  return (
    <section
      id="motion-gallery"
      ref={sectionRef}
      className={`motion-gallery${isVisible ? ' is-visible' : ''}`}
      aria-labelledby="motion-gallery-title"
    >
      <div className="motion-gallery__grid-bg" aria-hidden="true" />
      <div className="motion-gallery__orb motion-gallery__orb--red" aria-hidden="true" />
      <div className="motion-gallery__orb motion-gallery__orb--blue" aria-hidden="true" />

      <div className="container motion-gallery__container">
        <div className="section-tag motion-gallery__tag">
          <span className="section-tag__label">Project Archive 05 / Motion Works</span>
          <span className="section-tag__line" />
          <span className="section-tag__num">{String(motionWorks.length).padStart(2, '0')} FILMS</span>
        </div>

        <header className="motion-gallery__hero">
          <div className="motion-gallery__hero-copy">
            <p className="motion-gallery__eyebrow">CODE NAME - DYNAMIC EXHIBITION</p>
            <h1 id="motion-gallery-title">
              Motion pieces<br />
              as <em>living frames.</em>
            </h1>
            <p>
              A curated motion wall for short experiments in particles, portals,
              cloth, growth, compositing and cinematic atmosphere.
            </p>
          </div>

          <aside className="motion-gallery__hero-panel" aria-label="Active motion work">
            <div className="motion-gallery__hero-video">
              <LazyMotionVideo
                src={activeWork.src}
                title={activeWork.title}
                controls
              />
            </div>
            <div className="motion-gallery__hero-meta">
              <span>ACTIVE FILM / {activeWork.number}</span>
              <strong>{activeWork.title}</strong>
              <p>{activeWork.copy}</p>
              <div>
                {activeWork.tags.map((tag) => <i key={tag}>{tag}</i>)}
              </div>
            </div>
          </aside>
        </header>

        <div className="motion-gallery__index" aria-label="Motion work selector">
          {motionWorks.map((work) => (
            <button
              type="button"
              key={work.id}
              className={activeId === work.id ? 'is-active' : ''}
              onClick={() => setActiveId(work.id)}
            >
              <span>{work.number}</span>
              <strong>{work.title}</strong>
              <small>{work.label}</small>
            </button>
          ))}
        </div>

        <div className="motion-gallery__works">
          {motionWorks.map((work) => (
            <article
              className={`motion-gallery__card motion-gallery__card--${work.aspect}`}
              key={work.id}
            >
              <button
                type="button"
                className="motion-gallery__card-button"
                onClick={() => setActiveId(work.id)}
                aria-label={`Select ${work.title}`}
              >
                <LazyMotionVideo
                  src={work.src}
                  title={work.title}
                  active={activeId === work.id}
                />
                <span className="motion-gallery__card-wash" />
                <span className="motion-gallery__card-number">{work.number}</span>
                <span className="motion-gallery__card-title">
                  <small>{work.label}</small>
                  <strong>{work.title}</strong>
                </span>
              </button>
            </article>
          ))}
        </div>

        <footer className="motion-gallery__footer">
          <p>
            The page treats motion works as an exhibition system: each loop is
            lightweight, lazy-loaded and paused off screen, keeping the portfolio
            cinematic without turning the browser into a rendering burden.
          </p>
          <div>
            <span>LAZY VIDEO SOURCE</span>
            <span>OFFSCREEN PAUSE</span>
            <span>MOTION PORTFOLIO</span>
          </div>
        </footer>
      </div>
    </section>
  )
}
