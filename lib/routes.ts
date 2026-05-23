export function coursePath(courseSlug: string): string {
  return `/courses/${courseSlug}`;
}

export function modulePath(courseSlug: string, moduleSlug: string): string {
  return `/courses/${courseSlug}/modules/${moduleSlug}`;
}

export function lessonPath(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): string {
  return `/courses/${courseSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`;
}

export function conceptPath(
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
  conceptSlug: string,
): string {
  return `/courses/${courseSlug}/modules/${moduleSlug}/lessons/${lessonSlug}/concepts/${conceptSlug}`;
}

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function buildBreadcrumbs(params: {
  course?: { slug: string; title: string };
  module?: { slug: string; title: string };
  lesson?: { slug: string; title: string };
  concept?: { slug: string; title: string };
}): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  if (params.course) {
    items.push({
      label: params.course.title,
      href: params.concept || params.lesson || params.module
        ? coursePath(params.course.slug)
        : undefined,
    });
  }

  if (params.course && params.module) {
    items.push({
      label: params.module.title,
      href: params.concept || params.lesson
        ? modulePath(params.course.slug, params.module.slug)
        : undefined,
    });
  }

  if (params.course && params.module && params.lesson) {
    items.push({
      label: params.lesson.title,
      href: params.concept
        ? lessonPath(params.course.slug, params.module.slug, params.lesson.slug)
        : undefined,
    });
  }

  if (params.course && params.module && params.lesson && params.concept) {
    items.push({ label: params.concept.title });
  }

  return items;
}
