"use client";

interface GroundTruthCardProps {
  prediction: string;
  groundTruth: string;
  correct: boolean | null;
  title?: string;
}

export default function GroundTruthCard({
  prediction,
  groundTruth,
  correct,
  title = "Prediction vs Ground Truth",
}: GroundTruthCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <p className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-elevated rounded-lg p-4 border border-border">
          <p className="text-[10px] font-mono text-text-muted mb-2">PREDICTION</p>
          <p className="text-lg font-mono font-bold text-text-primary">
            {prediction}
          </p>
        </div>
        <div className="bg-elevated rounded-lg p-4 border border-border">
          <p className="text-[10px] font-mono text-text-muted mb-2">GROUND TRUTH</p>
          <p className="text-lg font-mono font-bold text-text-primary">
            {groundTruth}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {correct === null ? (
          <span className="text-xs text-text-muted italic">
            No verdict yet — run the experiment.
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
              correct
                ? "bg-correct/15 text-correct"
                : "bg-incorrect/15 text-incorrect"
            }`}
          >
            {correct ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 7l4 4 6-8" />
                </svg>
                CORRECT
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
                INCORRECT
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
}