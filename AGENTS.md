# QuantGifs — Agent Guide

QuantGifs is a **local-first visualization studio** for MSc Financial Engineering concepts. Users browse educational content and interact with animations, with a planned export pipeline (GIF / MP4 / PNG).

**This is not** an LMS, quiz app, auth platform, or SaaS product. Do not add databases, user accounts, payments, or CMS backends unless explicitly requested.

## Content model

Hierarchy (fixed):

**Course → Module → Lesson → Concept**

| Layer | Data | Routes |
|-------|------|--------|
| Course | `content/courses.ts` | `/courses/[courseSlug]` |
| Module | nested in course | `.../modules/[moduleSlug]` |
| Lesson | nested in module | `.../lessons/[lessonSlug]` |
| Concept | nested in lesson | `.../concepts/[conceptSlug]` |

- **Types & lookups:** `lib/content.ts` (`getCourse`, `getModule`, `getLesson`, `getConcept`, `getNavigationTree`)
- **URL helpers:** `lib/routes.ts` (`coursePath`, `modulePath`, `lessonPath`, `conceptPath`, `buildBreadcrumbs`)
- **All content** lives in TypeScript (`content/courses.ts`). No Prisma, no API routes for content, no markdown files unless the user asks.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — dark UI (`slate-950` background, `slate-100` text)
- **KaTeX** — LaTeX in `MathBlock` (`components/content/MathBlock.tsx`)
- **Framer Motion** — viz animations
- **Recharts** — charts where needed
- Path alias: `@/` → project root

## Project layout

```
app/                          # Route pages (mostly thin wrappers)
components/
  layout/                     # AppShell, Sidebar, Breadcrumbs
  content/                    # ConceptPage, MathBlock, Callout, ContentCard
  visualizations/             # *Viz.tsx + VisualizationFrame + VisualizationRenderer
  export/                     # ExportPanel (placeholder)
content/courses.ts            # Source of truth for all courses
lib/content.ts                # Types + getters
lib/routes.ts                 # Paths + breadcrumbs
lib/visualizations.ts         # visualizationRegistry + titles
```

## Patterns to follow

### Route pages

- Server components by default; `params` is a **Promise** (await it).
- Load data with `get*` from `lib/content.ts`; call `notFound()` when missing.
- Pass breadcrumbs via `buildBreadcrumbs`; render `ConceptPage` for concept routes.

### Visualizations

1. Create a **client** component in `components/visualizations/` (`"use client"`).
2. Register in `lib/visualizations.ts` — key must match `concept.visualizationKey` in `content/courses.ts`.
3. Add a human title in `visualizationTitles` in the same file.
4. Render inside `VisualizationFrame` (via `ConceptPage` / `VisualizationRenderer`). Prefer SVG or Canvas inside the frame for future frame capture (`data-visualization-frame` on the container).

### Adding a concept

1. Add object to the correct lesson in `content/courses.ts` (match existing `Concept` shape).
2. If it needs a viz: implement component + registry entry (see above).
3. No route file changes needed — dynamic segments already exist.

### Styling

- Match existing dark, compact academic UI (indigo accents for tags, bordered cards).
- Reuse layout primitives (`AppShell`, `Sidebar`, `ContentCard`, `Callout`) instead of one-off page chrome.

### Scope discipline

- Minimal diffs; no unrelated refactors.
- Do not introduce a database, env-heavy infra, or backend for static content.
- Export encoding is **not implemented** — `ExportPanel` is a placeholder; see README export roadmap before building capture/ffmpeg.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build
npx tsc --noEmit
```

## Verification

After substantive changes: `npm run lint`, `npx tsc --noEmit`, and smoke-test affected routes in dev.

## Reference

Human-oriented setup and examples: [README.md](./README.md).

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
