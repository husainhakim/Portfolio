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
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        <svg
          width="112"
          height="112"
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
    ),
    {
      ...size,
    }
  );
}
