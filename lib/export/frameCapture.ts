import { toCanvas } from "html-to-image";

const CAPTURE_BACKGROUND = "#020617";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export type CaptureFramesOptions = {
  fps: number;
  durationMs: number;
  settleMs?: number;
  onProgress?: (progress: number) => void;
};

export async function captureFrames(
  element: HTMLElement,
  options: CaptureFramesOptions,
): Promise<ImageData[]> {
  const { fps, durationMs, settleMs = 0, onProgress } = options;
  const frameCount = Math.max(1, Math.round((durationMs / 1000) * fps));
  const frameDelayMs = 1000 / fps;
  const frames: ImageData[] = [];

  if (settleMs > 0) {
    await sleep(settleMs);
  }

  for (let i = 0; i < frameCount; i++) {
    const canvas = await toCanvas(element, {
      backgroundColor: CAPTURE_BACKGROUND,
      pixelRatio: 1,
      cacheBust: true,
    });

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not read visualization frame pixels.");
    }

    frames.push(context.getImageData(0, 0, canvas.width, canvas.height));
    onProgress?.((i + 1) / frameCount);

    if (i < frameCount - 1) {
      await sleep(frameDelayMs);
    }
  }

  return frames;
}
