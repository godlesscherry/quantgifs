import Link from "next/link";

type ContentCardProps = {
  href: string;
  title: string;
  summary: string;
  meta?: string;
};

export function ContentCard({ href, title, summary, meta }: ContentCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20 transition-colors hover:border-slate-700 hover:bg-slate-800/80"
    >
      {meta && (
        <span className="text-xs font-medium uppercase tracking-wide text-indigo-400">
          {meta}
        </span>
      )}
      <h2 className="mt-1 text-lg font-semibold text-slate-100">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{summary}</p>
      <span className="mt-3 inline-block text-sm font-medium text-indigo-400">
        View →
      </span>
    </Link>
  );
}
