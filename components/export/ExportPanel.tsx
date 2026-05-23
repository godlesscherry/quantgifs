"use client";

import { useState } from "react";
import type { ExportFormat, ExportStatus } from "./exportTypes";

type ExportPanelProps = {
  visualizationKey: string;
};

const formatLabels: Record<ExportFormat, string> = {
  gif: "Export GIF",
  mp4: "Export MP4",
  "png-sequence": "Export PNG Sequence",
};

export function ExportPanel({ visualizationKey }: ExportPanelProps) {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleExport = (format: ExportFormat) => {
    // TODO: Capture frames from VisualizationFrame container ref.
    //   - Use canvas.toDataURL() for canvas/SVG rasterization, or html2canvas for DOM.
    // TODO: Encode frames:
    //   - GIF: gif.js or similar client-side encoder
    //   - MP4: ffmpeg.wasm or server-side pipeline
    //   - PNG sequence: zip individual frame blobs
    setStatus("preparing");
    setMessage(null);

    console.log(
      `[ExportPanel] Placeholder export requested: format=${format}, viz=${visualizationKey}`,
    );

    setTimeout(() => {
      setStatus("idle");
      setMessage(
        `Export (${formatLabels[format]}) is not yet implemented. Frame capture and encoding pipeline coming soon.`,
      );
    }, 300);
  };

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">Export</h3>
      <p className="mt-1 text-xs text-slate-500">
        Export animations as GIF, MP4, or PNG sequences (placeholder).
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(formatLabels) as ExportFormat[]).map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => handleExport(format)}
            disabled={status !== "idle"}
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {formatLabels[format]}
          </button>
        ))}
      </div>
      {message && (
        <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {message}
        </p>
      )}
    </section>
  );
}
