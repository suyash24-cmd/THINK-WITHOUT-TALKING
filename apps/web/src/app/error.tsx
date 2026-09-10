"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-xs font-mono text-incorrect mb-3">
          RUNTIME ERROR
        </p>
        <h1 className="text-xl font-bold text-text-primary mb-2">
          Something went wrong rendering this page.
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          The experiment data is intact; this is a rendering fault. Try again,
          and if it persists, the reproduction path in Section 12 documents how
          the site is rebuilt.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dim transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}