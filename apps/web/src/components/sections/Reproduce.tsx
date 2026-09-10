"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SourceBadge from "@/components/ui/SourceBadge";

const modelCode = `import torch
import torch.nn as nn

class LatentReasoner(nn.Module):
    """Toy model: recurrent latent-space reasoning without token generation."""

    def __init__(self, input_dim, state_dim, output_dim):
        super().__init__()
        self.state_dim = state_dim
        self.input_proj = nn.Linear(input_dim, state_dim)
        self.recur = nn.Linear(state_dim, state_dim)
        self.output_proj = nn.Linear(state_dim, output_dim)
        self.act = nn.Tanh()

    def forward(self, tokens, steps):
        # Project input into latent space
        h = self.act(self.input_proj(tokens))
        # Recurrent refinement: no tokens generated
        for _ in range(steps):
            h = self.act(self.recur(h))
        # Read out from final state
        return self.output_proj(h)

# --- Training loop (simplified) ---
def train(model, data, epochs=200):
    opt = torch.optim.Adam(model.parameters(), lr=1e-3)
    loss_fn = nn.CrossEntropyLoss()
    for epoch in range(epochs):
        inputs, labels = next(data)
        logits = model(inputs, steps=5)
        loss = loss_fn(logits, labels)
        opt.zero_grad()
        loss.backward()
        opt.step()`;

const steps = [
  {
    number: "1",
    title: "Install dependencies",
    command: "python -m venv .venv && .venv/bin/activate\npip install torch numpy pandas scikit-learn",
  },
  {
    number: "2",
    title: "Clone the experiment repo",
    command: "git clone <repo-url>\ncd think-without-talking/experiments",
  },
  {
    number: "3",
    title: "Train the toy model",
    command: "python toy_model.py --task parity \\\n  --state-dim 64 --epochs 200",
  },
  {
    number: "4",
    title: "Evaluate the budget sweep",
    command: "python run_sweep.py --steps 1,2,3,5,8,12,20,30 \\\n  --state-dims 16,32,64,128 --difficulties easy,medium,hard \\\n  --out results/",
  },
  {
    number: "5",
    title: "Export results for the frontend",
    command: "python export.py --results-dir results/ \\\n  --out ../apps/web/src/data/",
  },
];

export default function Reproduce() {
  const [showCode, setShowCode] = useState(false);

  return (
    <SectionWrapper
      id="reproduce"
      number="12"
      title="Reproduce"
      subtitle="Every number in this product can be regenerated. Here&apos;s how."
    >
      <div className="space-y-8">
        {/* Experiment Description */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
            Experiment Design
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                We train a simple tanh-RNN to solve two tasks:
              </p>
              <ul className="space-y-2 text-sm text-text-primary">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">→</span>
                  <span><strong>Parity sum:</strong> Is the sum of N numbers even or odd?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">→</span>
                  <span><strong>Sequence extension:</strong> What comes next?</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-3">Variables swept per experiment:</p>
              <ul className="space-y-2 text-sm text-text-primary">
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-1">→</span>
                  <span>Reasoning budget T: {`{1, 2, 3, 5, 8, 12, 20, 30}`}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-1">→</span>
                  <span>State dimension: {`{16, 32, 64, 128}`}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-1">→</span>
                  <span>Task difficulty: easy / medium / hard</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <SourceBadge
              source={{
                label: "our_experiment",
                description:
                  "Full experiment scripts, configs, and raw outputs are in the experiments/ directory of the source repo.",
              }}
            />
          </div>
        </div>

        {/* Model Code */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-accent uppercase tracking-wider">
              The Toy Model (PyTorch)
            </p>
            <button
              onClick={() => setShowCode(!showCode)}
              className="text-xs font-mono text-accent hover:text-accent-dim transition-colors"
            >
              {showCode ? "Hide code" : "Show code"}
            </button>
          </div>
          {showCode && (
            <pre className="bg-[#0d0e12] border border-border rounded-lg p-5 overflow-x-auto text-xs font-mono text-text-secondary leading-relaxed">
              {modelCode}
            </pre>
          )}
          {!showCode && (
            <p className="text-sm text-text-muted italic">
              Click to view the full model definition.
            </p>
          )}
        </div>

        {/* Reproduction Steps */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
            Reproduction Steps
          </p>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center text-xs font-mono text-accent font-bold shrink-0">
                    {step.number}
                  </div>
                  {step.number !== steps.length.toString() && (
                    <div className="w-0.5 flex-1 bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-sm text-text-primary font-medium mb-2">
                    {step.title}
                  </p>
                  <pre className="bg-[#0d0e12] border border-border rounded-lg p-3 text-xs font-mono text-text-secondary overflow-x-auto">
                    {step.command}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Pipeline Note */}
        <div className="bg-elevated border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
            Status & Data Pipeline
          </p>
          <p className="text-sm text-text-secondary leading-relaxed mb-3">
            The commands above follow the contract in{" "}
            <code className="bg-card px-1.5 py-0.5 rounded text-xs text-accent">experiments/README.md</code>.
            <code className="bg-card px-1.5 py-0.5 rounded text-xs text-accent">toy_model.py</code> is a
            working reference template; <code className="bg-card px-1.5 py-0.5 rounded text-xs text-accent">run_sweep.py</code>{" "}
            and <code className="bg-card px-1.5 py-0.5 rounded text-xs text-accent">export.py</code> are
            to be implemented before the harness produces the real numbers this site will display.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            The frontend consumes a single JSON contract. Experiment scripts export results into{" "}
            <code className="bg-card px-1.5 py-0.5 rounded text-xs text-accent">src/data/experiments.ts</code>.
            If the ML engineer&apos;s output format differs, the integration layer adapts — we never
            hardcode speculative numbers in place of real results.
          </p>
        </div>

        {/* Human experiment reproducibility */}
        <div className="bg-elevated border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
            Reproducing the human experiment
          </p>
          <p className="text-sm text-text-secondary leading-relaxed mb-3">
            Section 03 runs entirely in your browser. Its reproducibility is built in, not promised:
          </p>
          <ul className="space-y-2 text-sm text-text-primary">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1 shrink-0">→</span>
              <span>The task battery ({`{CRT-1 … BR-1}`}) ships in the bundle with fixed ground truths and a fixed condition order.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1 shrink-0">→</span>
              <span>Every trial records time, confidence, condition, and assist usage into a JSON session under <code className="bg-card px-1.5 py-0.5 rounded text-[10px] text-accent">twt:session:*</code> in your browser.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1 shrink-0">→</span>
              <span>Anyone — you included — can rerun the same battery and diff the JSON sessions.</span>
            </li>
          </ul>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            What is NOT reproducible is a population claim: your session is one person, once.
            That limitation is stated in the product wherever aggregates are quoted.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#bdh"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-elevated text-text-secondary rounded-lg text-sm border border-border hover:border-accent/50 transition-colors"
          >
            ← Back to BDH
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm hover:bg-accent-dim transition-colors"
          >
            Next: About →
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}