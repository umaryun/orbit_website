# Orbit — landing page

React 18 + TypeScript + Tailwind CSS v4 (CSS-first `@theme` config, no JS config file).

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typechecks (tsc -b) then builds
```

## Structure
- `src/ChromaLanding.tsx` — the whole page (typed subcomponents: Nav, Hero, Workflow, CtaFooter).
- `src/index.css` — `@import "tailwindcss"`, design tokens in `@theme`, and the `grain` / `label-mono` custom utilities.

## Notes
- Design tokens (`paper`, `ink`, `orange`, `forest`, `signal`, `blossom`) and fonts are defined once in `@theme`, then used as normal utilities (`bg-paper`, `text-orange`, `font-display`).
- Fonts load from Google Fonts (Space Grotesk / Space Mono / Inter). Swap the `@import` in `index.css` for self-hosted files if you prefer.
- Grain textures are inline SVG `feTurbulence` data-URIs blended over the shapes; `prefers-reduced-motion` is respected.
