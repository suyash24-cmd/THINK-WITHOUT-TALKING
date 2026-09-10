<<<<<<< HEAD
# THINK WITHOUT TALKING

**DataForge 2026 — Pathway Track · Educational research lab: does AI assistance change how you reason, and does a model reason by refining a hidden state instead of generating a verbal chain of thought?**

> "AI can explain anything. Can it help you think?"

This repository is the complete submission package. It contains an interactive
web laboratory (`apps/web`) plus the experiment harness contract and reference
template for the toy model (`experiments`). The product has two movements:

1. **A human experiment you run on yourself (primary flow).** You solve five
   classic reasoning puzzles twice — unaided and with a curated AI assist — and
   the site aggregates your own results honestly (per-condition accuracy,
   time, calibration), without pretending you are a study population.
2. **A supporting model lab (evidence).** Cases A/B contrast verbal
   chain-of-thought against latent-state reasoning, and you can run the toy
   model yourself in the Lab.

## Live artifact

Deployed frontend: *see DEPLOYMENT.md* (public URL supplied at submission).

## What you can do here

1. **01 · The Problem** — the bat-and-ball teaser that primes the experiment.
2. **02 · The Hypothesis** — H_a: assistance helps reasoning; H_b: help short-circuits it.
3. **03 · Your Experiment** — the 5-task self-experiment (unaided vs AI-assisted, hint lifeline).
4. **04 · Your Results** — your own per-condition numbers: accuracy, time, calibration.
5. **05 · Case A · Models That Talk** — simplified chain-of-thought, step by step.
6. **06 · Case B · Models That Stay Silent** — recurrent latent-state refinement.
7. **07 · The Model Lab** — change reasoning budget, state dimension, difficulty, example; run the toy model.
8. **08 · What Changes** — live accuracy curves (steps → accuracy, difficulty, state capacity).
9. **09 · What Breaks** — real, observed failure modes: error accumulation and state-capacity bottlenecks.
10. **10 · From Latent States to BDH** — an honest bridge from the toy model to the BDH / BDH-CQ architecture, clearly labeled.
11. **11 · Research** — primary sources.
12. **12 · Reproduce** — how to regenerate every number, including the human experiment.
13. **13 · About** — AI-assistance disclosure, licenses, provenance.

## Evidence discipline

Every scientific claim is labeled with one of four source tags, rendered
throughout the UI as color-coded badges:

| Label | Color | Meaning |
| --- | --- | --- |
| PUBLISHED RESEARCH | blue | result from a cited paper, not run by us |
| OUR EXPERIMENT | amber | produced by our own harness or by you during the session |
| ILLUSTRATIVE | purple | simplified teaching explanation |
| HYPOTHESIS / INFERENCE | teal/red | connection we infer, explicitly labeled |

No experimental result is invented, and no citation points to a paper we could
not verify. BDH/BDH-CQ is described from the challenge materials as a
cited-and-explained architecture — the site never presents our toy model or the
1-person self-experiment as a published result.

## Repository layout

```
think-without-talking/
├── apps/
│   └── web/                  # Next.js 16 · TypeScript · Tailwind v4
│       ├── src/
│       │   ├── app/          # layout, page (one long laboratory), error boundary
│       │   ├── components/
│       │   │   ├── layout/   # Navigation, Footer
│       │   │   ├── sections/ # one component per section (01–13)
│       │   │   └── ui/       # ExperimentChart, SectionWrapper, SourceBadge, ComparisonBars, …
│       │   ├── data/         # typed experiment data + citations + human-experiment battery
│       │   └── lib/          # experiment engine, human-experiment engine, formatting helpers
│       ├── README.md         # web app run instructions (see apps/web/README.md)
│       └── ARCHITECTURE.md   # web app design (see root ARCHITECTURE.md)
├── experiments/              # ML harness contract + reference template
├── ARCHITECTURE.md           # system overview (this repo)
├── CONCEPT_SUMMARY.md        # one-page concept summary (submission item)
├── DEPLOYMENT.md             # how to deploy (Vercel or static)
├── FRONTEND_HANDOFF.md       # frontend architect's handoff notes
└── README.md                 # this file
```

## Getting started (frontend)

```bash
cd apps/web
npm install
npm run dev        # http://localhost:3000
```

## Verifying (frontend)

```bash
cd apps/web
npm run lint
npm run typecheck
npm run build
npm run start      # production smoke test
```

## Reproduction

- **Model experiment:** see [`experiments/README.md`](experiments/README.md).
  In the reference state the result files are still placeholders — regenerate
  them with the harness before submission, then adapt via
  `apps/web/src/data/experiments.ts`.
- **Human experiment:** by construction. Section 12 (Reproduce) documents the
  exact 5-task battery, hint contents, and awareness disclosures so any human
  can rerun the self-experiment in the browser — there is no hidden model.

## License

- Code for the web app: MIT (see LICENSE note at repo root).
- Experiment data: CC-BY 4.0.
- All cited works remain the property of their authors, referenced under fair
  academic citation. Full record: `About → Source & License` (section 13).

## AI assistance disclosure

This product was built by a five-agent autonomous AI team (roles: Senior
Product Engineer/Frontend Architect, ML Engineer, Research Scientist, Data
Scientist, Educational Designer) for DataForge 2026. The complete disclosure,
roles, and attribution live in section 13 of the product and in
`FRONTEND_HANDOFF.md`.
=======
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
>>>>>>> 630fb0000998cc55f266096ee0d01d97f64a1f73
