# Minimal Portfolio Template

A clean, editorial, full-width portfolio built with React, Vite, TypeScript, Tailwind v4 and Motion. Light by default, with a dark mode ready to go. Made to be forked and made your own in minutes.

## Features

- **Full-width editorial layout** — off-white paper, dot grid, near-black ink, a single accent color.
- **Sections included** — hero, selected work (sticky scroll), about (bento grid), contact.
- **Smooth scroll** — buttery page + anchor scrolling with [Lenis](https://lenis.dev) (respects reduced-motion).
- **Animated mobile menu** — a hamburger that morphs into an X, with a slide-down panel.
- **Photo carousel** — swipeable "off the clock" gallery with dots and 3s autoplay.
- **Playful details** — hover letter-swap on project titles, tooltips on the tool stack.
- **Copy-to-clipboard email**, brand social icons, and a résumé download button.
- **Fluid & responsive** — scales smoothly from mobile to desktop; dark-mode tokens included.
- **Motion built in** — subtle fade-ins on scroll via [Motion](https://motion.dev).

## Tech stack

React 19 · Vite · TypeScript · Tailwind CSS v4 (tokens in CSS, no config file) · Motion · Lenis · lucide-react

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Make it yours

All the content lives in a handful of files. No CMS, no database — just edit and go.

| What | Where |
| --- | --- |
| Your name (nav + logo) | `src/components/sections/Nav.tsx` |
| Hero intro & tagline | `src/components/sections/Hero.tsx` |
| Projects (name, description, image) | `src/components/sections/Work.tsx` |
| About: story, experience, photo, bubbles | `src/components/sections/About.tsx` |
| "Off the clock" carousel photos | `src/components/sections/About.tsx` + `public/assets/off/` |
| Contact: email & footer | `src/components/sections/Contact.tsx` |
| Social links (Instagram, LinkedIn, YouTube) | `src/lib/socials.ts` |
| Tool-stack icons | `src/lib/tools.ts` |
| Colors, fonts & spacing (design tokens) | `src/index.css` |
| Page title & meta description | `index.html` |

### Images

Drop your images in `public/assets/` and point to them from `Work.tsx` (project cards, 4:3 works best) and `About.tsx` (your portrait). For the "off the clock" carousel, add photos to `public/assets/off/` and list them in the `offClockPhotos` array in `About.tsx`. The template ships with lightweight SVG placeholders you can delete.

### Résumé

Add a `resume.pdf` file to the `public/` folder and the "Download résumé" button will just work. Don't want it? Remove the button in `Nav.tsx` and `Contact.tsx`.

### Colors

Every color is a token in `src/index.css` under `@theme`. Change `--color-lime` to swap the accent across the whole site; the rest of the palette follows the same pattern.

## Fonts

- **Switzer** (body) loads from the free [Fontshare](https://www.fontshare.com/fonts/switzer) CDN — no setup needed.
- **Advercase** (display) is self-hosted in `public/fonts/`. Check the font's license before using it commercially, or swap both fonts in `src/styles/fonts.css` + `src/index.css` for whatever pairing you like.

## Deploy

Works anywhere that serves a static build. The one-click path is [Vercel](https://vercel.com):

1. Push this repo to your GitHub.
2. Import it in Vercel — it auto-detects Vite (build `npm run build`, output `dist`).
3. Done. Every push deploys automatically.

## License

Do whatever you want with it. The code is yours — just double-check the font licenses above before shipping commercially.
