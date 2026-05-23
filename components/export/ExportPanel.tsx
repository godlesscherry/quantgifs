"use client";

import { useRef, useState, type RefObject } from "react";
import { exportVisualizationGif } from "@/lib/export/exportGif";
import type { ExportFormat, ExportStatus } from "./exportTypes";

type ExportPanelProps = {
  visualizationKey: string;
  frameRef: RefObject<HTMLDivElement | null>;
};

const formatLabels: Record<ExportFormat, string> = {
  gif: "Export GIF",
  mp4: "Export MP4",
  "png-sequence": "Export PNG Sequence",
};

const statusLabels: Record<ExportStatus, string> = {
  idle: "",
  preparing: "Preparing export…",
  rendering: "Capturing frames…",
  done: "GIF downloaded.",
  error: "Export failed.",
};

export function ExportPanel({ visualizationKey, frameRef }: ExportPanelProps) {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const exportingRef = useRef(false);

  const isBusy = status !== "idle" && status !== "done" && status !== "error";

  const handleGifExport = async () => {
    const frameElement = frameRef.current;
    if (!frameElement) {
      setStatus("error");
      setMessage("Visualization frame is not ready. Try again in a moment.");
      return;
    }
    if (exportingRef.current) {
      return;
    }

    exportingRef.current = true;
    setStatus("preparing");
    setMessage(null);
    setProgress(0);

    try {
      setStatus("rendering");
      await exportVisualizationGif({
        visualizationKey,
        frameElement,
        onProgress: setProgress,
      });
      setStatus("done");
      setMessage(statusLabels.done);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : statusLabels.error,
      );
    } finally {
      exportingRef.current = false;
      setProgress(0);
    }
  };

  const handleExport = (format: ExportFormat) => {
    if (format === "gif") {
      void handleGifExport();
      return;
    }

    setMessage(
      `Export (${formatLabels[format]}) is not yet implemented. GIF export is available now.`,
    );
  };

  const statusMessage =
    status === "rendering"
      ? `${statusLabels.rendering} ${Math.round(progress * 100)}%`
      : status === "preparing"
        ? statusLabels.preparing
        : message;

  return (
    <section className="mt-6 rounded-lg border border-slate-700 bg-slate-900 p-4">
      <h3 className="text-sm font-semibold text-slate-100">Export</h3>
      <p className="mt-1 text-xs text-slate-400">
        Download the visualization animation as a GIF. MP4 and PNG sequence
        export are planned next.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(formatLabels) as ExportFormat[]).map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => handleExport(format)}
            disabled={isBusy}
            className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {formatLabels[format]}
          </button>
        ))}
      </div>
      {isBusy && (
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-indigo-500 transition-[width] duration-150"
            style={{ width: `${Math.max(4, Math.round(progress * 100))}%` }}
          />
        </div>
      )}
      {statusMessage && (
        <p
          className={`mt-3 rounded-md px-3 py-2 text-xs ${
            status === "error"
              ? "bg-red-950/50 text-red-200"
              : status === "done"
                ? "bg-emerald-950/50 text-emerald-200"
                : "bg-slate-800 text-slate-300"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </section>
  );
}
