# Orbit — website

React 18 + TypeScript + Tailwind CSS v4 (CSS-first `@theme` config, no JS config file).

## Run
```bash
npm install
npm run dev      # http://localhost:5173 and http://localhost:5173/teams/
npm run build    # typechecks (tsc -b) then builds
```

## Pages
Two HTML entries (see `vite.config.ts`), so `/teams/` is a real file in `dist/` and works on any static host without rewrite rules.

| Path | Entry | Page |
| --- | --- | --- |
| `/` | `index.html` → `src/main.tsx` | `src/pages/Home.tsx`: Orbit for freelancers, with a door to Teams |
| `/teams/` | `teams/index.html` → `src/teams-main.tsx` | `src/pages/Teams.tsx`: Orbit Teams |

## Structure
- `src/config.ts` — the WhatsApp number, campaign links (`?src=indie|founder|agency`), `BOOK_CALL_URL` for Teams, and page paths. Change links here only.
- `src/components/site.tsx` — the shared building blocks: hero sheet and panel, WhatsApp bubbles (`data-ui` interface fragments), stages bar, pricing table, FAQ bands, closing action row, footer, and the scroll reveal hook.
- `src/index.css` — design tokens in `@theme` (colours, the five type steps, radius) and the motion (shutter, drift, reveals) with `prefers-reduced-motion` fallbacks.

## Notes
- Colours: paper ground, ink, orange for the action, forest / signal / blossom for tiles and statuses. WhatsApp's own greens are used only inside chat fragments.
- Fonts: Space Grotesk for headings, Inter for text, from Google Fonts.
- Teams has no self-serve billing yet, so every Teams CTA goes to `BOOK_CALL_URL`. It currently opens a WhatsApp chat with a written request; swap in a Cal.com or Calendly link when there is one.
- The follow-up demo on `/teams/` mirrors `orbit_teams/app/services/followups.py` (heads-up 24h before, follow-ups once overdue and 24h later, managers 24h after that, 09:00–18:30 only, muted people aren't chased). Keep them in step if the ladder changes.
