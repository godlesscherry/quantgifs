import Link from "next/link";
import { getCourses } from "@/lib/content";
import { coursePath } from "@/lib/routes";

export default function HomePage() {
  const courses = getCourses();
  const sampleCourse = courses[0];

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
          QuantGifs
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Financial Engineering Visualization Studio
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          QuantGifs is a local-first web app for visual learning in MSc
          Financial Engineering. Explore concepts with formatted text, LaTeX
          formulas, and interactive visualizations — then export animations as
          GIF, MP4, or PNG sequences.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          <li className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong className="block text-slate-900">Structured content</strong>
            Course → Module → Lesson → Concept
          </li>
          <li className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong className="block text-slate-900">Math & charts</strong>
            KaTeX formulas and Recharts visualizations
          </li>
          <li className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <strong className="block text-slate-900">Export-ready</strong>
            Architecture for future GIF/MP4 export
          </li>
        </ul>
        {sampleCourse && (
          <Link
            href={coursePath(sampleCourse.slug)}
            className="mt-8 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Explore sample course: {sampleCourse.title}
          </Link>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Courses</h2>
        <div className="grid gap-4">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={coursePath(course.slug)}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {course.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{course.description}</p>
              <span className="mt-2 inline-block text-sm text-indigo-600">
                {course.modules.length} module
                {course.modules.length !== 1 ? "s" : ""} →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
