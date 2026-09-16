import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 90,
          background: "#101114",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          borderRadius: 36,
          border: "4px solid #8b1e2f",
          fontWeight: 900,
          fontFamily: "monospace",
        }}
      >
        <span style={{ color: "#ff4d6d" }}>H/H</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
