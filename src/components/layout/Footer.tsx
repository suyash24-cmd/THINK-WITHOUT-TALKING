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
          <div className="flex gap-4">
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
            This is an educational research product. All experiment results are clearly labeled by source.
            Toy model results are ours. BDH/BDH-CQ references are from published work.
            No results are fabricated. See <a href="#research" className="underline hover:text-text-secondary">Section 08</a> for full citations.
          </p>
        </div>
      </div>
    </footer>
  );
}
