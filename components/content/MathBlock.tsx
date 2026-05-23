"use client";

import katex from "katex";
import { useMemo } from "react";

type MathBlockProps = {
  latex: string;
  display?: boolean;
};

export function MathBlock({ latex, display = false }: MathBlockProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
        strict: "ignore",
      });
    } catch {
      return latex;
    }
  }, [latex, display]);

  if (display) {
    return (
      <div
        className="my-4 overflow-x-auto rounded-lg border border-slate-200 bg-white px-4 py-3 text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className="inline-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
