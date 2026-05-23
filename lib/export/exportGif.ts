import { getGifExportSettings } from "./exportConfig";
import { downloadBlob } from "./download";
import { captureFrames } from "./frameCapture";
import { encodeGif } from "./gifEncoder";

export type ExportGifOptions = {
  visualizationKey: string;
  frameElement: HTMLElement;
  onProgress?: (progress: number) => void;
};

export async function exportVisualizationGif({
  visualizationKey,
  frameElement,
  onProgress,
}: ExportGifOptions): Promise<void> {
  const settings = getGifExportSettings(visualizationKey);

  const frames = await captureFrames(frameElement, {
    fps: settings.fps,
    durationMs: settings.durationMs,
    settleMs: settings.settleMs,
    onProgress: (captureProgress) => {
      onProgress?.(captureProgress * 0.9);
    },
  });

  onProgress?.(0.95);

  const bytes = encodeGif(frames, settings.fps);
  const blob = new Blob([Uint8Array.from(bytes)], { type: "image/gif" });

  onProgress?.(1);
  downloadBlob(blob, `${visualizationKey}.gif`);
}
