import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#101114",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff4d6d",
          borderRadius: 6,
          border: "1.5px solid #8b1e2f",
          fontWeight: 800,
          fontFamily: "monospace",
        }}
      >
        H
      </div>
    ),
    {
      ...size,
    }
  );
}
