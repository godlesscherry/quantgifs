import type { CalloutType } from "@/lib/content";

type CalloutProps = {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
};

const styles: Record<CalloutType, string> = {
  info: "border-blue-700 bg-blue-950/50 text-blue-200",
  note: "border-amber-700 bg-amber-950/50 text-amber-200",
  warning: "border-orange-700 bg-orange-950/50 text-orange-200",
};

export function Callout({ type, title, children }: CalloutProps) {
  return (
    <aside
      className={`my-4 rounded-lg border-l-4 px-4 py-3 text-sm ${styles[type]}`}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="leading-relaxed">{children}</div>
    </aside>
  );
}
