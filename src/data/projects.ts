import type { L, Text } from '../i18n/locales'

/**
 * Selected software projects (DE / EN / ZH), from Jiayi Fan's CV.
 * `href` / `repo` are optional — links are only rendered when present.
 */
export interface Project {
  title: Text
  /** Short label shown as the domain link text. */
  domain?: string
  role: Text
  description?: Text
  highlights?: Text[]
  stack: string[]
  href?: string
  repo?: string
}

/** Order and wording follow the CV. */
export const projects: Project[] = [
  {
    title: { en: 'wendyfan.com — Interactive 3D Portfolio', de: 'wendyfan.com — Interaktives 3D-Portfolio', zh: 'wendyfan.com — 交互式 3D 作品集' },
    domain: 'wendyfan.com',
    role: { en: 'Designed and built solo', de: 'Eigenständig gestaltet und entwickelt', zh: '独立设计与开发' },
    highlights: [
      {
        en: 'Designed and built a solar-system portfolio where visitors explore four planets (Engineering, Creative, Journey, Future) through animated camera transitions; fully trilingual (German, English, Chinese).',
        de: 'Portfolio als Sonnensystem: Besucher erkunden vier Planeten (Engineering, Creative, Journey, Future) mit animierten Kamerafahrten; vollständig dreisprachig (Deutsch, Englisch, Chinesisch).',
        zh: '设计并开发了一个太阳系作品集，访客通过动画镜头切换探索四颗星球（工程、创意、旅程、未来）；完整支持德、英、中三种语言。',
      },
      {
        en: 'React, TypeScript, Vite, Three.js / React Three Fiber, GSAP and Framer Motion; procedurally generated planet textures with no external 3D assets.',
        de: 'React, TypeScript, Vite, Three.js / React Three Fiber, GSAP und Framer Motion; prozedural erzeugte Planetentexturen ohne externe 3D-Assets.',
        zh: '使用 React、TypeScript、Vite、Three.js / React Three Fiber、GSAP 和 Framer Motion；星球纹理全部程序化生成，不依赖外部 3D 素材。',
      },
      {
        en: 'First load about 95 KB gzipped with the 3D scene lazy-loaded; lighter rendering on phones, keyboard navigation, reduced-motion support and a non-WebGL fallback.',
        de: 'Erstes Laden ca. 95 KB (gzip), 3D-Szene per Lazy Loading; optimiert für Smartphones, per Tastatur bedienbar, Fallback ohne WebGL.',
        zh: '首次加载约 95 KB（gzip），3D 场景懒加载；手机端轻量渲染，支持键盘导航、减少动态效果设置，以及无 WebGL 时的降级方案。',
      },
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Three.js', 'React Three Fiber', 'GSAP', 'Framer Motion'],
  },
  {
    title: { en: 'RERI — E-Commerce Platform', de: 'RERI — E-Commerce-Plattform', zh: 'RERI — 电商平台' },
    domain: 'rerisnap.com',
    role: { en: 'Built and run independently', de: 'Eigenständig entwickelt und betrieben', zh: '独立开发并运营' },
    highlights: [
      {
        en: 'Live shop in English, German and French: catalogue, customer accounts, order management, admin dashboard.',
        de: 'Online-Shop auf Deutsch, Englisch und Französisch: Katalog, Kundenkonten, Bestellungen, Admin-Dashboard.',
        zh: '已上线的英、德、法三语在线商店：商品目录、客户账户、订单管理、后台管理面板。',
      },
      {
        en: 'React + TypeScript; REST API on Cloudflare Workers + Hono; SQLite (D1); hosted on Cloudflare Pages.',
        de: 'React und TypeScript; REST-API mit Cloudflare Workers und Hono; SQLite (D1); Hosting auf Cloudflare Pages.',
        zh: 'React + TypeScript；基于 Cloudflare Workers + Hono 的 REST API；SQLite（D1）；部署在 Cloudflare Pages。',
      },
    ],
    stack: ['React', 'TypeScript', 'Cloudflare Workers', 'Hono', 'SQLite (D1)', 'Cloudflare Pages'],
    href: 'https://rerisnap.com/',
  },
]

/**
 * Future planet. Every item carries an explicit status so visitors can tell
 * what is being explored, what is being learned, and what is only planned.
 * Nothing here is presented as finished or shipped.
 */
export type FutureStatus = 'exploring' | 'learning' | 'planned'

export interface FutureItem {
  title: Text
  text: Text
  status?: FutureStatus
  tags?: Text[]
}

export const exploring: FutureItem[] = [
  {
    title: { en: 'Physical AI & Embodied Intelligence', de: 'Physical AI & verkörperte Intelligenz', zh: '物理 AI 与具身智能' },
    text: {
      en: 'Exploring Physical AI and embodied intelligence by bringing AI into the physical world. I’m interested in building intelligent interactive systems that connect AI models, software, sensors, and hardware, starting with the MicroDuck project.',
      de: 'Ich beschäftige mich mit Physical AI und verkörperter Intelligenz – damit, KI in die physische Welt zu bringen. Mich interessieren intelligente, interaktive Systeme, die KI-Modelle, Software, Sensoren und Hardware verbinden – angefangen mit dem Projekt MicroDuck.',
      zh: '探索物理 AI 与具身智能，把 AI 带入真实的物理世界。我希望构建连接 AI 模型、软件、传感器与硬件的智能交互系统，并从 MicroDuck 项目开始。',
    },
    status: 'exploring',
    tags: [
      { en: 'Physical AI', de: 'Physical AI', zh: '物理 AI' },
      { en: 'Embodied AI', de: 'Embodied AI', zh: '具身智能' },
      { en: 'Robotics', de: 'Robotik', zh: '机器人' },
      { en: 'Edge AI', de: 'Edge AI', zh: '边缘 AI' },
      { en: 'Human-Robot Interaction', de: 'Mensch-Roboter-Interaktion', zh: '人机交互' },
    ],
  },
  {
    title: { en: 'Edge & serverless', de: 'Edge & Serverless', zh: '边缘计算与 Serverless' },
    text: {
      en: 'Building on Cloudflare Workers, Hono and D1 — the stack behind RERI.',
      de: 'Entwicklung mit Cloudflare Workers, Hono und D1 – der Stack hinter RERI.',
      zh: '基于 Cloudflare Workers、Hono 和 D1 进行开发——RERI 背后的技术栈。',
    },
  },
  {
    title: { en: 'Creative coding', de: 'Creative Coding', zh: '创意编程' },
    text: {
      en: 'Using 3D and the web as a canvas — this site is one of those experiments.',
      de: 'Das Web und 3D als Leinwand – diese Website ist eines dieser Experimente.',
      zh: '把 3D 和 Web 当作画布——这个网站就是其中一个实验。',
    },
  },
]

export const currentlyLearning: FutureItem = {
  title: { en: 'Rust, Robotics & Embedded Systems', de: 'Rust, Robotik & Embedded Systems', zh: 'Rust、机器人与嵌入式系统' },
  text: {
    en: 'Exploring Rust, robotics, and embedded systems to better understand how software interacts with hardware, sensors, and physical devices.',
    de: 'Ich lerne Rust, Robotik und Embedded Systems, um besser zu verstehen, wie Software mit Hardware, Sensoren und physischen Geräten zusammenspielt.',
    zh: '学习 Rust、机器人与嵌入式系统，更好地理解软件如何与硬件、传感器和物理设备交互。',
  },
  status: 'learning',
  tags: ['Rust', { en: 'Robotics', de: 'Robotik', zh: '机器人' }, { en: 'Embedded systems', de: 'Embedded Systems', zh: '嵌入式系统' }],
}

export interface PlannedProject extends FutureItem {
  focus: L[]
  stage: L
  note: L
}

export const nextProject: PlannedProject = {
  title: {
    en: 'MicroDuck — An Open-Source Physical AI Experiment',
    de: 'MicroDuck — ein Open-Source-Experiment zu Physical AI',
    zh: 'MicroDuck — 一个开源的物理 AI 实验',
  },
  text: {
    en: 'A personal exploration of Physical AI through the MicroDuck project. The goal is to understand how software, AI models, and hardware can work together to create an interactive intelligent companion.',
    de: 'Eine persönliche Erkundung von Physical AI mit dem Projekt MicroDuck. Ziel ist es zu verstehen, wie Software, KI-Modelle und Hardware zusammenwirken können, um einen interaktiven, intelligenten Begleiter zu schaffen.',
    zh: '通过 MicroDuck 项目对物理 AI 的一次个人探索。目标是理解软件、AI 模型与硬件如何协同工作，打造一个可交互的智能伙伴。',
  },
  status: 'planned',
  focus: [
    { en: 'Software foundation', de: 'Software-Grundlage', zh: '软件基础' },
    { en: 'Local AI inference', de: 'Lokale KI-Inferenz', zh: '本地 AI 推理' },
    { en: 'Hardware integration', de: 'Hardware-Integration', zh: '硬件集成' },
    { en: 'Intelligent interactions', de: 'Intelligente Interaktionen', zh: '智能交互' },
  ],
  stage: { en: 'In exploration', de: 'In Erkundung', zh: '探索中' },
  note: {
    en: 'A planned personal experiment, not a finished product. The focus areas above are goals, not shipped features.',
    de: 'Ein geplantes persönliches Experiment, kein fertiges Produkt. Die Schwerpunkte oben sind Ziele, keine fertigen Features.',
    zh: '这是一个计划中的个人实验，并非成品。以上重点是目标，而非已实现的功能。',
  },
}
