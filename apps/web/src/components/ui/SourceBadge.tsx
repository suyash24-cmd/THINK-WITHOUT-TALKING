import { DataSource, DataSourceLabel } from "@/data/types";

const labelColors: Record<DataSourceLabel, string> = {
  published_research: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  our_experiment: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  illustrative: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  hypothesis: "bg-red-500/15 text-red-400 border-red-500/30",
  inference: "bg-teal-500/15 text-teal-400 border-teal-500/30",
};

const labelDisplay: Record<DataSourceLabel, string> = {
  published_research: "PUBLISHED RESEARCH",
  our_experiment: "OUR EXPERIMENT",
  illustrative: "ILLUSTRATIVE",
  hypothesis: "HYPOTHESIS",
  inference: "INFERENCE",
};

interface SourceBadgeProps {
  source: DataSource;
  compact?: boolean;
}

export default function SourceBadge({ source, compact = false }: SourceBadgeProps) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider border ${labelColors[source.label]}`}
      >
        {labelDisplay[source.label]}
      </span>
      {!compact && (
        <span className="text-xs text-text-muted">{source.description}</span>
      )}
    </div>
  );
}
