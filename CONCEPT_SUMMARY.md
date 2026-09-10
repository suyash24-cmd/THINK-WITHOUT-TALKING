# THINK WITHOUT TALKING
## One-Page Concept Summary — DataForge 2026 · Pathway Track

**Concept, human side (the primary experience).** AI can explain anything. Can
it help you *think*? We built a 5-task, in-browser self-experiment that asks you
to answer classic reasoning puzzles twice — once unaided, once with a curated,
non-revealing "AI assist" hint — so **you** can watch your own accuracy, speed,
and confidence respond to the treatment.

**Concept, model side (the supporting evidence).** A model can improve its
answer by repeatedly refining a hidden state — computation in *latent space* —
without generating a natural-language token for every intermediate step. But
more latent computation does *not* guarantee better reasoning.

**The human experiment (03–04).** Five canonical puzzles: the CRT trio
(1 = 5¢, the lily pads, the machine speed-up), Monty Hall, and the Cab
base-rate problem. Conditions alternate unaided (amber) / AI-assisted (blue);
the assist is a static, curated hint with an explicit awareness disclosure. You
record time and a confidence slider per answer. Your results — per-condition
accuracy, speed, and calibration error — are aggregated locally on your device
and honestly labeled as a 1-person self-experiment.

| You observe | What it tells you |
| --- | --- |
| Unaided vs assisted accuracy | whether help actually moves your answer |
| Per-task time | whether help is a shortcut or a scaffold |
| Confidence vs correctness | how calibrated your own reasoning is |

**The model setup (05–07).** Input `x` is encoded into a state `h₀`; a
recurrent function updates it: `hₜ = tanh(W_r·hₜ₋₁ + W_x·x)`. After `T`
refinement steps a readout maps `h_T` to a prediction. Nothing is "spoken" in
between (Case B). Compare with chain-of-thought, which spends one token per
intermediate step (Case A). You run the toy model yourself in the Lab and
change three variables:

| You change | You observe |
| --- | --- |
| Reasoning budget `T` (1→30) | accuracy rises, plateaus, then falls on hard tasks |
| State dimension (8→128) | capacity bottleneck — more `T` can't fix a small `h` |
| Difficulty (easy/medium/hard) | everything degrades predictably |

**The evidence (our toy model, amber label).** Accuracy rises steeply early
(T=1→8), plateaus around T=8–12, then degrades at high T on hard tasks (error
accumulation in a plain tanh-RNN). A 16-dim state caps medium accuracy near 70%;
64-dim reaches ~94%. Same config ⇒ same outcome (seeded).

**What breaks (real).** (1) *Error accumulation:* hard-task accuracy peaks at
76% (T=8) then falls to 62% (T=30). Gated architectures may mitigate this; we
don't claim otherwise. (2) *Capacity bottleneck:* a 16-dim state cannot encode
the required cumulative information regardless of `T`. Neither failure proves
latent reasoning is unworkable — it defines its boundaries.

**Why it matters (published context, blue label).** Universal Transformers
(Dehghani et al., 2019) and Adaptive Computation Time (Graves, 2016) established
weight-tied, recurrent-with-halting computation. Chain-of-thought (Wei et al.,
2022) shows explicit verbal reasoning helps. A recent survey catalogs latent
reasoning in continuous hidden states (Zhu et al., 2025). BDH builds on this
with recurrent latent reasoning; BDH-CQ adds convergent-query halting. **We cite
BDH/BDH-CQ from the challenge materials — we do not claim to reproduce them, our
toy model is explicitly not BDH, and every citation in Section 11 is verified.**

**What you can do here.** Solve the priming problem (01); read the hypothesis
(02); run the self-experiment (03) and read your own results (04); contrast the
two model cases (05–06); run the Lab (07); read the accuracy curves (08); meet
the failure cases (09); trace toy → BDH → BDH-CQ (10); check verified primary
sources (11); reproduce every number, both model and human (12); see disclosure
and licenses (13).

**Evidence discipline.** Every claim is tagged PUBLISHED RESEARCH (blue),
OUR EXPERIMENT (amber), ILLUSTRATIVE (purple), or HYPOTHESIS/INFERENCE
(teal/red). Nothing is fabricated; model placeholders are replaced by the ML
harness <a href="#reproduce">before</a> final submission, and the human
experiment is reproducible on any device by construction.