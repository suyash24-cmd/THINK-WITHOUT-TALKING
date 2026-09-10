"use client";

import { useState, useMemo } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SourceBadge from "@/components/ui/SourceBadge";
import ReasoningSlider from "@/components/ui/ReasoningSlider";
import { puzzles, generateLatentStates } from "@/data/experiments";

export default function ThinkInStates() {
  const [currentStep, setCurrentStep] = useState(0);
  const puzzle = puzzles[1];
  const maxSteps = 10;
  const stateDim = 8;

  const states = useMemo(
    () => generateLatentStates(puzzle, maxSteps, stateDim),
    [puzzle]
  );

  const visibleStates = states.slice(0, currentStep + 1);

  return (
    <SectionWrapper
      id="states"
      number="06"
      title="Case B · Models That Stay Silent"
      subtitle="A recurrent model refines a hidden state at each step — no natural-language tokens at all. This is the &quot;silent reasoner&quot;: the machinery behind latent reasoning (and the toy model in Section 07)."
    >
      <div className="mb-6">
        <SourceBadge
          source={{
            label: "illustrative",
            description:
              "Visualization of a recurrent latent state trajectory. State values are from our toy model.",
          }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">
            Latent State Trajectory
          </p>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-mono text-text-primary">
              [{puzzle.input.join(", ")}]
            </span>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent shrink-0">
              <path d="M0 6h14M10 1l5 5-5 5" />
            </svg>
            <span className="text-sm font-mono text-text-muted">model</span>
          </div>

          <div className="space-y-2">
            {visibleStates.map((state, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 bg-elevated rounded-lg border border-border transition-all"
              >
                <span className="text-xs font-mono text-accent w-16 shrink-0">
                  {state.label}
                </span>
                <div className="flex gap-0.5 flex-1">
                  {state.values.map((v, j) => {
                    const normalized = (v + 1) / 2;
                    const hue = normalized * 120;
                    return (
                      <div
                        key={j}
                        className="flex-1 h-5 rounded-sm"
                        style={{
                          backgroundColor: `hsl(${hue}, 70%, ${30 + normalized * 30}%)`,
                        }}
                        title={`dim ${j}: ${v.toFixed(3)}`}
                      />
                    );
                  })}
                </div>
                <span className="text-[10px] font-mono text-text-muted w-10 text-right shrink-0">
                  [{state.values[0]?.toFixed(2)}, ...]
                </span>
              </div>
            ))}

            {currentStep < maxSteps && (
              <div className="flex items-center gap-3 p-2 bg-card border border-dashed border-border rounded-lg opacity-40">
                <span className="text-xs font-mono text-text-muted w-16 shrink-0">
                  ...
                </span>
                <span className="text-xs text-text-muted">refinement continues</span>
              </div>
            )}

            {currentStep >= maxSteps && (
              <div className="flex items-center gap-3 p-2 bg-correct/10 border border-correct/30 rounded-lg">
                <span className="text-xs font-mono text-correct shrink-0">
                  OUTPUT
                </span>
                <span className="text-sm font-mono font-bold text-text-primary">
                  f(h<sub>T</sub>) → {puzzle.groundTruth}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">
            Step Through
          </p>

          <div className="mb-6">
            <ReasoningSlider
              min={0}
              max={maxSteps}
              value={currentStep}
              onChange={setCurrentStep}
              label="Latent Reasoning Budget"
              valueLabel={`Step ${currentStep}/${maxSteps}`}
              ariaLabel="Latent reasoning step"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-elevated rounded-lg p-4 border border-border">
              <p className="text-xs font-mono text-text-muted mb-2">KEY DIFFERENCE</p>
              <p className="text-sm text-text-primary leading-relaxed">
                No tokens are generated. The model updates a fixed-size vector{" "}
                <span className="font-mono text-accent">h</span> at each step.
                Computation happens entirely in latent space.
              </p>
            </div>

            <div className="bg-elevated rounded-lg p-4 border border-border">
              <p className="text-xs font-mono text-text-muted mb-2">COMPUTATION</p>
              <div className="text-sm text-text-secondary font-mono space-y-1">
                <p><span className="text-text-primary">x</span> → <span className="text-amber">h₀</span></p>
                <p><span className="text-amber">h₀</span> → <span className="text-amber">h₁</span> → <span className="text-amber">h₂</span> → ... → <span className="text-amber">h<sub>T</sub></span></p>
                <p><span className="text-amber">h<sub>T</sub></span> → <span className="text-correct font-bold">answer</span></p>
              </div>
            </div>

            <div className="bg-elevated rounded-lg p-4 border border-border">
              <p className="text-xs font-mono text-text-muted mb-2">COST</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Each step is a matrix multiply in latent space.
                No token generation overhead. More steps = more computation, but no extra output tokens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
