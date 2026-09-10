# FRONTEND_HANDOFF.md

**THINK WITHOUT TALKING · DataForge 2026 Pathway Track**
Senior Product Engineer + Frontend Architect → rest of the team.

This file is the operating contract for the frontend. Read it before changing
the data layer, the human-experiment engine, or the Lab.

---

## 1. What ships and where it lives

| Piece | Location | Status |
| --- | --- | --- |
| Web app (Next.js 16) | `apps/web/` | ✅ builds, lints, typechecks, serves |
| Typed data layer | `apps/web/src/data/` | ⚠️ model sim is placeholder (see §5) |
| Human-experiment engine | `apps/web/src/lib/humanExperimentEngine.ts` | ✅ pure + persistable |
| ML harness contract | `experiments/README.md` + `toy_model.py` | 🕐 template |
| Docs | root: `README`, `ARCHITECTURE`, `DEPLOYMENT` | ✅ |

## 2. Routes

There is exactly one route. The whole product is Section 01→13 on `/`
(a single scrolling laboratory). Deep links:

```
/#problem  /#hypothesis  /#experiment  /#results  /#tokens
/#states  /#lab  /#changes  /#breaks  /#bdh
/#research  /#reproduce  /#about
```

No API routes are implemented (by design — see ARCHITECTURE.md).

## 3. Component architecture

```
sections/   Hero, TheProblem, HypothesisSection, HumanExperiment, ResultsSection,
            ThinkInTokens, ThinkInStates, TheLab, WhatChanges, WhatBreaks,
            BDHModule, Research, Reproduce, About
layout/     Navigation, Footer
ui/         SectionWrapper, SourceBadge, ExperimentChart, ComparisonBars,
            ReasoningSlider, GroundTruthCard
```

- `page.tsx` composes sections in order; text lives inside components.
- `ExperimentChart` is a dependency-free SVG line chart (no d3 — network
  flakiness made d3 uninstallable; hand-rolled scales/axes/bezier curves).
  Multi-series charts render a legend; the solid series draw in on mount and
  respect `prefers-reduced-motion`.
- `ComparisonBars` (Section 04) is the accessible two-condition comparison.
- `SourceBadge` is the single source of truth for evidence labeling; do not
  hand-roll labels elsewhere.
- **Pattern:** effects that set state synchronously (timer ticks, hint reveals)
  are deferred with `setTimeout(…, 0)` to satisfy `react-hooks/set-state-in-effect`.
  Do not disable that rule; follow the existing pattern.

## 4. Data contracts (stable API)

`src/data/types.ts` is the canonical schema. Key model types:

- `DataSource { label: published_research | our_experiment | illustrative | hypothesis | inference }`
- `ExperimentSeries { name, data: ExperimentPoint[], source, color }`
- `LabResult { prediction, groundTruth, correct, latentStates, confidence, steps, stateDim }`
- `LabConfig { steps, stateDim, difficulty, puzzleId }`

Key human-experiment types:

- `HumanTask { id, prompt, options, correctOption, explanation, hint, taskType, citationIds }`
- `ConditionAggregate { condition, count, correctCount, accuracy, avgTimeMs, accuracyStd }`
- `ParticipantSession { startedAt, activeTrialIndex, phase, trials, conditions }`

Adapters: `src/lib/experimentEngine.ts` + `src/data/experiments.ts` (model side);
`src/lib/humanExperimentEngine.ts` + `src/data/humanExperiments.ts` (human side).
The ML harness exports JSON → adapter maps it to the model types. **If the ML
output format differs, change the adapter, never the types or the charts.**
The human battery edits are data-only (`humanExperiments.ts`); the engine must
stay untouched by content edits.

## 5. Honesty rules (do not regress)

1. **Model placeholders are live right now.** `simulateLabResult` produces
   deterministic seeded outputs from the labeled accuracy curves; the charts are
   seeded from contract-shaped numbers. Every simulated result renders under the
   **OUR EXPERIMENT** badge, which is only valid once real numbers replace it.
   **Remaining integration task: run the ML harness, drop real results through
   the adapter, and re-verify Section 07/08.**
2. **The human self-experiment is a 1-person demonstration, not a study.**
   Section 04's interpretation and limitations copy says so. Never relabel it as
   a measured population result.
3. **BDH/BDH-CQ is cited from challenge materials, not reproduced.** Section 10
   says so. Its citation card has no public preprint URL and must never be given
   a fabricated one. Do not paste our toy numbers onto BDH results.
4. **Citations are verified-only.** `src/data/citations.ts` was audited in Phase 9:
   two unverifiable placeholders were removed (see git history). Any new entry
   must carry a working URL or an explicit "no public link" note; never invent an
   arXiv ID. The latent-reasoning survey (Zhu et al., 2025) is the canonical
   supporting source for the latent-reasoning claims.
5. The token-baseline dashed line in Section 05 is **ILLUSTRATIVE**. It cites
   Wei et al. as inspiration, not as a measurement.
6. Lab correctness on a single run uses a seeded RNG — the SAME config always
   yields the SAME outcome, so learners can reproduce results. Per-run
   prediction is stochastic, which is intentionally realistic; bias is governed
   by the accuracy curves.
7. Single dark lab theme; charts are numeric-only.

## 6. Human-experiment state (single source of truth)

Session persistence lives in `humanExperimentEngine` under localStorage key
`twt:session:ai-assistance-and-human-reasoning`. Rules:

- Components render from engine-derived snapshots; they never write to
  localStorage directly.
- A partial session resumes on load; an invalid/stale payload is discarded.
- Condition order alternates (unaided, ai-assisted, …) for balanced exposure;
  5 tasks, CRT-1/2/3 + Monty Hall + Cab base-rate, grounded in Frederick (2005)
  and Tversky & Kahneman (1982).

## 7. Deployment

Full instructions in `DEPLOYMENT.md`. TL;DR: Vercel (root `apps/web`) or
static export. After deploy, test `/#experiment` and `/#lab` on desktop,
tablet, mobile, and verify the security headers.

## 8. Checking in

```bash
cd apps/web
npm run lint && npm run typecheck && npm run build
npm run start    # verify / and the section anchors over HTTP
```

## 9. AI assistance disclosure (frontend)

The web app was authored by the Senior Product Engineer agent with AI
assistance. Model experiment numbers are placeholders pending the ML harness.
Full human-readable disclosure: Section 13 of the product + root README.