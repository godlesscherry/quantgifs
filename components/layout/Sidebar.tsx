"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigationTree } from "@/lib/content";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function courseAbbreviation(title: string): string {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.slice(0, 2).toUpperCase();
}

type SidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

/** Collapse ← when expanded; expand → when collapsed. */
function SidebarToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      {collapsed ? (
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
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
    <aside className="relative flex h-full flex-col overflow-visible border-r border-slate-800 bg-slate-900">
      <div
        className={`relative shrink-0 border-b border-slate-800 ${
          collapsed ? "flex flex-col items-center px-2 py-3" : "px-4 py-4 pr-5"
        }`}
      >
        <Link
          href="/"
          className={`group min-w-0 ${collapsed ? "flex items-center justify-center" : "block"}`}
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
            className="absolute top-1/2 -right-3 z-20 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-300 shadow-md ring-1 ring-slate-950/50 transition-colors hover:border-indigo-500/60 hover:bg-slate-700 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 lg:flex"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <SidebarToggleIcon collapsed={collapsed} />
          </button>
        )}
      </div>
      <nav
        className={
          collapsed
            ? "flex flex-1 flex-col overflow-y-auto px-1 py-3"
            : "flex-1 overflow-y-auto px-3 py-4"
        }
        aria-label="Course navigation"
      >
        {collapsed ? (
          <ul className="flex flex-col items-center gap-1">
            {navigation.map((course) => (
              <li key={course.slug} className="w-full">
                <Link
                  href={course.href}
                  title={course.title}
                  className={`flex h-9 w-full items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                    isActive(pathname, course.href)
                      ? "bg-slate-800 text-slate-100"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  {courseAbbreviation(course.title)}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
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
        )}
      </nav>
    </aside>
  );
}
