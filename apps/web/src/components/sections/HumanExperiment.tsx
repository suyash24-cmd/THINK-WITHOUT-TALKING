"use client";

import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GroundTruthCard from "@/components/ui/GroundTruthCard";
import { conditions, humanExperiment, tasks, aiAssist } from "@/data/humanExperiments";
import { citations } from "@/data/citations";
import { ParticipantSession, TrialResult } from "@/data/types";
import {
  aggregateByCondition,
  clearSession,
  createSession,
  formatDuration,
  loadSession,
  recordTrial,
  saveSession,
  toPercent,
} from "@/lib/humanExperimentEngine";

type Phase = "intro" | "tasks" | "summary";

const cite = (id: string): string => {
  const c = citations.find((c) => c.id === id);
  return c ? `${c.authors} (${c.year})` : id;
};

export default function HumanExperiment() {
  const exp = humanExperiment;
  const taskIds = tasks.map((t) => t.id);

  const [phase, setPhase] = useState<Phase>("intro");
  const [session, setSession] = useState<ParticipantSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [usedAssist, setUsedAssist] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [verdict, setVerdict] = useState<TrialResult | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const startRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const timer = window.setTimeout(() => {
      const stored = loadSession(exp.id);
      if (!stored) return;
      setSession(stored);
      if (stored.finished || stored.trials.length >= taskIds.length) {
        setPhase("summary");
      } else if (stored.trials.length > 0) {
        setPhase("tasks");
        setCurrentIndex(stored.trials.length);
        startRef.current = Date.now();
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [exp.id, taskIds.length]);

  useEffect(() => {
    if (phase !== "tasks") return;
    const timer = window.setInterval(
      () => setElapsed(Date.now() - startRef.current),
      500
    );
    return () => window.clearInterval(timer);
  }, [phase, currentIndex]);

  const resetWorking = () => {
    setSelectedIndex(null);
    setConfidence(50);
    setUsedAssist(false);
    setShowHint(false);
    setVerdict(null);
  };

  const begin = () => {
    const fresh = createSession(exp, taskIds);
    setSession(fresh);
    saveSession(fresh);
    resetWorking();
    setCurrentIndex(0);
    setPhase("tasks");
    startRef.current = Date.now();
  };

  const submit = () => {
    if (!session || selectedIndex === null) return;
    const task = tasks[currentIndex];
    const trial: TrialResult = {
      taskId: task.id,
      conditionId: session.conditionOrder[currentIndex],
      selectedIndex,
      correct: selectedIndex === task.correctIndex,
      timeMs: Date.now() - startRef.current,
      confidence,
      usedAssist,
      at: new Date().toISOString(),
    };
    const next = recordTrial(session, trial);
    setSession(next);
    saveSession(next);
    setVerdict(trial);
  };

  const nextTask = () => {
    if (!session) return;
    const done = currentIndex + 1 >= taskIds.length;
    if (done) {
      const final = {
        ...session,
        finished: true,
        updatedAt: new Date().toISOString(),
      };
      setSession(final);
      saveSession(final);
      setPhase("summary");
    } else {
      setCurrentIndex(currentIndex + 1);
      resetWorking();
      startRef.current = Date.now();
    }
  };

  const reset = () => {
    clearSession(exp.id);
    setSession(null);
    resetWorking();
    setCurrentIndex(0);
    setPhase("intro");
  };

  const task = tasks[currentIndex];
  const condition =
    session && phase !== "intro"
      ? session.conditionOrder[currentIndex] === conditions.assisted.id
        ? conditions.assisted
        : conditions.unaided
      : conditions.unaided;
  const answered = verdict !== null;
  const tasksByCondition = new Map<string, string[]>();
  if (session) {
    exp.conditions.forEach((c) => {
      tasksByCondition.set(
        c.id,
        taskIds.filter((_, i) => session.conditionOrder[i] === c.id)
      );
    });
  }
  const aggregate = session
    ? aggregateByCondition(session, exp.conditions.map((c) => c.id), tasksByCondition)
    : [];

  return (
    <SectionWrapper
      id="experiment"
      number="03"
      title="Your Experiment"
      subtitle="Five reasoning tasks. Two conditions. One session you can inspect, restart, and judge."
    >
      <div className="space-y-6">
        {/* Progress rail */}
        <div
          className="flex items-center gap-2 flex-wrap"
          role="list"
          aria-label="Task progress"
        >
          {taskIds.map((id, i) => {
            const done = session?.trials.some((t) => t.taskId === id);
            const cid = session?.conditionOrder[i];
            return (
              <div key={id} role="listitem" className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                    i === currentIndex && phase === "tasks"
                      ? "border-accent text-accent bg-accent/10"
                      : done
                        ? "border-border text-text-secondary bg-elevated"
                        : "border-border text-text-muted bg-card"
                  }`}
                >
                  {i + 1}
                  <span className="lowercase text-text-muted">
                    {cid === conditions.assisted.id ? "AI" : "alone"}
                  </span>
                </span>
                {i < taskIds.length - 1 && (
                  <span className="w-3 h-px bg-border" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>

        {/* Intro */}
        {phase === "intro" && (
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
              Session briefing
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {exp.conditions.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-lg border p-4 ${
                    c.aiAssisted
                      ? "border-blue-500/30 bg-blue-500/5"
                      : "border-amber-500/30 bg-amber-500/5"
                  }`}
                >
                  <p
                    className={`text-[10px] font-mono font-bold tracking-wider ${
                      c.aiAssisted ? "text-blue-400" : "text-amber"
                    }`}
                  >
                    {c.shortLabel}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">{c.description}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-2 text-sm text-text-secondary mb-6">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">→</span>
                5 tasks are balanced across the two conditions — neither one always comes first.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">→</span>
                A timer records how long you take; a slider records how confident you are.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1 shrink-0">→</span>
                In the AI-assisted tasks you may reveal a reasoning hint before answering.
              </li>
            </ul>
            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              This is a self-experiment: results are computed in your browser and
              nothing is uploaded. You can verify, restart, or throw them away at any time.
            </p>
            <button
              onClick={begin}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors"
            >
              Begin session
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 2l4 5-4 5M2 7h11" />
              </svg>
            </button>
          </div>
        )}

        {/* Task */}
        {phase === "tasks" && task && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-text-muted">
                  {currentIndex + 1}
                </span>
                <div>
                  <p className="text-sm font-bold text-text-primary">{task.title}</p>
                  <p className="text-[10px] font-mono text-text-muted">{task.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border ${
                    condition.aiAssisted
                      ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                      : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {condition.shortLabel}
                </span>
                <span className="text-xs font-mono text-text-muted">
                  {formatDuration(elapsed)}
                </span>
              </div>
            </div>

            <p className="text-lg text-text-primary leading-relaxed mb-6">
              {task.prompt}
            </p>

            {!answered && condition.aiAssisted && !usedAssist && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowHint(!showHint);
                    setUsedAssist(true);
                  }}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
                  aria-expanded={showHint}
                >
                  {showHint ? "Hide" : "Reveal"} an AI reasoning hint
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className={`transition-transform ${showHint ? "rotate-180" : ""}`}>
                    <path d="M1 3l4 4 4-4" />
                  </svg>
                </button>
                {showHint && (
                  <div className="mt-2 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 text-sm text-text-secondary leading-relaxed">
                    {aiAssist(task.id)}
                  </div>
                )}
              </div>
            )}

            {!answered ? (
              <>
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {task.options.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedIndex(i)}
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
                    How confident are you? <span className="font-mono text-accent">{confidence}%</span>
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
                  onClick={submit}
                  disabled={selectedIndex === null}
                  className="px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit answer
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <GroundTruthCard
                  prediction={task.options[verdict.selectedIndex]}
                  groundTruth={task.options[task.correctIndex]}
                  correct={verdict.correct}
                  title="Your answer vs ground truth"
                />
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-elevated rounded-lg p-4 border border-border">
                    <p className="text-[10px] font-mono text-text-muted mb-1">TIME</p>
                    <p className="font-mono font-bold text-text-primary">
                      {formatDuration(verdict.timeMs)}
                    </p>
                  </div>
                  <div className="bg-elevated rounded-lg p-4 border border-border">
                    <p className="text-[10px] font-mono text-text-muted mb-1">CONFIDENCE</p>
                    <p className="font-mono font-bold text-text-primary">{verdict.confidence}%</p>
                  </div>
                  <div className="bg-elevated rounded-lg p-4 border border-border">
                    <p className="text-[10px] font-mono text-text-muted mb-1">ASSIST USED</p>
                    <p className="font-mono font-bold text-text-primary">
                      {condition.aiAssisted ? (verdict.usedAssist ? "Yes" : "No") : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="bg-elevated border border-border rounded-lg p-4">
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
                  {task.publishedWork.length > 0 && (
                    <p className="mt-3 text-[10px] font-mono text-text-muted">
                      SOURCE: {task.publishedWork.map((p) => cite(p.citationId)).join(", ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={nextTask}
                  className="px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors"
                >
                  {currentIndex + 1 >= taskIds.length ? "Finish and see results" : "Next task"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {phase === "summary" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
              Session complete
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              You answered {session?.trials.length} of {taskIds.length} tasks. Compare your
              conditions below — full charts and the research context live in the next section.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {aggregate.map((agg) => {
                const c =
                  agg.conditionId === conditions.assisted.id
                    ? conditions.assisted
                    : conditions.unaided;
                return (
                  <div
                    key={agg.conditionId}
                    className={`rounded-lg border p-4 ${
                      c.aiAssisted
                        ? "border-blue-500/30 bg-blue-500/5"
                        : "border-amber-500/30 bg-amber-500/5"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-mono font-bold tracking-wider mb-3 ${
                        c.aiAssisted ? "text-blue-400" : "text-amber"
                      }`}
                    >
                      {c.shortLabel}
                    </p>
                    <dl className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-text-muted">Accuracy</dt>
                        <dd className="font-mono text-text-primary">
                          {agg.trials > 0 ? toPercent(agg.accuracy) : "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-text-muted">Avg time</dt>
                        <dd className="font-mono text-text-primary">
                          {agg.trials > 0 ? formatDuration(agg.avgTimeMs) : "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-text-muted">Avg confidence</dt>
                        <dd className="font-mono text-text-primary">
                          {agg.trials > 0 ? `${Math.round(agg.avgConfidence)}%` : "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#results"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors"
              >
                See your full results
              </a>
              <button
                onClick={reset}
                className="px-5 py-2.5 bg-elevated text-text-secondary rounded-lg text-sm border border-border hover:border-accent/50 transition-colors"
              >
                Restart the session
              </button>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}