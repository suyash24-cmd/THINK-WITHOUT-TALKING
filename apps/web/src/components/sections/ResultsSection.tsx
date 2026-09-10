"use client";

import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ComparisonBars from "@/components/ui/ComparisonBars";
import SourceBadge from "@/components/ui/SourceBadge";
import { conditions, humanExperiment } from "@/data/humanExperiments";
import { ParticipantSession } from "@/data/types";
import {
  aggregateByCondition,
  clearSession,
  formatDuration,
  loadSession,
  toPercent,
} from "@/lib/humanExperimentEngine";

export default function ResultsSection() {
  const exp = humanExperiment;
  const [session, setSession] = useState<ParticipantSession | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const timer = window.setTimeout(() => {
      setSession(loadSession(exp.id));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [exp.id]);

  const taskIdsByCondition = new Map<string, string[]>();
  if (session) {
    exp.conditions.forEach((c) =>
      taskIdsByCondition.set(
        c.id,
        session.trials.filter((t) => t.conditionId === c.id).map((t) => t.taskId)
      )
    );
  }

  const aggregates = session
    ? aggregateByCondition(
        session,
        exp.conditions.map((c) => c.id),
        taskIdsByCondition
      )
    : [];
  const unaided = aggregates.find((a) => a.conditionId === conditions.unaided.id);
  const assisted = aggregates.find((a) => a.conditionId === conditions.assisted.id);
  const ready = Boolean(session?.finished && unaided && assisted);

  const reset = () => {
    clearSession(exp.id);
    setSession(null);
  };

  const accDelta = ready && assisted && unaided ? assisted.accuracy - unaided.accuracy : 0;

  const interpretation = (): string[] => {
    if (!ready || !assisted || !unaided) return [];
    const lines: string[] = [];
    if (accDelta >= 0) {
      lines.push(
        `Your accuracy held or improved with AI assistance (${toPercent(assisted.accuracy)} vs ${toPercent(unaided.accuracy)} on small per-condition samples). Both hypotheses predict this, so accuracy alone cannot separate them.`
      );
    } else {
      lines.push(
        `Your accuracy was lower with AI assistance than without. With only ${assisted.trials} assisted trials, treat this as noise — and note that H_b predicts worse accuracy only when the assist misleads.`
      );
    }
    const timeDelta = assisted.avgTimeMs - unaided.avgTimeMs;
    if (Math.abs(timeDelta) < 1000) {
      lines.push("Your reaction times were statistically indistinguishable across conditions — you did not obviously rush or linger either way.");
    } else if (timeDelta > 0) {
      lines.push(`You spent more time with assistance enabled (${formatDuration(assisted.avgTimeMs)} vs ${formatDuration(unaided.avgTimeMs)}). Reading the hint costs time — that is real, and it matters for the "tool vs skill" question.`);
    } else {
      lines.push(`You answered faster with assistance (${formatDuration(assisted.avgTimeMs)} vs ${formatDuration(unaided.avgTimeMs)}). Faster answers with equal or better accuracy is the classic facilitation signature.`);
    }
    const calUnaided = unaided.calibrationError ?? 100;
    const calAssisted = assisted.calibrationError ?? 100;
    if (assisted.avgConfidence >= unaided.avgConfidence + 5 && calAssisted > calUnaided) {
      lines.push("Your confidence rose with assistance while your calibration got worse — you felt more certain without being more correct. That is exactly the pattern H_b predicts, not a proof it happened.");
    } else if (calAssisted <= calUnaided) {
      lines.push("Your confidence tracked your accuracy fairly in both conditions. Nothing here suggests offloading distorted your calibration.");
    }
    return lines;
  };

  return (
    <SectionWrapper
      id="results"
      number="04"
      title="Your Results"
      subtitle="What actually changed when the AI was in the room."
    >
      {!ready ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-sm text-text-secondary mb-2">
            Results are computed from a finished trial session. You haven{"'"}t completed one yet.
          </p>
          <a
            href="#experiment"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors"
          >
            Go to the experiment
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-4 gap-3">
            {[unaided, assisted].map((agg) => {
              if (!agg) return null;
              const isAssisted = agg.conditionId === conditions.assisted.id;
              return (
                <div
                  key={agg.conditionId}
                  className={`rounded-xl border p-5 ${
                    isAssisted
                      ? "border-blue-500/30 bg-blue-500/5"
                      : "border-amber-500/30 bg-amber-500/5"
                  }`}
                >
                  <p
                    className={`text-[10px] font-mono font-bold tracking-wider mb-3 ${
                      isAssisted ? "text-blue-400" : "text-amber"
                    }`}
                  >
                    {isAssisted ? conditions.assisted.shortLabel : conditions.unaided.shortLabel}
                  </p>
                  <p className="text-[10px] font-mono text-text-muted mb-2">
                    {agg.trials} trial{agg.trials === 1 ? "" : "s"}
                  </p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-text-muted">Accuracy</dt>
                      <dd className="font-mono text-text-primary">{toPercent(agg.accuracy)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-text-muted">Avg time</dt>
                      <dd className="font-mono text-text-primary">{formatDuration(agg.avgTimeMs)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-text-muted">Confidence</dt>
                      <dd className="font-mono text-text-primary">{Math.round(agg.avgConfidence)}%</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-text-muted">Calibration gap</dt>
                      <dd className="font-mono text-text-primary">
                        {agg.calibrationError !== null ? `${Math.round(agg.calibrationError)}` : "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
              Condition comparison
            </p>
            <ComparisonBars
              series={[
                { key: conditions.unaided.id, label: conditions.unaided.shortLabel, colorClass: "bg-amber-500/70 text-amber" },
                { key: conditions.assisted.id, label: conditions.assisted.shortLabel, colorClass: "bg-blue-500/70 text-blue-400" },
              ]}
              rows={[
                {
                  metric: "Accuracy",
                  values: {
                    [conditions.unaided.id]: unaided?.accuracy ?? null,
                    [conditions.assisted.id]: assisted?.accuracy ?? null,
                  },
                  display: {
                    [conditions.unaided.id]: toPercent(unaided?.accuracy ?? 0),
                    [conditions.assisted.id]: toPercent(assisted?.accuracy ?? 0),
                  },
                },
                {
                  metric: "Avg time",
                  lowerIsBetter: true,
                  values: {
                    [conditions.unaided.id]: unaided?.avgTimeMs ?? null,
                    [conditions.assisted.id]: assisted?.avgTimeMs ?? null,
                  },
                  display: {
                    [conditions.unaided.id]: formatDuration(unaided?.avgTimeMs ?? 0),
                    [conditions.assisted.id]: formatDuration(assisted?.avgTimeMs ?? 0),
                  },
                },
                {
                  metric: "Avg confidence",
                  values: {
                    [conditions.unaided.id]: unaided?.avgConfidence ?? null,
                    [conditions.assisted.id]: assisted?.avgConfidence ?? null,
                  },
                  display: {
                    [conditions.unaided.id]: `${Math.round(unaided?.avgConfidence ?? 0)}%`,
                    [conditions.assisted.id]: `${Math.round(assisted?.avgConfidence ?? 0)}%`,
                  },
                },
                {
                  metric: "Calibration gap",
                  lowerIsBetter: true,
                  values: {
                    [conditions.unaided.id]: unaided?.calibrationError ?? null,
                    [conditions.assisted.id]: assisted?.calibrationError ?? null,
                  },
                  display: {
                    [conditions.unaided.id]:
                      unaided?.calibrationError !== null ? `${Math.round(unaided?.calibrationError ?? 0)}` : "—",
                    [conditions.assisted.id]:
                      assisted?.calibrationError !== null ? `${Math.round(assisted?.calibrationError ?? 0)}` : "—",
                  },
                },
              ]}
            />
          </div>

          <div className="bg-elevated border border-border rounded-xl p-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              Reading your results
            </p>
            {interpretation().map((line, i) => (
              <p key={i} className="text-sm text-text-secondary leading-relaxed mb-3">
                {line}
              </p>
            ))}
            <div className="mt-4">
              <SourceBadge
                source={{
                  label: "our_experiment",
                  description:
                    "Interpretations are computed from your local session. They are observations about one person trying once — not scientific conclusions.",
                }}
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              What this does not prove
            </p>
            <ul className="space-y-2 text-sm text-text-secondary leading-relaxed">
              {exp.limitations.map((limitation, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber mt-1 shrink-0">→</span>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
              The published picture
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              The research you{"'"}re now the subject of is real and long-running. You can bracket
              your own numbers against it — but never confuse one person{"'"}s session with a study.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1 shrink-0">→</span>
                Fast, fluent, confident-but-wrong answers are the norm, not the exception. The
                Cognitive Reflection Test exists precisely because able reasoners answer intuitively.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1 shrink-0">→</span>
                People offload reasoning to available tools — and study what they offload less
                deeply afterward. Assistance can trade skill for performance.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1 shrink-0">→</span>
                When the tool is a reasoning model, the open question is whether we treat it as a
                scaffold or as a substitute — as something that talks so you do not have to.
              </li>
            </ul>
            <div className="mt-4">
              <SourceBadge
                source={{
                  label: "published_research",
                  description: "Primary sources for these claims are linked in the Research section.",
                }}
              />
            </div>
            <a
              href="#research"
              className="mt-4 inline-block text-xs font-mono text-accent hover:text-accent-dim transition-colors"
            >
              Read the sources →
            </a>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-text-muted">
              Session stored locally under{" "}
              <code className="bg-card px-1.5 py-0.5 rounded text-[10px] text-accent">twt:session:ai-assistance-and-human-reasoning</code>
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-elevated text-text-secondary rounded-lg text-sm border border-border hover:border-incorrect/50 transition-colors"
            >
              Reset my results
            </button>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}