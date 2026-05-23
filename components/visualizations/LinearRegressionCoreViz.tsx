"use client";

import { useMemo, useState } from "react";

const WIDTH = 600;
const HEIGHT = 320;
const MARGIN = { top: 28, right: 28, bottom: 44, left: 52 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

type Point = { x: number; y: number; label: string };

const VARIED_POINTS: Point[] = [
  { x: 1, y: 3.2, label: "(X₁, Y₁)" },
  { x: 2.2, y: 4.0, label: "(X₂, Y₂)" },
  { x: 3.1, y: 4.5, label: "(X₃, Y₃)" },
  { x: 4.0, y: 5.1, label: "(X₄, Y₄)" },
  { x: 5.2, y: 5.8, label: "(X₅, Y₅)" },
  { x: 6.1, y: 6.4, label: "(X₆, Y₆)" },
  { x: 7.0, y: 7.0, label: "(X₇, Y₇)" },
];

const DEGENERATE_POINTS: Point[] = [
  { x: 4, y: 3.1, label: "(X₁, Y₁)" },
  { x: 4, y: 4.2, label: "(X₂, Y₂)" },
  { x: 4, y: 5.0, label: "(X₃, Y₃)" },
  { x: 4, y: 5.8, label: "(X₄, Y₄)" },
  { x: 4, y: 6.5, label: "(X₅, Y₅)" },
  { x: 4, y: 7.2, label: "(X₆, Y₆)" },
];

const STEPS = [
  {
    id: "predictors",
    label: "X & Y",
    caption:
      "Predictor X and response Y as paired observations on a scatter plot.",
  },
  {
    id: "function",
    label: "f(X)",
    caption: "The linear function f(X) = β₀ + β₁X with random noise ε.",
  },
  {
    id: "coefficients",
    label: "β₀ & β₁",
    caption: "Intercept β₀ (y-axis crossing) and slope β₁ (steepness).",
  },
  {
    id: "least-squares",
    label: "OLS line",
    caption: "The line that minimizes the sum of squared vertical residuals.",
  },
  {
    id: "identifiability",
    label: "Identifiability",
    caption:
      "X must vary — if all Xᵢ are equal, the slope is not identified.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function fitOls(points: Point[]) {
  const n = points.length;
  const meanX = points.reduce((s, p) => s + p.x, 0) / n;
  const meanY = points.reduce((s, p) => s + p.y, 0) / n;
  const varX = points.reduce((s, p) => s + (p.x - meanX) ** 2, 0);
  if (varX === 0) return null;
  const covXY = points.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0);
  const b1 = covXY / varX;
  const b0 = meanY - b1 * meanX;
  return { b0, b1 };
}

function scaleDomain(points: Point[], degenerate: boolean) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = degenerate ? 1 : Math.min(...xs) - 0.5;
  const xMax = degenerate ? 7 : Math.max(...xs) + 0.5;
  const yMin = Math.min(...ys) - 0.8;
  const yMax = Math.max(...ys) + 0.8;
  return { xMin, xMax, yMin, yMax };
}

function toPx(
  x: number,
  y: number,
  domain: ReturnType<typeof scaleDomain>,
) {
  const px =
    MARGIN.left +
    ((x - domain.xMin) / (domain.xMax - domain.xMin)) * PLOT_W;
  const py =
    MARGIN.top +
    PLOT_H -
    ((y - domain.yMin) / (domain.yMax - domain.yMin)) * PLOT_H;
  return { px, py };
}

export function LinearRegressionCoreViz() {
  const [step, setStep] = useState<StepId>("predictors");
  const [degenerate, setDegenerate] = useState(false);

  const points = degenerate ? DEGENERATE_POINTS : VARIED_POINTS;
  const fit = useMemo(() => fitOls(points), [points]);
  const domain = useMemo(
    () => scaleDomain(points, degenerate),
    [points, degenerate],
  );

  const lineX1 = domain.xMin;
  const lineX2 = domain.xMax;
  const lineY1 = fit ? fit.b0 + fit.b1 * lineX1 : domain.yMin;
  const lineY2 = fit ? fit.b0 + fit.b1 * lineX2 : domain.yMax;
  const p1 = toPx(lineX1, lineY1, domain);
  const p2 = toPx(lineX2, lineY2, domain);
  const intercept = fit ? toPx(0, fit.b0, domain) : null;
  const slopeAnchor = fit ? toPx(1, fit.b0, domain) : null;
  const slopeEnd = fit ? toPx(1, fit.b0 + fit.b1, domain) : null;

  const activeCaption =
    step === "identifiability"
      ? degenerate
        ? "All Xᵢ = 4: infinitely many lines pass through the vertical cloud — β₁ is not identified."
        : "Varied Xᵢ spread observations in two dimensions, so β₀ and β₁ are estimable."
      : (STEPS.find((s) => s.id === step)?.caption ?? "");

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {STEPS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStep(item.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              step === item.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {step === "identifiability" && (
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setDegenerate(false)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              !degenerate
                ? "bg-emerald-700 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Varied X
          </button>
          <button
            type="button"
            onClick={() => setDegenerate(true)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              degenerate
                ? "bg-amber-700 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            All X equal
          </button>
        </div>
      )}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="min-h-0 w-full flex-1"
        role="img"
        aria-label="Linear regression core model components"
      >
        <rect width={WIDTH} height={HEIGHT} fill="#0f172a" />

        <line
          x1={MARGIN.left}
          y1={MARGIN.top + PLOT_H}
          x2={MARGIN.left + PLOT_W}
          y2={MARGIN.top + PLOT_H}
          stroke="#475569"
          strokeWidth={1.5}
        />
        <line
          x1={MARGIN.left}
          y1={MARGIN.top}
          x2={MARGIN.left}
          y2={MARGIN.top + PLOT_H}
          stroke="#475569"
          strokeWidth={1.5}
        />
        <text
          x={MARGIN.left + PLOT_W / 2}
          y={HEIGHT - 8}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={12}
        >
          Predictor (X)
        </text>
        <text
          x={14}
          y={MARGIN.top + PLOT_H / 2}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={12}
          transform={`rotate(-90, 14, ${MARGIN.top + PLOT_H / 2})`}
        >
          Response (Y)
        </text>

        {(step === "function" ||
          step === "coefficients" ||
          step === "least-squares" ||
          (step === "identifiability" && !degenerate && fit)) && (
          <>
            {step === "identifiability" && !degenerate && fit && (
              <line
                x1={p1.px}
                y1={p1.py}
                x2={p2.px}
                y2={p2.py}
                stroke="#34d399"
                strokeWidth={2.5}
              />
            )}
            {step !== "identifiability" && fit && (
              <line
                x1={p1.px}
                y1={p1.py}
                x2={p2.px}
                y2={p2.py}
                stroke={
                  step === "least-squares"
                    ? "#34d399"
                    : step === "function"
                      ? "#38bdf8"
                      : "#818cf8"
                }
                strokeWidth={2.5}
                strokeDasharray={step === "function" ? "6 4" : undefined}
              />
            )}
          </>
        )}

        {step === "identifiability" &&
          degenerate &&
          [-0.6, -0.2, 0.2, 0.6, 1.0].map((slope) => {
            const midY = 5.1;
            const midX = 4;
            const yAtMin = midY + slope * (domain.xMin - midX);
            const yAtMax = midY + slope * (domain.xMax - midX);
            const a = toPx(domain.xMin, yAtMin, domain);
            const b = toPx(domain.xMax, yAtMax, domain);
            return (
              <line
                key={slope}
                x1={a.px}
                y1={a.py}
                x2={b.px}
                y2={b.py}
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                opacity={0.7}
              />
            );
          })}

        {step === "least-squares" &&
          fit &&
          points.map((pt, index) => {
            const fittedY = fit.b0 + fit.b1 * pt.x;
            const obs = toPx(pt.x, pt.y, domain);
            const fitPt = toPx(pt.x, fittedY, domain);
            return (
              <g key={`${pt.label}-${index}`}>
                <line
                  x1={obs.px}
                  y1={obs.py}
                  x2={fitPt.px}
                  y2={fitPt.py}
                  stroke="#f472b6"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
                <rect
                  x={Math.min(obs.px, fitPt.px) - 3}
                  y={Math.min(obs.py, fitPt.py)}
                  width={6}
                  height={Math.abs(obs.py - fitPt.py)}
                  fill="#f472b6"
                  opacity={0.15}
                />
              </g>
            );
          })}

        {step === "coefficients" &&
          fit &&
          intercept &&
          slopeAnchor &&
          slopeEnd && (
            <>
              <circle
                cx={intercept.px}
                cy={intercept.py}
                r={5}
                fill="#fbbf24"
              />
              <text
                x={intercept.px + 10}
                y={intercept.py - 6}
                fill="#fbbf24"
                fontSize={11}
              >
                β₀ (intercept)
              </text>
              <line
                x1={slopeAnchor.px}
                y1={slopeAnchor.py}
                x2={slopeEnd.px}
                y2={slopeEnd.py}
                stroke="#fbbf24"
                strokeWidth={2}
              />
              <text
                x={slopeEnd.px + 8}
                y={slopeEnd.py + 4}
                fill="#fbbf24"
                fontSize={11}
              >
                β₁ (slope)
              </text>
            </>
          )}

        {points.map((pt, index) => {
          const { px, py } = toPx(pt.x, pt.y, domain);
          const showLabel =
            step === "predictors" || (step === "identifiability" && index < 3);
          return (
            <g key={`${pt.label}-${index}`}>
              <circle cx={px} cy={py} r={5} fill="#818cf8" />
              {showLabel && (
                <text x={px + 8} y={py - 8} fill="#cbd5e1" fontSize={10}>
                  {pt.label}
                </text>
              )}
            </g>
          );
        })}

        {step === "function" && fit && (
          <text
            x={MARGIN.left + 12}
            y={MARGIN.top + 16}
            fill="#38bdf8"
            fontSize={12}
          >
            f(X) = β₀ + β₁X + ε
          </text>
        )}
      </svg>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        {activeCaption}
      </p>
    </div>
  );
}
