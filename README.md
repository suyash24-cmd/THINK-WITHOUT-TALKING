# Think Without Talking — Web App

Interactive laboratory for DataForge 2026 · Pathway Track. See
[`../../README.md`](../../README.md) for the whole submission; this file covers
the Next.js app only.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## Verify

```bash
npm run lint    # eslint (strict)
npm run build   # production build
npm run start   # serve the build
```

## Structure

- `src/app/` — `layout.tsx`, `page.tsx` (single scrolling laboratory, sections 01–10), `globals.css` (design tokens).
- `src/components/sections/` — one component per numbered section.
- `src/components/ui/` — `SectionWrapper`, `SourceBadge`, `ExperimentChart` (SVG, no deps),
  `ReasoningSlider`, `GroundTruthCard`.
- `src/data/` — `types.ts` (canonical contracts), `experiments.ts` (results + placeholder simulator),
  `citations.ts` (primary sources).
- `src/lib/` — `experimentEngine.ts` (adapter + helpers).

## Data note

`experiments.ts` currently ships **placeholder simulation data** labeled
**OUR EXPERIMENT**. Real numbers replace it via the ML harness adapter
(single integration point) before final submission — see
[`../../experiments/README.md`](../../experiments/README.md) and
[`FRONTEND_HANDOFF.md`](../../FRONTEND_HANDOFF.md).

## License

MIT (see [`../../LICENSE`](../../LICENSE)).