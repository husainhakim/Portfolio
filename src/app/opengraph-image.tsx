import { ImageResponse } from "next/og";

export const alt = "Husain Hakim | Interactive Cybersecurity & Systems Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#080c16",
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(14, 165, 233, 0.15), transparent 60%), radial-gradient(circle at 85% 85%, rgba(99, 102, 241, 0.12), transparent 50%), radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.04) 2%, transparent 0%)",
          backgroundSize: "100% 100%, 100% 100%, 32px 32px",
          padding: "48px 60px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          border: "2px solid rgba(56, 189, 248, 0.2)",
          position: "relative",
        }}
      >
        {/* Top HUD Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                boxShadow: "0 0 10px #10b981",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                color: "#38bdf8",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              HUSAIN_OS // SEC_COMM // INTERACTIVE WORKSTATION
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(56, 189, 248, 0.1)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              padding: "4px 14px",
              borderRadius: "20px",
              color: "#38bdf8",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            GUI + CLI HYBRID
          </div>
        </div>

        {/* Central Logo & Brand Identity */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "42px",
            margin: "auto 0",
          }}
        >
          {/* Glowing Brand Logo Container */}
          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "36px",
              background: "linear-gradient(135deg, #0f172a 0%, #030712 100%)",
              border: "2px solid rgba(56, 189, 248, 0.5)",
              boxShadow:
                "0 0 40px rgba(14, 165, 233, 0.35), 0 20px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(56, 189, 248, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="116"
              height="116"
              viewBox="0 0 512 512"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M64 64H256V192H448V448H320V320C320 284.65 291.35 256 256 256C220.65 256 192 284.65 192 320V448H64V64Z"
                fill="#ffffff"
              />
            </svg>
          </div>

          {/* Hero Typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#38bdf8",
                backgroundColor: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                padding: "4px 12px",
                borderRadius: "9999px",
              }}
            >
              CYBERSECURITY &amp; SYSTEM ARCHITECTURE
            </div>

            <div
              style={{
                fontSize: "58px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#f8fafc",
                lineHeight: 1.1,
              }}
            >
              Husain Hakim
            </div>

            <div
              style={{
                fontSize: "22px",
                color: "#94a3b8",
                maxWidth: "760px",
                lineHeight: 1.45,
              }}
            >
              Interactive cybersecurity workstation &amp; portfolio featuring stateful UNIX filesystem,
              real-time terminal, security tools, and vulnerability research.
            </div>
          </div>
        </div>

        {/* Bottom Feature Tags & Domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "18px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              "Virtual File Explorer",
              "Interactive UNIX CLI",
              "Offensive & Defensive Security",
              "20s Live Skim",
            ].map((tag, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#cbd5e1",
                  fontFamily: "monospace",
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#38bdf8",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
          >
            husainhakim.me
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
