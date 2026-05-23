"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STRIKE = 100;

const chartTheme = {
  grid: "#334155",
  tick: "#94a3b8",
  label: "#94a3b8",
  tooltip: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    color: "#e2e8f0",
  },
  legend: "#cbd5e1",
};

function buildPayoffData() {
  const data = [];
  for (let spot = 60; spot <= 140; spot += 2) {
    data.push({
      spot,
      call: Math.max(spot - STRIKE, 0),
      put: Math.max(STRIKE - spot, 0),
    });
  }
  return data;
}

const payoffData = buildPayoffData();

export function BlackScholesViz() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={payoffData} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis
          dataKey="spot"
          tick={{ fontSize: 11, fill: chartTheme.tick }}
          stroke={chartTheme.grid}
          label={{
            value: "Spot at expiry",
            position: "insideBottom",
            offset: -4,
            fontSize: 11,
            fill: chartTheme.label,
          }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: chartTheme.tick }}
          stroke={chartTheme.grid}
          label={{
            value: "Payoff",
            angle: -90,
            position: "insideLeft",
            fontSize: 11,
            fill: chartTheme.label,
          }}
        />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            ...chartTheme.tooltip,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: chartTheme.legend }} />
        <Line
          type="monotone"
          dataKey="call"
          name="Call"
          stroke="#818cf8"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="put"
          name="Put"
          stroke="#fb923c"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
