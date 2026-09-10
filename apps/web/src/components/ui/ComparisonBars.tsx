interface ComparisonSeries {
  key: string;
  label: string;
  colorClass: string;
}

interface ComparisonRow {
  metric: string;
  lowerIsBetter?: boolean;
  values: Record<string, number | null>;
  display: Record<string, string>;
}

interface ComparisonBarsProps {
  series: ComparisonSeries[];
  rows: ComparisonRow[];
}

export default function ComparisonBars({ series, rows }: ComparisonBarsProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {series.map((s) => (
          <span
            key={s.key}
            className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider ${s.colorClass}`}
          >
            <span className="w-4 h-2 rounded-sm bg-current" aria-hidden="true" />
            {s.label}
          </span>
        ))}
        <span className="ml-auto text-[10px] font-mono text-text-muted">
          bars are relative within each metric
        </span>
      </div>

      <div role="list" aria-label="Condition comparison">
        {rows.map((row) => {
          const max = Math.max(
            ...series
              .map((s) => row.values[s.key])
              .filter((v): v is number => v !== null && Number.isFinite(v)),
            1e-9
          );
          return (
            <div key={row.metric} role="listitem" className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-mono text-text-secondary">{row.metric}</p>
                {row.lowerIsBetter && (
                  <span className="text-[10px] font-mono text-text-muted">lower is better</span>
                )}
              </div>
              <div className="space-y-1.5">
                {series.map((s) => {
                  const value = row.values[s.key];
                  const width =
                    value !== null && Number.isFinite(value) ? Math.max(2, (value / max) * 100) : 0;
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-right text-[10px] font-mono text-text-muted">
                        {row.display[s.key] ?? "—"}
                      </span>
                      <div className="flex-1 h-3 bg-elevated rounded-sm overflow-hidden">
                        <div
                          className={`h-full rounded-sm transition-all duration-700 ${s.colorClass}`}
                          style={{ width: `${width}%` }}
                          role="presentation"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}