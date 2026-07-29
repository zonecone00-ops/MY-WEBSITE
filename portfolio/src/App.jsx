import { lazy, useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import { CaseArchive, SelectedCases } from './components/CaseCatalog'
import CasePage from './components/CasePage'
import { CASE_ALIASES, getCaseStudy } from './data/caseStudies'

const CASE_COMPONENTS = {
  'ad-deconstruction': lazy(() => import('./components/SpecialAbility')),
  'character-multiverse': lazy(() => import('./components/CharacterAbility')),
  'webgl-editor': lazy(() => import('./components/DynamicDesignCase')),
  'open-the-loop': lazy(() => import('./components/NoCodeConcept')),
  'motion-gallery': lazy(() => import('./components/MotionGallery')),
}

function readRoute(hash) {
  if (hash === '#cases') return { type: 'archive' }

  const alias = CASE_ALIASES[hash]
  if (alias) return { type: 'case', slug: alias }

  const match = hash.match(/^#case\/([^/]+)$/)
  if (match && getCaseStudy(match[1])) return { type: 'case', slug: match[1] }

  return { type: 'home', anchor: hash.slice(1) || 'home' }
}

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash)
  const route = useMemo(() => readRoute(hash), [hash])

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.title = route.type === 'case'
      ? `${getCaseStudy(route.slug).title} - Chen Zhuoyi`
      : route.type === 'archive'
        ? 'Case Archive - Chen Zhuoyi'
        : 'Chen Zhuoyi - Portfolio'

    requestAnimationFrame(() => {
      if (route.type !== 'home') {
        window.scrollTo({ top: 0, behavior: 'auto' })
        return
      }

      const target = document.getElementById(route.anchor)
      if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }, [route])

  const caseStudy = route.type === 'case' ? getCaseStudy(route.slug) : null
  const CaseComponent = caseStudy ? CASE_COMPONENTS[caseStudy.slug] : null

  return (
    <div className="app">
      <Navbar solid={route.type !== 'home'} />
      <main>
        {route.type === 'home' && (
          <>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <SelectedCases />
            <Contact />
          </>
        )}
        {route.type === 'archive' && <CaseArchive />}
        {route.type === 'case' && (
          <CasePage caseStudy={caseStudy} component={CaseComponent} />
        )}
      </main>
    </div>
  )
}
