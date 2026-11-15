# Wendy's Universe — wendyfan.com

Portfolio of **Jiayi Fan (范佳怡)**, known as **Wendy**.

An interactive solar-system portfolio. The sun is Wendy; four planets are Engineering, Creative, Journey and Future.

**Stack:** React 18 · TypeScript · Vite · Three.js · React Three Fiber · drei · GSAP · Framer Motion · Tailwind · Lucide

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build → dist/
npm run preview   # serve the build locally
```

## Updating content (no 3D knowledge needed)

Content comes from Jiayi Fan's CV (work experience, RERI, education, languages) and lives in `src/data/`. Anything in `[square brackets]` or with `placeholder: true` shows up on the site with a gold "to add" marker. Replace those values and the markers disappear.

| File | What it controls |
| --- | --- |
| `site.ts` | Email, LinkedIn, GitHub, location, CV link |
| `experience.ts` | Jobs, skills, education, journey timeline |
| `projects.ts` | Selected projects, plus the Future planet (Physical AI, current learning, MicroDuck) |
| `photography.ts` | Photographs and paintings |
| `planets.ts` | Planet names, subtitles, colours, orbit sizes and speeds |

- **CV:** `public/cv/Jiayi-Fan-CV.pdf` (English, also used for Chinese) and `public/cv/Jiayi-Fan-Lebenslauf.pdf` (German). Sources: `~/Desktop/seek job in de/简历/website/` (website versions, without phone or photo).
- **Photos:** put images in `public/photography/` (WebP or JPG, about 1600px on the long edge), then set `src: '/photography/name.jpg'` in `photography.ts`. Only add your own work.

## Creativity page (`/creativity`)

A separate gallery page for photography and oil paintings. You reach it by clicking the Creative planet (the camera flies to it, then a pink glow fades in), the "Creative" dock button, **Photography** in the menu, or the URL `/creativity`.

**Adding your work**

1. Put the original files in `content/photography/` or `content/paintings/` (JPG, PNG, WebP or TIFF).
2. Run `npm run images`. This creates WebP files at 480 / 960 / 1600 / 2400px in `public/images/…`, strips all metadata including GPS location, and updates `src/data/image-manifest.json`.
3. Add an entry to `src/data/photography.ts` or `src/data/paintings.ts` with `image: '<key>'`. The key is the file name in lowercase with dashes (`Dresden 01.jpg` → `dresden-01`). Fill in only what is true; a missing title shows as "Untitled".

The placeholder frames disappear from a collection as soon as it has one real entry. Originals in `content/` are git-ignored; the optimized files are committed.

**How it behaves**

- **Layout:** photos use a masonry layout that keeps each one's original proportions. Paintings hang on a cream wall with museum-style labels.
- **Loading:** grids load only the small sizes; full resolution loads only in the lightbox.
- **Lightbox:** ←/→ to move, Esc to close, swipe on phones, focus trap, and focus returns to the tile you opened.
- **Reduced motion:** visitors who prefer reduced motion skip the fly-in.

## Privacy, legal pages and fonts (Germany)

- **Fonts are self-hosted:** Fraunces, Manrope and Noto Sans/Serif SC are bundled via `@fontsource`, so the site sends no requests to Google Fonts. On every page, 范佳怡 uses a 1.7 KB subset (`public/fonts/wendy-name-sc.woff2`, SIL OFL). The full Chinese fonts load only when Chinese is selected, and only the slices the page needs.
- **Imprint and privacy policy:** `/impressum` and `/datenschutz`, with content in `src/data/legal.ts`. German is the binding text; EN/ZH are translations. **Fill in the postal address in `legalContact`.** Update the privacy policy whenever you add analytics, embeds or anything else that processes data. These texts are a template, not legal advice.
- **No cookies, no tracking.** The only browser storage is the language choice (`localStorage`).

## Link preview image

`public/og-image.jpg` (1200×630) is shown when the site is shared on LinkedIn, WhatsApp, WeChat and similar apps. The design is in `scripts/og/og-image.html` (it uses the site's own fonts). To change it, open that file in Chrome at 1200×630, take a screenshot and save it as `public/og-image.jpg`.

## Identity system

Every name comes from `src/data/identity.ts`. Never type a name directly into a component.

| Name | Used for |
| --- | --- |
| **Wendy** | Brand, homepage hero, the sun, friendly introductions |
| **Jiayi Fan** | CV files, professional experience, project credit, contact details, SEO (`<title>`, meta, JSON-LD `Person`) |
| **范佳怡** | Shown with the professional name as `Jiayi Fan · 范佳怡` or `Jiayi Fan (范佳怡)`, and used as the name in the Chinese About text |

Clicking the sun, choosing **About** in the menu, or opening `/#about` shows the personal introduction card.

## Languages (Deutsch · English · 中文)

- **First visit:** English by default. A `?lang=de|en|zh` link wins, then the visitor's saved choice. The browser language is deliberately ignored.
- **Switcher:** a small globe dropdown in the far top-right corner of every page (desktop and phone).
- **Interface text** lives in `src/i18n/ui.ts`. English defines the shape, and the German and Chinese dictionaries must match it, so a missing translation fails the build.
- **Content** in `src/data/` uses `{ en, de, zh }` objects. Plain strings such as `'React'` are shown as-is in every language.
- **CVs per language** are set by `cv` in `site.ts`. German visitors get `Jiayi-Fan-Lebenslauf.pdf`; English and Chinese visitors get `Jiayi-Fan-CV.pdf`.
- **Links for applications:** `wendyfan.com/?lang=de` for German, `?lang=en` for English, and you can add a section such as `?lang=de#engineering`.
- **Chinese fonts:** Noto Sans SC and Noto Serif SC load only when Chinese is selected.

## Deep links

`/#engineering`, `/#creative`, `/#journey`, `/#future`, `/#contact` open the matching panel directly. Use them in your CV or on LinkedIn. `/?2d` forces the lightweight non-WebGL version.

## Architecture

```
src/
  components/universe/   3D scene only (no portfolio copy)
    SolarSystem.tsx      Canvas, layout, orbital clock (lazy-loaded chunk)
    Sun.tsx              shader surface, additive halo, WENDY label
    Planet.tsx           procedural texture, rings/moon/atmosphere, hover/click
    Orbit.tsx, StarField.tsx
    CameraController.tsx GSAP-driven transitions that track moving planets live
    textures.ts          seeded CPU noise → canvas textures (no external assets)
    runtime.ts           per-frame shared state kept in refs (no React re-renders)
  components/ui/         HTML interface: navigation, panels, dock, loader, fallback
  data/                  all portfolio content
  pages/Home.tsx         view state (universe / planet / contact) + URL hash sync
```

## Performance and accessibility

- The first-load shell is about 95 KB gzipped. Three.js and the scene (about 255 KB gzipped) load lazily behind the loader.
- No post-processing and no external models or textures. Planet surfaces are generated once at start-up.
- Phones and low-power devices get fewer particles, lower-resolution textures, a lower DPR cap, no antialiasing and no parallax. Portrait screens use a taller orbit layout and a bottom-sheet panel.
- `prefers-reduced-motion`: orbits stop, transitions are near-instant, CSS animations are off.
- No WebGL, or the scene crashes: a CSS-only solar system with the same panels takes over.
- Everything works by keyboard: the nav, the planet dock buttons, Esc to close, and focus moves to "Back to Universe" when a panel opens.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel, choose **Add New → Project** and import the repo. The Vite preset is picked up from `vercel.json`.
3. Under **Settings → Domains**, add `wendyfan.com` and point DNS at Vercel.
