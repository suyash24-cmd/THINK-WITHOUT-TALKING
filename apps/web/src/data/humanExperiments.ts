import { ExperimentDefinition, HumanTask } from "./types";

/**
 * Human-in-the-loop experiment battery.
 *
 * STATUS: the tasks below are canonical reasoning problems with well-documented
 * ground truths. The hypothesis + measurement scaffold is live. Aggregated
 * cross-user results are NOT claimed — only per-session results computed inside
 * the visitor's own browser are real. Published claims are cited; per-task
 * explanations are standard, well-documented derivations.
 */

export const ASSISTIVE_HINT: Record<string, string> = {
  "crt-bat": [
    "Try writing the price of the bat as \"ball + delta\" instead of reading the numbers quickly.",
    "Bat costs $1.00 MORE than the ball, so: bat = ball + 1.00, and bat + ball = 1.10.",
    "Solve: (ball + 1.00) + ball = 1.10 -> 2 * ball = 0.10 -> ball = 0.05.",
  ].join(" "),
  "crt-lily": [
    "Work backwards from the final day instead of forward from day one.",
    "If the patch doubles each day, yesterday's area was exactly half of today's.",
    "It covers half the lake the day before it covers the whole lake: day 48 - 1 = 47.",
  ].join(" "),
  "crt-car": [
    "A slower car over a 1-mile course at two different speeds.",
    "Going 30 mph (2 min/mile) leaves 2 minutes for the whole 2 miles if the goal is 60 mph average.",
    "If you already spent 2 minutes on the first mile, you cannot hit the total in 0 seconds. It is impossible.",
  ].join(" "),
  "monty": [
    "Re-frame: the host is giving you information, not picking a random door.",
    "Imagine 100 doors: you pick one, the host opens 98 goats and leaves one closed. Now switch?",
    "Switching wins whenever your first pick was wrong: probability 2/3 (not 1/2).",
  ].join(" "),
  "cab": [
    "Bayes' rule: update the 85/15 base rate by the witness' 80/20 reliability.",
    "P(blue | says blue) = (0.80 * 0.15) / (0.80 * 0.15 + 0.20 * 0.85) = 0.12 / 0.29 ≈ 0.41.",
    "The answer is roughly 41%, not 80% — the rare color is the base rate.",
  ].join(" "),
};

export const tasks: HumanTask[] = [
  {
    id: "crt-bat",
    code: "CRT-1",
    title: "Bat & Ball",
    category: "heuristics",
    prompt:
      "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
    options: ["$0.05", "$0.10", "$0.15", "$0.20"],
    correctIndex: 0,
    explanation:
      'If the ball costs $0.05, the bat costs $1.05 and together they cost $1.10. The intuitive answer, $0.10, would imply the bat costs $1.10 and the pair $1.20.',
    rationale: [
      "The fast, intuitive answer (10 cents) feels right but is inconsistent with the two equations.",
      "Slowing down to verify your own arithmetic is the 'effortful' step that this task is designed to skip.",
    ],
    publishedWork: [
      {
        citationId: "frederick2005",
        claim:
          "The Cognitive Reflection Test rewards suppressing the first intuitive impulse in favor of a quick algebraic check.",
      },
    ],
  },
  {
    id: "crt-lily",
    code: "CRT-2",
    title: "Lily Pad",
    category: "simulation",
    prompt:
      "In a lake, a patch of lily pads doubles in size every day. It takes 48 days for the patch to cover the entire lake. How many days does it take to cover half the lake?",
    options: ["24", "36", "47", "48"],
    correctIndex: 2,
    explanation:
      "The patch doubles each day, so the lake was half-covered the day before it became fully covered: day 47.",
    rationale: [
      "The intuition '48 ÷ 2 = 24' works for linear growth, but this is exponential growth.",
      "Running the process backwards (47 -> 48) exposes the correct answer immediately.",
    ],
    publishedWork: [
      {
        citationId: "frederick2005",
        claim:
          "Mirrors how a linear intuition fails on an exponential problem, a hallmark example in CRT-style batteries.",
      },
    ],
  },
  {
    id: "crt-car",
    code: "CRT-3",
    title: "Road Trip",
    category: "simulation",
    prompt:
      "A car travels 1 mile at 30 mph. How fast must it drive a second mile for its average over the whole 2 miles to be 60 mph?",
    options: ["90 mph", "120 mph", "150 mph", "Impossible"],
    correctIndex: 3,
    explanation:
      "At 60 mph, the whole 2-mile trip must take 2 minutes total. The first mile at 30 mph already took exactly 2 minutes, so no positive speed can bring the average to 60 mph.",
    rationale: [
      "The tempting 90 mph answers averages the two speeds, but correct averaging is by time, not by speed.",
      "The trap works because the time budget is hidden inside the distance.",
    ],
    publishedWork: [],
  },
  {
    id: "monty",
    code: "MH-1",
    title: "Monty Hall",
    category: "probabilistic",
    prompt:
      "You pick one of three doors. A prize is behind one. The host, who knows where it is, opens a losing door you did not pick, then offers you the chance to switch. Should you switch?",
    options: ["Stay", "Switch", "No difference"],
    correctIndex: 1,
    explanation:
      "Switching wins 2/3 of the time. Your first pick is wrong with probability 2/3, and the host's forced reveal means the remaining closed door is the prize in exactly those cases.",
    rationale: [
      "The host's reveal is selective information, not a random one — that is the fact people miss.",
      "Scaling to 100 doors makes the asymmetry obvious.",
    ],
    publishedWork: [],
  },
  {
    id: "cab",
    code: "BR-1",
    title: "The Taxi Cab",
    category: "probabilistic",
    prompt:
      "A cab was involved in a hit-and-run at night. Two companies, Green (85%) and Blue (15%), operate in the city. A witness identifies the cab as Blue. Tested under the same conditions, the witness is correct 80% of the time. What is the probability the cab was actually Blue?",
    options: ["12%", "41%", "68%", "80%"],
    correctIndex: 1,
    explanation:
      "By Bayes' rule: (0.80 × 0.15) / (0.80 × 0.15 + 0.20 × 0.85) = 12 / 29 ≈ 41%. The witness' 80% accuracy must be combined with the base rate.",
    rationale: [
      "People overweight the vivid witness account and underweight the base rate.",
      "Rare events require very reliable evidence before the posterior exceeds 50%.",
    ],
    publishedWork: [
      {
        citationId: "tversky1982",
        claim:
          "The classic base-rate problem introduced by Tversky and Kahneman in 'Evidential impact of base rates'.",
      },
    ],
  },
];

export const conditions = {
  unaided: {
    id: "unaided",
    name: "Unaided",
    shortLabel: "UNAIDED",
    aiAssisted: false,
    description:
      "No AI hint available. You solve the problem with your own reasoning only.",
  },
  assisted: {
    id: "ai-assisted",
    name: "AI-assisted",
    shortLabel: "AI-ASSISTED",
    aiAssisted: true,
    description:
      "A reasoning hint from an AI is offered. You choose whether to use it before answering.",
  },
};

export const aiAssist = (taskId: string): string | null =>
  ASSISTIVE_HINT[taskId] ?? null;

export const humanExperiment: ExperimentDefinition = {
  id: "ai-assistance-and-human-reasoning",
  slug: "can-ai-help-you-think",
  title: "Does AI assistance improve human reasoning — or make us think less?",
  description:
    "A within-subject self-experiment. You solve the same class of reasoning problems twice: once with AI assistance and once without. The product then compares your accuracy, time, and confidence across the two conditions.",
  hypothesis:
    "AI assistance improves measured performance (accuracy and speed) while shifting how you reason — and it may inflate confidence faster than accuracy.",
  objective:
    "Let a visitor experience, measure, and inspect the classic tension between using an AI as a tool and keeping the reasoning skill for themselves.",
  methodology: [
    "Each task is assigned to either the unaided or the AI-assisted condition.",
    "The conditions are interleaved so neither appears first in the whole session.",
    "A task timer records time-to-answer; a confidence control records your felt certainty from 0-100 before the verdict is shown.",
    "In the assisted condition you may reveal a written reasoning hint before answering.",
    "Results are computed locally, aggregated per condition, and compared to published findings.",
  ],
  conditions: [conditions.unaided, conditions.assisted],
  metrics: [
    "accuracy (correct / total)",
    "time to answer (ms)",
    "self-reported confidence (0-100)",
    "calibration gap (confidence vs accuracy)",
  ],
  limitations: [
    "This is a self-experiment on one browser: results are YOUR results, not a population claim.",
    "Five tasks is a small battery; nothing here should be read as a clinical or statistical verdict.",
    "The AI hint is a static, curated hint — not a live model — so the demonstration is reproducible.",
  ],
  citations: ["frederick2005", "tversky1982"],
  status: "live",
};

export const bannerConditions = [
  conditions.unaided,
  conditions.assisted,
];