export type DifficultyLevel = "easy" | "medium" | "hard";

export type DataSourceLabel = "published_research" | "our_experiment" | "illustrative" | "hypothesis" | "inference";

export interface DataSource {
  label: DataSourceLabel;
  description: string;
  citationId?: string;
}

export interface ReasoningPuzzle {
  id: string;
  input: number[];
  operation: "sum_parity" | "sequence_ext" | "nested_logic";
  description: string;
  groundTruth: string;
  groundTruthNumeric: number;
  difficulty: DifficultyLevel;
  expectedTokenSteps: string[];
}

export interface ExperimentPoint {
  steps: number;
  accuracy: number;
  stateDim?: number;
  difficulty?: DifficultyLevel;
  stdDev?: number;
}

export interface ExperimentSeries {
  name: string;
  data: ExperimentPoint[];
  source: DataSource;
  color: string;
}

export interface LatentState {
  step: number;
  values: number[];
  label: string;
}

export interface TokenStep {
  step: number;
  text: string;
  label: string;
}

export interface FailureCase {
  id: string;
  title: string;
  description: string;
  whatHappened: string;
  whyItHappened: string;
  whatItDoesNotProve: string;
  experimentData: ExperimentPoint[];
  source: DataSource;
}

export interface Citation {
  id: string;
  authors: string;
  title: string;
  year: number;
  venue: string;
  url: string;
  relevantClaims: string[];
}

export interface LabConfig {
  steps: number;
  stateDim: number;
  difficulty: DifficultyLevel;
  puzzleId: string;
}

export interface LabResult {
  prediction: string;
  groundTruth: string;
  correct: boolean;
  latentStates: LatentState[];
  confidence: number;
  steps: number;
  stateDim: number;
}
