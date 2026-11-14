import type { L } from '../i18n/locales'

export type PlanetId = 'engineering' | 'creative' | 'journey' | 'future'
/** Anything the camera can focus: a planet, or the sun (Wendy). */
export type FocusId = PlanetId | 'sun'
export type PlanetFeature = 'rings' | 'soft' | 'moon' | 'atmosphere'

export interface PlanetDef {
  id: PlanetId
  index: number
  name: L
  subtitle: L
  /** One-line teaser shown on hover. */
  teaser: L
  feature: PlanetFeature
  /** Visual radius in scene units. */
  size: number
  /** Accent colours used by both the 3D scene and the HTML panel. */
  color: string
  accent: string
  glow: string
  orbit: {
    radius: number
    /** Radians per second of simulated time. */
    speed: number
    phase: number
    /** Small inclination for depth (radians). */
    tilt: number
    /** z-radius / x-radius on landscape screens. */
    flatten: number
  }
  /** Multiplier on the camera distance when focused (rings need more room). */
  focusDistance: number
}

export const planets: PlanetDef[] = [
  {
    id: 'engineering',
    index: 1,
    name: { en: 'Engineering', de: 'Technik', zh: '工程' },
    subtitle: { en: 'Building things with technology.', de: 'Mit Technologie Dinge erschaffen.', zh: '用技术创造事物。' },
    teaser: {
      en: 'Experience, skills and selected software projects.',
      de: 'Berufserfahrung, Fähigkeiten und ausgewählte Softwareprojekte.',
      zh: '工作经历、技能与精选软件项目。',
    },
    feature: 'rings',
    size: 0.58,
    color: '#c8664a',
    accent: '#f2a679',
    glow: '#e58a63',
    orbit: { radius: 4.3, speed: 0.22, phase: 0.6, tilt: 0.05, flatten: 0.78 },
    focusDistance: 1.35,
  },
  {
    id: 'creative',
    index: 2,
    name: { en: 'Creative', de: 'Kreativität', zh: '创意' },
    subtitle: { en: 'Finding beauty in everyday life.', de: 'Schönheit im Alltag finden.', zh: '在日常中发现美。' },
    teaser: {
      en: 'Photography, travel, oil painting and experiments.',
      de: 'Fotografie, Reisen, Ölmalerei und Experimente.',
      zh: '摄影、旅行、油画与创意实验。',
    },
    feature: 'soft',
    size: 0.5,
    color: '#d9a0a6',
    accent: '#f0c4c4',
    glow: '#e8b3b6',
    orbit: { radius: 6.1, speed: 0.15, phase: 2.6, tilt: -0.04, flatten: 0.8 },
    focusDistance: 1,
  },
  {
    id: 'journey',
    index: 3,
    name: { en: 'Journey', de: 'Werdegang', zh: '旅程' },
    subtitle: {
      en: 'Every experience shapes who I am.',
      de: 'Jede Erfahrung prägt, wer ich bin.',
      zh: '每一段经历都塑造了今天的我。',
    },
    teaser: {
      en: 'Education, career path and life in Dresden.',
      de: 'Ausbildung, beruflicher Weg und Leben in Dresden.',
      zh: '教育、职业道路与德累斯顿的生活。',
    },
    feature: 'moon',
    size: 0.46,
    color: '#e9dcc6',
    accent: '#f4ead9',
    glow: '#efe1c8',
    orbit: { radius: 7.9, speed: 0.11, phase: 4.3, tilt: 0.06, flatten: 0.8 },
    focusDistance: 1.15,
  },
  {
    id: 'future',
    index: 4,
    name: { en: 'Future', de: 'Zukunft', zh: '未来' },
    subtitle: {
      en: 'Always curious, always exploring.',
      de: 'Immer neugierig, immer auf Entdeckungsreise.',
      zh: '永远好奇，永远探索。',
    },
    teaser: {
      en: 'Physical AI, Rust & robotics, and the MicroDuck experiment.',
      de: 'Physical AI, Rust & Robotik und das Experiment MicroDuck.',
      zh: '物理 AI、Rust 与机器人，以及 MicroDuck 实验。',
    },
    feature: 'atmosphere',
    size: 0.64,
    color: '#9a9cc4',
    accent: '#b9b0dc',
    glow: '#a99cc9',
    orbit: { radius: 9.9, speed: 0.075, phase: 5.6, tilt: -0.05, flatten: 0.8 },
    focusDistance: 1.1,
  },
]

export const planetById = Object.fromEntries(planets.map((p) => [p.id, p])) as Record<PlanetId, PlanetDef>
