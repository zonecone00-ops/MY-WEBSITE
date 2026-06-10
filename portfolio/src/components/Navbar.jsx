import { useState, useEffect } from 'react'

export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 60)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header className={`navbar ${scrolled || solid ? 'scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#home" className="navbar__logo">
          C<span>Z</span>
        </a>

        <nav>
          <ul className="navbar__links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#skills">Strengths</a></li>
            <li><a href="#cases">Cases</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <a href="mailto:zonecone00@gmail.com" className="navbar__cta">
          Get in Touch
        </a>
      </div>
    </header>
  )
}
