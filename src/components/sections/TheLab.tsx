"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SourceBadge from "@/components/ui/SourceBadge";
import ReasoningSlider from "@/components/ui/ReasoningSlider";
import GroundTruthCard from "@/components/ui/GroundTruthCard";
import { puzzles } from "@/data/experiments";
import { LabResult, DifficultyLevel } from "@/data/types";
import { simulateLabResult } from "@/data/experiments";

export default function TheLab() {
  const [steps, setSteps] = useState(8);
  const [stateDim, setStateDim] = useState(64);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [puzzleIdx, setPuzzleIdx] = useState(1);
  const [result, setResult] = useState<LabResult | null>(null);
  const [history, setHistory] = useState<LabResult[]>([]);

  const filteredPuzzles = useMemo(
    () => puzzles.filter((p) => p.difficulty === difficulty),
    [difficulty]
  );

  const currentPuzzle = filteredPuzzles[puzzleIdx % filteredPuzzles.length] || filteredPuzzles[0];

  const runExperiment = useCallback(() => {
    const r = simulateLabResult(currentPuzzle.id, steps, stateDim, difficulty);
    setResult(r);
    setHistory((prev) => [r, ...prev].slice(0, 20));
  }, [currentPuzzle, steps, stateDim, difficulty]);

  const accuracy = useMemo(() => {
    if (history.length === 0) return null;
    const correct = history.filter((r) => r.correct).length;
    return correct / history.length;
  }, [history]);

  const didAutoRun = useRef(false);
  useEffect(() => {
    if (!didAutoRun.current) {
      didAutoRun.current = true;
      runExperiment();
    }
  }, [runExperiment]);

  return (
    <SectionWrapper
      id="lab"
      number="04"
      title="The Lab"
      subtitle="Run your own experiment. Change the parameters and observe the results."
    >
      <div className="mb-6">
        <SourceBadge
          source={{
            label: "our_experiment",
            description:
              "All results come from our recurrent toy model (tanh-RNN). No API call required — the experiment runs instantly.",
          }}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider">
            Experiment Controls
          </p>

          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Task Difficulty
            </label>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDifficulty(d);
                    setPuzzleIdx(0);
                    setResult(null);
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-mono capitalize border transition-all ${
                    difficulty === d
                      ? d === "easy"
                        ? "bg-correct/15 text-correct border-correct/30"
                        : d === "medium"
                        ? "bg-accent/15 text-accent border-accent/30"
                        : "bg-incorrect/15 text-incorrect border-incorrect/30"
                      : "bg-elevated text-text-muted border-border hover:border-accent/30"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <ReasoningSlider
            min={1}
            max={30}
            value={steps}
            onChange={setSteps}
            label="Reasoning Steps (T)"
            valueLabel={`${steps}`}
            ariaLabel="Reasoning steps"
          />

          <ReasoningSlider
            min={8}
            max={128}
            step={8}
            value={stateDim}
            onChange={setStateDim}
            label="State Dimension"
            valueLabel={`${stateDim}`}
            accent="amber"
            ariaLabel="State dimension"
          />

          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Example
            </label>
            <div className="space-y-1">
              {filteredPuzzles.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPuzzleIdx(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                    puzzleIdx === i
                      ? "bg-elevated text-text-primary border-accent/50"
                      : "bg-card text-text-muted border-border hover:border-border"
                  }`}
                >
                  <span className="font-mono">[{p.input.slice(0, 4).join(", ")}{p.input.length > 4 ? ", ..." : ""}]</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runExperiment}
            className="w-full py-3 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dim transition-colors"
          >
            Run Experiment
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Result Card */}
          <div
            className={`bg-card border rounded-xl p-6 transition-all ${
              result
                ? result.correct
                  ? "border-correct/30"
                  : "border-incorrect/30"
                : "border-border"
            }`}
          >
            {result ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-mono text-accent uppercase tracking-wider">
                    Experiment Result
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-text-muted">
                    run #{history.length}
                  </span>
                </div>

                <div className="mb-6">
                  <GroundTruthCard
                    prediction={result.prediction}
                    groundTruth={result.groundTruth}
                    correct={result.correct}
                    title="Prediction vs Ground Truth"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-elevated rounded-lg p-3 border border-border">
                    <p className="text-[10px] font-mono text-text-muted mb-1">STEPS (T)</p>
                    <p className="text-lg font-mono font-bold text-accent">{result.steps}</p>
                  </div>
                  <div className="bg-elevated rounded-lg p-3 border border-border">
                    <p className="text-[10px] font-mono text-text-muted mb-1">STATE DIM</p>
                    <p className="text-lg font-mono font-bold text-amber">{result.stateDim}</p>
                  </div>
                  <div className="bg-elevated rounded-lg p-3 border border-border">
                    <p className="text-[10px] font-mono text-text-muted mb-1">CONFIDENCE</p>
                    <p className="text-lg font-mono font-bold text-text-primary">
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Latent State Visualization */}
                <div className="mb-4">
                  <p className="text-xs font-mono text-text-muted mb-3">LATENT STATE TRAJECTORY</p>
                  <div className="flex gap-1 overflow-x-auto pb-2">
                    {result.latentStates.map((state, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1 shrink-0"
                      >
                        <span className="text-[9px] font-mono text-text-muted">
                          {state.step}
                        </span>
                        <div className="flex gap-px">
                          {state.values.map((v, j) => {
                            const normalized = (v + 1) / 2;
                            const hue = normalized * 120;
                            return (
                              <div
                                key={j}
                                className="w-2 h-8 rounded-sm"
                                style={{
                                  backgroundColor: `hsl(${hue}, 70%, ${30 + normalized * 30}%)`,
                                }}
                                title={`h[${state.step}][${j}] = ${v.toFixed(3)}`}
                              />
                            );
                          })}
                        </div>
                        <span className="text-[9px] font-mono text-text-muted">
                          h<sub>{state.step}</sub>
                        </span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-1 shrink-0 ml-2">
                      <span className="text-[9px] font-mono text-correct">→</span>
                      <div className="flex items-center justify-center w-2 h-8 rounded-sm bg-correct/20 border border-correct/40">
                        <span className="text-[8px] font-mono text-correct font-bold">
                          {result.prediction[0]}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-correct">out</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>
                    <span className="text-accent font-mono">Input:</span>{" "}
                    [{currentPuzzle.input.slice(0, 5).join(", ")}
                    {currentPuzzle.input.length > 5 ? ", …" : ""}] —{" "}
                    {currentPuzzle.description}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-elevated border border-border flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </div>
                <p className="text-sm text-text-muted">
                  Adjust the parameters and click &quot;Run Experiment&quot; to begin.
                </p>
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-mono text-accent uppercase tracking-wider">
                  Run History
                </p>
                {accuracy !== null && (
                  <span className="text-xs font-mono text-text-secondary">
                    Running accuracy: {(accuracy * 100).toFixed(0)}%
                    <span className="text-text-muted ml-1">({history.length} runs)</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {history.map((r, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${
                      r.correct ? "bg-correct" : "bg-incorrect"
                    }`}
                    title={`Run ${history.length - i}: ${r.correct ? "Correct" : "Incorrect"} (T=${r.steps}, dim=${r.stateDim})`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Experiment Question */}
          <div className="bg-elevated border border-border rounded-xl p-6">
            <p className="text-xs font-mono text-amber uppercase tracking-wider mb-3">
              Think About It
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">→</span>
                What happens when you increase T from 1 to 30?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">→</span>
                How does state dimension affect the result?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">→</span>
                Does more computation always mean better answers?
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">→</span>
                Try hard difficulty with low state dimension. What happens?
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
