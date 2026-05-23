import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentCard } from "@/components/content/ContentCard";
import { getModule } from "@/lib/content";
import { buildBreadcrumbs, lessonPath } from "@/lib/routes";

type PageProps = {
  params: Promise<{ courseSlug: string; moduleSlug: string }>;
};

export default async function ModulePage({ params }: PageProps) {
  const { courseSlug, moduleSlug } = await params;
  const result = getModule(courseSlug, moduleSlug);

  if (!result) {
    notFound();
  }

  const { course, module } = result;
  const breadcrumbs = buildBreadcrumbs({ course, module });

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{module.title}</h1>
        <p className="mt-2 text-lg text-slate-400">{module.summary}</p>
      </header>
      <div className="grid gap-4">
        {module.lessons.map((lesson) => (
          <ContentCard
            key={lesson.slug}
            href={lessonPath(course.slug, module.slug, lesson.slug)}
            title={lesson.title}
            summary={lesson.summary}
            meta={`${lesson.concepts.length} concept${lesson.concepts.length !== 1 ? "s" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
