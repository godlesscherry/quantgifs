import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ConceptPage } from "@/components/content/ConceptPage";
import { getConcept } from "@/lib/content";
import { buildBreadcrumbs } from "@/lib/routes";

type PageProps = {
  params: Promise<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
    conceptSlug: string;
  }>;
};

export default async function ConceptRoutePage({ params }: PageProps) {
  const { courseSlug, moduleSlug, lessonSlug, conceptSlug } = await params;
  const result = getConcept(courseSlug, moduleSlug, lessonSlug, conceptSlug);

  if (!result) {
    notFound();
  }

  const { course, module, lesson, concept } = result;
  const breadcrumbs = buildBreadcrumbs({
    course,
    module,
    lesson,
    concept,
  });

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <ConceptPage concept={concept} />
    </div>
  );
}
