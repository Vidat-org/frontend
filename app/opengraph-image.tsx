import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "48px",
          backgroundColor: "#f6f1e8",
          backgroundImage:
            "radial-gradient(circle at top left, rgba(210, 99, 46, 0.18), transparent 38%), radial-gradient(circle at top right, rgba(39, 39, 42, 0.12), transparent 34%)",
          color: "#171717",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(23, 23, 23, 0.08)",
            borderRadius: "36px",
            background: "rgba(255, 255, 255, 0.72)",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#efe6d7",
                  padding: "6px",
                }}
              >
                <div
                  style={{
                    width: "13px",
                    height: "13px",
                    borderRadius: "6px",
                    background: "#d2632e",
                  }}
                />
                <div
                  style={{
                    width: "13px",
                    height: "13px",
                    borderRadius: "6px",
                    background: "rgba(23, 23, 23, 0.16)",
                  }}
                />
                <div
                  style={{
                    width: "13px",
                    height: "13px",
                    borderRadius: "6px",
                    background: "rgba(23, 23, 23, 0.16)",
                  }}
                />
                <div
                  style={{
                    width: "13px",
                    height: "13px",
                    borderRadius: "6px",
                    background: "#d2632e",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Vidat
                </div>
                <div style={{ fontSize: "14px", color: "rgba(23, 23, 23, 0.65)" }}>
                  Performance monitoring for teams
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "999px",
                padding: "10px 16px",
                background: "rgba(210, 99, 46, 0.1)",
                color: "#d2632e",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Catch regressions early
            </div>
          </div>

          <div style={{ display: "flex", gap: "28px", alignItems: "stretch" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "60%",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div
                  style={{
                    fontSize: "62px",
                    lineHeight: 1.02,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Make performance a product, not an afterthought.
                </div>
                <div
                  style={{
                    maxWidth: "620px",
                    fontSize: "24px",
                    lineHeight: 1.45,
                    color: "rgba(23, 23, 23, 0.72)",
                  }}
                >
                  Lighthouse monitoring, regression alerts, and reporting that
                  helps product teams and agencies act faster.
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                {[
                  ["< 5 min", "Time to first scan"],
                  ["100%", "Uptime SLA"],
                  ["Lighthouse v12", "Always current"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      minWidth: "150px",
                      borderRadius: "24px",
                      border: "1px solid rgba(23, 23, 23, 0.08)",
                      background: "rgba(255, 255, 255, 0.75)",
                      padding: "18px 20px",
                    }}
                  >
                    <div style={{ fontSize: "28px", fontWeight: 700 }}>{value}</div>
                    <div style={{ fontSize: "14px", color: "rgba(23, 23, 23, 0.62)" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "40%",
                borderRadius: "30px",
                border: "1px solid rgba(23, 23, 23, 0.08)",
                background: "rgba(255, 255, 255, 0.9)",
                padding: "28px",
                boxShadow: "0 24px 80px rgba(23, 23, 23, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "rgba(23, 23, 23, 0.55)",
                    }}
                  >
                    Live overview
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 700 }}>
                    Deploy health
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: "999px",
                    padding: "8px 12px",
                    background: "rgba(210, 99, 46, 0.12)",
                    color: "#d2632e",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Pro workspace
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
                {[
                  ["Performance", "92", "#d2632e"],
                  ["SEO", "96", "#d2632e"],
                  ["Best Practices", "78", "#c2410c"],
                ].map(([label, value, color]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      flex: 1,
                      borderRadius: "20px",
                      border: "1px solid rgba(23, 23, 23, 0.08)",
                      padding: "16px",
                      background: "#faf7f2",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(23, 23, 23, 0.55)",
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: "30px", fontWeight: 700, color }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  borderRadius: "24px",
                  border: "1px solid rgba(194, 65, 12, 0.16)",
                  background: "rgba(255, 237, 213, 0.55)",
                  padding: "18px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: 700 }}>
                  Regression detected
                </div>
                <div style={{ fontSize: "14px", lineHeight: 1.45, color: "rgba(23, 23, 23, 0.72)" }}>
                  LCP degraded by 380ms after the latest mobile deploy. The
                  analytics bundle grew significantly.
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  borderRadius: "24px",
                  border: "1px solid rgba(23, 23, 23, 0.08)",
                  background: "#faf7f2",
                  padding: "18px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#d2632e",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  AI recommendation
                </div>
                <div style={{ fontSize: "14px", lineHeight: 1.45, color: "rgba(23, 23, 23, 0.72)" }}>
                  Move third-party scripts off the critical render path and
                  review the latest deploy for new above-the-fold image blocks.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
