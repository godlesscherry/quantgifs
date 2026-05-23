"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigationTree } from "@/lib/content";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const navigation = getNavigationTree();

  return (
    <aside className="flex h-full flex-col border-r border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-4 py-4">
        <Link href="/" className="group block">
          <span className="text-lg font-bold tracking-tight text-slate-100">
            QuantGifs
          </span>
          <span className="mt-0.5 block text-xs text-slate-400 group-hover:text-slate-300">
            Financial Engineering Studio
          </span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
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
