# QuantGifs

A local-first web studio for visualizing MSc Financial Engineering concepts and exporting animations as GIF, MP4, or PNG sequences.

QuantGifs is **not** an LMS, quiz app, or SaaS platform. It is a personal visualization workspace organized as:

**Course → Module → Lesson → Concept**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and navigate to the sample course.

### Other Commands

```bash
npm run lint      # ESLint
npm run build     # Production build
npx tsc --noEmit  # Type check
```

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **KaTeX** for LaTeX math rendering
- **Framer Motion** for animations
- **Recharts** for charts
- Local TypeScript content files (no database)

## Folder Structure

```
quantgifs/
├── app/                    # Next.js routes
│   ├── page.tsx            # Landing page
│   └── courses/[courseSlug]/
│       └── modules/[moduleSlug]/
│           └── lessons/[lessonSlug]/
│               └── concepts/[conceptSlug]/
├── components/
│   ├── layout/             # AppShell, Sidebar, Breadcrumbs
│   ├── content/            # ConceptPage, MathBlock, Callout
│   ├── visualizations/     # Viz components + VisualizationFrame
│   └── export/             # ExportPanel (placeholder)
├── content/
│   └── courses.ts          # All course/content data
├── lib/
│   ├── content.ts          # Types + content helpers
│   ├── routes.ts           # URL builders + breadcrumbs
│   └── visualizations.ts   # Viz component registry
└── public/
```

## Sample Content

- **Course:** MSc Financial Engineering
- **Module:** Stochastic Calculus & Derivatives
- **Lesson:** Introduction to Financial Modeling
- **Concepts:** Brownian Motion, Black-Scholes Model, Yield Curve

## Adding a New Concept

1. Open [`content/courses.ts`](content/courses.ts).
2. Add a concept object to the appropriate lesson:

```typescript
{
  slug: "my-concept",
  title: "My Concept",
  summary: "Short description.",
  formulas: ["E = mc^2"],
  body: [
    {
      heading: "Section",
      paragraphs: ["Educational text here."],
    },
  ],
  visualizationKey: "my-concept", // must match registry key
  tags: ["tag1"],
}
```

3. If the concept needs a visualization, create the component and register it (see below).
4. Navigate to the concept URL or use the sidebar.

## Adding a New Visualization

1. Create a client component in `components/visualizations/`, e.g. `MyConceptViz.tsx`.
2. Register it in [`lib/visualizations.ts`](lib/visualizations.ts):

```typescript
export const visualizationRegistry = {
  // ...
  "my-concept": MyConceptViz,
};
```

3. Set `visualizationKey: "my-concept"` on the concept in `content/courses.ts`.
4. Wrap the component in `VisualizationFrame` via `ConceptPage` (automatic when the key matches).

Use SVG or Canvas inside `VisualizationFrame` for future frame-capture export.

## Export Roadmap

The export panel (`components/export/ExportPanel.tsx`) is a **placeholder**. Planned pipeline:

1. **Frame capture** — Read pixels from the `VisualizationFrame` container (canvas `toDataURL`, or `html2canvas` for DOM/SVG).
2. **Encoding**
   - GIF: client-side encoder (e.g. gif.js)
   - MP4: ffmpeg.wasm or a serverless function
   - PNG sequence: zip individual frames
3. **Download** — Trigger browser download of the encoded file.

## License

Personal project — use and extend as needed.
