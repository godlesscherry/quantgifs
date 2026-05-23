"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  getNavigationTree,
  type NavigationCourse,
  type NavigationLesson,
  type NavigationModule,
} from "@/lib/content";

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

function moduleKey(courseSlug: string, moduleSlug: string): string {
  return `${courseSlug}/${moduleSlug}`;
}

function lessonKey(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): string {
  return `${courseSlug}/${moduleSlug}/${lessonSlug}`;
}

type ActivePath = {
  courseSlug?: string;
  moduleSlug?: string;
  lessonSlug?: string;
};

function findActivePath(
  pathname: string,
  navigation: NavigationCourse[],
): ActivePath {
  for (const course of navigation) {
    if (!isActive(pathname, course.href)) continue;

    let moduleSlug: string | undefined;
    let lessonSlug: string | undefined;

    for (const mod of course.modules) {
      if (!isActive(pathname, mod.href)) continue;
      moduleSlug = mod.slug;
      for (const lesson of mod.lessons) {
        if (isActive(pathname, lesson.href)) {
          lessonSlug = lesson.slug;
          break;
        }
      }
      break;
    }

    return { courseSlug: course.slug, moduleSlug, lessonSlug };
  }
  return {};
}

function TreeChevron({
  expanded,
  onToggle,
  label,
}: {
  expanded: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
      aria-expanded={expanded}
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`h-3.5 w-3.5 transition-transform duration-150 ${
          expanded ? "rotate-90" : ""
        }`}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
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

type ActiveKeys = {
  courses: Set<string>;
  modules: Set<string>;
  lessons: Set<string>;
};

function activeKeysFromPath(
  active: ActivePath,
): ActiveKeys {
  const courses = new Set<string>();
  const modules = new Set<string>();
  const lessons = new Set<string>();
  if (active.courseSlug) {
    courses.add(active.courseSlug);
    if (active.moduleSlug) {
      modules.add(moduleKey(active.courseSlug, active.moduleSlug));
      if (active.lessonSlug) {
        lessons.add(
          lessonKey(active.courseSlug, active.moduleSlug, active.lessonSlug),
        );
      }
    }
  }
  return { courses, modules, lessons };
}

function isNodeExpanded(
  key: string,
  active: Set<string>,
  forcedOpen: Set<string>,
  forcedClosed: Set<string>,
): boolean {
  if (forcedClosed.has(key)) return false;
  if (forcedOpen.has(key)) return true;
  return active.has(key);
}

function useExpandedNav(pathname: string, navigation: NavigationCourse[]) {
  const active = useMemo(
    () => findActivePath(pathname, navigation),
    [pathname, navigation],
  );
  const activeKeys = useMemo(() => activeKeysFromPath(active), [active]);

  const [forcedOpenCourses, setForcedOpenCourses] = useState<Set<string>>(
    () => new Set(),
  );
  const [forcedClosedCourses, setForcedClosedCourses] = useState<Set<string>>(
    () => new Set(),
  );
  const [forcedOpenModules, setForcedOpenModules] = useState<Set<string>>(
    () => new Set(),
  );
  const [forcedClosedModules, setForcedClosedModules] = useState<Set<string>>(
    () => new Set(),
  );
  const [forcedOpenLessons, setForcedOpenLessons] = useState<Set<string>>(
    () => new Set(),
  );
  const [forcedClosedLessons, setForcedClosedLessons] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleInSets = useCallback(
    (
      key: string,
      activeSet: Set<string>,
      forcedOpen: Set<string>,
      forcedClosed: Set<string>,
      setForcedOpen: Dispatch<SetStateAction<Set<string>>>,
      setForcedClosed: Dispatch<SetStateAction<Set<string>>>,
    ) => {
      const open = isNodeExpanded(key, activeSet, forcedOpen, forcedClosed);
      if (open) {
        setForcedClosed((prev) => new Set(prev).add(key));
        setForcedOpen((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      } else {
        setForcedOpen((prev) => new Set(prev).add(key));
        setForcedClosed((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [],
  );

  const toggleCourse = useCallback(
    (slug: string) => {
      toggleInSets(
        slug,
        activeKeys.courses,
        forcedOpenCourses,
        forcedClosedCourses,
        setForcedOpenCourses,
        setForcedClosedCourses,
      );
    },
    [
      activeKeys.courses,
      forcedOpenCourses,
      forcedClosedCourses,
      toggleInSets,
    ],
  );

  const toggleModule = useCallback(
    (courseSlug: string, moduleSlug: string) => {
      const key = moduleKey(courseSlug, moduleSlug);
      toggleInSets(
        key,
        activeKeys.modules,
        forcedOpenModules,
        forcedClosedModules,
        setForcedOpenModules,
        setForcedClosedModules,
      );
    },
    [
      activeKeys.modules,
      forcedOpenModules,
      forcedClosedModules,
      toggleInSets,
    ],
  );

  const toggleLesson = useCallback(
    (courseSlug: string, moduleSlug: string, lessonSlug: string) => {
      const key = lessonKey(courseSlug, moduleSlug, lessonSlug);
      toggleInSets(
        key,
        activeKeys.lessons,
        forcedOpenLessons,
        forcedClosedLessons,
        setForcedOpenLessons,
        setForcedClosedLessons,
      );
    },
    [
      activeKeys.lessons,
      forcedOpenLessons,
      forcedClosedLessons,
      toggleInSets,
    ],
  );

  const isCourseExpanded = useCallback(
    (slug: string) =>
      isNodeExpanded(
        slug,
        activeKeys.courses,
        forcedOpenCourses,
        forcedClosedCourses,
      ),
    [activeKeys.courses, forcedOpenCourses, forcedClosedCourses],
  );
  const isModuleExpanded = useCallback(
    (courseSlug: string, moduleSlug: string) => {
      const key = moduleKey(courseSlug, moduleSlug);
      return isNodeExpanded(
        key,
        activeKeys.modules,
        forcedOpenModules,
        forcedClosedModules,
      );
    },
    [activeKeys.modules, forcedOpenModules, forcedClosedModules],
  );
  const isLessonExpanded = useCallback(
    (courseSlug: string, moduleSlug: string, lessonSlug: string) => {
      const key = lessonKey(courseSlug, moduleSlug, lessonSlug);
      return isNodeExpanded(
        key,
        activeKeys.lessons,
        forcedOpenLessons,
        forcedClosedLessons,
      );
    },
    [activeKeys.lessons, forcedOpenLessons, forcedClosedLessons],
  );

  return {
    toggleCourse,
    toggleModule,
    toggleLesson,
    isCourseExpanded,
    isModuleExpanded,
    isLessonExpanded,
  };
}

function NavLesson({
  lesson,
  pathname,
  expanded,
  onToggle,
}: {
  lesson: NavigationLesson;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const lessonActive = isActive(pathname, lesson.href);
  const hasConcepts = lesson.concepts.length > 0;

  return (
    <li>
      <div className="flex items-center gap-0.5">
        {hasConcepts ? (
          <TreeChevron
            expanded={expanded}
            onToggle={onToggle}
            label={`${expanded ? "Collapse" : "Expand"} concepts in ${lesson.title}`}
          />
        ) : (
          <span className="h-6 w-6 shrink-0" aria-hidden="true" />
        )}
        <Link
          href={lesson.href}
          className={`min-w-0 flex-1 rounded-md px-2 py-1 text-xs transition-colors ${
            lessonActive
              ? "bg-slate-800 font-medium text-slate-100"
              : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
          }`}
        >
          {lesson.title}
        </Link>
      </div>
      {hasConcepts && expanded && (
        <ul className="mt-0.5 space-y-0.5 border-l border-slate-700/80 pl-3 ml-3">
          {lesson.concepts.map((concept) => (
            <li key={concept.slug}>
              <Link
                href={concept.href}
                className={`block rounded-md px-2 py-1 text-xs transition-colors ${
                  pathname === concept.href
                    ? "bg-indigo-950 font-medium text-indigo-300"
                    : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-400"
                }`}
              >
                {concept.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function NavModule({
  module,
  pathname,
  expanded,
  onToggle,
  isLessonExpanded,
  toggleLesson,
}: {
  module: NavigationModule;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  isLessonExpanded: (lessonSlug: string) => boolean;
  toggleLesson: (lessonSlug: string) => void;
}) {
  const moduleActive = isActive(pathname, module.href);

  return (
    <li>
      <div className="flex items-center gap-0.5">
        <TreeChevron
          expanded={expanded}
          onToggle={onToggle}
          label={`${expanded ? "Collapse" : "Expand"} lessons in ${module.title}`}
        />
        <Link
          href={module.href}
          className={`min-w-0 flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            moduleActive
              ? "bg-slate-800 text-slate-100"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
          }`}
        >
          {module.title}
        </Link>
      </div>
      {expanded && (
        <ul className="mt-1 space-y-0.5 border-l border-slate-700/80 pl-3 ml-3">
          {module.lessons.map((lesson) => (
            <NavLesson
              key={lesson.slug}
              lesson={lesson}
              pathname={pathname}
              expanded={isLessonExpanded(lesson.slug)}
              onToggle={() => toggleLesson(lesson.slug)}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function NavCourse({
  course,
  pathname,
  expanded,
  onToggle,
  isModuleExpanded,
  toggleModule,
  isLessonExpanded,
  toggleLesson,
}: {
  course: NavigationCourse;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  isModuleExpanded: (moduleSlug: string) => boolean;
  toggleModule: (moduleSlug: string) => void;
  isLessonExpanded: (moduleSlug: string, lessonSlug: string) => boolean;
  toggleLesson: (moduleSlug: string, lessonSlug: string) => void;
}) {
  const courseActive = isActive(pathname, course.href);
  const hasModules = course.modules.length > 0;

  return (
    <li>
      <div className="flex items-center gap-0.5">
        {hasModules ? (
          <TreeChevron
            expanded={expanded}
            onToggle={onToggle}
            label={`${expanded ? "Collapse" : "Expand"} modules in ${course.title}`}
          />
        ) : (
          <span className="h-6 w-6 shrink-0" aria-hidden="true" />
        )}
        <Link
          href={course.href}
          className={`min-w-0 flex-1 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
            courseActive
              ? "bg-slate-800 text-slate-100"
              : "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100"
          }`}
        >
          {course.title}
        </Link>
      </div>
      {hasModules && expanded && (
        <ul className="mt-1 space-y-1 border-l border-slate-700/80 pl-3 ml-3">
          {course.modules.map((module) => (
            <NavModule
              key={module.slug}
              module={module}
              pathname={pathname}
              expanded={isModuleExpanded(module.slug)}
              onToggle={() => toggleModule(module.slug)}
              isLessonExpanded={(lessonSlug) =>
                isLessonExpanded(module.slug, lessonSlug)
              }
              toggleLesson={(lessonSlug) =>
                toggleLesson(module.slug, lessonSlug)
              }
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const navigation = getNavigationTree();
  const {
    toggleCourse,
    toggleModule,
    toggleLesson,
    isCourseExpanded,
    isModuleExpanded,
    isLessonExpanded,
  } = useExpandedNav(pathname, navigation);

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
          <ul className="space-y-3">
            {navigation.map((course) => (
              <NavCourse
                key={course.slug}
                course={course}
                pathname={pathname}
                expanded={isCourseExpanded(course.slug)}
                onToggle={() => toggleCourse(course.slug)}
                isModuleExpanded={(moduleSlug) =>
                  isModuleExpanded(course.slug, moduleSlug)
                }
                toggleModule={(moduleSlug) =>
                  toggleModule(course.slug, moduleSlug)
                }
                isLessonExpanded={(moduleSlug, lessonSlug) =>
                  isLessonExpanded(course.slug, moduleSlug, lessonSlug)
                }
                toggleLesson={(moduleSlug, lessonSlug) =>
                  toggleLesson(course.slug, moduleSlug, lessonSlug)
                }
              />
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
