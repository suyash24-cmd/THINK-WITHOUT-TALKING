"use client";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-amber/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-xs font-mono text-accent tracking-[0.3em] uppercase mb-8">
          DataForge 2026 — Pathway Track · Interactive Reasoning Research
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight mb-6">
          AI can explain
          <br />
          <span className="text-accent">anything.</span>
          <br />
          Can it help you think?
        </h1>

        <p className="text-xl sm:text-2xl text-text-secondary font-light mb-4">
          A live self-experiment in human reasoning.
        </p>

        <p className="text-base text-text-muted max-w-xl mx-auto mb-12 leading-relaxed">
          You will solve a battery of reasoning problems — some alone, some with
          AI assistance. Then you will see what changed in your accuracy, speed,
          and confidence, and what the research says about tools versus skills.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#hypothesis"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-dim transition-colors"
          >
            Start the experiment
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 1v12M1 7l6 6 6-6" />
            </svg>
          </a>
          <a
            href="#lab"
            className="inline-flex items-center gap-2 px-6 py-3 bg-elevated text-text-secondary rounded-lg font-medium text-sm border border-border hover:border-accent/50 transition-colors"
          >
            The model lab
          </a>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-text-primary">2</p>
            <p className="text-xs text-text-muted mt-1">Conditions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-accent">5</p>
            <p className="text-xs text-text-muted mt-1">Reasoning tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-amber">0</p>
            <p className="text-xs text-text-muted mt-1">Fabricated numbers</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
          <path d="M10 2v16M3 11l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}