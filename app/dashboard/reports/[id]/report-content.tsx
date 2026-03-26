"use client"

import ReactMarkdown from "react-markdown"

export default function ReportContent({ content }: { content: string }) {
  return (
    <div className="prose">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
