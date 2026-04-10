import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "../migrations/schema"

type Database = ReturnType<typeof drizzle<typeof schema>>

declare global {
  // Reuse the pool across Next.js dev reloads to avoid connection churn.
  var __vidatDbPool: InstanceType<typeof Pool> | undefined
  var __vidatDb: Database | undefined
}

const pool =
  globalThis.__vidatDbPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: process.env.NODE_ENV === "development" ? 5 : 10,
  })

export const db =
  globalThis.__vidatDb ??
  drizzle(pool, {
    schema,
  })

if (process.env.NODE_ENV !== "production") {
  globalThis.__vidatDbPool = pool
  globalThis.__vidatDb = db
}

// const WEBSITE_ID = "web_XKJ06BcMrPmMm5Zz4s"

// async function seed() {
//   // Insert scans
//   const insertedScans = await db
//     .insert(schema.scans)
//     .values([
//       {
//         websiteId: WEBSITE_ID,
//         performanceScore: 87,
//         seoScore: 92,
//         accessibilityScore: 78,
//         bestPracticesScore: 85,
//         lcpMs: 2450,
//         fcpMs: 1200,
//         clsScore: "0.085",
//         ttfbMs: 320,
//         speedIndexMs: 3100,
//         pageSizeKb: 1240,
//         requestCount: 48,
//         status: "success",
//       },
//       {
//         websiteId: WEBSITE_ID,
//         performanceScore: 63,
//         seoScore: 71,
//         accessibilityScore: 55,
//         bestPracticesScore: 70,
//         lcpMs: 4800,
//         fcpMs: 2900,
//         clsScore: "0.245",
//         ttfbMs: 780,
//         speedIndexMs: 5600,
//         pageSizeKb: 3200,
//         requestCount: 94,
//         status: "success",
//       },
//       {
//         websiteId: WEBSITE_ID,
//         performanceScore: 91,
//         seoScore: 88,
//         accessibilityScore: 95,
//         bestPracticesScore: 92,
//         lcpMs: 1800,
//         fcpMs: 900,
//         clsScore: "0.032",
//         ttfbMs: 210,
//         speedIndexMs: 2400,
//         pageSizeKb: 890,
//         requestCount: 31,
//         status: "success",
//       },
//       {
//         websiteId: WEBSITE_ID,
//         performanceScore: 45,
//         seoScore: 60,
//         accessibilityScore: 42,
//         bestPracticesScore: 55,
//         lcpMs: 7200,
//         fcpMs: 4100,
//         clsScore: "0.412",
//         ttfbMs: 1200,
//         speedIndexMs: 8900,
//         pageSizeKb: 5600,
//         requestCount: 127,
//         status: "success",
//       },
//       {
//         websiteId: WEBSITE_ID,
//         status: "error",
//         errorMessage: "Timeout: page failed to load within 30 seconds",
//       },
//     ])
//     .returning({
//       id: schema.scans.id,
//       performanceScore: schema.scans.performanceScore,
//     })

//   const [scan87, scan63, scan91, scan45] = insertedScans

//   // Insert issues per scan
//   await db.insert(schema.scanIssues).values([
//     // Scan 87 - good
//     {
//       scanId: scan87.id,
//       category: "performance",
//       title: "Render-blocking resources",
//       description:
//         "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.",
//       severity: "medium",
//     },
//     {
//       scanId: scan87.id,
//       category: "seo",
//       title: "Image elements do not have explicit width and height",
//       description:
//         "3 images are missing explicit dimensions, causing layout shifts during load.",
//       severity: "low",
//     },
//     {
//       scanId: scan87.id,
//       category: "accessibility",
//       title: "Buttons do not have an accessible name",
//       description:
//         "2 button elements have no discernible text for screen readers.",
//       severity: "high",
//     },

//     // Scan 63 - poor
//     {
//       scanId: scan63.id,
//       category: "performance",
//       title: "Unused JavaScript",
//       description:
//         "487 KiB of JavaScript is unused. Remove or defer unused code to reduce bytes consumed by network activity.",
//       severity: "high",
//     },
//     {
//       scanId: scan63.id,
//       category: "performance",
//       title: "Serve images in next-gen formats",
//       description:
//         "Image formats like WebP and AVIF often provide better compression. Consider converting your PNGs and JPEGs.",
//       severity: "medium",
//     },
//     {
//       scanId: scan63.id,
//       category: "performance",
//       title: "Eliminate render-blocking resources",
//       description:
//         "Potential savings of 1,340 ms by deferring or inlining render-blocking scripts.",
//       severity: "high",
//     },
//     {
//       scanId: scan63.id,
//       category: "seo",
//       title: "Links do not have descriptive text",
//       description:
//         '5 links use generic anchor text like "click here" or "read more".',
//       severity: "medium",
//     },
//     {
//       scanId: scan63.id,
//       category: "accessibility",
//       title: "Background and foreground colors do not have sufficient contrast",
//       description:
//         "Low contrast ratio of 2.3:1 detected on navigation elements. Minimum is 4.5:1.",
//       severity: "high",
//     },
//     {
//       scanId: scan63.id,
//       category: "best_practices",
//       title: "Uses deprecated APIs",
//       description:
//         "document.write() and synchronous XMLHttpRequest are deprecated and should be replaced.",
//       severity: "medium",
//     },

//     // Scan 91 - excellent
//     {
//       scanId: scan91.id,
//       category: "seo",
//       title: "Document does not have a meta description",
//       description:
//         "Meta descriptions may be included in search results to concisely summarize page content.",
//       severity: "low",
//     },

//     // Scan 45 - very poor
//     {
//       scanId: scan45.id,
//       category: "performance",
//       title: "Time to First Byte is too high",
//       description:
//         "TTFB of 1,200 ms exceeds the recommended 600 ms. Check server response time and consider CDN usage.",
//       severity: "high",
//     },
//     {
//       scanId: scan45.id,
//       category: "performance",
//       title: "Avoid an excessive DOM size",
//       description:
//         "3,842 DOM elements detected. Large DOM sizes increase memory usage and slow down style calculations.",
//       severity: "high",
//     },
//     {
//       scanId: scan45.id,
//       category: "performance",
//       title: "Minify JavaScript",
//       description: "14 JavaScript files could save 320 KiB after minification.",
//       severity: "medium",
//     },
//     {
//       scanId: scan45.id,
//       category: "performance",
//       title: "Minify CSS",
//       description: "6 CSS files could save 84 KiB after minification.",
//       severity: "medium",
//     },
//     {
//       scanId: scan45.id,
//       category: "accessibility",
//       title: "Form elements do not have associated labels",
//       description:
//         "7 form inputs are missing label elements or aria-label attributes.",
//       severity: "high",
//     },
//     {
//       scanId: scan45.id,
//       category: "accessibility",
//       title: "Heading elements are not in sequentially-descending order",
//       description:
//         "Heading order jumps from H1 to H4, breaking document outline for screen reader users.",
//       severity: "medium",
//     },
//     {
//       scanId: scan45.id,
//       category: "seo",
//       title: "Page blocked from indexing",
//       description:
//         "A noindex directive is present. Remove it if this page should appear in search results.",
//       severity: "high",
//     },
//     {
//       scanId: scan45.id,
//       category: "best_practices",
//       title: "Does not use HTTPS",
//       description:
//         "All sites should be protected with HTTPS, even ones that do not handle sensitive data.",
//       severity: "high",
//     },
//     {
//       scanId: scan45.id,
//       category: "best_practices",
//       title: "Browser errors logged to console",
//       description:
//         "12 errors logged to the browser console. These indicate unhandled exceptions in your JavaScript.",
//       severity: "medium",
//     },
//   ])

//   console.log(
//     "Seed complete:",
//     insertedScans.map((s) => s.id)
//   )
// }

// seed().catch(console.error)
