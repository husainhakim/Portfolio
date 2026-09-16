import { ImageResponse } from "next/og";

export const alt = "Husain Hakim — Offensive Security & Cybersecurity Workspace";
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
          backgroundColor: "#0d0e11",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1a1c23 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1c23 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          border: "8px solid #1f232b",
        }}
      >
        {/* Top Bar / Terminal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderBottom: "1px solid #2d333f",
            paddingBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#ff5f56",
              }}
            />
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#27c93f",
              }}
            />
            <span
              style={{
                marginLeft: "16px",
                fontSize: "18px",
                color: "#8b949e",
                fontFamily: "monospace",
              }}
            >
              sec-ws://home/husain [GUI + CLI]
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#261317",
              border: "1px solid #8b1e2f",
              padding: "6px 16px",
              borderRadius: "20px",
              color: "#ff6b81",
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "monospace",
            }}
          >
            OFFENSIVE SECURITY LAB
          </div>
        </div>

        {/* Central Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Husain Hakim
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 600,
              color: "#ff6b81",
              fontFamily: "monospace",
            }}
          >
            Cybersecurity Student | Offensive Security
          </div>

          <div
            style={{
              fontSize: "22px",
              color: "#9ca3af",
              maxWidth: "950px",
              lineHeight: 1.4,
            }}
          >
            Interactive cybersecurity workspace featuring custom reconnaissance utilities,
            SUID binary privilege escalation research, and verified lab writeups.
          </div>
        </div>

        {/* Bottom Tag Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #2d333f",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "14px" }}>
            {["CYBER // SONAR", "SUID Escalation", "File Signature Detector", "VFS & CLI"].map(
              (tag, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#16181d",
                    border: "1px solid #30363d",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "16px",
                    color: "#c9d1d9",
                    fontFamily: "monospace",
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>

          <div
            style={{
              fontSize: "18px",
              color: "#8b949e",
              fontFamily: "monospace",
            }}
          >
            https://husainhakim.me
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
