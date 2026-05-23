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
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      {meta && (
        <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
          {meta}
        </span>
      )}
      <h2 className="mt-1 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{summary}</p>
      <span className="mt-3 inline-block text-sm font-medium text-indigo-600">
        View →
      </span>
    </Link>
  );
}
