export type ExportFormat = "gif" | "mp4" | "png-sequence";

export type ExportOptions = {
  format: ExportFormat;
  fps?: number;
  width?: number;
  height?: number;
};

export type ExportStatus =
  | "idle"
  | "preparing"
  | "rendering"
  | "done"
  | "error";

export type ExportResult = {
  format: ExportFormat;
  status: ExportStatus;
  message?: string;
};
