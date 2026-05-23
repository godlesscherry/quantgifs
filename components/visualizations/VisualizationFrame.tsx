import type { ReactNode, Ref } from "react";

type VisualizationFrameProps = {
  title: string;
  description?: string;
  children: ReactNode;
  containerRef?: Ref<HTMLDivElement>;
};

export function VisualizationFrame({
  title,
  description,
  children,
  containerRef,
}: VisualizationFrameProps) {
  return (
    <section className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
      <div
        ref={containerRef}
        data-visualization-frame
        className="aspect-video w-full bg-slate-50 p-4"
      >
        {children}
      </div>
    </section>
  );
}
