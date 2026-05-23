import { courses } from "@/content/courses";

export type CalloutType = "info" | "note" | "warning";

export type Callout = {
  type: CalloutType;
  title?: string;
  content: string;
};

export type BodySection = {
  heading?: string;
  paragraphs: string[];
  callout?: Callout;
};

export type Concept = {
  slug: string;
  title: string;
  summary: string;
  formulas: string[];
  body: BodySection[];
  visualizationKey: string;
  tags: string[];
};

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  concepts: Concept[];
};

export type Module = {
  slug: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  description: string;
  modules: Module[];
};

export type NavigationConcept = {
  slug: string;
  title: string;
  href: string;
};

export type NavigationLesson = {
  slug: string;
  title: string;
  href: string;
  concepts: NavigationConcept[];
};

export type NavigationModule = {
  slug: string;
  title: string;
  href: string;
  lessons: NavigationLesson[];
};

export type NavigationCourse = {
  slug: string;
  title: string;
  href: string;
  modules: NavigationModule[];
};

export function getCourses(): Course[] {
  return courses;
}

export function getCourse(courseSlug: string): Course | undefined {
  return courses.find((course) => course.slug === courseSlug);
}

export function getModule(
  courseSlug: string,
  moduleSlug: string,
): { course: Course; module: Module } | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;

  const mod = course.modules.find((item) => item.slug === moduleSlug);
  if (!mod) return undefined;

  return { course, module: mod };
}

export function getLesson(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): { course: Course; module: Module; lesson: Lesson } | undefined {
  const result = getModule(courseSlug, moduleSlug);
  if (!result) return undefined;

  const lesson = result.module.lessons.find((item) => item.slug === lessonSlug);
  if (!lesson) return undefined;

  return { ...result, lesson };
}

export function getConcept(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
  conceptSlug: string,
):
  | { course: Course; module: Module; lesson: Lesson; concept: Concept }
  | undefined {
  const result = getLesson(courseSlug, moduleSlug, lessonSlug);
  if (!result) return undefined;

  const concept = result.lesson.concepts.find((item) => item.slug === conceptSlug);
  if (!concept) return undefined;

  return { ...result, concept };
}

export function getNavigationTree(): NavigationCourse[] {
  return courses.map((course) => ({
    slug: course.slug,
    title: course.title,
    href: `/courses/${course.slug}`,
    modules: course.modules.map((module) => ({
      slug: module.slug,
      title: module.title,
      href: `/courses/${course.slug}/modules/${module.slug}`,
      lessons: module.lessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        href: `/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}`,
        concepts: lesson.concepts.map((concept) => ({
          slug: concept.slug,
          title: concept.title,
          href: `/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}/concepts/${concept.slug}`,
        })),
      })),
    })),
  }));
}
