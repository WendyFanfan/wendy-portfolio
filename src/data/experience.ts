import type { L, Text } from '../i18n/locales'

/**
 * Career + education data (DE / EN / ZH), kept strictly in line with
 * public/cv/Jiayi-Fan-CV.pdf (EN) and public/cv/Jiayi-Fan-Lebenslauf.pdf (DE).
 * Never invent roles, dates or achievements.
 */
export interface Achievement {
  value: Text
  label: Text
}

export interface ExperienceItem {
  role: Text
  company: Text
  period: Text
  location?: Text
  /** One-line company context, shown in italics under the role. */
  context?: Text
  highlights: Text[]
  achievements?: Achievement[]
  stack: string[]
}

export interface EducationItem {
  degree: Text
  school: Text
  location?: Text
  period: Text
  note?: Text
  coursework?: Text
}

export interface TimelineItem {
  period: Text
  title: Text
  text: Text
}

export interface LanguageSkill {
  name: L
  level: L
  /** CEFR position 1–6 (A1…C2); 7 = native. */
  cefr: number
}

/**
 * Dates follow each CV: EN "Feb 2023" (CV), DE "02/2023" (Lebenslauf), ZH "2023年2月".
 */
const chengdu: L = { en: 'Chengdu, China', de: 'Chengdu, China', zh: '中国成都' }

export const experience: ExperienceItem[] = [
  {
    role: { en: 'Software Engineer (Frontend)', de: 'Softwareentwicklerin (Frontend)', zh: '软件工程师（前端）' },
    company: 'TI Cloud Inc.',
    period: { en: 'Feb 2023 – May 2025', de: '02/2023 – 05/2025', zh: '2023年2月 – 2025年5月' },
    location: chengdu,
    context: {
      en: 'SaaS provider of AI-agent and contact-centre software; LiveChat and ticketing products used daily by business customers.',
      de: 'SaaS-Anbieter für KI-Agenten- und Contact-Center-Software (LiveChat, Ticketing) für Geschäftskunden.',
      zh: 'AI 智能体与联络中心软件的 SaaS 提供商；其 LiveChat 与工单产品每天被企业客户使用。',
    },
    highlights: [
      {
        en: 'Developed and maintained LiveChat and ticketing features (Angular, Vue) used by customer-service agents, from requirements to release in two-week Scrum sprints.',
        de: 'Entwicklung und Pflege von LiveChat- und Ticketing-Funktionen (Angular, Vue) für Kundenservice-Teams – von der Anforderung bis zum Release in zweiwöchigen Scrum-Sprints.',
        zh: '开发并维护客服人员日常使用的 LiveChat 与工单功能（Angular、Vue），在两周一迭代的 Scrum 中完成从需求到发布的全过程。',
      },
      {
        en: 'Diagnosed and resolved production issues through log analysis and debugging, following each case through to closure with backend, QA and support teams.',
        de: 'Analyse und Behebung von Produktionsfehlern per Log-Analyse und Debugging, mit Nachverfolgung bis zum Abschluss gemeinsam mit Backend, QA und Support.',
        zh: '通过日志分析与调试定位并解决线上问题，并与后端、QA 和支持团队协作，跟进每个问题直至关闭。',
      },
      {
        en: 'Built backend services with NestJS for API handling and system integration; supported deployment and configuration in Linux environments.',
        de: 'Entwicklung von Backend-Services mit NestJS für API-Anbindung und Systemintegration; Unterstützung bei Deployment und Konfiguration in Linux-Umgebungen.',
        zh: '使用 NestJS 开发后端服务，负责 API 处理与系统集成；协助在 Linux 环境中进行部署与配置。',
      },
    ],
    // The three measurable bullets from the CV, shown as tiles.
    achievements: [
      {
        value: { en: '20–35%', de: '20–35 %', zh: '20–35%' },
        label: {
          en: 'Frontend performance improved through profiling, component optimisation and lazy loading',
          de: 'Frontend-Performance verbessert durch Profiling, Komponentenoptimierung und Lazy Loading',
          zh: '前端性能提升：通过性能分析、组件优化与懒加载实现',
        },
      },
      {
        value: { en: '~40%', de: 'ca. 40 %', zh: '约 40%' },
        label: {
          en: 'Faster feature development after building the internal UI component library and team code standards (ESLint, Prettier, GitLab CI/CD)',
          de: 'schnellere Feature-Entwicklung durch Aufbau der internen UI-Komponentenbibliothek und Code-Standards (ESLint, Prettier, GitLab CI/CD)',
          zh: '功能开发提速：搭建内部 UI 组件库与团队代码规范（ESLint、Prettier、GitLab CI/CD）',
        },
      },
      {
        value: { en: '3\u00a0wk → <1\u00a0wk', de: '3\u00a0Wo. → <1\u00a0Wo.', zh: '3周 → <1周' },
        label: {
          en: 'New-colleague ramp-up, cut by the component documentation and onboarding guide I wrote',
          de: 'Einarbeitungszeit neuer Kolleginnen und Kollegen – verkürzt durch Komponentendokumentation und Onboarding-Leitfaden',
          zh: '新同事上手时间：因我编写的组件文档与入职指南而缩短',
        },
      },
    ],
    stack: ['Angular', 'Vue', 'NestJS', 'Linux', 'GitLab CI/CD', 'ESLint', 'Prettier', 'Scrum'],
  },
  {
    role: { en: 'Frontend Developer, Intern', de: 'Praktikantin Frontend-Entwicklung', zh: '前端开发实习生' },
    company: 'TI Cloud Inc.',
    period: { en: 'Jun 2022 – Jan 2023', de: '06/2022 – 01/2023', zh: '2022年6月 – 2023年1月' },
    location: chengdu,
    highlights: [
      {
        en: 'Built UI components, fixed defects in the LiveChat and ticketing systems and supported internal users with environment setup.',
        de: 'UI-Komponenten und Fehlerbehebung in LiveChat- und Ticketing-Systemen; Unterstützung interner Nutzer bei der Einrichtung.',
        zh: '开发 UI 组件，修复 LiveChat 与工单系统中的缺陷，并协助内部用户完成环境配置。',
      },
    ],
    stack: [],
  },
]

export const skills: { group: Text; items: Text[] }[] = [
  {
    group: { en: 'Technical', de: 'IT', zh: '技术' },
    items: [
      'Angular', 'Vue', 'React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Three.js', 'GSAP',
      'NestJS', 'Hono', 'REST APIs', 'SQL / SQLite', 'Linux', 'GitLab CI/CD', 'Git',
    ],
  },
  {
    group: { en: 'Support & operations', de: 'Support & Operations', zh: '支持与运维' },
    items: [
      { en: 'Troubleshooting and root-cause analysis', de: 'Fehleranalyse', zh: '故障排查与根因分析' },
      { en: 'Ticketing and LiveChat systems', de: 'Ticketing- und LiveChat-Systeme', zh: '工单与 LiveChat 系统' },
      { en: 'Issue follow-up', de: 'Nachverfolgung von Anfragen', zh: '问题跟进' },
      { en: 'Technical documentation', de: 'Technische Dokumentation', zh: '技术文档' },
      { en: 'User guidance', de: 'Anwenderbetreuung', zh: '用户指导' },
    ],
  },
  {
    group: { en: 'Collaboration', de: 'Zusammenarbeit', zh: '协作' },
    items: [
      'Agile / Scrum',
      { en: 'Cross-team work with product, QA and support', de: 'Abstimmung mit Produkt, QA und Support', zh: '与产品、QA 和支持团队跨团队协作' },
      { en: 'Plain-language explanations', de: 'Erklärung technischer Themen', zh: '用通俗语言解释技术' },
    ],
  },
  {
    group: { en: 'Creative', de: 'Kreatives', zh: '创意' },
    items: [
      { en: 'Photography', de: 'Fotografie', zh: '摄影' },
      { en: 'Photo editing', de: 'Bildbearbeitung', zh: '照片后期' },
      { en: 'Oil painting', de: 'Ölmalerei', zh: '油画' },
      { en: 'Visual design sense for UI and product content', de: 'Gespür für visuelles Design', zh: '对 UI 与产品内容的视觉设计感' },
    ],
  },
]

export const languageSkills: LanguageSkill[] = [
  { name: { en: 'Chinese', de: 'Chinesisch', zh: '中文' }, level: { en: 'Native', de: 'Muttersprache', zh: '母语' }, cefr: 7 },
  {
    name: { en: 'English', de: 'Englisch', zh: '英语' },
    level: { en: 'C1 · working language', de: 'C1 · Arbeitssprache', zh: 'C1 · 工作语言' },
    cefr: 5,
  },
  {
    name: { en: 'German', de: 'Deutsch', zh: '德语' },
    level: { en: 'B1 · actively improving', de: 'B1 · in Weiterbildung', zh: 'B1 · 持续提升中' },
    cefr: 3,
  },
]

export const education: EducationItem[] = [
  {
    degree: { en: 'B.Sc. Software Engineering', de: 'B.Sc. Software Engineering', zh: '软件工程 学士' },
    school: { en: 'Southwest Petroleum University', de: 'Southwest Petroleum University', zh: '西南石油大学' },
    location: chengdu,
    period: { en: 'Aug 2019 – Jun 2023', de: '08/2019 – 06/2023', zh: '2019年8月 – 2023年6月' },
    note: { en: 'GPA 3.2 / 4.0', de: 'Note (GPA) 3,2 / 4,0', zh: 'GPA 3.2 / 4.0' },
    coursework: {
      en: 'Web Development, Design Patterns, Operating Systems, Networks · Apostilled translation available',
      de: 'Webentwicklung, Entwurfsmuster, Betriebssysteme, Rechnernetze · Übersetzung mit Apostille',
      zh: 'Web 开发、设计模式、操作系统、计算机网络 · 可提供海牙认证（Apostille）翻译件',
    },
  },
]

export const timeline: TimelineItem[] = [
  {
    period: { en: 'Aug 2019', de: '08/2019', zh: '2019年8月' },
    title: { en: 'Software Engineering in Chengdu', de: 'Software Engineering in Chengdu', zh: '在成都学习软件工程' },
    text: {
      en: 'Started a B.Sc. in Software Engineering at Southwest Petroleum University.',
      de: 'Beginn des B.Sc. Software Engineering an der Southwest Petroleum University.',
      zh: '进入西南石油大学攻读软件工程学士学位。',
    },
  },
  {
    period: { en: 'Jun 2022', de: '06/2022', zh: '2022年6月' },
    title: { en: 'Frontend intern at TI Cloud', de: 'Praktikantin Frontend-Entwicklung bei TI Cloud', zh: 'TI Cloud 前端实习' },
    text: {
      en: 'Joined TI Cloud in Chengdu as a frontend developer intern.',
      de: 'Einstieg bei TI Cloud in Chengdu als Praktikantin in der Frontend-Entwicklung.',
      zh: '在成都加入 TI Cloud，担任前端开发实习生。',
    },
  },
  {
    period: { en: 'Feb 2023', de: '02/2023', zh: '2023年2月' },
    title: { en: 'Software Engineer (Frontend) at TI Cloud', de: 'Softwareentwicklerin (Frontend) bei TI Cloud', zh: '转正为 TI Cloud 软件工程师（前端）' },
    text: {
      en: 'LiveChat and ticketing features in Angular and Vue, production troubleshooting, and NestJS backend services.',
      de: 'LiveChat- und Ticketing-Funktionen mit Angular und Vue, Analyse von Produktionsfehlern und Backend-Services mit NestJS.',
      zh: '负责 Angular 与 Vue 的 LiveChat 和工单功能、线上问题排查，以及 NestJS 后端服务。',
    },
  },
  {
    period: { en: 'Independent project', de: 'Eigenes Projekt', zh: '独立项目' },
    title: { en: 'RERI', de: 'RERI', zh: 'RERI' },
    text: {
      en: 'Built and run independently: a live shop in English, German and French on Cloudflare.',
      de: 'Eigenständig entwickelt und betrieben: ein Online-Shop auf Deutsch, Englisch und Französisch auf Cloudflare.',
      zh: '独立开发并运营：一个支持英、德、法三语、部署在 Cloudflare 上的在线商店。',
    },
  },
  {
    period: { en: 'May 2025 – now', de: 'seit 05/2025', zh: '2025年5月 – 至今' },
    title: { en: 'Relocated to Germany', de: 'Umzug nach Deutschland', zh: '移居德国' },
    text: {
      en: 'Now based in Dresden — building software, taking photographs and painting.',
      de: 'Heute lebe ich in Dresden – ich entwickle Software, fotografiere und male.',
      zh: '现在生活在德累斯顿——写代码、拍照、画画。',
    },
  },
]
