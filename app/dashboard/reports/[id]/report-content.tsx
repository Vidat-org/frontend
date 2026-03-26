"use client"

import ReactMarkdown from "react-markdown"

export default function ReportContent({ content }: { content: string }) {
  return (
    <div className="prose max-w-none text-foreground [&_*]:text-foreground [&_a]:text-foreground [&_a]:underline [&_hr]:border-border [&_ol>li]:marker:text-foreground [&_ul>li]:marker:text-foreground">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
