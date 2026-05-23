import type { ComponentType } from "react";
import { BlackScholesViz } from "@/components/visualizations/BlackScholesViz";
import { BrownianMotionViz } from "@/components/visualizations/BrownianMotionViz";
import { YieldCurveViz } from "@/components/visualizations/YieldCurveViz";

export const visualizationRegistry: Record<string, ComponentType> = {
  "brownian-motion": BrownianMotionViz,
  "black-scholes": BlackScholesViz,
  "yield-curve": YieldCurveViz,
};

export function getVisualization(
  key: string,
): ComponentType | undefined {
  return visualizationRegistry[key];
}

export const visualizationTitles: Record<string, string> = {
  "brownian-motion": "Simulated Brownian Paths",
  "black-scholes": "Option Payoff at Expiry",
  "yield-curve": "Sample Yield Curve",
};
