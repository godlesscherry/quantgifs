import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentCard } from "@/components/content/ContentCard";
import { getLesson } from "@/lib/content";
import { buildBreadcrumbs, conceptPath } from "@/lib/routes";

type PageProps = {
  params: Promise<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
};

export default async function LessonPage({ params }: PageProps) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const result = getLesson(courseSlug, moduleSlug, lessonSlug);

  if (!result) {
    notFound();
  }

  const { course, module, lesson } = result;
  const breadcrumbs = buildBreadcrumbs({ course, module, lesson });

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="mt-2 text-lg text-slate-600">{lesson.summary}</p>
      </header>
      <div className="grid gap-4">
        {lesson.concepts.map((concept) => (
          <ContentCard
            key={concept.slug}
            href={conceptPath(
              course.slug,
              module.slug,
              lesson.slug,
              concept.slug,
            )}
            title={concept.title}
            summary={concept.summary}
            meta={concept.tags.join(" · ")}
          />
        ))}
      </div>
    </div>
  );
}
