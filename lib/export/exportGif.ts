import { getGifExportSettings } from "./exportConfig";
import { downloadBlob } from "./download";
import { captureFrames } from "./frameCapture";
import { overlayTitleOnFrames, gifFilenameFromTitle } from "./frameOverlay";
import { encodeGif } from "./gifEncoder";

export type ExportGifOptions = {
  visualizationKey: string;
  title: string;
  frameElement: HTMLElement;
  onProgress?: (progress: number) => void;
};

export async function exportVisualizationGif({
  visualizationKey,
  title,
  frameElement,
  onProgress,
}: ExportGifOptions): Promise<void> {
  const settings = getGifExportSettings(visualizationKey);

  const frames = await captureFrames(frameElement, {
    fps: settings.fps,
    durationMs: settings.durationMs,
    settleMs: settings.settleMs,
    onProgress: (captureProgress) => {
      onProgress?.(captureProgress * 0.85);
    },
  });

  onProgress?.(0.9);

  const titledFrames = overlayTitleOnFrames(frames, title);
  const bytes = encodeGif(titledFrames, settings.fps);
  const blob = new Blob([Uint8Array.from(bytes)], { type: "image/gif" });

  onProgress?.(1);
  downloadBlob(blob, gifFilenameFromTitle(title, visualizationKey));
}
