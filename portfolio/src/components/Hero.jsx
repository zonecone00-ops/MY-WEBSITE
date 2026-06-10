import { useEffect, useRef } from 'react'

export default function Hero() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return undefined

    let inViewport = true
    const updatePlayback = () => {
      if (inViewport && !document.hidden) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting
        updatePlayback()
      },
      { threshold: 0.05 },
    )

    video.load()
    observer.observe(section)
    document.addEventListener('visibilitychange', updatePlayback)
    window.addEventListener('focus', updatePlayback)
    video.addEventListener('loadeddata', updatePlayback)
    video.addEventListener('canplay', updatePlayback)
    updatePlayback()
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updatePlayback)
      window.removeEventListener('focus', updatePlayback)
      video.removeEventListener('loadeddata', updatePlayback)
      video.removeEventListener('canplay', updatePlayback)
    }
  }, [])

  return (
    <section id="home" className="hero hero--editorial" ref={sectionRef}>
      <video
        ref={videoRef}
        className="hero__background-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-background-poster.jpg"
        disablePictureInPicture
        aria-hidden="true"
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>
      <div className="hero__video-overlay" aria-hidden="true" />

      <svg className="hero__threads" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <path d="M470 258C620 110 746 618 928 394C1085 201 1142 210 1608 432" />
        <path d="M554 672C690 392 805 244 1016 474C1196 669 1311 526 1608 586" />
        <path d="M722 84C623 244 739 333 971 325C1217 317 1310 102 1608 151" />
      </svg>

      <div className="hero__folio" aria-hidden="true">PORTFOLIO / 2026</div>

      <div className="container hero__content">
        <div className="hero__left">
          <div className="hero__intro">
            <span>INTRODUCTION</span>
            <small>ポートフォリオ</small>
          </div>

          <p className="hero__label">Visual Design · AI Workflow · Brand Strategy</p>

          <h1 className="hero__title">
            <span className="hero__title-kicker">Designing clarity</span>
            <span className="hero__title-line">BETWEEN</span>
            <span className="hero__title-line hero__title-line--accent">IDEAS &amp; IMPACT.</span>
          </h1>

          <p className="hero__summary">
            I turn complex ideas into clear visual systems, combining
            creative direction, AI workflows and brand thinking.
          </p>

          <div className="hero__actions">
            <a href="#projects" className="hero__cta hero__cta--primary">
              View Projects
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#about" className="hero__cta">
              My Story
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <span className="hero__visual-index">CZ / 01</span>
          <p className="hero__visual-name">CHEN ZHUOYI</p>
          <p className="hero__visual-note">Designer based in Japan</p>
        </div>
      </div>

      <a className="hero__scroll" href="#about">
        <span>Scroll to explore</span>
        <div className="hero__scroll-line" />
      </a>
    </section>
  )
}
