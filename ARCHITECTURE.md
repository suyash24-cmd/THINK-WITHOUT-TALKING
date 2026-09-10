# THINK WITHOUT TALKING — System Architecture

## Overview

Single-repo monorepo with two conceptual parts:

```
┌────────────────────────────┐     ┌───────────────────────────────┐
│  apps/web  (Next.js SPA)   │     │  experiments (Python harness) │
│  interactive laboratory    │◄────┤  toy model + sweeps → JSON    │
└────────────────────────────┘     └───────────────────────────────┘
              │        ▲
              │        │ typed data adapter
              ▼        │
      src/data/*.ts ◄───┘
```

The product is deliberately **static-first**: all experiment data ships with the
build as TypeScript/JSON modules. There is no backend, no API, and nothing that
can "go down" during a live judging demo. If the ML harness produces new numbers,
the only code that must change is the adapter in `apps/web/src/data/experiments.ts`.

A second, purely client-side data path powers the **human experiment**: the task
battery and hint text ship statically, and the participant's results are computed
in the browser and persisted to `localStorage` under the key
`twt:session:ai-assistance-and-human-reasoning`. Nothing ever leaves the device.

## Frontend (`apps/web`)

### Stack

- **Next.js 16** (App Router) — static export friendly, deploys to Vercel.
- **TypeScript** — strict mode.
- **Tailwind CSS v4** — design tokens in `globals.css` via CSS vars.
- **React + SVG** — all charts hand-rolled in SVG; no chart library.
- CSS keyframes + `prefers-reduced-motion` for all animation (including the
  chart draw-in). No animation library.

### Component architecture

```
src/app/
  layout.tsx          # fonts, metadata, skip-link, Nav, Footer
  page.tsx            # composes section components in order 01→13
  error.tsx           # client error boundary with reset
  globals.css         # design tokens, base styles, reduced-motion

src/components/
  layout/
    Navigation.tsx    # fixed section jump-nav (desktop rail + mobile sheet, Escape closes)
    Footer.tsx        # provenance footer
  sections/
    Hero.tsx              # invitation to run the human experiment
    TheProblem.tsx        # 01: bat-and-ball priming task
    HypothesisSection.tsx # 02: H_a / H_b with source badges
    HumanExperiment.tsx   # 03: 5-task wizard (timer, confidence, hint lifeline)
    ResultsSection.tsx    # 04: per-condition aggregates, calibration, honest limits
    ThinkInTokens.tsx     # 05: Case A — simplified CoT step-through
    ThinkInStates.tsx     # 06: Case B — latent-state refinement step-through
    TheLab.tsx            # 07: toy-model controls + results + history
    WhatChanges.tsx       # 08: accuracy curves (hand-rolled SVG chart)
    WhatBreaks.tsx        # 09: two real failure cases with evidence
    BDHModule.tsx         # 10: toy → BDH → BDH-CQ bridge, clearly labeled
    Research.tsx          # 11: verified citations with source discipline legend
    Reproduce.tsx         # 12: model + human reproduction steps
    About.tsx             # 13: disclosure, licenses, integrity statement
  ui/
    SectionWrapper.tsx    # numbered section shell (id, title, subtitle)
    SourceBadge.tsx       # PUBLISHED / OUR EXPERIMENT / ILLUSTRATIVE / …
    ExperimentChart.tsx   # dependency-free SVG line chart (legend, draw-in)
    ComparisonBars.tsx    # accessible two-condition bar comparison (Section 04)
    ReasoningSlider.tsx   # labelled range input (budget / capacity)
    GroundTruthCard.tsx   # prediction vs ground-truth verdict card
```

### Data layer

- `src/data/types.ts` — canonical TS types (`ExperimentSeries`, `LabResult`,
  `LatentState`, `DataSource`, `Citation`, plus the human-experiment types:
  `HumanTask`, `TrialResult`, `ConditionAggregate`, `ParticipantSession`, …).
- `src/data/experiments.ts` — typed results + a deterministic simulator that the
  Lab uses to "run" an experiment instantly in-browser.
  - ⚠️ **Simulator is a placeholder.** It derives outputs from the labelled
    accuracy curves via seeded randomness. The REAL numbers come from the ML
    harness; until they ship, every simulation output renders under the
    **OUR EXPERIMENT** badge because the harness contract guarantees identical
    shapes.
- `src/data/humanExperiments.ts` — the 5-task battery (CRT-1, CRT-2, CRT-3,
  Monty Hall, Cab/Base-rate), the two conditions, and the static curated hints
  (`ASSISTIVE_HINT`) that serve as the only "AI assistance" in the study.
- `src/lib/humanExperimentEngine.ts` — pure functions: session creation,
  condition order, trial recording, aggregation by condition, calibration error,
  persistence (`localStorage`). No component mutates session state directly.
- `src/data/citations.ts` — **verified primary sources only.** Every entry was
  checked against its real publication record; entries that could not be
  verified were removed and replaced with verifiable ones (e.g. the latent
  reasoning survey, Zhu et al. 2025). Section 11 renders a repository note when
  a source has no public URL (e.g. BDH/BDH-CQ challenge materials).
- `src/lib/experimentEngine.ts` — formatting + curve helpers.

### State management

Local `useState`/`useMemo` only, plus convention-driven state inside the two
engines:

- Section 04's Lab owns its run history in component state.
- Section 03 persists the human-experiment session to `localStorage` through
  `humanExperimentEngine`, so a partial session survives a refresh. Session
  state flows one way: engine → component state → engine (never mutated
  directly in JSX).

Effects that must set state synchronously are deferred via `setTimeout(…, 0)`
to satisfy React's `set-state-in-effect` lint rule; this is the documented
pattern for the timer and hint-reveal transitions in Sections 03/04.

## Data contract between ML and UI

The ML harness emits JSON: `{ experiment, task, model, state_dim, difficulty,
notes, points: [{ steps, accuracy, std_dev? }] }`. The adapter converts this into
`ExperimentSeries[]` for the charts and into `LabResult` for the Lab. The contract
is documented in `experiments/README.md`.

## Edge cases handled

- No API, so "backend down" is impossible; missing data shows labeled
  empty/fallback UI (charts render axes, Lab shows hint text).
- Deterministic seeded simulator → every learner can reproduce a model result.
- `prefers-reduced-motion` disables all animation (including chart draw-in).
- Keyboard: all controls are native `<button>`/`<input type=range>`; the mobile
  nav sheet closes on `Escape` and returns focus to its toggle; a skip-link
  exists in layout.
- Render faults: `error.tsx` provides a reset UI; the app never loses session
  data because persistence lives in the engine, not the tree.
- Partial human sessions resume from `localStorage`; a stale/invalid session is
  discarded safely by the engine's validation.
- Mobile: single scroll page, rail nav collapses to a sheet.

## Performance

- All computation is client-side and trivial (small arrays); charts are static
  SVG — no per-frame inference.
- No streaming, no heavy bundles beyond Next/React/Tailwind itself.
- Build output is fully static (`next build`), ready for CDN caching.

## Security

`next.config.ts` ships `poweredByHeader: false` plus headers: `X-Frame-Options:
DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
`Permissions-Policy`, and a conservative `Content-Security-Policy` (self-only
defaults; inlined scripts/styles permitted for the static React hydration
payload). No secrets are compiled into the bundle (there are none).