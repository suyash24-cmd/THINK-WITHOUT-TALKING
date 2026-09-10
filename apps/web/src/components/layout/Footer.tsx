"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-mono text-text-muted">THINK WITHOUT TALKING</p>
            <p className="text-xs text-text-muted mt-1">
              DataForge 2026 Pathway Track Submission
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="#experiment"
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              Experiment
            </a>
            <a
              href="#results"
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              Your results
            </a>
            <a
              href="#research"
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              Sources
            </a>
            <a
              href="#reproduce"
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              Reproduce
            </a>
            <a
              href="#about"
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              About
            </a>
          </div>
        </div>
        <div className="border-t border-border-subtle pt-6">
          <p className="text-xs text-text-muted leading-relaxed">
            An interactive reasoning research platform. Your experiment results are computed
            locally in your browser and never leave it. Every scientific claim is labeled by
            source: PUBLISHED RESEARCH, OUR EXPERIMENT, or ILLUSTRATIVE. Toy-model results are
            ours. BDH/BDH-CQ references are from published work. No results are fabricated.
            See <a href="#research" className="underline hover:text-text-secondary">Section 11</a> for full citations.
          </p>
        </div>
      </div>
    </footer>
  );
}