# To-do — wendyfan.com

Last updated: 2026-11-15

Legend: 🔴 important · 🟡 recommended · 🟢 optional
When an item is done, tick it and move it to **Done** at the bottom.

---

## 1. Deployment

- [ ] 🟡 Check the preview card with LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/) (enter `wendyfan.com`). This refreshes LinkedIn's cache **before** adding the site to *Featured*.

## 2. Legal & privacy (Germany)

- [ ] 🔴 **Postal address for the Impressum**
  - Decide: home address, or a paid "Impressum-Adresse" service (a few € per month) so your home address isn't public.
  - Fill in `street` and `city` in `src/data/legal.ts` → `legalContact`.
  - Then set `legalPublished = true` in the same file. This shows the "Imprint · Privacy" links on every page.
- [ ] 🟡 Accept Netlify's **Data Processing Agreement (DPA)** in the Netlify account settings.
- [ ] 🟢 Have the legal texts checked (lawyer or a service such as eRecht24).
- [ ] 🟢 Whenever analytics, embeds or anything else that processes visitor data is added, update the privacy policy in `src/data/legal.ts`.

## 3. Content

- [ ] 🟢 **More photographs**: put originals in `content/photography/`, run `npm run images`, add entries in `src/data/photography.ts`. Landscape / everyday categories appear automatically once they have photos.
- [ ] 🟢 Optional titles for the place-labelled photos; year for the Snapshots set (currently labelled by place).
- [ ] 🟢 Painting medium (oil / acrylic / gouache …) and sizes, if you want them on the labels → `src/data/paintings.ts`.
- [ ] 🟢 Re-photograph a few paintings straight-on in daylight (lavender field, blossom house, the two pencil sketches look slightly tilted or dim).
- [ ] 🟡 **Decide the homepage role line**. The site says "Software Engineer · Creative Technologist"; the CV says "Software Engineer · Technical Support & Operations".
- [ ] 🟡 **Decide whether to show work authorisation**. The CV now says "Residence permit with unrestricted work authorisation"; the site currently doesn't mention it.
- [ ] 🟡 Have a native speaker read all German text (`src/i18n/ui.ts`, `src/data/*.ts`).
- [ ] 🟢 Back up the original artwork files in `content/` somewhere else. They are not in git.

## 4. Account & repository security

- [ ] 🔴 Turn on **two-factor authentication** for GitHub and Netlify.
- [ ] 🟡 Netlify → Build & deploy → Branches and deploy contexts:
  - Production branch: `main`
  - Branch deploys: only the production branch
  - Deploy Previews: don't deploy pull requests
- [ ] 🟡 GitHub → Settings → Branches → ruleset for `main`: block force pushes, restrict deletions.
- [ ] 🟡 GitHub → Settings → Actions → General: require approval for workflows from external contributors.
- [ ] 🟢 Decide which email the commits show (currently `jiayifan076@gmail.com`; the CV uses `jiayifan.dev@gmail.com`).

## 5. Showcase / job search

- [ ] 🔴 **LinkedIn**: add `https://wendyfan.com` in four places:
  - *Contact info → Website* (type: Portfolio)
  - *Featured → Add a link* (after the Post Inspector check in 1.)
  - *Projects* ("wendyfan.com — Interactive 3D Portfolio", with the URL)
  - last line of *About*: `Portfolio: wendyfan.com`
  - Then post it with a short screen recording. Check the result via *Resources → View as public*.
- [ ] 🟡 **XING**: add the website to the profile portfolio.
- [ ] 🟡 **GitHub**: pin the repo, add a description, the website link and topics (`threejs`, `react-three-fiber`, `portfolio`, `i18n`); create a profile README (`WendyFanfan/WendyFanfan`).
- [ ] 🟡 Add `wendyfan.com` to the email signature and to job-platform profiles (StepStone, Indeed, Arbeitsagentur).
- [ ] 🟢 Write an article about building the site (dev.to / Medium / 掘金).
- [ ] 🟢 Share it in the Three.js forum showcase, r/threejs, R3F Discord.
- [ ] 🟢 Submit to design galleries (Awwwards, CSS Design Awards, Godly, Siteinspire).

## 6. Maintenance

- [ ] 🟡 Turn on **Dependabot** for dependency updates.
- [ ] 🟡 Polish the repo README with screenshots and project highlights.
- [ ] 🟢 Visitor statistics: only with a cookie-free tool (Plausible / Netlify Analytics), and update the privacy policy at the same time.
- [ ] 🟢 Whenever the job, projects or artwork change, update the website, CV and LinkedIn together.

---

## Done

- [x] 2026-11-15 — Pushed & deployed: 32 paintings, 99 photos (Budapest, Moritzburg, Saxon Switzerland, Dresden Old Town, Chengdu, around Munich, Snapshots), place filter, new painting wall
- [x] 2026-11-15 — 15 everyday snapshots (cats, swans, lake, sky, flowers) added under "Snapshots"
- [x] 2026-11-15 — 15 photos from around Munich (2025, Bavarian Alps) added with own place filter; removed Chengdu 07
- [x] 2026-11-15 — 25 Chengdu photos (2024: night views, Jinli after rain, Chunxi Road) added with own place filter
- [x] 2026-11-15 — Years added: Saxon Switzerland autumn 2025, Dresden Old Town February 2026
- [x] 2026-11-15 — 16 Dresden Old Town (overcast) photos added with own place filter; one duplicate skipped
- [x] 2026-11-15 — 9 Saxon Switzerland autumn photos added (category: landscape, own place filter)
- [x] 2026-11-15 — Place filter for photos (All places · Budapest · Moritzburg); new places: add a key to `photoPlaces` in `src/data/photography.ts`
- [x] 2026-11-15 — 15 Budapest + 4 Moritzburg photos (2026) added; labelled by place; empty categories hidden
- [x] 2026-11-15 — Re-shot "雪山湖景" (2025) added → 32 paintings
- [x] 2026-11-15 — Titles (EN/DE/ZH) and years added to all 31 paintings
- [x] 2026-11-15 — Painting wall: tidy 3-column grid, landscape works span two columns (no stagger)
- [x] 2026-11-15 — 15 paintings added to /creativity; one removed (not mine), dark mountain-lake photo removed, 18 more added → 31 (cropped, rotated, WebP, metadata stripped); empty photo section hidden until real photos exist
- [x] 2026-11-15 — Pushed and deployed: self-hosted fonts + link preview image + hidden legal pages (commit `368ad10`)
- [x] 2026-11-15 — Self-hosted fonts (no Google Fonts requests); 1.7 KB subset font for 范佳怡
- [x] 2026-11-15 — Link preview image `public/og-image.jpg` + Open Graph / Twitter tags
- [x] 2026-11-15 — Impressum & privacy pages built (`/impressum`, `/datenschutz`); links hidden until the address is filled in
- [x] 2026-11-15 — Netlify "Powered by Netlify" badge turned off
- [x] 2026-11-15 — Custom domain wendyfan.com live on Netlify with HTTPS
- [x] 2026-11-14 — Netlify routing fix for `/creativity` (`netlify.toml`)
- [x] 2026-11-14 — Repo on GitHub: `WendyFanfan/wendy-portfolio`
