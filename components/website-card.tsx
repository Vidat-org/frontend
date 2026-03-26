// "use client"
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import type { Website } from "@/migrations/schema"
// import { Skeleton } from "./ui/skeleton"
// import Link from "next/link"
// import { useEffect, useState } from "react"
// import { cn } from "@/lib/utils"

// type Props = {
//   website: Website
// }

// export default function WebsiteCard({ website }: Props) {
//   // if (!website.isEnabled) {
//   //   return (
//   //     <div className="cursor-not-allowed">
//   //       <Card className="pointer-events-none border-dashed opacity-50 grayscale select-none">
//   //         <CardHeader>
//   //           <CardTitle className="truncate text-muted-foreground">
//   //             {website.url}
//   //           </CardTitle>
//   //         </CardHeader>
//   //         <CardContent>
//   //           <p className="text-muted-foreground">
//   //             Senast kollad:{" "}
//   //             {website.lastCheckedAt
//   //               ? new Date(website.lastCheckedAt).toDateString()
//   //               : "Aldrig"}
//   //           </p>
//   //           <p className="text-muted-foreground">
//   //             Körs varje: {website.intervalSeconds / 60 / 60}h
//   //           </p>
//   //         </CardContent>
//   //         <CardFooter>
//   //           <p className="text-muted-foreground">
//   //             Senast uppdaterad:{" "}
//   //             {new Date(website.createdAt || "").toDateString()}
//   //           </p>
//   //         </CardFooter>
//   //       </Card>
//   //     </div>
//   //   )
//   // }

//   // return (
//   //   <Link href={`/dashboard/${website.id}`}>
//   //     <Card>
//   //       <CardHeader>
//   //         <CardTitle className="truncate">{website.url}</CardTitle>
//   //       </CardHeader>
//   //       <CardContent>
//   //         <p>
//   //           Senast kollad:{" "}
//   //           {website.lastCheckedAt
//   //             ? new Date(website.lastCheckedAt).toDateString()
//   //             : "Aldrig"}
//   //         </p>
//   //         <p>Körs varje: {website.intervalSeconds / 60 / 60}h</p>
//   //       </CardContent>
//   //       <CardFooter>
//   //         <p>
//   //           Senast uppdaterad:{" "}
//   //           {new Date(website.createdAt || "").toDateString()}
//   //         </p>
//   //       </CardFooter>
//   //     </Card>
//   //   </Link>
//   // )

//   return (
//     <div className="rounded-xl border p-3">
//       <p>{website.url}</p>

//       <div>
//         <CircularProgress size={100} score={website.lastSeoScore || 0} />
//         <CircularProgress
//           size={100}
//           score={website.lastPerformanceScore || 0}
//         />
//       </div>
//     </div>
//   )
// }

// export function WebsiteCardSkeleton() {
//   return (
//     <Card>
//       <CardHeader>
//         <Skeleton className="h-5 w-48" />
//       </CardHeader>
//       <CardContent className="space-y-2">
//         <Skeleton className="h-4 w-56" />
//         <Skeleton className="h-4 w-32" />
//       </CardContent>
//       <CardFooter>
//         <Skeleton className="h-4 w-52" />
//       </CardFooter>
//     </Card>
//   )
// }

// const RADIUS = 54
// const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// function getScoreColor(score: number) {
//   if (score >= 90)
//     return {
//       stroke: "#22c55e",
//       text: "text-green-500",
//       label: "Excellent",
//       badge: "bg-green-500/10 text-green-500 border-green-500/20",
//     }
//   if (score >= 70)
//     return {
//       stroke: "#f59e0b",
//       text: "text-amber-500",
//       label: "Needs Work",
//       badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
//     }
//   return {
//     stroke: "#ef4444",
//     text: "text-red-500",
//     label: "Poor",
//     badge: "bg-red-500/10 text-red-500 border-red-500/20",
//   }
// }

// function CircularProgress({
//   score = 0,
//   size = 140,
//   strokeWidth = 8,
//   animate = true,
// }) {
//   const [displayed, setDisplayed] = useState(animate ? 0 : score)
//   const [progress, setProgress] = useState(animate ? 0 : score / 100)

//   useEffect(() => {
//     if (!animate) return
//     let start = null
//     const duration = 1200
//     const raf = requestAnimationFrame(function tick(timestamp) {
//       if (!start) start = timestamp
//       const elapsed = timestamp - start
//       const t = Math.min(elapsed / duration, 1)
//       const ease = 1 - Math.pow(1 - t, 3)
//       setDisplayed(Math.round(ease * score))
//       setProgress((ease * score) / 100)
//       if (t < 1) requestAnimationFrame(tick)
//     })
//     return () => cancelAnimationFrame(raf)
//   }, [score, animate])

//   const { stroke, text } = getScoreColor(score)
//   const r = RADIUS
//   const circ = CIRCUMFERENCE
//   const offset = circ - progress * circ
//   const svgSize = size
//   const cx = svgSize / 2
//   const cy = svgSize / 2
//   const scale = (svgSize / 2 - strokeWidth) / r

//   return (
//     <div
//       className="relative inline-flex items-center justify-center"
//       style={{ width: svgSize, height: svgSize }}
//     >
//       <svg width={svgSize} height={svgSize} className="-rotate-90" aria-hidden>
//         {/* Track */}
//         <circle
//           cx={cx}
//           cy={cy}
//           r={r * scale}
//           fill="none"
//           stroke="currentColor"
//           strokeWidth={strokeWidth}
//           className="text-muted/30"
//         />
//         {/* Progress arc */}
//         <circle
//           cx={cx}
//           cy={cy}
//           r={r * scale}
//           fill="none"
//           stroke={stroke}
//           strokeWidth={strokeWidth}
//           strokeLinecap="round"
//           strokeDasharray={circ * scale}
//           strokeDashoffset={offset * scale}
//           style={{ transition: "stroke-dashoffset 0.05s linear" }}
//         />
//       </svg>
//       {/* Score text */}
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span
//           className={cn(
//             "font-mono leading-none font-bold tabular-nums",
//             text,
//             size >= 140 ? "text-4xl" : "text-2xl"
//           )}
//         >
//           {displayed}
//         </span>
//         {/*<span className="mt-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
//           / 100
//         </span>*/}
//       </div>
//     </div>
//   )
// }

"use client"
import type { Website } from "@/migrations/schema"
import { Skeleton } from "./ui/skeleton"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  website: Website
}

function scoreColor(score: number) {
  if (score >= 90) return { stroke: "#22c55e", text: "#22c55e" }
  if (score >= 70) return { stroke: "#f59e0b", text: "#f59e0b" }
  return { stroke: "#ef4444", text: "#ef4444" }
}

function scoreLabel(score: number) {
  if (score >= 90)
    return {
      label: "Bra",
      bg: "rgba(34,197,94,0.08)",
      color: "#16a34a",
      border: "rgba(34,197,94,0.2)",
    }
  if (score >= 70)
    return {
      label: "Kan förbättras",
      bg: "rgba(245,158,11,0.08)",
      color: "#b45309",
      border: "rgba(245,158,11,0.2)",
    }
  return {
    label: "Dålig",
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

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

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
      const t = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      const displayed = Math.round(ease * score)

      ctx!.clearRect(0, 0, size, size)

      ctx!.beginPath()
      ctx!.arc(cx, cy, r, 0, Math.PI * 2)
      ctx!.strokeStyle = trackColor
      ctx!.lineWidth = sw
      ctx!.stroke()

      const startAngle = -Math.PI / 2
      const endAngle = startAngle + ((ease * score) / 100) * Math.PI * 2
      ctx!.beginPath()
      ctx!.arc(cx, cy, r, startAngle, endAngle)
      ctx!.strokeStyle = stroke
      ctx!.lineWidth = sw
      ctx!.lineCap = "round"
      ctx!.stroke()

      const fontSize = size >= 140 ? 28 : 18
      ctx!.fillStyle = text
      ctx!.font = `700 ${fontSize}px "JetBrains Mono", monospace`
      ctx!.textAlign = "center"
      ctx!.textBaseline = "middle"
      ctx!.fillText(String(displayed), cx, cy)

      if (t < 1) raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [score, size])

  return <canvas ref={canvasRef} />
}

export default function WebsiteCard({ website }: Props) {
  const perf = website.lastPerformanceScore ?? 0
  const seo = website.lastSeoScore ?? 0
  const avgScore = Math.round((perf + seo) / 2)
  const { label, bg, color, border } = scoreLabel(avgScore)
  const dotColor =
    avgScore >= 90 ? "#22c55e" : avgScore >= 70 ? "#f59e0b" : "#ef4444"
  const stripeLeft = scoreColor(perf).stroke
  const stripeRight = scoreColor(seo).stroke

  const lastChecked = website.lastCheckedAt
    ? (() => {
        const diff = Date.now() - new Date(website.lastCheckedAt).getTime()
        const h = Math.floor(diff / 1000 / 60 / 60)
        if (h < 1) return "< 1h sedan"
        if (h < 24) return `${h}h sedan`
        return `${Math.floor(h / 24)}d sedan`
      })()
    : "aldrig"

  const intervalHours = website.intervalSeconds / 60 / 60

  return (
    <Link href={`/dashboard/${website.id}`}>
      <div
        className="relative overflow-hidden rounded-xl border bg-card p-5 transition-colors hover:border-border"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {/* top accent stripe */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, ${stripeLeft} 0%, ${stripeRight} 100%)`,
            opacity: 0.6,
          }}
        />

        {/* header */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className="size-[6px] shrink-0 rounded-full"
            style={{
              background: dotColor,
              boxShadow: `0 0 0 3px ${dotColor}22`,
            }}
          />
          <span className="truncate text-[13px] font-medium">
            {website.url}
          </span>
        </div>

        {/* rings */}
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center gap-2">
            <RingCanvas score={perf} size={88} />
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
              Prestanda
            </span>
          </div>
          <div className="h-16 w-px bg-border" />
          <div className="flex flex-col items-center gap-2">
            <RingCanvas score={seo} size={88} />
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
              SEO
            </span>
          </div>
        </div>

        {/* footer */}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <span className="text-[10px] text-muted-foreground">
            {lastChecked} · var {intervalHours}:e timme
          </span>
          <span
            className="rounded px-2 py-0.5 text-[10px] font-medium"
            style={{ background: bg, color, border: `0.5px solid ${border}` }}
          >
            {label}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function WebsiteCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-[6px] rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="flex items-center justify-around">
        <Skeleton className="size-[88px] rounded-full" />
        <div className="h-16 w-px bg-border" />
        <Skeleton className="size-[88px] rounded-full" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
    </div>
  )
}
