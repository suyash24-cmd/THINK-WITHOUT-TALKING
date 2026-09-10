"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SourceBadge from "@/components/ui/SourceBadge";
import ReasoningSlider from "@/components/ui/ReasoningSlider";
import { puzzles } from "@/data/experiments";

export default function ThinkInTokens() {
  const [currentStep, setCurrentStep] = useState(0);
  const puzzle = puzzles[1];
  const steps = puzzle.expectedTokenSteps;

  return (
    <SectionWrapper
      id="tokens"
      number="05"
      title="Case A · Models That Talk"
      subtitle="Chain-of-thought reasoning generates intermediate natural-language tokens for every computation. This is the &quot;talker&quot; — and for years it was the only credible way to get reasoning out of a model."
    >
      <div className="mb-6">
        <SourceBadge
          source={{
            label: "illustrative",
            description: "Simplified illustration of chain-of-thought process.",
            citationId: "wei2022",
          }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">
            Token-Based Reasoning
          </p>

          <div className="space-y-0">
            <div className="flex items-start gap-3 p-3 bg-elevated rounded-t-lg border border-border">
              <span className="text-xs font-mono text-text-muted mt-0.5 shrink-0">INPUT</span>
              <span className="text-sm text-text-primary font-mono">
                [{puzzle.input.join(", ")}]
              </span>
            </div>

            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 border-x border-b border-border transition-all duration-300 ${
                  i <= currentStep
                    ? "bg-elevated/80 opacity-100"
                    : "bg-card opacity-30"
                }`}
              >
                <span className="text-xs font-mono text-accent mt-0.5 shrink-0">
                  TOKEN {i + 1}
                </span>
                <span
                  className={`text-sm font-mono ${
                    i <= currentStep ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}

            <div
              className={`flex items-start gap-3 p-3 border-x border-b rounded-b-lg border-border transition-all duration-300 ${
                currentStep >= steps.length
                  ? "bg-correct/10 border-correct/30"
                  : "bg-card opacity-30"
              }`}
            >
              <span className="text-xs font-mono text-correct mt-0.5 shrink-0">
                OUTPUT
              </span>
              <span className="text-sm font-mono font-bold text-text-primary">
                {currentStep >= steps.length ? `Answer: ${puzzle.groundTruth}` : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">
            Step Through
          </p>

          <div className="mb-6">
            <ReasoningSlider
              min={0}
              max={steps.length}
              value={currentStep}
              onChange={setCurrentStep}
              label="Reasoning Budget"
              valueLabel={`Step ${currentStep}/${steps.length}`}
              ariaLabel="Reasoning step"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-elevated rounded-lg p-4 border border-border">
              <p className="text-xs font-mono text-text-muted mb-2">KEY CHARACTERISTIC</p>
              <p className="text-sm text-text-primary leading-relaxed">
                Each computation step produces an explicit natural-language token.
                The model must &quot;talk through&quot; every intermediate step.
              </p>
            </div>

            <div className="bg-elevated rounded-lg p-4 border border-border">
              <p className="text-xs font-mono text-text-muted mb-2">COMPUTATION</p>
              <div className="flex items-center gap-3 text-sm text-text-secondary font-mono">
                <span className="text-text-primary">x</span>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent shrink-0">
                  <path d="M0 6h14M10 1l5 5-5 5" />
                </svg>
                <span className="text-text-primary">token₁</span>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent shrink-0">
                  <path d="M0 6h14M10 1l5 5-5 5" />
                </svg>
                <span className="text-text-primary">token₂</span>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent shrink-0">
                  <path d="M0 6h14M10 1l5 5-5 5" />
                </svg>
                <span className="text-correct font-bold">answer</span>
              </div>
            </div>

            <div className="bg-elevated rounded-lg p-4 border border-border">
              <p className="text-xs font-mono text-text-muted mb-2">COST</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every step costs a forward pass AND generates a token.
                More reasoning = more tokens = more latency and compute.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
