"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { puzzles } from "@/data/experiments";

export default function TheQuestion() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const puzzle = puzzles[1]; // medium difficulty

  const options = puzzle.operation === "sum_parity" ? ["Even", "Odd"] : ["6", "7", "8", "9"];

  return (
    <SectionWrapper
      id="question"
      number="01"
      title="The Question"
      subtitle="Try to solve this yourself before looking at how a model approaches it."
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">
            Reasoning Challenge
          </p>
          <p className="text-lg text-text-primary mb-6">{puzzle.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {puzzle.input.map((num, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center w-12 h-12 bg-elevated border border-border rounded-lg text-lg font-mono text-text-primary"
              >
                {num}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSelectedAnswer(opt);
                  setRevealed(false);
                }}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm border transition-all ${
                  selectedAnswer === opt
                    ? "bg-accent text-white border-accent"
                    : "bg-elevated text-text-secondary border-border hover:border-accent/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRevealed(true)}
              disabled={!selectedAnswer}
              className="px-4 py-2 bg-elevated text-text-secondary rounded-lg text-sm border border-border hover:border-accent/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check my answer
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent mb-4 uppercase tracking-wider">
            Ground Truth
          </p>
          {revealed ? (
            <div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-mono font-bold ${
                  selectedAnswer === puzzle.groundTruth
                    ? "bg-correct/15 text-correct"
                    : "bg-incorrect/15 text-incorrect"
                }`}
              >
                {selectedAnswer === puzzle.groundTruth ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 9l3 3 7-7" />
                    </svg>
                    Correct: {puzzle.groundTruth}
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 5l8 8M13 5l-8 8" />
                    </svg>
                    {selectedAnswer} is incorrect. Answer: {puzzle.groundTruth}
                  </>
                )}
              </div>
              <p className="text-sm text-text-secondary mt-4 leading-relaxed">
                The sum is {puzzle.input.reduce((a, b) => a + b, 0)}. That&apos;s an odd number.
              </p>
              <p className="text-sm text-text-muted mt-3">
                Now let&apos;s see two different ways a model might approach this...
              </p>
            </div>
          ) : (
            <div className="text-sm text-text-muted italic">
              {selectedAnswer
                ? `You picked "${selectedAnswer}". Click "Check my answer" to see the ground truth.`
                : "Select your answer above, then check it here."}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
