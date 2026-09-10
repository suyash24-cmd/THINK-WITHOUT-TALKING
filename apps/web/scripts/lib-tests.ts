import { strict as assert } from "node:assert";

import {
  buildConditionOrder,
  createSession,
  recordTrial,
  aggregateByCondition,
  calibrationError,
  formatDuration,
  sessionProgress,
  sessionKey,
  toPercent,
} from "@/lib/humanExperimentEngine";
import {
  clamp,
  formatPercent,
  runExperiment,
  getAccuracyCurve,
  getInitialStates,
} from "@/lib/experimentEngine";
import { humanExperiment, tasks } from "@/data/humanExperiments";
import { puzzles } from "@/data/experiments";

let passed = 0;
function ok(condition: unknown, name: string) {
  assert.ok(condition, name);
  passed++;
}

// ── humanExperimentEngine ──────────────────────────────────────────────

const taskIds = tasks.map((t) => t.id);
const conditionIds = ["unaided", "ai-assisted"];

ok(taskIds.length === 5, "battery contains exactly 5 tasks");

const order = buildConditionOrder(taskIds, conditionIds);
ok(
  JSON.stringify(order) ===
    JSON.stringify(["unaided", "ai-assisted", "unaided", "ai-assisted", "unaided"]),
  "condition order alternates starting with unaided"
);

const session = createSession(humanExperiment, taskIds);
ok(session.expKey === humanExperiment.id, "session carries experiment key");
ok(session.finished === false, "session starts unfinished");
ok(session.trials.length === 0, "session starts with no trials");
ok(session.conditionOrder.length === 5, "session has one condition per task");
ok(session.id.length > 0, "session id generated");

const trial = {
  taskId: taskIds[0],
  conditionId: order[0],
  selectedIndex: 0,
  correct: true,
  timeMs: 5000,
  confidence: 80,
  usedAssist: false,
  at: new Date().toISOString(),
};

const updated = recordTrial(session, trial);
ok(session.trials.length === 0, "recordTrial is immutable (source untouched)");
ok(updated.trials.length === 1, "recordTrial appends a trial");

const aggregates = aggregateByCondition(updated, conditionIds, new Map());
const unaided = aggregates.find((a) => a.conditionId === "unaided");
ok(unaided !== undefined, "aggregate contains unaided");
ok(unaided!.trials === 1, "aggregate counts trials");
ok(unaided!.correctCount === 1, "aggregate counts correct");
ok(unaided!.accuracy === 1, "aggregate accuracy for single correct trial");
ok(unaided!.avgTimeMs === 5000, "aggregate averages time");
ok(unaided!.avgConfidence === 80, "aggregate averages confidence");
ok(unaided!.calibrationError === 20, "aggregate calibration 100 - 80");

ok(calibrationError(50, true) === 50, "calibration overconfident-correct");
ok(calibrationError(0, false) === 0, "calibration perfectly uncertain-wrong");

ok(formatDuration(650) === "650ms", "format sub-second");
ok(formatDuration(6500) === "6.5s", "format seconds");
ok(formatDuration(65000) === "1m 5s", "format minutes");
ok(formatDuration(NaN) === "—", "format invalid");

ok(sessionProgress(updated, 5) === 0.2, "progress 1/5");
ok(sessionProgress(session, 0) === 0, "progress guards zero total");

ok(toPercent(0.67) === "67%", "toPercent rounds");

ok(
  sessionKey("ai-assistance-and-human-reasoning") ===
    "twt:session:ai-assistance-and-human-reasoning",
  "storage key prefix contract"
);

// ── experimentEngine ──────────────────────────────────────────────────

ok(clamp(150, 0, 100) === 100, "clamp caps high");
ok(clamp(-5, 0, 100) === 0, "clamp floors low");
ok(clamp(50, 0, 100) === 50, "clamp passes through");
ok(formatPercent(0.1234) === "12.3%", "formatPercent one decimal");

const result = runExperiment(puzzles[0].id, 8, 32, "medium");
ok(typeof result.prediction === "string", "experiment produces a prediction");
ok(typeof result.correct === "boolean", "experiment produces a verdict");
ok(result.latentStates.length > 0, "experiment produces latent states");

const curve = getAccuracyCurve([1, 8, 20], "hard", 64);
ok(curve.length === 3, "curve covers requested steps");
ok(curve[1].step === 8, "curve preserves step values");
ok(curve[0].accuracy < curve[1].accuracy, "accuracy rises early");
ok(curve[2].accuracy < curve[1].accuracy, "accuracy degrades at high T on hard");

const states = getInitialStates("jellybean", 16);
ok(states.length === 1, "initial latent state present");
ok(Array.isArray(states[0].values), "latent state has value vector");

console.log(`\nAll ${passed} engine assertions passed.`);
console.log("(model results are seeded placeholders — labeled OUR EXPERIMENT in the product)");