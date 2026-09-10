"use client";

import { useMemo, useId } from "react";

interface ChartDataPoint {
  x: number;
  y: number;
}

interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color: string;
  dashed?: boolean;
}

interface ExperimentChartProps {
  series: ChartSeries[];
  xLabel: string;
  yLabel: string;
  yDomain?: [number, number];
  xDomain?: [number, number];
  annotations?: { x: number; y: number; label: string }[];
  height?: number;
}

interface Scale {
  (value: number): number;
  invert: (pixel: number) => number;
}

function makeScale(
  domain: [number, number],
  range: [number, number]
): Scale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  const s = (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
  (s as Scale).invert = (pixel: number) => d0 + ((pixel - r0) / (r1 - r0)) * span;
  return s as Scale;
}

function niceTicks(minValue: number, maxValue: number, count: number): number[] {
  if (minValue === maxValue) {
    return [minValue];
  }
  const step = (maxValue - minValue) / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / magnitude;
  let stepNorm: number;
  if (norm < 1.5) stepNorm = 1;
  else if (norm < 3) stepNorm = 2;
  else if (norm < 7) stepNorm = 5;
  else stepNorm = 10;
  const actualStep = stepNorm * magnitude;
  const start = Math.ceil(minValue / actualStep) * actualStep;
  const ticks: number[] = [];
  for (let v = start; v <= maxValue + 1e-9; v += actualStep) {
    ticks.push(Math.round(v * 1e6) / 1e6);
  }
  return ticks;
}

function buildPath(
  data: ChartDataPoint[],
  xScale: Scale,
  yScale: Scale
): string {
  if (data.length === 0) return "";
  const first = data[0];
  let d = `M ${xScale(first.x).toFixed(2)} ${yScale(first.y).toFixed(2)}`;
  for (let i = 1; i < data.length; i++) {
    const point = data[i];
    const prev = data[i - 1];
    const midX = (xScale(prev.x) + xScale(point.x)) / 2;
    d += ` C ${midX.toFixed(2)} ${yScale(prev.y).toFixed(2)}, ${midX.toFixed(2)} ${yScale(point.y).toFixed(2)}, ${xScale(point.x).toFixed(2)} ${yScale(point.y).toFixed(2)}`;
  }
  return d;
}

export default function ExperimentChart({
  series,
  xLabel,
  yLabel,
  yDomain,
  xDomain,
  annotations = [],
  height = 280,
}: ExperimentChartProps) {
  const gradientId = useId();
  const margin = useMemo(() => ({ top: 24, right: 24, bottom: 48, left: 56 }), []);
  const width = 1000;

  const allX = useMemo(
    () => series.flatMap((s) => s.data.map((d) => d.x)),
    [series]
  );
  const allY = useMemo(
    () => series.flatMap((s) => s.data.map((d) => d.y)),
    [series]
  );

  const xScale = useMemo(
    () =>
      makeScale(
        xDomain || [
          Math.min(...allX),
          Math.max(...allX),
        ],
        [0, width - margin.left - margin.right]
      ),
    [allX, xDomain, margin]
  );

  const yScale = useMemo(() => {
    const [d0, d1] = yDomain || [
      Math.max(0, Math.min(...allY) - 0.05),
      Math.min(1, Math.max(...allY) + 0.05),
    ];
    return makeScale([d0, d1], [height - margin.top - margin.bottom, 0]);
  }, [allY, yDomain, margin, height]);

  const yTicks = useMemo(
    () => niceTicks(yDomain ? yDomain[0] : Math.min(...allY) - 0.01, yDomain ? yDomain[1] : Math.max(...allY) + 0.01, 5),
    [yDomain, allY]
  );
  const xTicks = useMemo(
    () => niceTicks(xDomain ? xDomain[0] : Math.min(...allX), xDomain ? xDomain[1] : Math.max(...allX), 6),
    [xDomain, allX]
  );

  const formatTick = (value: number) => {
    if (yDomain && yDomain[1] <= 1.01 && yDomain[0] >= -0.01) {
      return `${Math.round(value * 100)}%`;
    }
    if (Math.abs(value) >= 100) return `${Math.round(value)}`;
    if (Math.abs(value) >= 10) return value.toFixed(0);
    return value.toFixed(1);
  };

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${yLabel} vs ${xLabel} chart`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid + y-axis ticks */}
        {yTicks.map((tick) => {
          const y = yScale(tick);
          const isEdges = tick === 0 || tick === 1;
          return (
            <g key={`y-${tick}`}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={y}
                y2={y}
                stroke={isEdges ? "#2a2d36" : "#1f222b"}
                strokeWidth={isEdges ? 1 : 1}
                strokeDasharray={isEdges ? undefined : "3 3"}
              />
              <text
                x={margin.left - 10}
                y={y + 3.5}
                textAnchor="end"
                fill="#9ca3af"
                fontSize="11"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {formatTick(tick)}
              </text>
            </g>
          );
        })}

        {/* x-axis ticks */}
        {xTicks.map((tick) => {
          const x = xScale(tick);
          return (
            <g key={`x-${tick}`}>
              <line
                x1={x}
                x2={x}
                y1={height - margin.bottom}
                y2={height - margin.bottom + 4}
                stroke="#2a2d36"
                strokeWidth={1}
              />
              <text
                x={x}
                y={height - margin.bottom + 20}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="11"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {formatTick(tick)}
              </text>
            </g>
          );
        })}

        {/* Axis lines */}
        <line
          x1={margin.left}
          x2={width - margin.right}
          y1={height - margin.bottom}
          y2={height - margin.bottom}
          stroke="#2a2d36"
          strokeWidth={1}
        />
        <line
          x1={margin.left}
          x2={margin.left}
          y1={margin.top}
          y2={height - margin.bottom}
          stroke="#2a2d36"
          strokeWidth={1}
        />

        {/* Axis labels */}
        <text
          x={(margin.left + width - margin.right) / 2}
          y={height - 8}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="12"
          fontFamily="var(--font-geist-mono), monospace"
        >
          {xLabel}
        </text>
        <text
          transform={`rotate(-90 ${margin.left - 42} ${(margin.top + height - margin.bottom) / 2})`}
          x={margin.left - 42}
          y={(margin.top + height - margin.bottom) / 2}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="12"
          fontFamily="var(--font-geist-mono), monospace"
        >
          {yLabel}
        </text>

        {/* Area + lines + points */}
        {series.map((s) => {
          const linePath = buildPath(s.data, xScale, yScale);
          return (
            <g key={s.name}>
              {/* Area fill under first series */}
              {series.length === 1 && s.data.length > 1 && (
                <path
                  d={`${linePath} L ${xScale(s.data[s.data.length - 1].x).toFixed(2)} ${(height - margin.bottom).toFixed(2)} L ${xScale(s.data[0].x).toFixed(2)} ${(height - margin.bottom).toFixed(2)} Z`}
                  fill={`url(#${gradientId})`}
                  stroke="none"
                />
              )}
              <path
                d={linePath}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.dashed ? "5 4" : undefined}
                strokeLinecap="round"
                opacity={0.9}
              />
              {s.data.map((point, i) => (
                <g key={i}>
                  <circle
                    cx={xScale(point.x)}
                    cy={yScale(point.y)}
                    r={4}
                    fill={s.color}
                    stroke="#0a0b0d"
                    strokeWidth={1.5}
                  />
                  <title>{`${s.name}: x=${point.x}, y=${(point.y * 100).toFixed(1)}%`}</title>
                </g>
              ))}
            </g>
          );
        })}

        {/* Annotations */}
        {annotations.map((a, i) => (
          <g key={i}>
            <circle
              cx={xScale(a.x)}
              cy={yScale(a.y)}
              r={7}
              fill="none"
              stroke="#ef4444"
              strokeWidth={1.5}
              strokeDasharray="3 2"
            />
            <text
              x={xScale(a.x) + 10}
              y={yScale(a.y) - 8}
              fill="#ef4444"
              fontSize="11"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {a.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}