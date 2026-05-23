import { GIFEncoder, applyPalette, quantize } from "gifenc";

export function encodeGif(frames: ImageData[], fps: number): Uint8Array {
  if (frames.length === 0) {
    throw new Error("No frames to encode.");
  }

  const { width, height } = frames[0];
  const delay = Math.max(1, Math.round(1000 / fps));
  const gif = GIFEncoder();

  const firstRgba = new Uint8Array(frames[0].data);
  const palette = quantize(firstRgba, 256);
  const firstIndex = applyPalette(firstRgba, palette);
  gif.writeFrame(firstIndex, width, height, { palette, delay });

  for (let i = 1; i < frames.length; i++) {
    const frame = frames[i];
    if (frame.width !== width || frame.height !== height) {
      throw new Error("All frames must share the same dimensions.");
    }

    const rgba = new Uint8Array(frame.data);
    const index = applyPalette(rgba, palette);
    gif.writeFrame(index, width, height, { delay });
  }

  gif.finish();
  return gif.bytes();
}
