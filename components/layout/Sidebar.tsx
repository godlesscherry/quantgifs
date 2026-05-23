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
    <aside className="flex h-full flex-col border-r border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-4 py-4">
        <Link href="/" className="group block">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            QuantGifs
          </span>
          <span className="mt-0.5 block text-xs text-slate-500 group-hover:text-slate-700">
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
                    ? "bg-slate-200 text-slate-900"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {course.title}
              </Link>
              <ul className="mt-1 space-y-1 border-l border-slate-200 pl-3">
                {course.modules.map((module) => (
                  <li key={module.slug}>
                    <Link
                      href={module.href}
                      className={`block rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                        isActive(pathname, module.href)
                          ? "bg-slate-200 text-slate-900"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {module.title}
                    </Link>
                    <ul className="mt-1 space-y-0.5 border-l border-slate-200 pl-3">
                      {module.lessons.map((lesson) => (
                        <li key={lesson.slug}>
                          <Link
                            href={lesson.href}
                            className={`block rounded-md px-2 py-1 text-xs transition-colors ${
                              isActive(pathname, lesson.href)
                                ? "bg-slate-200 text-slate-900"
                                : "text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            {lesson.title}
                          </Link>
                          {isActive(pathname, lesson.href) && (
                            <ul className="mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                              {lesson.concepts.map((concept) => (
                                <li key={concept.slug}>
                                  <Link
                                    href={concept.href}
                                    className={`block rounded-md px-2 py-1 text-xs transition-colors ${
                                      pathname === concept.href
                                        ? "bg-indigo-100 font-medium text-indigo-900"
                                        : "text-slate-500 hover:bg-slate-100"
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
