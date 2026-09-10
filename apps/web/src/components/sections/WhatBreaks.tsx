"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SourceBadge from "@/components/ui/SourceBadge";
import ExperimentChart from "@/components/ui/ExperimentChart";
import { failureCases } from "@/data/experiments";

export default function WhatBreaks() {
  const [activeCase, setActiveCase] = useState(0);
  const fc = failureCases[activeCase];

  return (
    <SectionWrapper
      id="breaks"
      number="09"
      title="What Breaks?"
      subtitle="Every model has limitations. Here are genuine failures we observed in our experiments."
    >
      <div className="mb-6">
        <SourceBadge source={fc.source} />
      </div>

      <div className="flex gap-2 mb-8">
        {failureCases.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActiveCase(i)}
            className={`px-4 py-2 rounded-lg text-xs font-mono border transition-all ${
              activeCase === i
                ? "bg-incorrect/15 text-incorrect border-incorrect/30"
                : "bg-elevated text-text-muted border-border hover:border-accent/30"
            }`}
          >
            {c.title.split(" ").slice(0, 3).join(" ")}
          </button>
        ))}
      </div>

      <div className="bg-card border border-incorrect/20 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold text-text-primary mb-3">{fc.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          {fc.description}
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-elevated rounded-lg p-4 border border-border">
            <p className="text-xs font-mono text-incorrect mb-2">WHAT HAPPENED</p>
            <p className="text-sm text-text-primary leading-relaxed">
              {fc.whatHappened}
            </p>
          </div>
          <div className="bg-elevated rounded-lg p-4 border border-border">
            <p className="text-xs font-mono text-amber mb-2">WHY IT HAPPENED</p>
            <p className="text-sm text-text-primary leading-relaxed">
              {fc.whyItHappened}
            </p>
          </div>
          <div className="bg-elevated rounded-lg p-4 border border-border">
            <p className="text-xs font-mono text-accent mb-2">WHAT IT DOES NOT PROVE</p>
            <p className="text-sm text-text-primary leading-relaxed">
              {fc.whatItDoesNotProve}
            </p>
          </div>
        </div>

        {activeCase === 0 && (
          <div>
            <p className="text-xs font-mono text-text-muted mb-3">EVIDENCE: ACCURACY vs STEPS ON HARD TASKS</p>
            <ExperimentChart
              series={[
                {
                  name: "Hard task accuracy",
                  data: fc.experimentData
                    .filter((d) => d.steps !== undefined)
                    .map((d) => ({ x: d.steps, y: d.accuracy })),
                  color: "#ef4444",
                },
              ]}
              xLabel="Reasoning Steps (T)"
              yLabel="Accuracy"
              yDomain={[0.4, 1]}
              annotations={[{ x: 8, y: 0.76, label: "Peak here" }]}
              height={220}
            />
          </div>
        )}

        {activeCase === 1 && (
          <div>
            <p className="text-xs font-mono text-text-muted mb-3">EVIDENCE: MAX ACCURACY BY STATE DIMENSION</p>
            <ExperimentChart
              series={[
                {
                  name: "dim=16",
                  data: [{ x: 16, y: 0.7 }],
                  color: "#a78bfa",
                },
                {
                  name: "dim=32",
                  data: [{ x: 32, y: 0.86 }],
                  color: "#60a5fa",
                },
                {
                  name: "dim=64",
                  data: [{ x: 64, y: 0.94 }],
                  color: "#3b82f6",
                },
                {
                  name: "dim=128",
                  data: [{ x: 128, y: 0.95 }],
                  color: "#f59e0b",
                },
              ].map((s) => ({
                name: s.name,
                data: s.data,
                color: s.color,
              }))}
              xLabel="State Dimension"
              yLabel="Max Accuracy"
              xDomain={[0, 140]}
              yDomain={[0.5, 1]}
              height={220}
            />
          </div>
        )}
      </div>

      <div className="bg-elevated border border-border rounded-xl p-6">
        <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
          Why This Matters
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          Showing genuine limitations is essential for scientific honesty.
          These failures do not invalidate latent reasoning — they define its boundaries.
          Understanding where a model breaks is as important as knowing where it works.
        </p>
      </div>
    </SectionWrapper>
  );
}
