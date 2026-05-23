import { BlackScholesViz } from "./BlackScholesViz";
import { BrownianMotionViz } from "./BrownianMotionViz";
import { LinearRegressionCoreViz } from "./LinearRegressionCoreViz";
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
    default:
      return null;
  }
}

export function hasVisualization(visualizationKey: string): boolean {
  return (
    visualizationKey === "brownian-motion" ||
    visualizationKey === "black-scholes" ||
    visualizationKey === "yield-curve" ||
    visualizationKey === "linear-regression-core"
  );
}
