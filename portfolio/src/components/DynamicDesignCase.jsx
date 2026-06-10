import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import './DynamicDesignCase.css'

const NAV_ITEMS = [
  ['workspace', 'Workspace'],
  ['timeline', 'Timeline'],
  ['assets', 'Shaders'],
  ['team', 'Curve Editor'],
]

const FILES = [
  { name: 'Wave_Mesh.scene', type: 'SCN', size: '12.8 MB', updated: 'LIVE' },
  { name: 'Fluid_Noise.glsl', type: 'GLSL', size: '8.2 KB', updated: '4m' },
  { name: 'Surface_Mask.webp', type: 'TEX', size: '3.6 MB', updated: '18m' },
]

const TIMELINE_ROWS = [
  { label: 'Wave_Speed', start: 4, width: 39, value: '1.20', keyframes: [4, 31, 43] },
  { label: 'Mesh_Deformation', start: 18, width: 47, value: '0.68', keyframes: [18, 47, 65] },
  { label: 'Noise_Frequency', start: 37, width: 35, value: '4.20', keyframes: [37, 56, 72] },
  { label: 'Camera_Z_Depth', start: 61, width: 28, value: '-6.40', keyframes: [61, 75, 89] },
]

function Icon({ name }) {
  const paths = {
    workspace: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    timeline: 'M4 6h16M7 6v5M4 13h16M16 13v5M4 20h16',
    assets: 'M4 5.5A1.5 1.5 0 0 1 5.5 4h5l2 2H19a1 1 0 0 1 1 1v11.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z',
    team: 'M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 19a5 5 0 0 1 10 0M16 8a2.5 2.5 0 1 1 0 5M15 15a4 4 0 0 1 5 4',
    search: 'M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm5-2 4 4',
    bell: 'M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8ZM10 21h4',
    play: 'm9 7 8 5-8 5z',
    pause: 'M9 7h2v10H9zM15 7h2v10h-2z',
    more: 'M6 12h.01M12 12h.01M18 12h.01',
    plus: 'M12 5v14M5 12h14',
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}

function FluidPreview({ paused }) {
  const canvasRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d', { alpha: false })
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frameId = 0
    let visible = true
    let pageVisible = !document.hidden
    let lastFrame = 0
    let width = 1
    let height = 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      width = Math.max(1, Math.floor(rect.width * dpr))
      height = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }

    const draw = (time = 0) => {
      const t = time * 0.00032
      const pointer = pointerRef.current
      context.fillStyle = '#050505'
      context.fillRect(0, 0, width, height)

      const glow = context.createRadialGradient(
        width * (0.58 + pointer.x * 0.03),
        height * (0.46 + pointer.y * 0.03),
        0,
        width * 0.55,
        height * 0.5,
        Math.max(width, height) * 0.66,
      )
      glow.addColorStop(0, 'rgba(255,255,255,0.10)')
      glow.addColorStop(0.36, 'rgba(130,130,130,0.035)')
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      context.globalCompositeOperation = 'screen'
      const ribbons = [
        { y: 0.36, amp: 0.11, width: 0.13, alpha: 0.64, speed: 1 },
        { y: 0.52, amp: 0.15, width: 0.17, alpha: 0.34, speed: -0.72 },
        { y: 0.66, amp: 0.09, width: 0.1, alpha: 0.22, speed: 0.48 },
      ]

      ribbons.forEach((ribbon, ribbonIndex) => {
        const points = 36
        const upper = []
        const lower = []
        for (let index = 0; index <= points; index += 1) {
          const ratio = index / points
          const wave =
            Math.sin(ratio * Math.PI * 2.2 + t * ribbon.speed + ribbonIndex) * ribbon.amp +
            Math.sin(ratio * Math.PI * 4.6 - t * 0.55) * ribbon.amp * 0.28
          const center =
            height * (ribbon.y + wave + pointer.y * 0.012) +
            Math.sin(ratio * Math.PI) * pointer.x * height * 0.018
          const thickness = height * ribbon.width * (0.3 + Math.sin(ratio * Math.PI) * 0.7)
          upper.push([ratio * width, center - thickness])
          lower.push([ratio * width, center + thickness])
        }

        const gradient = context.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, `rgba(54,54,54,${ribbon.alpha * 0.25})`)
        gradient.addColorStop(0.46, `rgba(245,245,242,${ribbon.alpha})`)
        gradient.addColorStop(0.72, `rgba(114,114,114,${ribbon.alpha * 0.48})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        context.beginPath()
        context.moveTo(upper[0][0], upper[0][1])
        upper.forEach(([x, y]) => context.lineTo(x, y))
        lower.reverse().forEach(([x, y]) => context.lineTo(x, y))
        context.closePath()
        context.fillStyle = gradient
        context.fill()
      })

      context.globalCompositeOperation = 'source-over'
      context.strokeStyle = 'rgba(255,255,255,0.13)'
      context.lineWidth = Math.max(1, width / 900)
      context.beginPath()
      for (let index = 0; index <= 32; index += 1) {
        const ratio = index / 32
        const y = height * (0.49 + Math.sin(ratio * 7.2 + t) * 0.13)
        if (index === 0) context.moveTo(ratio * width, y)
        else context.lineTo(ratio * width, y)
      }
      context.stroke()
    }

    const animate = (time) => {
      if (!visible || !pageVisible || paused || reduceMotion) return
      if (time - lastFrame >= 33) {
        draw(time)
        lastFrame = time
      }
      frameId = requestAnimationFrame(animate)
    }

    const restart = () => {
      cancelAnimationFrame(frameId)
      draw(performance.now())
      if (visible && pageVisible && !paused && !reduceMotion) {
        frameId = requestAnimationFrame(animate)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      restart()
    }, { threshold: 0.05 })

    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })

    const onVisibilityChange = () => {
      pageVisible = !document.hidden
      restart()
    }

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      }
    }

    const onPointerLeave = () => {
      pointerRef.current = { x: 0, y: 0 }
    }

    resize()
    draw()
    observer.observe(canvas)
    resizeObserver.observe(canvas)
    document.addEventListener('visibilitychange', onVisibilityChange)
    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true })
    restart()

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [paused])

  return <canvas ref={canvasRef} className="dynamic-ui__canvas" aria-label="Animated fluid design preview" />
}

export default function DynamicDesignCase() {
  const [sectionRef, inView] = useInView(0.05)
  const [activeNav, setActiveNav] = useState('workspace')
  const [selectedFile, setSelectedFile] = useState(0)
  const [activeTrack, setActiveTrack] = useState('Wave_Speed')
  const [trackKeyframes, setTrackKeyframes] = useState(() => (
    Object.fromEntries(TIMELINE_ROWS.map((row) => [row.label, row.keyframes]))
  ))
  const [playhead, setPlayhead] = useState(40)
  const [factor, setFactor] = useState(0.42)
  const [paused, setPaused] = useState(false)

  const addKeyframe = (event, trackLabel) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const position = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
    const roundedPosition = Math.round(position * 10) / 10

    setActiveTrack(trackLabel)
    setPlayhead(roundedPosition)
    setFactor(Number((0.28 + Math.random() * 0.44).toFixed(2)))
    setTrackKeyframes((current) => {
      const existing = current[trackLabel] || []
      return {
        ...current,
        [trackLabel]: [...existing, roundedPosition].sort((a, b) => a - b),
      }
    })
  }

  const playheadTime = `00:${Math.round(playhead * 0.72).toString().padStart(2, '0')}`

  return (
    <section id="dynamic-ui-case" className="dynamic-ui" ref={sectionRef}>
      <div className="dynamic-ui__sunlight" aria-hidden="true" />
      <div className="container dynamic-ui__intro">
        <div className={`section-tag reveal ${inView ? 'in-view' : ''}`}>
          <span className="section-tag__label">Project Archive 03 / UI Case</span>
          <span className="section-tag__line" />
          <span className="section-tag__num">03</span>
        </div>

        <div className="dynamic-ui__intro-grid">
          <div>
            <p className={`dynamic-ui__code reveal ${inView ? 'in-view' : ''}`}>
              CODE NAME — REALTIME WEBGL AUTHORING
            </p>
            <h2 className={`dynamic-ui__title reveal reveal-d1 ${inView ? 'in-view' : ''}`}>
              Shape motion.<br /><em>Without code.</em>
            </h2>
          </div>
          <div className={`dynamic-ui__brief reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
            <span>PROJECT SUMMARY</span>
            <p>
              A professional no-code WebGL editor for building responsive motion
              assets through property tracks, shaders and live curve control.
            </p>
            <div>
              <span>WEBGL</span><span>NODE-FREE MOTION</span><span>REALTIME PREVIEW</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`dynamic-ui__stage reveal reveal-d2 ${inView ? 'in-view' : ''}`}>
        <div className="dynamic-ui__app">
          <aside className="dynamic-ui__sidebar">
            <button className="dynamic-ui__brand" type="button" aria-label="Wave Lab home">
              <span>W</span>
            </button>
            <nav aria-label="Editor sections">
              {NAV_ITEMS.map(([id, label]) => (
                <button
                  type="button"
                  key={id}
                  className={activeNav === id ? 'is-active' : ''}
                  onClick={() => setActiveNav(id)}
                  aria-label={label}
                  title={label}
                >
                  <Icon name={id} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            <button className="dynamic-ui__avatar" type="button" aria-label="Alex Chen profile">AC</button>
          </aside>

          <div className="dynamic-ui__workspace">
            <header className="dynamic-ui__topbar">
              <nav className="dynamic-ui__app-menu" aria-label="Application menu">
                {['File', 'Edit', 'View', 'Assets', 'Export'].map((item) => (
                  <button type="button" key={item}>{item}</button>
                ))}
              </nav>
              <div className="dynamic-ui__search">
                <Icon name="search" />
                <input aria-label="Search editor resources" placeholder="Search nodes, assets, properties" />
                <kbd>⌘ K</kbd>
              </div>
              <div className="dynamic-ui__status">
                <div>
                  <span>Tokyo</span>
                  <strong>24°</strong>
                  <small>Clear / 10:32 AM</small>
                </div>
                <button type="button" aria-label="Notifications"><Icon name="bell" /><i /></button>
              </div>
            </header>

            <main className={`dynamic-ui__management is-view-${activeNav}`}>
              <section className="dynamic-ui__panel dynamic-ui__timeline">
                <header>
                  <div><span>ACTIVE_SESSION_01</span><h3>WAVE_DYNAMICS_LAB</h3></div>
                  <div className="dynamic-ui__members">
                    <span>AC</span><span>RT</span><span>AI</span><button type="button" aria-label="Add collaborator"><Icon name="plus" /></button>
                  </div>
                </header>
                <div className="dynamic-ui__timeline-scale">
                  {['00:00', '00:18', '00:36', '00:54', '01:12'].map((timecode) => <span key={timecode}>{timecode}</span>)}
                </div>
                <div className="dynamic-ui__timeline-grid">
                  {TIMELINE_ROWS.map((row) => (
                    <div
                      className={`dynamic-ui__timeline-row ${activeTrack === row.label ? 'is-active' : ''}`}
                      key={row.label}
                    >
                      <button
                        type="button"
                        className="dynamic-ui__track-label"
                        onClick={() => setActiveTrack(row.label)}
                        aria-pressed={activeTrack === row.label}
                      >
                        <strong>{row.label}</strong><small>{row.value}</small>
                      </button>
                      <button
                        type="button"
                        className="dynamic-ui__track-lane"
                        onClick={(event) => addKeyframe(event, row.label)}
                        aria-label={`Add keyframe to ${row.label}`}
                      >
                        <i
                          style={{ left: `${row.start}%`, width: `${row.width}%` }}
                        />
                        {(trackKeyframes[row.label] || []).map((position, index) => (
                          <b
                            className="dynamic-ui__keyframe"
                            style={{ left: `${position}%` }}
                            key={`${row.label}-${position}-${index}`}
                          />
                        ))}
                      </button>
                    </div>
                  ))}
                  <span className="dynamic-ui__playhead">
                    <b style={{ left: `${playhead}%` }}><i>{playheadTime}</i></b>
                  </span>
                </div>
              </section>

              <section className="dynamic-ui__panel dynamic-ui__files">
                <header>
                  <div><span>SCENE RESOURCES</span><h3>Shader & Asset Library</h3></div>
                  <button type="button" aria-label="More file options"><Icon name="more" /></button>
                </header>
                <div className="dynamic-ui__file-list">
                  {FILES.map((file, index) => (
                    <button
                      type="button"
                      key={file.name}
                      className={selectedFile === index ? 'is-selected' : ''}
                      onClick={() => setSelectedFile(index)}
                    >
                      <span className="dynamic-ui__file-type">{file.type}</span>
                      <span><strong>{file.name}</strong><small>{file.size}</small></span>
                      <time>{file.updated}</time>
                    </button>
                  ))}
                </div>
              </section>

              <section className="dynamic-ui__panel dynamic-ui__analytics">
                <header>
                  <div>
                    <span>BEZIER CURVE GRID</span>
                    <h3>Motion Curve &amp; Easing</h3>
                    <small>Target: {activeTrack}</small>
                  </div>
                  <div className="dynamic-ui__curve-values">
                    <span>Duration: 1.2s</span>
                    <span>Factor: {factor.toFixed(2)}</span>
                  </div>
                </header>
                <div className="dynamic-ui__curve-editor">
                  <svg viewBox="0 0 420 220" preserveAspectRatio="none" aria-label={`Ease-in-out curve controlling ${activeTrack}`}>
                    <defs>
                      <pattern id="bezierSmallGrid" width="21" height="22" patternUnits="userSpaceOnUse">
                        <path d="M21 0H0V22" fill="none" stroke="rgba(17,17,15,.055)" strokeWidth="1" />
                      </pattern>
                      <pattern id="bezierGrid" width="84" height="88" patternUnits="userSpaceOnUse">
                        <rect width="84" height="88" fill="url(#bezierSmallGrid)" />
                        <path d="M84 0H0V88" fill="none" stroke="rgba(17,17,15,.1)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect x="0" y="0" width="420" height="220" fill="url(#bezierGrid)" />
                    <line className="axis" x1="26" y1="194" x2="394" y2="194" />
                    <line className="axis" x1="26" y1="194" x2="26" y2="24" />
                    <line className="handle-line" x1="26" y1="194" x2="136" y2="194" />
                    <line className="handle-line" x1="394" y1="24" x2="284" y2="24" />
                    <path className="curve" d="M26 194 C136 194 284 24 394 24" />
                    <circle className="endpoint" cx="26" cy="194" r="5" />
                    <circle className="endpoint" cx="394" cy="24" r="5" />
                    <circle className="handle" cx="136" cy="194" r="4" />
                    <circle className="handle" cx="284" cy="24" r="4" />
                  </svg>
                  <div className="dynamic-ui__curve-axis">
                    <span>INPUT</span><span>OUTPUT</span>
                  </div>
                </div>
              </section>
            </main>
          </div>

          <aside className="dynamic-ui__preview">
            <header>
              <div>
                <span>LIVE PREVIEW</span>
                <strong>{FILES[selectedFile].name}</strong>
              </div>
              <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Play preview' : 'Pause preview'}>
                <Icon name={paused ? 'play' : 'pause'} />
              </button>
            </header>
            <div className="dynamic-ui__preview-screen">
              <FluidPreview paused={paused} />
              <div className="dynamic-ui__preview-meta">
                <span>1080 × 1350</span>
                <span>WEBGL / 30 FPS</span>
              </div>
              <div className="dynamic-ui__preview-title">
                <small>PROCEDURAL OUTPUT / 04</small>
                <strong>Wave<br />Field</strong>
              </div>
            </div>
            <footer>
              <div>
                <span>00:08</span>
                <i><b style={{ width: paused ? '38%' : '64%' }} /></i>
                <span>00:12</span>
              </div>
              <button type="button">Publish</button>
            </footer>
          </aside>
        </div>
      </div>

      <div className="container dynamic-ui__footer">
        <p>
          A focused WebGL authoring system where property tracks, easing curves,
          shader assets and the final render remain visible in one continuous workspace.
        </p>
        <div><span>PROPERTY TIMELINE</span><span>BEZIER CONTROL</span><span>LIVE WEBGL OUTPUT</span></div>
      </div>
    </section>
  )
}
