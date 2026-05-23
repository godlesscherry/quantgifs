"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const WIDTH = 600;
const HEIGHT = 300;
const STEPS = 80;

function generatePath(seed: number): string {
  let x = 0;
  let y = HEIGHT / 2;
  const stepX = WIDTH / STEPS;
  const points: string[] = [`M ${x} ${y}`];

  for (let i = 1; i <= STEPS; i++) {
    const noise = Math.sin(i * 0.3 + seed) * 8 + (Math.random() - 0.5) * 20;
    x += stepX;
    y = Math.max(20, Math.min(HEIGHT - 20, y + noise));
    points.push(`L ${x} ${y}`);
  }

  return points.join(" ");
}

export function BrownianMotionViz() {
  const [seed, setSeed] = useState(0);

  const paths = useMemo(
    () => [generatePath(seed), generatePath(seed + 1.7), generatePath(seed + 3.1)],
    [seed],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSeed((current) => current + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="Simulated Brownian motion paths"
    >
      <rect width={WIDTH} height={HEIGHT} fill="#f8fafc" />
      {[0.25, 0.5, 0.75].map((ratio) => (
        <line
          key={ratio}
          x1={0}
          y1={HEIGHT * ratio}
          x2={WIDTH}
          y2={HEIGHT * ratio}
          stroke="#e2e8f0"
          strokeDasharray="4 4"
        />
      ))}
      {paths.map((path, index) => (
        <motion.path
          key={`${seed}-${index}`}
          d={path}
          fill="none"
          stroke={["#6366f1", "#0ea5e9", "#14b8a6"][index]}
          strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
