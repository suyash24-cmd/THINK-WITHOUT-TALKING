import { ConditionAggregate, ExperimentDefinition, ParticipantSession, TrialResult } from "@/data/types";

const SESSION_PREFIX = "twt:session:";

export function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Interleave conditions across the task list so neither condition always
 * appears first. Deterministic order guarantees every visitor sees the same
 * balanced session, which keeps the self-experiment reproducible.
 */
export function buildConditionOrder(taskIds: string[], conditionIds: string[]): string[] {
  const order: string[] = [];
  taskIds.forEach((taskId, i) => {
    order.push(conditionIds[i % conditionIds.length]);
  });
  return order;
}

export function createSession(
  experiment: ExperimentDefinition,
  taskIds: string[]
): ParticipantSession {
  const now = new Date().toISOString();
  return {
    id: createSessionId(),
    expKey: experiment.id,
    createdAt: now,
    updatedAt: now,
    conditionOrder: buildConditionOrder(taskIds, experiment.conditions.map((c) => c.id)),
    trials: [],
    finished: false,
  };
}

export function recordTrial(session: ParticipantSession, trial: TrialResult): ParticipantSession {
  return {
    ...session,
    updatedAt: new Date().toISOString(),
    trials: [...session.trials, trial],
  };
}

export function sessionKey(expKey: string): string {
  return `${SESSION_PREFIX}${expKey}`;
}

export function loadSession(expKey: string): ParticipantSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(sessionKey(expKey));
    return raw ? (JSON.parse(raw) as ParticipantSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: ParticipantSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(sessionKey(session.expKey), JSON.stringify(session));
  } catch {
    // storage may be unavailable (private mode); the session still works in-memory
  }
}

export function clearSession(expKey: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(sessionKey(expKey));
}

export function calibrationError(confidence: number, correct: boolean): number {
  return Math.abs(confidence - (correct ? 100 : 0));
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms)) return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const s = Math.round(ms / 100) / 10;
  const min = Math.floor(s / 60);
  if (min > 0) return `${min}m ${Math.round(s % 60)}s`;
  return `${s.toFixed(1)}s`;
}

export function aggregateByCondition(
  session: ParticipantSession,
  conditionIds: string[],
  tasksByCondition: Map<string, string[]>
): ConditionAggregate[] {
  return conditionIds.map((conditionId) => {
    const trials = session.trials.filter((t) => t.conditionId === conditionId);
    const correctCount = trials.filter((t) => t.correct).length;
    const accuracy = trials.length ? correctCount / trials.length : 0;
    const avgTimeMs = trials.length
      ? trials.reduce((sum, t) => sum + t.timeMs, 0) / trials.length
      : 0;
    const avgConfidence = trials.length
      ? trials.reduce((sum, t) => sum + t.confidence, 0) / trials.length
      : 0;
    const calibration =
      trials.length > 0
        ? trials.reduce((sum, t) => sum + calibrationError(t.confidence, t.correct), 0) / trials.length
        : null;

    return {
      conditionId,
      taskIds: tasksByCondition.get(conditionId) ?? [],
      trials: trials.length,
      correctCount,
      accuracy,
      avgTimeMs,
      avgConfidence,
      calibrationError: calibration,
    };
  });
}

export function sessionProgress(session: ParticipantSession, totalTasks: number): number {
  if (totalTasks === 0) return 0;
  return Math.min(1, session.trials.length / totalTasks);
}

export function toPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}