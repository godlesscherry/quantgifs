import type { CalloutType } from "@/lib/content";

type CalloutProps = {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
};

const styles: Record<CalloutType, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  note: "border-amber-200 bg-amber-50 text-amber-900",
  warning: "border-orange-200 bg-orange-50 text-orange-900",
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
