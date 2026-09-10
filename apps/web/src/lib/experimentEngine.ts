import { LatentState, LabResult, DifficultyLevel } from "@/data/types";
import { puzzles, generateLatentStates, simulateLabResult } from "@/data/experiments";

export function getInitialStates(puzzleId: string, stateDim: number): LatentState[] {
  const puzzle = puzzles.find((p) => p.id === puzzleId) || puzzles[0];
  return generateLatentStates(puzzle, 0, stateDim);
}

export function runExperiment(
  puzzleId: string,
  numSteps: number,
  stateDim: number,
  difficulty: DifficultyLevel
): LabResult {
  return simulateLabResult(puzzleId, numSteps, stateDim, difficulty);
}

export function getAccuracyCurve(
  steps: number[],
  difficulty: DifficultyLevel,
  stateDim: number
): { step: number; accuracy: number }[] {
  const baseAcc: Record<DifficultyLevel, number> = {
    easy: 0.97,
    medium: 0.94,
    hard: 0.76,
  };

  return steps.map((t) => {
    const stepFactor = Math.min(1, 0.3 + 0.7 * (1 - Math.exp(-t / 4)));
    const dimFactor = Math.min(1, 0.4 + 0.6 * (stateDim / 128));
    const degrade =
      t > 15 ? 1 - (t - 15) * 0.008 * (difficulty === "hard" ? 3 : 1) : 1;
    return {
      step: t,
      accuracy: Math.max(0.05, Math.min(0.99, baseAcc[difficulty] * stepFactor * dimFactor * degrade)),
    };
  });
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
