"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GroundTruthCard from "@/components/ui/GroundTruthCard";
import SourceBadge from "@/components/ui/SourceBadge";
import { tasks } from "@/data/humanExperiments";
import { citations } from "@/data/citations";

const cite = (id: string): string => {
  const c = citations.find((c) => c.id === id);
  return c ? `${c.authors} (${c.year})` : id;
};

export default function TheProblem() {
  const task = tasks.find((t) => t.code === "CRT-1") ?? tasks[0];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [revealed, setRevealed] = useState(false);

  const correct = selectedIndex === task.correctIndex;

  return (
    <SectionWrapper
      id="problem"
      number="01"
      title="The Problem"
      subtitle="No AI yet. One question. Solve it before you read the verdict."
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <p className="text-xs font-mono text-accent uppercase tracking-wider">
              Reasoning challenge
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider border bg-amber-500/15 text-amber-400 border-amber-500/30">
              UNAIDED
            </span>
          </div>

          <p className="text-lg text-text-primary leading-relaxed mb-6">{task.prompt}</p>

          <div className="grid gap-3 mb-6">
            {task.options.map((opt, i) => (
              <button
                key={opt}
                onClick={() => {
                  setSelectedIndex(i);
                  setRevealed(false);
                }}
                className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                  selectedIndex === i
                    ? "bg-accent text-white border-accent"
                    : "bg-elevated text-text-secondary border-border hover:border-accent/50"
                }`}
                aria-pressed={selectedIndex === i}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm text-text-secondary mb-2">
              How confident are you?{" "}
              <span className="font-mono text-accent">{confidence}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-elevated rounded-full appearance-none cursor-pointer accent-accent"
              aria-label="Confidence 0 to 100 percent"
            />
            <div className="flex justify-between mt-1 text-xs text-text-muted">
              <span>Guess</span>
              <span>Certain</span>
            </div>
          </div>

          <button
            onClick={() => setRevealed(true)}
            disabled={selectedIndex === null}
            className="px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check my answer
          </button>
        </div>

        <div className="space-y-6">
          {revealed ? (
            <>
              <GroundTruthCard
                prediction={task.options[selectedIndex ?? 0]}
                groundTruth={task.options[task.correctIndex]}
                correct={correct}
                title="Your answer vs ground truth"
              />
              <div className="bg-elevated border border-border rounded-xl p-5">
                <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
                  Why
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">{task.explanation}</p>
                {task.rationale.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {task.rationale.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                        <span className="text-accent mt-0.5 shrink-0">→</span>
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <SourceBadge
                    source={{
                      label: "published_research",
                      description: `Canonical CRT item (${task.publishedWork.map((p) => cite(p.citationId)).join(", ")}).`,
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                You felt {confidence}% confident. Quick, fluent, and wrong is the
                default — for everyone. Now the question of this whole product:
                what changes when an AI is allowed in the room?
              </p>
              <a
                href="#hypothesis"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-elevated text-text-secondary rounded-lg text-sm border border-border hover:border-accent/50 transition-colors"
              >
                State the hypothesis →
              </a>
            </>
          ) : (
            <div className="bg-elevated border border-border rounded-xl p-6 text-sm text-text-muted italic leading-relaxed">
              {selectedIndex === null
                ? "Pick an answer above, then set how confident you feel before you check it. The timer runs while you think — speed and certainty are both data here."
                : "Answer locked. Set your confidence, then check your answer."}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}