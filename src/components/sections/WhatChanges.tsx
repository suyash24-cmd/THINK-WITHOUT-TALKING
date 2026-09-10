"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import SourceBadge from "@/components/ui/SourceBadge";
import ExperimentChart from "@/components/ui/ExperimentChart";
import {
  accuracyBySteps,
  accuracyByDifficulty,
  accuracyByStateDim,
  tokenBaseline,
} from "@/data/experiments";

export default function WhatChanges() {
  return (
    <SectionWrapper
      id="changes"
      number="05"
      title="What Changes?"
      subtitle="See how accuracy varies with reasoning steps, difficulty, and state capacity."
    >
      <div className="space-y-10">
        {/* Chart 1: Accuracy vs Steps */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-4">
            <p className="text-sm font-mono text-text-primary mb-1">
              Accuracy vs Reasoning Steps (T)
            </p>
            <SourceBadge source={accuracyBySteps.source} compact />
          </div>
          <ExperimentChart
            series={[
              {
                name: accuracyBySteps.name,
                data: accuracyBySteps.data.map((d) => ({ x: d.steps, y: d.accuracy })),
                color: accuracyBySteps.color,
              },
              {
                name: "Token CoT Baseline",
                data: tokenBaseline.data.map((d) => ({ x: d.steps, y: d.accuracy })),
                color: tokenBaseline.color,
                dashed: true,
              },
            ]}
            xLabel="Reasoning Steps (T)"
            yLabel="Accuracy"
            yDomain={[0.4, 1]}
            annotations={[{ x: 12, y: 0.94, label: "Peak" }]}
          />
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-accent inline-block" /> Latent recurrent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber inline-block" style={{ borderBottom: "2px dashed" }} /> Token CoT baseline (illustrative)
            </span>
          </div>
          <p className="text-xs text-text-muted mt-3 leading-relaxed">
            Latent reasoning improves with more steps up to a point, then plateaus.
            The dashed line represents an approximate token-based chain-of-thought baseline.
          </p>
        </div>

        {/* Chart 2: Accuracy by Difficulty */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-4">
            <p className="text-sm font-mono text-text-primary mb-1">
              Accuracy by Task Difficulty
            </p>
            <SourceBadge
              source={accuracyByDifficulty[0].source}
              compact
            />
          </div>
          <ExperimentChart
            series={accuracyByDifficulty.map((s) => ({
              name: s.name,
              data: s.data.map((d) => ({ x: d.steps, y: d.accuracy })),
              color: s.color,
            }))}
            xLabel="Reasoning Steps (T)"
            yLabel="Accuracy"
            yDomain={[0.4, 1]}
          />
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-muted">
            {accuracyByDifficulty.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-3 leading-relaxed">
            Harder tasks start with lower accuracy and plateau at a lower level.
            More reasoning steps help less when the task is fundamentally harder.
          </p>
        </div>

        {/* Chart 3: State Dimension */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-4">
            <p className="text-sm font-mono text-text-primary mb-1">
              Accuracy by State Dimension
            </p>
            <SourceBadge source={accuracyByStateDim[0].source} compact />
          </div>
          <ExperimentChart
            series={accuracyByStateDim.map((s) => ({
              name: s.name,
              data: s.data.map((d) => ({ x: d.steps, y: d.accuracy })),
              color: s.color,
            }))}
            xLabel="Reasoning Steps (T)"
            yLabel="Accuracy"
            yDomain={[0.4, 1]}
          />
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-muted">
            {accuracyByStateDim.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-3 leading-relaxed">
            Larger state dimensions allow more information to be carried through recurrence.
            But the gains show diminishing returns — a 128-dim state barely outperforms 64-dim.
          </p>
        </div>

        {/* Key Insight */}
        <div className="bg-elevated border border-accent/30 rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
            Key Finding
          </p>
          <p className="text-lg text-text-primary font-medium mb-2">
            More latent computation helps — but only up to a point.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Accuracy improves rapidly in early steps, plateaus around T=8-12, and can even
            decrease at very high T due to error accumulation. This supports the central claim:
            latent recurrent reasoning works, but more computation does not guarantee better reasoning.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
