export type GifExportSettings = {
  fps: number;
  durationMs: number;
  settleMs: number;
};

export function getGifExportSettings(visualizationKey: string): GifExportSettings {
  switch (visualizationKey) {
    case "brownian-motion":
      return { fps: 12, durationMs: 6000, settleMs: 200 };
    default:
      return { fps: 8, durationMs: 1200, settleMs: 150 };
  }
}
