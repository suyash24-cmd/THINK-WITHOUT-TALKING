"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";

const bridgeSteps = [
  {
    id: "toy",
    title: "Our Toy Model",
    label: "OUR EXPERIMENT",
    labelColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    description:
      "A tanh-RNN that reads input, runs T steps of recurrent refinement, then predicts. Simple but demonstrates the core idea.",
    details: [
      "h_t = tanh(W_h · h_{t-1} + W_x · x)",
      "prediction = softmax(W_out · h_T)",
      "No gating mechanism",
      "Fixed state dimension",
    ],
  },
  {
    id: "recurrent",
    title: "Recurrent Internal Computation",
    label: "CONCEPT",
    labelColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    description:
      "The key insight: let the model compute for multiple steps in latent space without generating tokens.",
    details: [
      "Shared weights across steps (weight tying)",
      "Adaptive computation time (how many steps?)",
      "No intermediate natural language",
      "Can be combined with attention mechanisms",
    ],
  },
  {
    id: "architectures",
    title: "Architectural Alternatives",
    label: "PUBLISHED RESEARCH",
    labelColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    description:
      "Several published works explore similar ideas with more sophisticated architectures.",
    details: [
      "Universal Transformers (Dehghani et al., 2019): weight-tied recurrence + adaptive halting",
      "Adaptive Computation Time (Graves, 2016): learned halting probabilities",
      "Implicit Chain-of-Thought: latent representations replace verbal chains",
    ],
  },
  {
    id: "bdh",
    title: "BDH Architecture",
    label: "PUBLISHED BDH",
    labelColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    description:
      "The BDH (Beyond Chain-of-Thought) architecture formalizes recurrent latent reasoning with specific architectural innovations.",
    details: [
      "Recurrent latent state with gating mechanisms",
      "Multi-head state refinement at each step",
      "End-to-end differentiable reasoning depth",
      "Evaluated on mathematical and logical reasoning benchmarks",
    ],
  },
  {
    id: "bdhcq",
    title: "BDH-CQ: Convergent Query",
    label: "PUBLISHED BDH-CQ",
    labelColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    description:
      "BDH-CQ extends BDH with a convergent query mechanism that allows the model to dynamically allocate computation.",
    details: [
      "Query-based convergence criterion",
      "Dynamic halting based on state stability",
      "Published evaluation results on standard benchmarks",
      "Demonstrates that latent computation can match token-based reasoning",
    ],
  },
];

export default function BDHModule() {
  const [activeStep, setActiveStep] = useState(0);
  const current = bridgeSteps[activeStep];

  return (
    <SectionWrapper
      id="bdh"
      number="10"
      title="From Latent States to BDH"
      subtitle="How our toy model connects to published research on Beyond Chain-of-Thought reasoning."
    >
      {/* Bridge Timeline */}
      <div className="mb-10">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {bridgeSteps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className="flex items-center shrink-0"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono font-bold border transition-all ${
                  i <= activeStep
                    ? "bg-accent text-white border-accent"
                    : "bg-elevated text-text-muted border-border"
                }`}
              >
                {i + 1}
              </div>
              {i < bridgeSteps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-1 transition-colors ${
                    i < activeStep ? "bg-accent" : "bg-border"
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Detail */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3 className="text-lg font-bold text-text-primary">{current.title}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider border ${current.labelColor}`}
          >
            {current.label}
          </span>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          {current.description}
        </p>

        <div className="bg-elevated rounded-lg p-4 border border-border">
          <p className="text-xs font-mono text-text-muted mb-3">KEY DETAILS</p>
          <ul className="space-y-2">
            {current.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                <span className="text-accent mt-1 shrink-0">→</span>
                <span className="font-mono text-xs leading-relaxed">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Conceptual Bridge Diagram */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <p className="text-xs font-mono text-accent uppercase tracking-wider mb-6">
          Conceptual Bridge
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <div className="bg-elevated rounded-lg p-4 border border-border flex-1 w-full">
            <p className="text-xs font-mono text-amber mb-1">TOY MODEL</p>
            <p className="text-[10px] font-mono text-text-muted">h_t = tanh(W·h + x)</p>
          </div>
          <svg
            width="24"
            height="12"
            viewBox="0 0 24 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-accent shrink-0 hidden sm:block"
          >
            <path d="M0 6h22M16 1l6 5-6 5" />
          </svg>
          <div className="bg-elevated rounded-lg p-4 border border-border flex-1 w-full">
            <p className="text-xs font-mono text-purple-400 mb-1">UNIVERSAL TRANSFORMER</p>
            <p className="text-[10px] font-mono text-text-muted">Shared layers + halting</p>
          </div>
          <svg
            width="24"
            height="12"
            viewBox="0 0 24 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-accent shrink-0 hidden sm:block"
          >
            <path d="M0 6h22M16 1l6 5-6 5" />
          </svg>
          <div className="bg-elevated rounded-lg p-4 border border-accent/30 flex-1 w-full">
            <p className="text-xs font-mono text-accent mb-1">BDH</p>
            <p className="text-[10px] font-mono text-text-muted">Gated recurrent latent reasoning</p>
          </div>
          <svg
            width="24"
            height="12"
            viewBox="0 0 24 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-accent shrink-0 hidden sm:block"
          >
            <path d="M0 6h22M16 1l6 5-6 5" />
          </svg>
          <div className="bg-elevated rounded-lg p-4 border border-accent/30 flex-1 w-full">
            <p className="text-xs font-mono text-accent mb-1">BDH-CQ</p>
            <p className="text-[10px] font-mono text-text-muted">Convergent query halting</p>
          </div>
        </div>
      </div>

      {/* Important Distinction */}
      <div className="bg-elevated border border-accent/30 rounded-xl p-6">
        <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
          Scientific Distinction
        </p>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            <span className="text-amber font-mono text-xs mr-2">OUR TOY MODEL</span>
            is a simple tanh-RNN we built to illustrate the concept. It is NOT the BDH architecture.
            Its results demonstrate the basic principle but should not be confused with published BDH evaluations.
          </p>
          <p>
            <span className="text-accent font-mono text-xs mr-2">PUBLISHED BDH</span>
            is a specific architecture with gating, attention, and sophisticated design choices.
            We reference BDH published results and architecture, not our toy model results.
          </p>
          <p>
            <span className="text-accent font-mono text-xs mr-2">PUBLISHED BDH-CQ</span>
            adds convergent query mechanisms. Its published evaluation results are on different benchmarks
            and should not be compared directly to our toy model numbers.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
