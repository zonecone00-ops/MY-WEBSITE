import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'

const Grainient = lazy(() => import('./Grainient/Grainient'))

export default function Contact() {
  const [ref, inView] = useInView(0.2)
  const backgroundRef = useRef(null)
  const [backgroundActive, setBackgroundActive] = useState(false)
  const [backgroundKey, setBackgroundKey] = useState(0)
  const year = new Date().getFullYear()

  useEffect(() => {
    const background = backgroundRef.current
    if (!background) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBackgroundActive(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px', threshold: 0 },
    )

    observer.observe(background)
    return () => observer.disconnect()
  }, [])

  const recoverBackground = useCallback(() => {
    setBackgroundKey((value) => value + 1)
  }, [])

  return (
    <section
      id="contact"
      className={`contact${backgroundActive ? ' is-background-active' : ''}`}
      ref={ref}
    >
      <div className="contact__grainient" ref={backgroundRef} aria-hidden="true">
        {backgroundActive && (
          <Suspense fallback={null}>
            <Grainient
              key={backgroundKey}
              color1="#000000"
              color2="#721f1f"
              color3="#000000"
              timeSpeed={0.5}
              colorBalance={-0.05}
              warpStrength={3}
              warpFrequency={6.8}
              warpSpeed={1.7}
              warpAmplitude={41}
              blendAngle={24}
              blendSoftness={0.05}
              rotationAmount={500}
              noiseScale={2}
              grainAmount={0.1}
              grainScale={2}
              grainAnimated={false}
              contrast={1.5}
              gamma={1}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={0.85}
              onContextLost={recoverBackground}
            />
          </Suspense>
        )}
      </div>
      <div className="contact__grainient-shade" aria-hidden="true" />

      <svg className="contact__thread" viewBox="0 0 1600 800" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-50 585C310 238 495 776 810 401C1052 112 1271 516 1660 231" />
      </svg>
      <span className="contact__bg-text" aria-hidden="true">終</span>

      <div className="container contact__inner">
        <p className={`contact__eyebrow reveal ${inView ? 'in-view' : ''}`}>
          Final Scene / お問い合わせ
        </p>
        <h2 className={`contact__heading reveal reveal-d1 ${inView ? 'in-view' : ''}`}>
          Let&apos;s build the<br /><em>next frame.</em>
        </h2>
        <p className={`contact__lead reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
          Available for visual design, AI workflow and international brand projects.
        </p>

        <div className={`contact__links reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
          <a href="mailto:zonecone00@gmail.com" className="contact__link">
            <span>MAIL</span> zonecone00@gmail.com
          </a>
          <a href="tel:+817094492998" className="contact__link">
            <span>TEL</span> 070-9449-2998
          </a>
          <span className="contact__link"><span>BASE</span> Tokyo, Japan</span>
        </div>

        <div className={`contact__actions reveal reveal-d3 ${inView ? 'in-view' : ''}`}>
          <a href="mailto:zonecone00@gmail.com" className="contact__btn contact__btn--primary">Send Message ↗</a>
          <a href="#projects" className="contact__btn contact__btn--outline">Review Projects →</a>
        </div>
      </div>

      <footer className="contact__footer">
        <span className="contact__footer-text">© {year} Chen Zhuoyi</span>
        <span className="contact__footer-line" />
        <span className="contact__footer-text">Visual · AI · Brand</span>
        <span className="contact__footer-line" />
        <span className="contact__footer-text">Shanghai · Tokyo · Global</span>
      </footer>
    </section>
  )
}
