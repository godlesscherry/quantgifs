"use client";

import { useRef } from "react";
import type { Concept } from "@/lib/content";
import { visualizationTitles } from "@/lib/visualizations";
import { Callout } from "./Callout";
import { MathBlock } from "./MathBlock";
import { ExportPanel } from "@/components/export/ExportPanel";
import { VisualizationFrame } from "@/components/visualizations/VisualizationFrame";
import {
  hasVisualization,
  VisualizationRenderer,
} from "@/components/visualizations/VisualizationRenderer";

type ConceptPageProps = {
  concept: Concept;
};

export function ConceptPage({ concept }: ConceptPageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const showVisualization = hasVisualization(concept.visualizationKey);
  const vizTitle =
    visualizationTitles[concept.visualizationKey] ?? "Visualization";

  return (
    <article>
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2">
          {concept.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-indigo-950 px-2.5 py-0.5 text-xs font-medium text-indigo-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          {concept.title}
        </h1>
        <p className="mt-2 text-lg text-slate-400">{concept.summary}</p>
      </header>

      {concept.formulas.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Key Formulas
          </h2>
          {concept.formulas.map((formula) => (
            <MathBlock key={formula} latex={formula} display />
          ))}
        </section>
      )}

      <section className="concept-body space-y-6">
        {concept.body.map((section, index) => (
          <div key={index}>
            {section.heading && (
              <h2 className="mb-2 text-xl font-semibold text-slate-100">
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((paragraph, pIndex) => (
              <p
                key={pIndex}
                className="mb-3 leading-relaxed text-slate-300 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
            {section.callout && (
              <Callout type={section.callout.type} title={section.callout.title}>
                {section.callout.content}
              </Callout>
            )}
          </div>
        ))}
      </section>

      {showVisualization ? (
        <>
          <VisualizationFrame
            title={vizTitle}
            description="Interactive placeholder — ready for frame capture export."
            containerRef={frameRef}
          >
            <VisualizationRenderer
              visualizationKey={concept.visualizationKey}
            />
          </VisualizationFrame>
          <ExportPanel visualizationKey={concept.visualizationKey} />
        </>
      ) : (
        <p className="mt-6 text-sm text-red-400">
          Visualization not found for key: {concept.visualizationKey}
        </p>
      )}
    </article>
  );
}
