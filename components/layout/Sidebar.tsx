"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigationTree } from "@/lib/content";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      {collapsed ? (
        <path
          fillRule="evenodd"
          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const navigation = getNavigationTree();

  return (
    <aside className="flex h-full flex-col border-r border-slate-800 bg-slate-900">
      <div
        className={`flex shrink-0 border-b border-slate-800 ${
          collapsed
            ? "flex-col items-center gap-2 px-2 py-3"
            : "items-center justify-between gap-2 px-4 py-4"
        }`}
      >
        <Link
          href="/"
          className={`group min-w-0 ${collapsed ? "flex items-center justify-center" : "block flex-1"}`}
          title="QuantGifs"
        >
          {collapsed ? (
            <span className="text-base font-bold tracking-tight text-slate-100">Q</span>
          ) : (
            <>
              <span className="text-lg font-bold tracking-tight text-slate-100">
                QuantGifs
              </span>
              <span className="mt-0.5 block text-xs text-slate-400 group-hover:text-slate-300">
                Financial Engineering Studio
              </span>
            </>
          )}
        </Link>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`hidden shrink-0 rounded-md border border-slate-700 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 lg:inline-flex ${
              collapsed ? "p-2" : "p-1.5"
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        )}
      </div>
      <nav
        className={
          collapsed
            ? "hidden"
            : "flex-1 overflow-y-auto px-3 py-4"
        }
        aria-hidden={collapsed || undefined}
      >
        <ul className="space-y-4">
          {navigation.map((course) => (
            <li key={course.slug}>
              <Link
                href={course.href}
                className={`block rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
                  isActive(pathname, course.href)
                    ? "bg-slate-800 text-slate-100"
                    : "text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                {course.title}
              </Link>
              <ul className="mt-1 space-y-1 border-l border-slate-700 pl-3">
                {course.modules.map((module) => (
                  <li key={module.slug}>
                    <Link
                      href={module.href}
                      className={`block rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                        isActive(pathname, module.href)
                          ? "bg-slate-800 text-slate-100"
                          : "text-slate-400 hover:bg-slate-800/60"
                      }`}
                    >
                      {module.title}
                    </Link>
                    <ul className="mt-1 space-y-0.5 border-l border-slate-700 pl-3">
                      {module.lessons.map((lesson) => (
                        <li key={lesson.slug}>
                          <Link
                            href={lesson.href}
                            className={`block rounded-md px-2 py-1 text-xs transition-colors ${
                              isActive(pathname, lesson.href)
                                ? "bg-slate-800 text-slate-100"
                                : "text-slate-500 hover:bg-slate-800/60"
                            }`}
                          >
                            {lesson.title}
                          </Link>
                          {isActive(pathname, lesson.href) && (
                            <ul className="mt-0.5 space-y-0.5 border-l border-slate-700 pl-3">
                              {lesson.concepts.map((concept) => (
                                <li key={concept.slug}>
                                  <Link
                                    href={concept.href}
                                    className={`block rounded-md px-2 py-1 text-xs transition-colors ${
                                      pathname === concept.href
                                        ? "bg-indigo-950 font-medium text-indigo-300"
                                        : "text-slate-500 hover:bg-slate-800/60"
                                    }`}
                                  >
                                    {concept.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
