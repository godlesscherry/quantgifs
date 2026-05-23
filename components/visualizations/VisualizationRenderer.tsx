import { BlackScholesViz } from "./BlackScholesViz";
import { BrownianMotionViz } from "./BrownianMotionViz";
import { LinearRegressionCoreViz } from "./LinearRegressionCoreViz";
import { LinearRegressionMetricsViz } from "./LinearRegressionMetricsViz";
import { YieldCurveViz } from "./YieldCurveViz";

type VisualizationRendererProps = {
  visualizationKey: string;
};

export function VisualizationRenderer({
  visualizationKey,
}: VisualizationRendererProps) {
  switch (visualizationKey) {
    case "brownian-motion":
      return <BrownianMotionViz />;
    case "black-scholes":
      return <BlackScholesViz />;
    case "yield-curve":
      return <YieldCurveViz />;
    case "linear-regression-core":
      return <LinearRegressionCoreViz />;
    case "linear-regression-metrics":
      return <LinearRegressionMetricsViz />;
    default:
      return null;
  }
}

export function hasVisualization(visualizationKey: string): boolean {
  return (
    visualizationKey === "brownian-motion" ||
    visualizationKey === "black-scholes" ||
    visualizationKey === "yield-curve" ||
    visualizationKey === "linear-regression-core" ||
    visualizationKey === "linear-regression-metrics"
  );
}
