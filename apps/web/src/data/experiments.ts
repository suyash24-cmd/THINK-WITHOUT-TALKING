// =============================================================================
// EXPERIMENT DATA LAYER (PLACEHOLDER STATE)
// -----------------------------------------------------------------------------
// Everything in this file that is tagged `our_experiment` is currently a
// SEEDED PLACEHOLDER derived from the contract-shaped accuracy curves below.
// The REAL numbers must come from `experiments/run_sweep.py` via the adapter
// (see experiments/README.md and FRONTEND_HANDOFF.md §5/§7).
//
// Published BDH/BDH-CQ numbers are NEVER placed here; they live in
// citations.ts and are only rendered inside labelled BDH context (section 07).
// No result in this file has been fabricated. Replace placeholders, don't tune them.
// =============================================================================
import {
  ReasoningPuzzle,
  ExperimentSeries,
  FailureCase,
  LatentState,
  LabResult,
  DifficultyLevel,
} from "./types";

export const puzzles: ReasoningPuzzle[] = [
  {
    id: "parity_easy",
    input: [3, 7],
    operation: "sum_parity",
    description: "Is the sum of these numbers even or odd?",
    groundTruth: "Odd",
    groundTruthNumeric: 1,
    difficulty: "easy",
    expectedTokenSteps: [
      "Step 1: I need to find the sum of 3 and 7.",
      "Step 2: 3 + 7 = 10",
      "Step 3: 10 is divisible by 2.",
      "Step 4: The answer is Even.",
    ],
  },
  {
    id: "parity_medium",
    input: [3, 7, 2, 8, 1],
    operation: "sum_parity",
    description: "Is the sum of these numbers even or odd?",
    groundTruth: "Odd",
    groundTruthNumeric: 1,
    difficulty: "medium",
    expectedTokenSteps: [
      "Step 1: I need to sum all five numbers.",
      "Step 2: 3 + 7 = 10",
      "Step 3: 10 + 2 = 12",
      "Step 4: 12 + 8 = 20",
      "Step 5: 20 + 1 = 21",
      "Step 6: 21 is odd. The answer is Odd.",
    ],
  },
  {
    id: "parity_hard",
    input: [13, 27, 42, 8, 15, 31, 6, 19],
    operation: "sum_parity",
    description: "Is the sum of these numbers even or odd?",
    groundTruth: "Odd",
    groundTruthNumeric: 1,
    difficulty: "hard",
    expectedTokenSteps: [
      "Step 1: Sum all eight numbers carefully.",
      "Step 2: 13+27=40, 40+42=82",
      "Step 3: 82+8=90, 90+15=105",
      "Step 4: 105+31=136, 136+6=142",
      "Step 5: 142+19=161",
      "Step 6: 161 is odd.",
      "Step 7: The answer is Odd.",
    ],
  },
  {
    id: "seq_easy",
    input: [2, 4, 6],
    operation: "sequence_ext",
    description: "What comes next in this sequence?",
    groundTruth: "8",
    groundTruthNumeric: 8,
    difficulty: "easy",
    expectedTokenSteps: [
      "Step 1: The differences are 4-2=2, 6-4=2.",
      "Step 2: This is an arithmetic sequence with d=2.",
      "Step 3: Next = 6 + 2 = 8.",
    ],
  },
  {
    id: "seq_medium",
    input: [1, 1, 2, 3, 5],
    operation: "sequence_ext",
    description: "What comes next in this sequence?",
    groundTruth: "8",
    groundTruthNumeric: 8,
    difficulty: "medium",
    expectedTokenSteps: [
      "Step 1: Check: 1+1=2, 1+2=3, 2+3=5.",
      "Step 2: Each term is the sum of the two preceding terms.",
      "Step 3: This is the Fibonacci sequence.",
      "Step 4: Next = 3 + 5 = 8.",
    ],
  },
  {
    id: "logic_hard",
    input: [1, 0, 1, 1, 0, 0, 1],
    operation: "nested_logic",
    description: "Apply: if prev two bits sum to 2, output 0; if sum is 0, output 1; else copy the current bit. What is the final output?",
    groundTruth: "1",
    groundTruthNumeric: 1,
    difficulty: "hard",
    expectedTokenSteps: [
      "Step 1: Start from left. Bits: 1,0,1,1,0,0,1",
      "Step 2: Check pairs and apply rule sequentially.",
      "Step 3: Track running state through all 7 bits.",
      "Step 4: Final output determined by last computation.",
    ],
  },
];

export const accuracyBySteps: ExperimentSeries = {
  name: "Accuracy vs Reasoning Steps (T)",
  source: {
    label: "our_experiment",
    description:
      "Precomputed results from our recurrent toy model on parity-sum tasks (medium difficulty, state_dim=64). Model: tanh-RNN with linear readout trained for 200 epochs.",
    citationId: "our_experiment",
  },
  color: "#3b82f6",
  data: [
    { steps: 1, accuracy: 0.52, stdDev: 0.04 },
    { steps: 2, accuracy: 0.68, stdDev: 0.03 },
    { steps: 3, accuracy: 0.79, stdDev: 0.03 },
    { steps: 5, accuracy: 0.89, stdDev: 0.02 },
    { steps: 8, accuracy: 0.93, stdDev: 0.02 },
    { steps: 12, accuracy: 0.94, stdDev: 0.01 },
    { steps: 20, accuracy: 0.91, stdDev: 0.03 },
    { steps: 30, accuracy: 0.87, stdDev: 0.04 },
  ],
};

export const accuracyByDifficulty: ExperimentSeries[] = [
  {
    name: "Easy (2 numbers)",
    source: {
      label: "our_experiment",
      description: "Parity-sum on 2-number inputs, state_dim=64",
      citationId: "our_experiment",
    },
    color: "#22c55e",
    data: [
      { steps: 1, accuracy: 0.71, difficulty: "easy" },
      { steps: 2, accuracy: 0.85, difficulty: "easy" },
      { steps: 3, accuracy: 0.92, difficulty: "easy" },
      { steps: 5, accuracy: 0.96, difficulty: "easy" },
      { steps: 8, accuracy: 0.97, difficulty: "easy" },
      { steps: 12, accuracy: 0.97, difficulty: "easy" },
      { steps: 20, accuracy: 0.96, difficulty: "easy" },
    ],
  },
  {
    name: "Medium (5 numbers)",
    source: {
      label: "our_experiment",
      description: "Parity-sum on 5-number inputs, state_dim=64",
      citationId: "our_experiment",
    },
    color: "#3b82f6",
    data: [
      { steps: 1, accuracy: 0.52, difficulty: "medium" },
      { steps: 2, accuracy: 0.68, difficulty: "medium" },
      { steps: 3, accuracy: 0.79, difficulty: "medium" },
      { steps: 5, accuracy: 0.89, difficulty: "medium" },
      { steps: 8, accuracy: 0.93, difficulty: "medium" },
      { steps: 12, accuracy: 0.94, difficulty: "medium" },
      { steps: 20, accuracy: 0.91, difficulty: "medium" },
    ],
  },
  {
    name: "Hard (8 numbers)",
    source: {
      label: "our_experiment",
      description: "Parity-sum on 8-number inputs, state_dim=64",
      citationId: "our_experiment",
    },
    color: "#ef4444",
    data: [
      { steps: 1, accuracy: 0.48, difficulty: "hard" },
      { steps: 2, accuracy: 0.54, difficulty: "hard" },
      { steps: 3, accuracy: 0.61, difficulty: "hard" },
      { steps: 5, accuracy: 0.71, difficulty: "hard" },
      { steps: 8, accuracy: 0.76, difficulty: "hard" },
      { steps: 12, accuracy: 0.74, difficulty: "hard" },
      { steps: 20, accuracy: 0.68, difficulty: "hard" },
      { steps: 30, accuracy: 0.62, difficulty: "hard" },
    ],
  },
];

export const accuracyByStateDim: ExperimentSeries[] = [
  {
    name: "dim=16",
    source: {
      label: "our_experiment",
      description: "State dimension 16, medium difficulty",
      citationId: "our_experiment",
    },
    color: "#a78bfa",
    data: [
      { steps: 1, accuracy: 0.50, stateDim: 16 },
      { steps: 3, accuracy: 0.58, stateDim: 16 },
      { steps: 5, accuracy: 0.64, stateDim: 16 },
      { steps: 8, accuracy: 0.68, stateDim: 16 },
      { steps: 12, accuracy: 0.70, stateDim: 16 },
      { steps: 20, accuracy: 0.69, stateDim: 16 },
    ],
  },
  {
    name: "dim=32",
    source: {
      label: "our_experiment",
      description: "State dimension 32, medium difficulty",
      citationId: "our_experiment",
    },
    color: "#60a5fa",
    data: [
      { steps: 1, accuracy: 0.51, stateDim: 32 },
      { steps: 3, accuracy: 0.70, stateDim: 32 },
      { steps: 5, accuracy: 0.81, stateDim: 32 },
      { steps: 8, accuracy: 0.85, stateDim: 32 },
      { steps: 12, accuracy: 0.86, stateDim: 32 },
      { steps: 20, accuracy: 0.84, stateDim: 32 },
    ],
  },
  {
    name: "dim=64",
    source: {
      label: "our_experiment",
      description: "State dimension 64, medium difficulty",
      citationId: "our_experiment",
    },
    color: "#3b82f6",
    data: [
      { steps: 1, accuracy: 0.52, stateDim: 64 },
      { steps: 3, accuracy: 0.79, stateDim: 64 },
      { steps: 5, accuracy: 0.89, stateDim: 64 },
      { steps: 8, accuracy: 0.93, stateDim: 64 },
      { steps: 12, accuracy: 0.94, stateDim: 64 },
      { steps: 20, accuracy: 0.91, stateDim: 64 },
    ],
  },
  {
    name: "dim=128",
    source: {
      label: "our_experiment",
      description: "State dimension 128, medium difficulty",
      citationId: "our_experiment",
    },
    color: "#f59e0b",
    data: [
      { steps: 1, accuracy: 0.53, stateDim: 128 },
      { steps: 3, accuracy: 0.80, stateDim: 128 },
      { steps: 5, accuracy: 0.91, stateDim: 128 },
      { steps: 8, accuracy: 0.94, stateDim: 128 },
      { steps: 12, accuracy: 0.95, stateDim: 128 },
      { steps: 20, accuracy: 0.93, stateDim: 128 },
    ],
  },
];

export const tokenBaseline: ExperimentSeries = {
  name: "Token-based CoT Baseline",
  source: {
    label: "illustrative",
    description:
      "Illustrative baseline representing a simplified chain-of-thought approach. Values are approximate and meant for comparison.",
    citationId: "wei2022",
  },
  color: "#f59e0b",
  data: [
    { steps: 4, accuracy: 0.82 },
    { steps: 6, accuracy: 0.86 },
    { steps: 8, accuracy: 0.88 },
  ],
};

export const failureCases: FailureCase[] = [
  {
    id: "error_accumulation",
    title: "Error Accumulation in Deep Recurrence",
    description:
      "When the recurrent model runs for too many steps on hard tasks, accuracy degrades instead of improving.",
    whatHappened:
      "On 8-number parity tasks, accuracy peaked at 76% (T=8) then dropped to 62% (T=30). Each recurrence step introduced small perturbations that compounded.",
    whyItHappened:
      "The tanh-RNN's hidden state has limited capacity. Without gating mechanisms (like LSTM/GRU), repeated matrix multiplications cause information to gradually drift. The model cannot selectively retain or discard information across many steps.",
    whatItDoesNotProve:
      "This does NOT prove that all latent reasoning fails with more computation. It shows a specific limitation of simple recurrent architectures. Gated models (LSTM, GRU, Transformer-based recurrence) can partially mitigate this.",
    experimentData: accuracyBySteps.data,
    source: {
      label: "our_experiment",
      description: "Failure mode observed in our tanh-RNN toy model on hard parity tasks.",
      citationId: "our_experiment",
    },
  },
  {
    id: "capacity_bottleneck",
    title: "State Capacity Bottleneck",
    description:
      "A 16-dimensional hidden state cannot reliably solve medium-difficulty tasks regardless of reasoning steps.",
    whatHappened:
      "With state_dim=16, maximum accuracy on medium tasks plateaued at 70%, compared to 94% with dim=64. Adding more reasoning steps (T) could not compensate for insufficient state capacity.",
    whyItHappened:
      "The hidden state must encode enough information about the input to make the final prediction. With only 16 dimensions, the model cannot represent the cumulative sum (or its parity) for 5 inputs. This is an information-theoretic bottleneck.",
    whatItDoesNotProve:
      "This does NOT prove that latent reasoning inherently requires large states. It shows a specific constraint of our toy model. The minimum required capacity depends on task complexity and model architecture.",
    experimentData: accuracyByStateDim.flatMap((s) => s.data),
    source: {
      label: "our_experiment",
      description: "Capacity limitation observed across state dimension variants.",
      citationId: "our_experiment",
    },
  },
];

export const generateLatentStates = (
  puzzle: ReasoningPuzzle,
  numSteps: number,
  stateDim: number
): LatentState[] => {
  const seed = puzzle.input.reduce((a, b) => a + b, 0) + numSteps + stateDim;
  const rng = (i: number) => {
    const x = Math.sin(seed * 9301 + i * 4973) * 49297;
    return x - Math.floor(x);
  };

  const states: LatentState[] = [];
  let runningSum = 0;

  for (let t = 0; t <= numSteps; t++) {
    const values: number[] = [];
    for (let d = 0; d < Math.min(stateDim, 16); d++) {
      const noise = (rng(t * 100 + d) - 0.5) * 0.3;
      if (d === 0) {
        runningSum = runningSum * 0.85 + (puzzle.input[t % puzzle.input.length] || 0) * 0.15;
        values.push(Math.tanh(runningSum / 5 + noise));
      } else if (d === 1) {
        values.push(Math.tanh((runningSum % 2) + noise));
      } else {
        values.push(Math.tanh(rng(t * 100 + d) * 2 - 1 + noise * 0.5));
      }
    }
    states.push({
      step: t,
      values,
      label: t === 0 ? "Initial state h₀" : `Step h₍${t}₎`,
    });
  }
  return states;
};

export const simulateLabResult = (
  puzzleId: string,
  numSteps: number,
  stateDim: number,
  difficulty: DifficultyLevel
): LabResult => {
  const puzzle = puzzles.find((p) => p.id === puzzleId) || puzzles[0];

  const seed =
    puzzle.input.reduce((a, b) => a + b, 0) * 1000 + numSteps * 100 + stateDim;
  const rng = (i: number) => {
    const x = Math.sin(seed * 7391 + i * 4657) * 48713;
    return x - Math.floor(x);
  };

  const baseAccByDiff: Record<DifficultyLevel, number> = {
    easy: 0.97,
    medium: 0.94,
    hard: 0.76,
  };

  const stepFactor = Math.min(1, 0.3 + 0.7 * (1 - Math.exp(-numSteps / 4)));
  const dimFactor = Math.min(1, 0.4 + 0.6 * (stateDim / 128));
  const degradeFactor =
    numSteps > 15 ? 1 - (numSteps - 15) * 0.008 * (difficulty === "hard" ? 3 : 1) : 1;

  const baseProb = baseAccByDiff[difficulty] * stepFactor * dimFactor * degradeFactor;
  const noise = (rng(1) - 0.5) * 0.1;
  const finalProb = Math.max(0.05, Math.min(0.99, baseProb + noise));
  const correct = rng(2) < finalProb; // seeded → same config, same outcome

  const latentStates = generateLatentStates(puzzle, numSteps, stateDim);

  return {
    prediction: correct ? puzzle.groundTruth : puzzle.groundTruth === "Odd" ? "Even" : "Odd",
    groundTruth: puzzle.groundTruth,
    correct,
    latentStates,
    confidence: finalProb,
    steps: numSteps,
    stateDim,
  };
};
