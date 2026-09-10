"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import SourceBadge from "@/components/ui/SourceBadge";
import { humanExperiment } from "@/data/humanExperiments";

const hypotheses = [
  {
    id: "h-a",
    label: "H_a · Performance facilitation",
    color: "text-accent border-accent",
    claim:
      "AI assistance improves how fast and how accurately you solve problems. The AI acts as a scaffold: it augments your reasoning rather than replacing it.",
    basis: "Models that show their reasoning (chain-of-thought) measurably improve task performance.",
    basisLabel: "PUBLISHED RESEARCH",
  },
  {
    id: "h-b",
    label: "H_b · Cognitive offloading",
    color: "text-amber border-amber",
    claim:
      "AI assistance improves the answer while displacing the reasoning. You rely on the assist, and your confidence drifts away from your actual accuracy.",
    basis: "People offload mental work to available tools and remember less of the underlying process.",
    basisLabel: "PUBLISHED RESEARCH",
  },
];

export default function HypothesisSection() {
  return (
    <SectionWrapper
      id="hypothesis"
      number="02"
      title="The Hypothesis"
      subtitle="One question, two competing answers — and a session designed to let you feel the difference."
    >
      <div className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
            Research Question
          </p>
          <p className="text-xl sm:text-2xl font-bold text-text-primary leading-snug">
            When an AI shows its reasoning, do you reason more — or less?
          </p>
          <p className="text-sm text-text-secondary mt-3 leading-relaxed">
            {humanExperiment.hypothesis}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {hypotheses.map((h) => (
            <div
              key={h.id}
              className={`bg-card border border-border rounded-xl p-6 ${h.color}`}
            >
              <p className={`text-xs font-mono font-semibold tracking-wider ${h.color.split(" ")[0]}`}>
                {h.label}
              </p>
              <p className="text-sm text-text-primary mt-3 leading-relaxed">
                {h.claim}
              </p>
              <div className="mt-4">
                <SourceBadge
                  source={{ label: "published_research", description: h.basis }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-elevated border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
            What the experiment measures
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {humanExperiment.metrics.map((metric) => (
              <div
                key={metric}
                className="bg-card border border-border rounded-lg p-4"
              >
                <p className="text-xs font-mono text-text-primary leading-relaxed">
                  {metric}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <SourceBadge
              source={{
                label: "our_experiment",
                description:
                  "The following section is a self-experiment: your answers, timed and scored in your browser.",
              }}
            />
          </div>
          <div className="mt-6">
            <a
              href="#experiment"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors"
            >
              Run the experiment
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 1v12M1 7l6 6 6-6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}