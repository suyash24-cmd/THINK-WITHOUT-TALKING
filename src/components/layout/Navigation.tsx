"use client";

import { useState, useEffect } from "react";

const sections = [
  { id: "question", label: "01" },
  { id: "tokens", label: "02" },
  { id: "states", label: "03" },
  { id: "lab", label: "04" },
  { id: "changes", label: "05" },
  { id: "breaks", label: "06" },
  { id: "bdh", label: "07" },
  { id: "research", label: "08" },
  { id: "reproduce", label: "09" },
  { id: "about", label: "10" },
];

export default function Navigation() {
  const [active, setActive] = useState("question");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-2"
        aria-label="Section navigation"
      >
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`group relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono transition-all duration-200 ${
              active === id
                ? "bg-accent text-white scale-110"
                : "bg-elevated text-text-muted hover:text-text-secondary hover:bg-card"
            }`}
            aria-label={`Go to section ${label}`}
            aria-current={active === id ? "true" : undefined}
          >
            {label}
            <span className="absolute right-10 whitespace-nowrap text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {id}
            </span>
          </a>
        ))}
      </nav>

      <button
        className="fixed bottom-4 right-4 z-50 lg:hidden w-10 h-10 rounded-full bg-elevated text-text-secondary flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle section navigation"
        aria-expanded={isOpen}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="2" y1="4" x2="14" y2="4" />
          <line x1="2" y1="8" x2="14" y2="8" />
          <line x1="2" y1="12" x2="14" y2="12" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <nav
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-card border border-border rounded-xl p-3 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono transition-colors ${
                  active === id
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-elevated"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-text-muted">{label}</span>
                <span className="capitalize">{id}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
