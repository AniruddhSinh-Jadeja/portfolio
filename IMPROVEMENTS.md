# Portfolio Improvement Roadmap

**Current rating: 84 / 100** — strong senior portfolio with room to tighten.
Last audited: 2026-05-18.

This document captures the rating breakdown and a prioritised change menu so we
can pick up where we left off in any session. Strike items off as we ship them.

---

## Scorecard

| # | Category | Score | Notes |
|---|---|---|---|
| 1 | First impression (hero) | 8.5/10 | Real photo, gradient name, visible Jadeja, stats clear, CTAs above the fold |
| 2 | Typography | 9/10 | Space Grotesk / IBM Plex Sans / JetBrains Mono trio, tuned letter-spacing per weight |
| 3 | Color & palette | 9/10 | Disciplined cyan→indigo→purple over dark slate, consistent across hero, code window, scrollbar, logo |
| 4 | Layout & composition | 8/10 | Hero grid `minmax(0,1fr) 480px` solid. Bento section good. Stats row competes with hero buttons slightly |
| 5 | Custom logo / branding | 9/10 | AJ hex monogram with animated stroke-draw, gradient stroke, role tag. Favicon matches |
| 6 | Animation & interaction | 8.5/10 | 115 keyframes/animations. Lerp mouse, magnetic buttons, 3D tilt, glitch hover, word-split reveal, film grain |
| 7 | Custom scrollbar | 9.5/10 | Gradient thumb, hidden arrows, Firefox `scrollbar-color` fallback |
| 8 | Photo treatment (final) | 7.5/10 | Natural colors, soft halo aura. Took several iterations to land here |
| 9 | About section | 8/10 | Section-kicker `01`, italic accent on "systems", animated gradient on "scale.", code window with conic glow |
| 10 | Projects / experience / contact | 7.5/10 | Bento cards, filters, timeline — needs review pass |
| 11 | SEO | 10/10 | Full meta + Open Graph + Twitter card + schema.org Person & WebSite JSON-LD + sitemap + robots |
| 12 | Accessibility | 7.5/10 | aria-labels, role=img, alt text, prefers-reduced-motion. Contrast audit + small-viewport scaling pending |
| 13 | Performance | 7/10 | Preconnect on fonts, no Tailwind CDN. 3.5k CSS lines + always-on canvas + film grain need attention |
| 14 | Responsive | 7/10 | Media queries for hero portrait + mobile menu. 320 / 375 / 768 viewport validation pending |
| 15 | Code quality | 7.5/10 | Modular section loading, init function organisation, custom properties. Duplicate selectors + legacy CSS to clean |

**Weighted total: 84/100**

---

## Tier 1 — Quick wins (~3 hrs, lowest risk)

Targets: **84 → 92**.

- [ ] **CSS cleanup pass** — merge duplicate `.hero-last`, `.hero-name`, `.hero-first` rules; delete dead switcher / variant CSS; consolidate the two `.hero-name` definitions. _(1h)_
- [ ] **Footer** — page ends abruptly. Add AJ logo + tagline + key links + © line. _(30m)_
- [ ] **Mobile pass at 375px** — DevTools mobile preview across hero / about / projects / contact; fix overflow & stacking. _(1h)_
- [ ] **Image lazy-load + WebP** — `loading="lazy"` on project thumbs; convert `me-cutout.png` to WebP (-60% bytes). _(30m)_

## Tier 2 — Credibility builders (1–2 days)

Targets: convert visitors to leads.

- [ ] **Real case studies** — pick 2–3 strongest projects, write deep-dive page each: Problem · Architecture diagram · Stack · My role · Metrics. _(1d)_
- [ ] **Engineering blog section** — even 2 posts ("Why Lumen over Laravel for X", "Migrating 50M rows zero-downtime"). _(1d)_
- [ ] **Testimonials/quotes** — 2–3 quotes from peers/managers/clients with photo + title (LinkedIn recs work). _(2h)_
- [ ] **Loading splash with logo pulse** — turn existing 0.8s fade into a branded moment. _(1h)_

## Tier 3 — Transformative (3+ days, awwwards-tier)

Targets: shareable, memorable, top 1% of dev portfolios.

- [ ] **Interactive terminal hero** — `~/aniruddhsinh $` accepts commands (`help`, `about`, `projects`, `cv`, `contact`, easter eggs like `sudo hire-me`). _(2d)_
- [ ] **3D / WebGL accent** — one tasteful Three.js element (rotating geometry, scroll-reactive particles), light not heavy. _(2d)_
- [ ] **Animated architecture diagrams** in case studies — SVG diagrams that draw themselves on scroll. _(1d)_
- [ ] **Performance budget** — minify CSS/JS, defer non-critical animations, `content-visibility: auto`, inline critical CSS. _(1d)_
- [ ] **Light mode** — proper colour token swap, separate gradient stops, both modes tested. _(1d)_
- [ ] **i18n / language toggle** — English + Hindi or Gujarati. _(1d)_

## Code-quality / technical debt (background)

Pick when bored:

- [ ] Move inline `style="..."` in `index.html` and `hero.html` into CSS classes
- [ ] JSDoc comments on each init function in `script.js`
- [ ] Prettier + ESLint config and format pass
- [ ] Extract magic numbers (sizes, durations) into CSS custom properties
- [ ] `package.json` script for local dev server (skip XAMPP for new contributors)
- [ ] GitHub Actions workflow that runs Lighthouse on every PR
- [ ] `lang` attributes on non-English content once i18n lands
- [ ] Static-site build that pre-renders sections (the new `build.js` is a start)

---

## What NOT to change

These are working well — leaving them alone:

- The cyan → indigo → purple palette (disciplined and signature)
- The custom AJ hex logo (use it as the mark everywhere)
- The dark-theme commitment (don't add a half-baked light mode)
- The JetBrains Mono terminal prompt + typing animation (rare personality)
- The custom scrollbar (small but signals craft)
- The natural-colour hero portrait (atmosphere around, not painted on)

---

## Lessons from previous iterations

- **Heavy photo treatments backfire** for senior-leader portfolios. The duotone "hologram" attempt was rejected. Default to less effect, not more.
- **Accumulated dead CSS / HTML** caused the empty-pill and Jadeja-invisibility bugs. A periodic cleanup sprint is mandatory, not optional.
- **Auto-committing batches** is not welcome — commits only happen on explicit "commit it" / "push" instructions.

---

## Quick command reference

```bash
# Local preview (requires XAMPP because sections are fetch-loaded)
# Open http://localhost/portfolio/

# Pre-render for production SEO (inlines sections into index.html)
npm run build

# Deploy (push to main; GitHub Pages auto-deploys)
git push origin main
```

---

_Update this doc whenever scores change or items ship. Keep it short, keep it
honest — it's a working document, not marketing material._
