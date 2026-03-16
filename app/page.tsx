"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Show } from "@clerk/nextjs"
import { ArrowRight } from "lucide-react"

// ─── Design tokens — CSS-variabler från globals.css ───────────────────────────
// Dessa är CSS-variabelreferenser; de fungerar bara i inline style-strängar
// via var(--...) eller i CSS-regler — inte som JS-strängar i rgba().
// För alpha-varianter används color-mix().
const C = {
  bg: "var(--background)",
  surface: "var(--card)",
  border: "var(--border)",

  // tone down chart-1 slightly when used as accent
  accent: "color-mix(in oklch, var(--chart-1) 85%, black)",

  // stronger fill so charts are visible
  accentDim: "color-mix(in oklch, var(--chart-1) 30%, transparent)",

  blue: "var(--chart-2)",
  teal: "var(--chart-3)",
  red: "var(--destructive)",

  fg: "var(--foreground)",
  muted: "var(--muted-foreground)",

  // make muted slightly clearer
  mutedLo: "color-mix(in oklch, var(--muted-foreground) 60%, transparent)",
}

// Literal oklch-värden för ställen där vi måste bädda in i rgba/radial-gradient
// (CSS color-mix stöds inte i alla gradient-kontexter i äldre browsers)
const RAW = {
  accent: "oklch(0.67 0.16 165)", // toned down chart-1
  blue: "oklch(0.64 0.17 240)", // deeper blue
  teal: "oklch(0.62 0.14 180)", // balanced teal
  red: "oklch(0.60 0.16 25)", // clearer red
  fg: "oklch(0.985 0 0)",
  muted: "oklch(0.711 0.019 323.02)",
  mutedLo: "oklch(0.263 0.024 320.12)",
  bg: "oklch(0.145 0.008 326)",
}

// ─── Primitive components ─────────────────────────────────────────────────────
const Btn = ({
  children,
  variant = "primary",
  size = "md",
  style: s = {},
  ...p
}) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
    fontWeight: 700,
    letterSpacing: "0.08em",
    cursor: "pointer",
    border: "none",
    transition: "all 0.15s",
    textTransform: "uppercase",
  }
  const variants = {
    primary: {
      background: C.accent,
      color: "#000",
      border: `1px solid ${C.accent}`,
    },
    outline: {
      background: "transparent",
      color: C.accent,
      border: `1px solid color-mix(in oklch, var(--chart-1) 35%, transparent)`,
    },
    ghost: {
      background: "transparent",
      color: C.muted,
      border: "1px solid transparent",
    },
  }
  const sizes = {
    sm: { padding: "8px 16px", fontSize: "10px" },
    md: { padding: "11px 22px", fontSize: "11px" },
    lg: { padding: "15px 36px", fontSize: "12px" },
  }
  return (
    <button
      style={{ ...base, ...variants[variant], ...sizes[size], ...s }}
      onMouseEnter={(e) => {
        if (variant === "primary")
          e.currentTarget.style.background = `color-mix(in oklch, var(--chart-1) 85%, white)`
        if (variant === "outline") {
          e.currentTarget.style.borderColor = C.accent
          e.currentTarget.style.background = `color-mix(in oklch, var(--chart-1) 6%, transparent)`
        }
        if (variant === "ghost") e.currentTarget.style.color = C.fg
        e.currentTarget.style.transform = "translateY(-1px)"
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") e.currentTarget.style.background = C.accent
        if (variant === "outline") {
          e.currentTarget.style.borderColor = `color-mix(in oklch, var(--chart-1) 35%, transparent)`
          e.currentTarget.style.background = "transparent"
        }
        if (variant === "ghost") e.currentTarget.style.color = C.muted
        e.currentTarget.style.transform = "translateY(0)"
      }}
      {...p}
    >
      {children}
    </button>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 1600 }) {
  const [v, setV] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const t0 = performance.now()
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1)
          setV(Math.floor((1 - Math.pow(1 - p, 3)) * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [target, duration])
  return (
    <span ref={ref}>
      {v.toLocaleString()}
      {suffix}
    </span>
  )
}

// ─── SVG Score ring ───────────────────────────────────────────────────────────
function ScoreRing({ score, label, color, size = 64, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)
  const r = size * 0.38
  const circ = 2 * Math.PI * r

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        setTimeout(() => {
          const t0 = performance.now()
          const tick = (now) => {
            const p = Math.min((now - t0) / 900, 1)
            setDisplayed(Math.floor((1 - Math.pow(1 - p, 3)) * score))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }, delay)
      }
    })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [score, delay])

  const dash = (displayed / 100) * circ
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          style={{ width: size, height: size, transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={size * 0.07}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.07}
            strokeDasharray={circ}
            strokeDashoffset={circ - dash}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.04s" }}
          />
        </svg>
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.22,
            fontWeight: 800,
            color,
          }}
        >
          {displayed}
        </span>
      </div>
      {label && (
        <span
          style={{
            fontSize: 9,
            color: C.muted,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ text, delay = 0, speed = 30 }) {
  const [out, setOut] = useState("")
  useEffect(() => {
    let i = 0,
      timeout
    const start = () => {
      const iv = setInterval(() => {
        if (i <= text.length) {
          setOut(text.slice(0, i))
          i++
        } else clearInterval(iv)
      }, speed)
    }
    timeout = setTimeout(start, delay)
    return () => clearTimeout(timeout)
  }, [text, delay, speed])
  return <>{out}</>
}

function BlinkCursor() {
  const [v, setV] = useState(true)
  useEffect(() => {
    const i = setInterval(() => setV((x) => !x), 530)
    return () => clearInterval(i)
  }, [])
  return <span style={{ opacity: v ? 1 : 0, color: C.accent }}>█</span>
}

// ─── Grid background ──────────────────────────────────────────────────────────
function GridBg({ style: s = {} }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
        ...s,
      }}
    />
  )
}

// ─── Scanline ─────────────────────────────────────────────────────────────────
function Scanline() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0.025,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: 2,
          background: `linear-gradient(to right, transparent, var(--foreground), transparent)`,
          animation: "scanline 6s linear infinite",
        }}
      />
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    n: "01",
    icon: "⬡",
    title: "PageSpeed Insights",
    desc: "Realtidsdata från Googles infrastruktur. Core Web Vitals, prestanda och tekniska rekommendationer direkt i dashboarden.",
    tag: "Alla planer",
    accent: false,
  },
  {
    n: "02",
    icon: "◈",
    title: "Schemalagd scanning",
    desc: "Välj ditt intervall — timme, dag eller vecka. Vidat kör i bakgrunden och samlar data utan att du behöver göra något.",
    tag: "Alla planer",
    accent: false,
  },
  {
    n: "03",
    icon: "✦",
    title: "AI-analys",
    desc: "AI tolkar Lighthouse-data och ger konkreta, prioriterade åtgärdsförslag på svenska. Förstå vad siffrorna faktiskt innebär.",
    tag: "Pro & Enterprise",
    accent: true,
  },
  {
    n: "04",
    icon: "◎",
    title: "Regressionsdetektering",
    desc: "Automatiska varningar inom sekunder när poäng sjunker efter ett deploy. Vet innan dina användare märker något.",
    tag: "Alla planer",
    accent: false,
  },
  {
    n: "05",
    icon: "◷",
    title: "Slack & Webhooks",
    desc: "Meddelas direkt i Slack eller via webhook. Trigga skanningar automatiskt från Vercel, Netlify eller valfri CI/CD-pipeline.",
    tag: "Pro & Enterprise",
    accent: false,
  },
  {
    n: "06",
    icon: "⬚",
    title: "White-label-rapporter",
    desc: "Månadsrapporter som PDF levererade till inkorgen. White-label-redo — dela med kunder utan att lyfta ett finger.",
    tag: "Enterprise",
    accent: false,
  },
]

const PLANS = [
  {
    name: "FREE",
    price: "0",
    period: "/ månad",
    features: [
      "1 URL",
      "Manuella skanningar",
      "7 dagars historik",
      "Grundläggande mätvärden",
    ],
    cta: "Kom igång",
    highlight: false,
  },
  {
    name: "PRO",
    price: "149",
    period: "kr / månad",
    features: [
      "10 URLs",
      "Mobil + desktop",
      "Daglig schemaläggning",
      "90 dagars historik",
      "AI-rekommendationer",
      "E-postaviseringar",
    ],
    cta: "Starta 14-dagars test",
    highlight: true,
    badge: "POPULÄR",
  },
  {
    name: "BUSINESS",
    price: "399",
    period: "kr / månad",
    features: [
      "50 URLs",
      "Timvis schemaläggning",
      "12 månaders historik",
      "Regressionsdetektering",
      "Slack & webhooks",
      "Deploy-webhooks",
    ],
    cta: "Kom igång",
    highlight: false,
  },
  {
    name: "ENTERPRISE",
    price: "999",
    period: "kr / månad",
    features: [
      "Obegränsade URLs",
      "API-åtkomst",
      "White-label-rapporter",
      "Teammedlemmar",
      "Obegränsad historik",
      "Prioriterad support",
    ],
    cta: "Kontakta oss",
    highlight: false,
  },
]

const STEPS = [
  [
    "01",
    "Koppla din URL",
    "Lägg till valfri URL. Vi börjar skanna direkt — inga kodändringar krävs.",
  ],
  [
    "02",
    "Välj ditt schema",
    "Dagligen, veckovis eller vid varje deploy via webhook. Du bestämmer takten.",
  ],
  [
    "03",
    "Få varningar direkt",
    "Poängfall triggar notiser till e-post, Slack eller din webhook inom sekunder.",
  ],
  [
    "04",
    "Åtgärda med AI",
    "AI analyserar din Lighthouse-data och berättar exakt vad du ska fixa — och varför.",
  ],
]

// ─── Main component ───────────────────────────────────────────────────────────
export default function VidatLanding() {
  const [url, setUrl] = useState("")
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)

  const handleScan = () => {
    if (!url.trim() || scanning) return
    setScanned(false)
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setScanned(true)
    }, 2400)
  }

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        background: C.bg,
        color: C.fg,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: var(--chart-1); color: #000; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: var(--background); }
        ::-webkit-scrollbar-thumb { background: color-mix(in oklch, var(--muted-foreground) 40%, transparent); }
        html { scroll-behavior: smooth; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes scanline  { 0%{top:0%}100%{top:100%} }
        @keyframes blink-dot { 0%,100%{opacity:1}50%{opacity:0.15} }
        @keyframes spin      { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes glowPulse {
          0%,100%{box-shadow:0 0 0 1px var(--chart-1), 0 0 20px color-mix(in oklch, var(--chart-1) 15%, transparent)}
          50%{box-shadow:0 0 0 1px var(--chart-1), 0 0 40px color-mix(in oklch, var(--chart-1) 28%, transparent)}
        }
        @keyframes shimmer   { 0%{background-position:-200% 0}100%{background-position:200% 0} }

        .au1{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .05s both}
        .au2{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .18s both}
        .au3{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .32s both}
        .au4{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .46s both}
        .au5{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) .60s both}

        .shimmer-text {
          background: linear-gradient(90deg,
            var(--muted-foreground) 0%,
            var(--foreground) 35%,
            var(--chart-1) 50%,
            var(--foreground) 65%,
            var(--muted-foreground) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 5s linear infinite;
        }
        .feature-cell {
          background: var(--background); padding: 36px 32px; position: relative;
          overflow: hidden; cursor: default; transition: background 0.2s, transform 0.2s;
        }
        .feature-cell::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, var(--chart-1), transparent);
          transform: scaleX(0); transition: transform 0.35s;
        }
        .feature-cell:hover { background: var(--card); transform: translateY(-2px); }
        .feature-cell:hover::before { transform: scaleX(1); }
        .plan-card { transition: transform 0.2s; }
        .plan-card:hover { transform: translateY(-3px); }
        .plan-highlight { animation: glowPulse 3s ease-in-out infinite; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 max(24px, calc(50% - 620px))",
          borderBottom: `1px solid var(--border)`,
          background: `color-mix(in oklch, var(--background) 88%, transparent)`,
          backdropFilter: "blur(14px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <rect
              x="0"
              y="0"
              width="7.5"
              height="7.5"
              fill={`var(--chart-1)`}
            />
            <rect
              x="10.5"
              y="0"
              width="7.5"
              height="7.5"
              fill={`var(--chart-1)`}
              opacity="0.35"
            />
            <rect
              x="0"
              y="10.5"
              width="7.5"
              height="7.5"
              fill={`var(--chart-1)`}
              opacity="0.35"
            />
            <rect
              x="10.5"
              y="10.5"
              width="7.5"
              height="7.5"
              fill={`var(--chart-1)`}
            />
          </svg>
          <span
            style={{
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.1em",
              color: C.fg,
            }}
          >
            VIDAT
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 36,
            fontSize: 11,
            letterSpacing: "0.1em",
          }}
        >
          {[
            ["FUNKTIONER", "#features"],
            ["PRISER", "#pricing"],
            ["DOCS", "#docs"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              style={{ color: C.muted, transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.fg)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Show when="signed-out">
            <Link href="/sign-in">
              <Btn variant="ghost" size="sm">
                Logga in
              </Btn>
            </Link>
            <Btn size="sm">Registrera</Btn>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard">
              <Btn variant="outline" className="gap-2">
                Översikt
                <ArrowRight size={16} />
              </Btn>
            </Link>
          </Show>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "93vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px max(24px, calc(50% - 620px)) 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GridBg style={{ opacity: 0.7 }} />
        <Scanline />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 700,
            height: 700,
            pointerEvents: "none",
            background: `radial-gradient(circle, color-mix(in oklch, var(--chart-1) 5%, transparent) 0%, transparent 65%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 300,
            height: 300,
            pointerEvents: "none",
            background: `radial-gradient(circle, color-mix(in oklch, var(--chart-2) 5%, transparent) 0%, transparent 70%)`,
          }}
        />

        <div className="au1" style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: `1px solid color-mix(in oklch, var(--chart-1) 22%, transparent)`,
              padding: "6px 14px",
              fontSize: 10,
              letterSpacing: "0.12em",
              color: C.accent,
              background: `color-mix(in oklch, var(--chart-1) 4%, transparent)`,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.accent,
                flexShrink: 0,
                animation: "blink-dot 1.5s ease infinite",
              }}
            />
            LIVE — 1 247 SKANNINGAR IDAG
          </div>
        </div>

        <h1
          className="au2"
          style={{
            fontSize: "clamp(36px, 6vw, 74px)",
            fontWeight: 800,
            lineHeight: 1.02,
            textAlign: "center",
            letterSpacing: "-0.025em",
            maxWidth: 860,
            marginBottom: 12,
          }}
        >
          <span style={{ color: C.fg }}>Vet när din sajt blir</span>
        </h1>
        <h1
          className="au2"
          style={{
            fontSize: "clamp(36px, 6vw, 74px)",
            fontWeight: 800,
            lineHeight: 1.02,
            textAlign: "center",
            letterSpacing: "-0.025em",
            maxWidth: 860,
            marginBottom: 28,
          }}
        >
          <span className="shimmer-text">långsam.</span>
          <span style={{ color: C.mutedLo }}> Innan dina användare.</span>
        </h1>

        <p
          className="au3"
          style={{
            fontSize: 14,
            color: C.muted,
            textAlign: "center",
            maxWidth: 500,
            lineHeight: 1.9,
            marginBottom: 52,
            letterSpacing: "0.02em",
          }}
        >
          Automatiserade PageSpeed-granskningar, AI-drivna rekommendationer och
          regressionsvarningar — din prestanda försämras aldrig tyst igen.
        </p>

        {/* URL scanner */}
        <div
          className="au4"
          style={{ width: "100%", maxWidth: 580, marginBottom: 14 }}
        >
          <div
            style={{
              display: "flex",
              border: `1px solid color-mix(in oklch, var(--foreground) 10%, transparent)`,
              background: `color-mix(in oklch, var(--foreground) 2.5%, transparent)`,
              overflow: "hidden",
            }}
          >
            <span
              style={{
                padding: "0 14px",
                color: C.accent,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                borderRight: `1px solid color-mix(in oklch, var(--foreground) 8%, transparent)`,
                letterSpacing: "0.05em",
                flexShrink: 0,
              }}
            >
              $
            </span>
            <input
              type="text"
              placeholder="https://din-hemsida.se"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "14px 16px",
                fontSize: 13,
                color: C.fg,
                fontFamily: "inherit",
                letterSpacing: "0.02em",
              }}
            />
            <button
              onClick={handleScan}
              style={{
                padding: "14px 22px",
                background: scanning
                  ? `color-mix(in oklch, var(--chart-1) 12%, transparent)`
                  : C.accent,
                color: scanning ? C.accent : "#000",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.1em",
                fontFamily: "inherit",
                transition: "all 0.15s",
                minWidth: 120,
              }}
            >
              {scanning ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{ animation: "spin 0.8s linear infinite" }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  SCANNER
                </span>
              ) : (
                "SKANNA →"
              )}
            </button>
          </div>

          {scanned && (
            <div
              style={{
                marginTop: 1,
                border: `1px solid color-mix(in oklch, var(--chart-1) 14%, transparent)`,
                borderTop: "none",
                background: `color-mix(in oklch, var(--chart-1) 2.5%, transparent)`,
                padding: "22px 26px",
                animation: "fadeUp 0.45s cubic-bezier(.16,1,.3,1) both",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: C.muted,
                  marginBottom: 18,
                  letterSpacing: "0.1em",
                }}
              >
                SKANNINGSRESULTAT — {url || "example.se"}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 28,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <ScoreRing
                  score={92}
                  label="Prestanda"
                  color={`var(--chart-1)`}
                  delay={0}
                />
                <ScoreRing
                  score={88}
                  label="SEO"
                  color={`var(--chart-2)`}
                  delay={150}
                />
                <ScoreRing
                  score={96}
                  label="Tillgängl"
                  color={`var(--chart-3)`}
                  delay={300}
                />
                <ScoreRing
                  score={79}
                  label="Best pract"
                  color={`var(--destructive)`}
                  delay={450}
                />
              </div>
              <div
                style={{
                  marginTop: 18,
                  padding: "10px 14px",
                  background: `color-mix(in oklch, var(--foreground) 3%, transparent)`,
                  borderLeft: `2px solid var(--chart-1)`,
                  fontSize: 11,
                  color: C.muted,
                  lineHeight: 1.9,
                }}
              >
                <span style={{ color: C.accent }}>AI ✦ </span>3 oanvända
                JS-paket ökar laddningstiden med ~340 ms. Optimera hero-bilden
                (420 kb → &lt;100 kb) och aktivera lazy loading. Förväntad
                förbättring: +12 poäng.
                <span style={{ color: C.mutedLo }}>
                  {" "}
                  Aktivera Pro för full analys.
                </span>
              </div>
            </div>
          )}
        </div>

        <p
          className="au5"
          style={{ fontSize: 10, color: C.mutedLo, letterSpacing: "0.07em" }}
        >
          Gratis för alltid · Inget kreditkort · Kom igång på 30 sekunder
        </p>

        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 1,
              height: 44,
              background: `linear-gradient(to bottom, transparent, color-mix(in oklch, var(--foreground) 18%, transparent))`,
            }}
          />
          <span
            style={{ fontSize: 9, color: C.mutedLo, letterSpacing: "0.18em" }}
          >
            SCROLLA
          </span>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: `1px solid var(--border)`,
          borderBottom: `1px solid var(--border)`,
          padding: "30px max(24px, calc(50% - 620px))",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          background: `color-mix(in oklch, var(--foreground) 0.8%, transparent)`,
        }}
      >
        {[
          ["10 000+", "Skanningar per dag"],
          ["< 2s", "Varningsfördröjning"],
          ["99.9%", "Drifttid"],
          ["4 800+", "Aktiva hemsidor"],
        ].map(([v, l], i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "clamp(22px, 2.5vw, 34px)",
                fontWeight: 800,
                color: C.accent,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.muted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* ── TERMINAL DEMO ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px max(24px, calc(50% - 620px))",
          position: "relative",
        }}
      >
        <div
          style={{
            border: `1px solid var(--border)`,
            background: `color-mix(in oklch, var(--background) 97%, black)`,
            overflow: "hidden",
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: `1px solid var(--border)`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: `color-mix(in oklch, var(--foreground) 2%, transparent)`,
            }}
          >
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
            <span
              style={{
                fontSize: 10,
                color: C.muted,
                marginLeft: 8,
                letterSpacing: "0.06em",
              }}
            >
              vidat — scan — zsh
            </span>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}
          >
            <div
              style={{
                padding: "28px 28px",
                fontSize: 12,
                lineHeight: 2.1,
                borderRight: `1px solid var(--border)`,
              }}
            >
              <div>
                <span style={{ color: C.accent }}>vidat</span>
                <span style={{ color: C.blue }}> scan</span>
                <span style={{ color: C.fg }}> acme.se</span>
              </div>
              <div style={{ color: C.muted }}>
                <Typewriter
                  text="→ Connecting to PageSpeed API..."
                  delay={600}
                />
              </div>
              <div style={{ color: C.muted }}>
                <Typewriter
                  text="→ Fetching Desktop + Mobile..."
                  delay={1300}
                />
              </div>
              <div style={{ color: C.muted }}>
                <Typewriter text="→ Analyserar 47 resurser..." delay={2100} />
              </div>
              <div style={{ color: C.teal }}>
                <Typewriter text="✓ Klar på 2.3s" delay={3000} />
              </div>
              <div style={{ marginTop: 16 }}>
                {[
                  ["Performance  ", 92, `var(--chart-1)`],
                  ["SEO          ", 88, `var(--chart-2)`],
                  ["Accessibility", 96, `var(--chart-3)`],
                  ["Best Practices", 79, `var(--destructive)`],
                ].map(([label, val, color], i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{ color: C.muted, minWidth: 138, fontSize: 11 }}
                    >
                      {label}
                    </span>
                    <span style={{ color, fontWeight: 800 }}>{val}</span>
                    <span style={{ color: C.mutedLo, letterSpacing: -1 }}>
                      {"█".repeat(Math.floor(val / 5))}
                      {"░".repeat(20 - Math.floor(val / 5))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "28px 28px" }}>
              <div
                style={{
                  fontSize: 9,
                  color: C.muted,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                VISUELL ÖVERSIKT
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                <ScoreRing
                  score={92}
                  label="Prestanda"
                  color={`var(--chart-1)`}
                  size={72}
                  delay={3200}
                />
                <ScoreRing
                  score={88}
                  label="SEO"
                  color={`var(--chart-2)`}
                  size={72}
                  delay={3400}
                />
                <ScoreRing
                  score={96}
                  label="Tillgängl"
                  color={`var(--chart-3)`}
                  size={72}
                  delay={3600}
                />
                <ScoreRing
                  score={79}
                  label="Best pract"
                  color={`var(--destructive)`}
                  size={72}
                  delay={3800}
                />
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  background: `color-mix(in oklch, var(--chart-1) 4%, transparent)`,
                  borderLeft: `2px solid var(--chart-1)`,
                  fontSize: 11,
                  color: C.muted,
                  lineHeight: 1.8,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: C.accent,
                    letterSpacing: "0.12em",
                    marginBottom: 6,
                  }}
                >
                  AI ✦ REKOMMENDATION
                </div>
                <Typewriter
                  text="Ditt LCP på 1.2s är utmärkt. Oanvänd JS lägger till 340ms på mobil — code-splitta analytics-bundeln. Förväntad förbättring: +12 poäng."
                  delay={3500}
                  speed={22}
                />
                <BlinkCursor />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section
        id="features"
        style={{ padding: "80px max(24px, calc(50% - 620px)) 100px" }}
      >
        <div style={{ marginBottom: 60 }}>
          <div
            style={{
              fontSize: 10,
              color: C.accent,
              letterSpacing: "0.16em",
              marginBottom: 14,
            }}
          >
            // FUNKTIONER
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: C.fg,
              lineHeight: 1.1,
              maxWidth: 480,
            }}
          >
            Allt ditt prestandaarbetsflöde
            <br />
            <span style={{ color: C.mutedLo }}>behöver.</span>
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: 1,
            background: C.border,
          }}
        >
          {FEATURES.map((f) => (
            <div key={f.n} className="feature-cell">
              {f.accent && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    background: `radial-gradient(circle at top right, color-mix(in oklch, var(--chart-1) 7%, transparent), transparent)`,
                    pointerEvents: "none",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 18,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: C.mutedLo,
                    letterSpacing: "0.1em",
                  }}
                >
                  {f.n}
                </span>
                <span
                  style={{
                    fontSize: 18,
                    color: f.accent ? C.accent : C.mutedLo,
                  }}
                >
                  {f.icon}
                </span>
              </div>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.fg,
                  marginBottom: 10,
                  letterSpacing: "0.02em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 1.85,
                  marginBottom: 18,
                }}
              >
                {f.desc}
              </p>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: f.accent ? C.accent : C.mutedLo,
                  border: `1px solid ${f.accent ? "color-mix(in oklch, var(--chart-1) 25%, transparent)" : "var(--border)"}`,
                  padding: "3px 9px",
                }}
              >
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px max(24px, calc(50% - 620px))",
          borderTop: `1px solid var(--border)`,
          borderBottom: `1px solid var(--border)`,
          background: `color-mix(in oklch, var(--foreground) 1%, transparent)`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: C.accent,
            letterSpacing: "0.16em",
            marginBottom: 52,
          }}
        >
          // SÅ HÄR FUNGERAR DET
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 1,
            background: C.border,
          }}
        >
          {STEPS.map(([n, title, desc]) => (
            <div key={n} style={{ background: C.bg, padding: "36px 28px" }}>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: `color-mix(in oklch, var(--foreground) 4%, transparent)`,
                  marginBottom: 20,
                  userSelect: "none",
                }}
              >
                {n}
              </div>
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.fg,
                  marginBottom: 10,
                  letterSpacing: "0.03em",
                }}
              >
                {title}
              </h3>
              <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.85 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        style={{ padding: "100px max(24px, calc(50% - 620px))" }}
      >
        <div style={{ marginBottom: 60, textAlign: "center" }}>
          <div
            style={{
              fontSize: 10,
              color: C.accent,
              letterSpacing: "0.16em",
              marginBottom: 14,
            }}
          >
            // PRISER
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: C.fg,
              lineHeight: 1.1,
            }}
          >
            Börja gratis.
            <br />
            <span style={{ color: C.mutedLo }}>Skala när du behöver.</span>
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
            background: C.border,
            maxWidth: 980,
            margin: "0 auto",
          }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`plan-card ${plan.highlight ? "plan-highlight" : ""}`}
              style={{
                background: plan.highlight ? C.surface : C.bg,
                padding: "40px 30px",
                position: "relative",
                borderTop: plan.highlight
                  ? `2px solid var(--chart-1)`
                  : `2px solid transparent`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {plan.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -1,
                    right: 20,
                    background: C.accent,
                    color: "#000",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    padding: "3px 10px",
                  }}
                >
                  {plan.badge}
                </div>
              )}
              <div
                style={{
                  fontSize: 10,
                  color: C.muted,
                  letterSpacing: "0.16em",
                  marginBottom: 20,
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: plan.highlight ? C.accent : C.fg,
                  }}
                >
                  {plan.price}
                </span>
                <span style={{ fontSize: 11, color: C.muted }}>
                  {plan.period}
                </span>
              </div>
              <div
                style={{
                  width: 32,
                  height: 1,
                  background: C.border,
                  margin: "18px 0 20px",
                }}
              />
              <div style={{ flex: 1, marginBottom: 28 }}>
                {plan.features.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 10,
                      fontSize: 11,
                      color: C.muted,
                    }}
                  >
                    <span
                      style={{
                        color: plan.highlight ? C.accent : C.mutedLo,
                        flexShrink: 0,
                        marginTop: 2,
                        fontSize: 9,
                      }}
                    >
                      ▸
                    </span>
                    {f}
                  </div>
                ))}
              </div>
              <button
                style={{
                  width: "100%",
                  padding: "12px 0",
                  background: plan.highlight ? C.accent : "transparent",
                  color: plan.highlight ? "#000" : C.accent,
                  border: plan.highlight
                    ? "none"
                    : `1px solid color-mix(in oklch, var(--chart-1) 30%, transparent)`,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!plan.highlight) {
                    e.currentTarget.style.borderColor = C.accent
                    e.currentTarget.style.background = `color-mix(in oklch, var(--chart-1) 6%, transparent)`
                  } else
                    e.currentTarget.style.background = `color-mix(in oklch, var(--chart-1) 85%, white)`
                }}
                onMouseLeave={(e) => {
                  if (!plan.highlight) {
                    e.currentTarget.style.borderColor = `color-mix(in oklch, var(--chart-1) 30%, transparent)`
                    e.currentTarget.style.background = "transparent"
                  } else e.currentTarget.style.background = C.accent
                }}
              >
                {plan.cta.toUpperCase()} →
              </button>
            </div>
          ))}
        </div>
        <p
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 10,
            color: C.mutedLo,
            letterSpacing: "0.07em",
          }}
        >
          Alla planer inkluderar 14 dagars gratis provperiod · Inget kreditkort
          krävs
        </p>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────────── */}
      <section
        style={{
          margin: "0 max(24px, calc(50% - 620px)) 80px",
          border: `1px solid var(--border)`,
          padding: "64px max(32px, 8%)",
          position: "relative",
          overflow: "hidden",
          background: C.surface,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(ellipse at 20% 50%, color-mix(in oklch, var(--chart-1) 5%, transparent) 0%, transparent 55%)`,
          }}
        />
        <GridBg style={{ opacity: 0.4 }} />
        <div style={{ position: "relative", maxWidth: 560 }}>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: C.fg,
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Sluta få reda på prestandaproblem
            <br />
            <span style={{ color: C.accent }}>från dina användare.</span>
          </h2>
          <p
            style={{
              fontSize: 12,
              color: C.muted,
              marginBottom: 36,
              lineHeight: 1.85,
            }}
          >
            Gå med de utvecklare som får varningar inom sekunder — inte dagar.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn size="lg">Skapa gratis konto →</Btn>
            <Btn variant="outline" size="lg">
              Se demo
            </Btn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: `1px solid var(--border)`,
          padding: "28px max(24px, calc(50% - 620px))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 18 18">
            <rect x="0" y="0" width="7.5" height="7.5" fill="var(--chart-1)" />
            <rect
              x="10.5"
              y="0"
              width="7.5"
              height="7.5"
              fill="var(--chart-1)"
              opacity="0.35"
            />
            <rect
              x="0"
              y="10.5"
              width="7.5"
              height="7.5"
              fill="var(--chart-1)"
              opacity="0.35"
            />
            <rect
              x="10.5"
              y="10.5"
              width="7.5"
              height="7.5"
              fill="var(--chart-1)"
            />
          </svg>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: C.muted,
              letterSpacing: "0.12em",
            }}
          >
            VIDAT
          </span>
        </div>
        <span
          style={{ fontSize: 10, color: C.mutedLo, letterSpacing: "0.06em" }}
        >
          © 2026 VIDAT · BYGGD MED NEXT.JS + GO
        </span>
        <div style={{ display: "flex", gap: 24, fontSize: 10, color: C.muted }}>
          {["Integritetspolicy", "Villkor", "Kontakt", "Docs"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.fg)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
