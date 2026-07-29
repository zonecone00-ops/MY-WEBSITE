export const CASE_STUDIES = [
  {
    slug: 'ad-deconstruction',
    number: '01',
    title: 'Ad Deconstruction',
    subtitle: 'AI-assisted product previsualization',
    description: 'Translate leading smartphone commercials into producible shots, motion intent and reusable visual references.',
    tags: ['AI PREVIS', 'SHOT DESIGN', 'PRODUCT CGI'],
    image: '/case-study/mobile-ad-storyboard.jpg',
    tone: 'red',
  },
  {
    slug: 'character-multiverse',
    number: '02',
    title: 'Character Multiverse',
    subtitle: 'Poster exploration and assetization',
    description: 'Compare multiple visual worlds quickly, then turn the strongest direction into a repeatable character asset system.',
    tags: ['ART DIRECTION', 'CHARACTER', 'AIGC'],
    image: '/case-study/character-posters/scarlet-phantom.jpg',
    tone: 'blue',
  },
  {
    slug: 'webgl-editor',
    number: '03',
    title: 'WebGL Motion Editor',
    subtitle: 'No-code dynamic asset platform',
    description: 'A professional editor concept connecting property tracks, easing curves, shaders and real-time output.',
    tags: ['UI/UX', 'WEBGL', 'NO-CODE'],
    image: null,
    tone: 'light',
  },
  {
    slug: 'open-the-loop',
    number: '04',
    title: 'Open the Loop',
    subtitle: 'No-code concept deconstruction',
    description: 'A symbolic journey from programming anxiety to creative participation, expressed through X, barriers and O.',
    tags: ['CONCEPT', 'STORYTELLING', 'UX'],
    image: '/case-study/no-code-concept-board.jpg',
    tone: 'violet',
  },
  {
    slug: 'motion-gallery',
    number: '05',
    title: 'Motion Works',
    subtitle: 'Dynamic visual exhibition',
    description: 'A curated gallery of short motion experiments covering particles, portals, growth, compositing and cinematic atmosphere.',
    tags: ['MOTION', 'VIDEO', 'EXPERIMENT'],
    image: null,
    visual: 'motion',
    tone: 'motion',
  },
]

export const CASE_ALIASES = {
  '#ability-case': 'ad-deconstruction',
  '#character-case': 'character-multiverse',
  '#dynamic-ui-case': 'webgl-editor',
  '#no-code-concept': 'open-the-loop',
  '#motion-gallery': 'motion-gallery',
}

export function getCaseStudy(slug) {
  return CASE_STUDIES.find((caseStudy) => caseStudy.slug === slug)
}
