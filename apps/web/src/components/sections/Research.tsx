"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { citations, getBdhCitations, getFoundationalCitations } from "@/data/citations";

interface CitationCardProps {
  citation: (typeof citations)[0];
}

function CitationCard({ citation }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <p className="text-sm font-bold text-text-primary leading-snug">
          {citation.title}
        </p>
        <span className="text-[10px] font-mono text-text-muted whitespace-nowrap">
          {citation.year}
        </span>
      </div>
      <p className="text-xs text-text-muted mb-3">
        {citation.authors} — {citation.venue}
      </p>
      <div className="space-y-2">
        <p className="text-xs font-mono text-accent uppercase tracking-wider">
          Why it matters
        </p>
        <ul className="space-y-1.5">
          {citation.relevantClaims.map((claim, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed"
            >
              <span className="text-accent mt-0.5 shrink-0">→</span>
              {claim}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-dim transition-colors"
      >
        {expanded ? "Hide" : "View source"}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M1 3l4 4 4-4" />
        </svg>
      </button>
      {expanded && (
        <div className="mt-3 bg-elevated rounded-lg p-3 border border-border">
          {citation.url ? (
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-accent break-all hover:underline"
            >
              {citation.url}
            </a>
          ) : (
            <p className="text-xs font-mono text-text-muted">
              Full bibliographic record available in the repository.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Research() {
  const bdhRefs = getBdhCitations();
  const foundational = getFoundationalCitations();

  return (
    <SectionWrapper
      id="research"
      number="11"
      title="Research"
      subtitle="Every important claim in this product is backed by either a primary source or clearly labeled as our experiment."
    >
      <div className="space-y-10">
        <div>
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
            Foundational Sources
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {foundational.map((c) => (
              <CitationCard key={c.id} citation={c} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
            BDH / Recurrent Reasoning Sources
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {bdhRefs.map((c) => (
              <CitationCard key={c.id} citation={c} />
            ))}
          </div>
        </div>

        <div className="bg-elevated border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
            Evidence Discipline
          </p>
          <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="text-amber font-mono text-xs mt-0.5 shrink-0">A.</span>
              <span>
                <strong className="text-amber font-mono text-xs">PUBLISHED RESEARCH:</strong>{" "}
                Research papers referenced above. We did not run these experiments; we cite their results.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber font-mono text-xs mt-0.5 shrink-0">B.</span>
              <span>
                <strong className="text-amber font-mono text-xs">OUR EXPERIMENTS:</strong>{" "}
                The toy model results in Sections 04-06 were produced by our team. They are reproducible
                and clearly labeled.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-400 font-mono text-xs mt-0.5 shrink-0">C.</span>
              <span>
                <strong className="text-purple-400 font-mono text-xs">ILLUSTRATIVE:</strong>{" "}
                Simplified explanations (e.g., token-based reasoning walkthrough in Section 02)
                meant for teaching. Not an exact simulation of any published system.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-teal-400 font-mono text-xs mt-0.5 shrink-0">D.</span>
              <span>
                <strong className="text-teal-400 font-mono text-xs">HYPOTHESES/INFERENCES:</strong>{" "}
                Connections between our toy model and BDH are inferred conceptual relationships, not
                demonstrated reproductions. We state them as hypotheses.
              </span>
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}