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
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="spot"
          tick={{ fontSize: 11, fill: "#64748b" }}
          label={{ value: "Spot at expiry", position: "insideBottom", offset: -4, fontSize: 11 }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748b" }}
          label={{ value: "Payoff", angle: -90, position: "insideLeft", fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="call"
          name="Call"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="put"
          name="Put"
          stroke="#f97316"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
