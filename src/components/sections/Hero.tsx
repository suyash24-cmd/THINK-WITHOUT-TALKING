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
          DataForge 2026 — Pathway Track
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight mb-6">
          Think Without
          <br />
          <span className="text-accent">Talking</span>
        </h1>

        <p className="text-xl sm:text-2xl text-text-secondary font-light mb-4">
          Can an AI reason without talking to itself?
        </p>

        <p className="text-base text-text-muted max-w-xl mx-auto mb-12 leading-relaxed">
          Explore what happens when a model repeatedly refines a hidden state
          instead of generating a verbal chain of thought.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#question"
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
            Jump to The Lab
          </a>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-text-primary">h₀→h_T</p>
            <p className="text-xs text-text-muted mt-1">Latent states</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-accent">T</p>
            <p className="text-xs text-text-muted mt-1">Reasoning steps</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-amber">∞</p>
            <p className="text-xs text-text-muted mt-1">Experiments</p>
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
