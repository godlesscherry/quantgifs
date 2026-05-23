function truncateToWidth(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (context.measureText(text).width <= maxWidth) {
    return text;
  }

  let truncated = text;
  const ellipsis = "…";
  while (
    truncated.length > 0 &&
    context.measureText(truncated + ellipsis).width > maxWidth
  ) {
    truncated = truncated.slice(0, -1);
  }

  return truncated.length > 0 ? truncated + ellipsis : ellipsis;
}

export function overlayTitleOnFrames(
  frames: ImageData[],
  title: string,
): ImageData[] {
  if (!title.trim()) {
    return frames;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not draw title on export frames.");
  }

  return frames.map((frame) => {
    canvas.width = frame.width;
    canvas.height = frame.height;
    context.putImageData(frame, 0, 0);

    const padding = Math.max(10, Math.round(frame.height * 0.035));
    const fontSize = Math.max(13, Math.round(frame.width * 0.03));
    const barHeight = fontSize + padding * 2;
    const maxTextWidth = frame.width - padding * 2;

    context.font = `600 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
    const label = truncateToWidth(context, title.trim(), maxTextWidth);

    context.fillStyle = "rgba(15, 23, 42, 0.88)";
    context.fillRect(0, 0, frame.width, barHeight);

    context.fillStyle = "#f1f5f9";
    context.textBaseline = "middle";
    context.fillText(label, padding, barHeight / 2);

    return context.getImageData(0, 0, frame.width, frame.height);
  });
}

export function gifFilenameFromTitle(title: string, fallbackKey: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return `${slug || fallbackKey}.gif`;
}
