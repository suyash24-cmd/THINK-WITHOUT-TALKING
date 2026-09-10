# THINK WITHOUT TALKING — Deployment

The product is a **static-first Next.js app**. It has no backend and no runtime
dependencies beyond the browser, so it deploys anywhere that can serve static
files. Two supported paths follow.

## Prerequisite

```bash
cd apps/web
npm install
npm run lint && npm run typecheck && npm run build
```

## Option A — Vercel (primary, recommended for the challenge)

1. Push the repository to GitHub.
2. In Vercel, **New Project → Import** the repo.
3. Framework preset auto-detects **Next.js**; root directory: `apps/web`.
4. Build command: `npm run build` (default).
5. Deploy. No environment variables are required.

## Option B — Any static host (Netlify / GitHub Pages / S3 / nginx)

The app renders fully statically. To emit a static export:

```bash
cd apps/web
npx next build        # adds .next static output
# With this config in next.config.ts:
#   output: 'export'
npx next export -o out/
```

Serve the `out/` directory. There are no API routes, so nothing else is needed.

> Note: enabling `output: 'export'` disables `next start`. If you need both,
> keep the default server build (Option A) and only enable export when you want
> the `out/` artifact.

## Environment variables

None are required. The app ships its data with the build by design — see
`ARCHITECTURE.md → Data layer`. The human-experiment session lives entirely in
the participant's `localStorage`; nothing is transmitted.

## Post-deploy verification

After deploying, confirm:

- `http(s)://<host>/#experiment` runs the 5-task human experiment and writes
  results to `04 · Your Results`.
- `http(s)://<host>/#lab` immediately shows the Lab controls and the default
  experiment runs on load without a network round-trip.
- OS reduced-motion setting disables animation.
- Security headers are present: `curl -I <host>/` shows `X-Content-Type-Options:
  nosniff`, `Content-Security-Policy`, and no `X-Powered-By`.

## Reproduction of the experiment numbers

- **Model experiment.** The frontend ships placeholder simulation data labeled
  **OUR EXPERIMENT**. Before final submission, regenerate real numbers with the
  ML harness:

  ```bash
  cd experiments
  # … implement toy_model.py / run_sweep.py per experiments/README.md …
  python export.py --results-dir results/ --out ../apps/web/src/data/
  cd ../apps/web && npm run build && npm run start
  ```

  The data adapter (`src/data/experiments.ts`) is the single integration point —
  the rest of the app needs no changes when real numbers replace the placeholders.

- **Human experiment.** Reproducible by construction: the battery, conditions,
  and hint contents are static, documented in Section 12, and every session's
  numbers are computed on the participant's own device. There is no pipeline to
  redeploy.