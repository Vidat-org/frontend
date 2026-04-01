"use client"
import type { Website } from "@/migrations/schema"
import { formatDate } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"
import Link from "next/link"
import { useEffect, useRef } from "react"
import type { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { type Locale } from "@/lib/i18n"

type Props = {
  website: Website
}

function scoreColor(score: number) {
  if (score >= 90) return { stroke: "#22c55e", text: "#22c55e" }
  if (score >= 70) return { stroke: "#f59e0b", text: "#f59e0b" }
  return { stroke: "#ef4444", text: "#ef4444" }
}

function scoreLabel(score: number, t: TFunction) {
  if (score >= 90) {
    return {
      label: t("websiteCard.scoreGood"),
      bg: "rgba(34,197,94,0.08)",
      color: "#16a34a",
      border: "rgba(34,197,94,0.2)",
    }
  }
  if (score >= 70) {
    return {
      label: t("websiteCard.scoreNeedsWork"),
      bg: "rgba(245,158,11,0.08)",
      color: "#b45309",
      border: "rgba(245,158,11,0.2)",
    }
  }
  return {
    label: t("websiteCard.scorePoor"),
    bg: "rgba(239,68,68,0.08)",
    color: "#b91c1c",
    border: "rgba(239,68,68,0.2)",
  }
}

function RingCanvas({ score, size = 100 }: { score: number; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const context = ctx

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    context.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = size * 0.38
    const sw = size * 0.07
    const { stroke, text } = scoreColor(score)
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const trackColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"

    const duration = 1100
    let start: number | null = null
    let raf: number

    function frame(ts: number) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      const displayed = Math.round(ease * score)

      context.clearRect(0, 0, size, size)

      context.beginPath()
      context.arc(cx, cy, r, 0, Math.PI * 2)
      context.strokeStyle = trackColor
      context.lineWidth = sw
      context.stroke()

      const startAngle = -Math.PI / 2
      const endAngle = startAngle + ((ease * score) / 100) * Math.PI * 2
      context.beginPath()
      context.arc(cx, cy, r, startAngle, endAngle)
      context.strokeStyle = stroke
      context.lineWidth = sw
      context.lineCap = "round"
      context.stroke()

      const fontSize = size >= 140 ? 28 : 18
      context.fillStyle = text
      context.font = `700 ${fontSize}px "JetBrains Mono", monospace`
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.fillText(String(displayed), cx, cy)

      if (progress < 1) raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [score, size])

  return <canvas ref={canvasRef} />
}

export default function WebsiteCard({ website }: Props) {
  const { t, i18n } = useTranslation("common")
  const locale = (i18n.resolvedLanguage === "en" ? "en" : "sv") as Locale
  const perf = website.lastPerformanceScore ?? 0
  const seo = website.lastSeoScore ?? 0
  const avgScore = Math.round((perf + seo) / 2)
  const { label, bg, color, border } = scoreLabel(avgScore, t)
  const dotColor =
    avgScore >= 90 ? "#22c55e" : avgScore >= 70 ? "#f59e0b" : "#ef4444"
  const stripeLeft = scoreColor(perf).stroke
  const stripeRight = scoreColor(seo).stroke

  const lastChecked = website.lastCheckedAt
    ? formatDate(new Date(website.lastCheckedAt), locale)
    : t("common.never")

  const intervalHours = website.intervalSeconds / 60 / 60

  const cardContent = (
    <div
      className={`relative overflow-hidden rounded-xl border bg-card p-5 transition-colors ${!website.isEnabled && "cursor-not-allowed opacity-65 hover:border-border"} ${website.isEnabled && "hover:border-border"}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${stripeLeft} 0%, ${stripeRight} 100%)`,
          opacity: 0.6,
        }}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className="size-[6px] shrink-0 rounded-full"
          style={{
            background: website.isEnabled ? dotColor : "#6b7280",
            boxShadow: `0 0 0 3px ${
              website.isEnabled ? `${dotColor}22` : "rgba(107,114,128,0.16)"
            }`,
          }}
        />
        <span className="truncate text-[13px] font-medium">{website.url}</span>

        {!website.isEnabled && (
          <span className="rounded border border-dashed px-2 py-0.5 text-[10px] text-muted-foreground">
            {t("websiteCard.pausedByPlan")}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <div className="flex flex-col items-center gap-2">
          <RingCanvas score={perf} size={88} />
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            {t("scanChart.performance")}
          </span>
        </div>
        <div className="h-px w-full bg-border sm:h-16 sm:w-px" />
        <div className="flex flex-col items-center gap-2">
          <RingCanvas score={seo} size={88} />
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            SEO
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[10px] text-muted-foreground">
          {t("websiteCard.lastCheckedEvery", {
            date: lastChecked,
            hours: intervalHours,
          })}
        </span>
        <span
          className="rounded px-2 py-0.5 text-[10px] font-medium"
          style={{ background: bg, color, border: `0.5px solid ${border}` }}
        >
          {label}
        </span>
      </div>
    </div>
  )

  return website.isEnabled ? (
    <Link href={`/dashboard/${website.id}`}>{cardContent}</Link>
  ) : (
    cardContent
  )
}

export function WebsiteCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-[6px] rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <Skeleton className="size-[88px] rounded-full" />
        <div className="h-px w-full bg-border sm:h-16 sm:w-px" />
        <Skeleton className="size-[88px] rounded-full" />
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
    </div>
  )
}
