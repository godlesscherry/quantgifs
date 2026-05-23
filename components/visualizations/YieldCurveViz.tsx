"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const yieldCurveData = [
  { maturity: 1, yield: 4.85 },
  { maturity: 3, yield: 4.62 },
  { maturity: 6, yield: 4.41 },
  { maturity: 12, yield: 4.18 },
  { maturity: 24, yield: 3.95 },
  { maturity: 36, yield: 3.82 },
  { maturity: 60, yield: 3.71 },
  { maturity: 120, yield: 3.65 },
  { maturity: 240, yield: 3.78 },
  { maturity: 360, yield: 3.92 },
];

export function YieldCurveViz() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={yieldCurveData}
        margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="maturity"
          tick={{ fontSize: 11, fill: "#64748b" }}
          label={{
            value: "Maturity (months)",
            position: "insideBottom",
            offset: -4,
            fontSize: 11,
          }}
        />
        <YAxis
          domain={[3.4, 5.2]}
          tick={{ fontSize: 11, fill: "#64748b" }}
          label={{
            value: "Yield (%)",
            angle: -90,
            position: "insideLeft",
            fontSize: 11,
          }}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Yield"]}
          labelFormatter={(label) => `${label} months`}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
        />
        <Line
          type="monotone"
          dataKey="yield"
          stroke="#0ea5e9"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#0ea5e9" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
