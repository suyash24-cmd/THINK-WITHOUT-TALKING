# THINK WITHOUT TALKING — Reproducible Toy Model

This directory holds the ML experiment code and the data contract that the
frontend (`apps/web`) consumes. It is prepared by the **ML Engineer** role and
used by the **Data Scientist** role for the sweeps shown in the site.

## Status

> **Template state.** The `toy_model.py` file below is a reference template
> demonstrating the toy architecture and the exact JSON contract produced by
> the harness. Training/sweep results are exported by `run_sweep.py` into
> `results/` and then integrated into `apps/web/src/data/experiments.ts` by the
> adaptation layer. **Never hardcode numbers into the frontend that do not come
> from a real training run.**

## Data Contract

Every experiment must export JSON matching the schema below. The frontend
contains an adapter (`apps/web/src/data/experiments.ts`) that is the *only*
place that converts raw result JSON into the typed `ExperimentSeries[]`
objects rendered by the charts.

```jsonc
// experiments/results/accuracy_by_steps.json  (example shape)
{
  "experiment": "accuracy-vs-steps",
  "task": "parity_sum",
  "model": "tanh_rnn",
  "state_dim": 64,
  "difficulty": "medium",
  "notes": "200 epochs, Adam lr=1e-3, batch 128",
  "points": [
    { "steps": 1,  "accuracy": 0.52, "std_dev": 0.04 },
    { "steps": 2,  "accuracy": 0.68, "std_dev": 0.03 },
    { "steps": 5,  "accuracy": 0.89, "std_dev": 0.02 }
  ]
}
```

Contract rules:

1. All numbers must come from an actual `run_sweep.py` execution.
2. `accuracy` must be in `[0, 1]` (fraction, not percent).
3. If a point is missing for a sampled budget, omit it — do not fabricate it.
4. Every result file declares `"source": "our_experiment"` implicitly — the
   frontend renders these behind the amber **OUR EXPERIMENT** label.
5. Published BDH/BDH-CQ numbers are referenced in `apps/web/src/data/citations.ts`
   and are **never** mixed into these result files.

## Reference Template

`toy_model.py` is the starting point. It defines:

```
input → W_in(x) → h₀ → tanh(W_r · h₀) → h₁ → … → h_T → W_out(h_T) → logits
```

No tokens are generated at any point. The only free budget knob is **T**
(reasoning steps) and the only architecture knob in these experiments is the
**state dimension**.

## How to run (once implemented)

```bash
python -m venv .venv && .venv/Scripts/activate   # Windows
pip install torch numpy pandas scikit-learn
python toy_model.py --epochs 200 --state-dim 64
python run_sweep.py --steps 1,2,3,5,8,12,20,30 --state-dims 16,32,64,128 \
  --difficulties easy,medium,hard --out results/
python export.py --results-dir results/ --out ../apps/web/src/data/
```

The final step regenerates the typed data file the frontend imports.