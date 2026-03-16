export const auditLabels: Record<string, string> = {
  "largest-contentful-paint": "Långsam LCP",
  "first-contentful-paint": "Långsam FCP",
  "total-blocking-time": "Hög Total Blockeringstid",
  "cumulative-layout-shift": "Layoutförskjutning Detekterad",
  "server-response-time": "Långsam Serverrespons (TTFB)",
  "uses-https": "Sidan Serveras Inte Över HTTPS",
  "meta-description": "Saknar Metabeskrivning",
  "document-title": "Saknar Sidtitel",
  "image-alt": "Bilder Saknar Alt-text",
  "color-contrast": "Otillräcklig Färgkontrast",
} satisfies Record<string, string>
