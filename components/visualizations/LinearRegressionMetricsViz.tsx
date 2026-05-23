"use client";

import { useMemo, useState } from "react";

const WIDTH = 600;
const HEIGHT = 340;
const MARGIN = { top: 36, right: 28, bottom: 44, left: 52 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

type Point = { x: number; y: number };

/** Deliberately noisy around a linear trend so residuals, R², and σ̂² are visible. */
const POINTS: Point[] = [
  { x: 1, y: 2.5 },
  { x: 2, y: 4.0 },
  { x: 3, y: 3.0 },
  { x: 4, y: 5.2 },
  { x: 5, y: 4.8 },
  { x: 6, y: 6.5 },
  { x: 7, y: 5.5 },
];

const STEPS = [
  {
    id: "residuals",
    label: "Residuals",
    caption:
      "Each rᵢ = Yᵢ − Ŷᵢ is the signed vertical gap from the observed point to the fitted value on the OLS line.",
  },
  {
    id: "r-squared",
    label: "R²",
    caption:
      "Total deviation Yᵢ − Ȳ splits into explained (Ŷᵢ − Ȳ, blue) plus residual (Yᵢ − Ŷᵢ, pink). R² = SSR / SST.",
  },
  {
    id: "error-variance",
    label: "σ̂²",
    caption:
      "Shaded squares have area ∝ rᵢ². σ̂² = (1/n) Σ rᵢ² is the MLE average squared residual.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function fitOls(points: Point[]) {
  const n = points.length;
  const meanX = points.reduce((s, p) => s + p.x, 0) / n;
  const meanY = points.reduce((s, p) => s + p.y, 0) / n;
  const varX = points.reduce((s, p) => s + (p.x - meanX) ** 2, 0);
  const covXY = points.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0);
  const b1 = covXY / varX;
  const b0 = meanY - b1 * meanX;
  return { b0, b1, meanY, n };
}

function scaleDomain(points: Point[], fit: ReturnType<typeof fitOls>) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const fittedYs = points.map((p) => fit.b0 + fit.b1 * p.x);
  return {
    xMin: Math.min(...xs) - 0.5,
    xMax: Math.max(...xs) + 0.5,
    yMin: Math.min(...ys, ...fittedYs, fit.meanY) - 0.6,
    yMax: Math.max(...ys, ...fittedYs, fit.meanY) + 0.6,
  };
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

function computeMetrics(points: Point[]) {
  const fit = fitOls(points);
  const fitted = points.map((p) => fit.b0 + fit.b1 * p.x);
  const residuals = points.map((p, i) => p.y - fitted[i]);
  const sse = residuals.reduce((s, r) => s + r ** 2, 0);
  const sst = points.reduce((s, p) => s + (p.y - fit.meanY) ** 2, 0);
  const ssr = fitted.reduce((s, yHat) => s + (yHat - fit.meanY) ** 2, 0);
  const rSquared = sst === 0 ? 1 : ssr / sst;
  const sigmaSq = sse / fit.n;
  return { fit, fitted, residuals, sse, sst, ssr, rSquared, sigmaSq };
}

const SUBS = "₀₁₂₃₄₅₆₇₈₉";

function sub(i: number) {
  return String(i)
    .split("")
    .map((d) => SUBS[Number(d)])
    .join("");
}

export function LinearRegressionMetricsViz() {
  const [step, setStep] = useState<StepId>("residuals");

  const metrics = useMemo(() => computeMetrics(POINTS), []);
  const { fit, fitted, residuals, sse, sst, ssr, rSquared, sigmaSq } =
    metrics;
  const domain = useMemo(() => scaleDomain(POINTS, fit), [fit]);

  const lineX1 = domain.xMin;
  const lineX2 = domain.xMax;
  const p1 = toPx(lineX1, fit.b0 + fit.b1 * lineX1, domain);
  const p2 = toPx(lineX2, fit.b0 + fit.b1 * lineX2, domain);
  const meanLeft = toPx(domain.xMin, fit.meanY, domain);
  const meanRight = toPx(domain.xMax, fit.meanY, domain);

  const highlightIndex = residuals.reduce(
    (best, r, i) =>
      Math.abs(r) > Math.abs(residuals[best]) ? i : best,
    0,
  );

  const activeCaption = STEPS.find((s) => s.id === step)?.caption ?? "";

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
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="min-h-0 w-full flex-1"
        role="img"
        aria-label="Linear regression error and fit metrics"
      >
        <rect width={WIDTH} height={HEIGHT} fill="#0f172a" />

        {/* Axes */}
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

        {/* Sample mean baseline — shown for R² decomposition */}
        {step === "r-squared" && (
          <>
            <line
              x1={meanLeft.px}
              y1={meanLeft.py}
              x2={meanRight.px}
              y2={meanRight.py}
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="8 4"
            />
            <text
              x={meanRight.px - 4}
              y={meanLeft.py - 8}
              textAnchor="end"
              fill="#64748b"
              fontSize={10}
            >
              Ȳ = {fit.meanY.toFixed(2)}
            </text>
          </>
        )}

        {/* OLS fitted line Ŷ = β̂₀ + β̂₁X */}
        <line
          x1={p1.px}
          y1={p1.py}
          x2={p2.px}
          y2={p2.py}
          stroke="#34d399"
          strokeWidth={2.5}
        />

        {/* Per-point geometry */}
        {POINTS.map((pt, index) => {
          const fittedY = fitted[index];
          const r = residuals[index];
          const obs = toPx(pt.x, pt.y, domain);
          const fitPt = toPx(pt.x, fittedY, domain);
          const meanPt = toPx(pt.x, fit.meanY, domain);
          const isHighlight = index === highlightIndex;
          const sqSide = Math.abs(obs.py - fitPt.py);

          return (
            <g key={index}>
              {step === "residuals" && (
                <>
                  <line
                    x1={obs.px}
                    y1={obs.py}
                    x2={fitPt.px}
                    y2={fitPt.py}
                    stroke="#f472b6"
                    strokeWidth={isHighlight ? 2.5 : 1.75}
                    strokeDasharray={isHighlight ? undefined : "5 3"}
                  />
                  {isHighlight && (
                    <>
                      <text
                        x={obs.px + 10}
                        y={obs.py - 6}
                        fill="#cbd5e1"
                        fontSize={10}
                      >
                        Y{sub(index + 1)}
                      </text>
                      <text
                        x={fitPt.px + 10}
                        y={fitPt.py + 14}
                        fill="#34d399"
                        fontSize={10}
                      >
                        Ŷ{sub(index + 1)}
                      </text>
                      <text
                        x={obs.px + 12}
                        y={(obs.py + fitPt.py) / 2}
                        fill="#f472b6"
                        fontSize={11}
                        fontWeight={600}
                      >
                        r{sub(index + 1)} = {r >= 0 ? "+" : ""}
                        {r.toFixed(2)}
                      </text>
                    </>
                  )}
                </>
              )}

              {step === "r-squared" && (
                <>
                  {/* Explained: Ȳ → Ŷ */}
                  <line
                    x1={meanPt.px}
                    y1={meanPt.py}
                    x2={fitPt.px}
                    y2={fitPt.py}
                    stroke="#38bdf8"
                    strokeWidth={isHighlight ? 3 : 2}
                    opacity={0.9}
                  />
                  {/* Residual: Ŷ → Y */}
                  <line
                    x1={fitPt.px}
                    y1={fitPt.py}
                    x2={obs.px}
                    y2={obs.py}
                    stroke="#f472b6"
                    strokeWidth={isHighlight ? 3 : 2}
                    strokeDasharray={isHighlight ? undefined : "4 3"}
                  />
                  {isHighlight && (
                    <>
                      <text
                        x={meanPt.px - 10}
                        y={(meanPt.py + fitPt.py) / 2}
                        textAnchor="end"
                        fill="#38bdf8"
                        fontSize={10}
                      >
                        Ŷ−Ȳ
                      </text>
                      <text
                        x={obs.px + 10}
                        y={(fitPt.py + obs.py) / 2}
                        fill="#f472b6"
                        fontSize={10}
                      >
                        Y−Ŷ
                      </text>
                    </>
                  )}
                </>
              )}

              {step === "error-variance" && sqSide > 1 && (
                <rect
                  x={fitPt.px - 4}
                  y={Math.min(obs.py, fitPt.py)}
                  width={8}
                  height={sqSide}
                  fill="#f472b6"
                  opacity={isHighlight ? 0.4 : 0.22}
                  stroke="#f472b6"
                />
              )}

              {step === "error-variance" && (
                <line
                  x1={obs.px}
                  y1={obs.py}
                  x2={fitPt.px}
                  y2={fitPt.py}
                  stroke="#f472b6"
                  strokeWidth={1.25}
                  strokeDasharray="3 3"
                  opacity={0.55}
                />
              )}

              {/* Observed Yᵢ */}
              <circle cx={obs.px} cy={obs.py} r={5} fill="#818cf8" />
              {/* Fitted Ŷᵢ on the regression line */}
              <circle
                cx={fitPt.px}
                cy={fitPt.py}
                r={3.5}
                fill="#34d399"
                stroke="#0f172a"
                strokeWidth={1}
              />
            </g>
          );
        })}

        {/* Step-specific annotations */}
        {step === "residuals" && (
          <text
            x={MARGIN.left + 10}
            y={MARGIN.top + 14}
            fill="#f472b6"
            fontSize={12}
          >
            rᵢ = Yᵢ − Ŷᵢ (vertical)
          </text>
        )}

        {step === "r-squared" && (
          <g>
            <rect
              x={MARGIN.left + 8}
              y={MARGIN.top + 4}
              width={10}
              height={10}
              fill="#38bdf8"
            />
            <text
              x={MARGIN.left + 22}
              y={MARGIN.top + 13}
              fill="#94a3b8"
              fontSize={9}
            >
              SSR: Σ(Ŷᵢ − Ȳ)² = {ssr.toFixed(2)}
            </text>
            <rect
              x={MARGIN.left + 8}
              y={MARGIN.top + 18}
              width={10}
              height={10}
              fill="#f472b6"
            />
            <text
              x={MARGIN.left + 22}
              y={MARGIN.top + 27}
              fill="#94a3b8"
              fontSize={9}
            >
              SSE: Σ(Yᵢ − Ŷᵢ)² = {sse.toFixed(2)}
            </text>
            <rect
              x={MARGIN.left + PLOT_W - 128}
              y={MARGIN.top + 4}
              width={120}
              height={58}
              rx={6}
              fill="#1e293b"
              stroke="#334155"
            />
            <text
              x={MARGIN.left + PLOT_W - 68}
              y={MARGIN.top + 22}
              textAnchor="middle"
              fill="#38bdf8"
              fontSize={11}
            >
              R² = SSR / SST
            </text>
            <text
              x={MARGIN.left + PLOT_W - 68}
              y={MARGIN.top + 38}
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize={12}
              fontWeight={600}
            >
              = {rSquared.toFixed(3)}
            </text>
            <text
              x={MARGIN.left + PLOT_W - 68}
              y={MARGIN.top + 54}
              textAnchor="middle"
              fill="#64748b"
              fontSize={9}
            >
              SST = {sst.toFixed(2)} · {(rSquared * 100).toFixed(1)}% explained
            </text>
          </g>
        )}

        {step === "error-variance" && (
          <g>
            <rect
              x={MARGIN.left + 8}
              y={MARGIN.top + 4}
              width={188}
              height={72}
              rx={6}
              fill="#1e293b"
              stroke="#334155"
            />
            <text
              x={MARGIN.left + 102}
              y={MARGIN.top + 22}
              textAnchor="middle"
              fill="#a78bfa"
              fontSize={11}
            >
              σ̂² = (1/n) Σ rᵢ²
            </text>
            <text
              x={MARGIN.left + 102}
              y={MARGIN.top + 40}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize={10}
            >
              = {sse.toFixed(2)} / {fit.n}
            </text>
            <text
              x={MARGIN.left + 102}
              y={MARGIN.top + 58}
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize={13}
              fontWeight={600}
            >
              = {sigmaSq.toFixed(3)}
            </text>
            <text
              x={MARGIN.left + 102}
              y={MARGIN.top + 70}
              textAnchor="middle"
              fill="#64748b"
              fontSize={9}
            >
              square area ∝ rᵢ²
            </text>
          </g>
        )}
      </svg>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        {activeCaption}
      </p>
    </div>
  );
}
