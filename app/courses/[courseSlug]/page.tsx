import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentCard } from "@/components/content/ContentCard";
import { getCourse } from "@/lib/content";
import { buildBreadcrumbs, modulePath } from "@/lib/routes";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export default async function CoursePage({ params }: PageProps) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);

  if (!course) {
    notFound();
  }

  const breadcrumbs = buildBreadcrumbs({ course });

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">{course.title}</h1>
        <p className="mt-2 text-lg text-slate-400">{course.description}</p>
      </header>
      <div className="grid gap-4">
        {course.modules.map((module) => (
          <ContentCard
            key={module.slug}
            href={modulePath(course.slug, module.slug)}
            title={module.title}
            summary={module.summary}
            meta={`${module.lessons.length} lesson${module.lessons.length !== 1 ? "s" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
