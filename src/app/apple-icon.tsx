import { ImageResponse } from "next/og";

export const runtime = "edge";

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
          fontSize: 120,
          background: "#fdf6e3",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8b4513",
          borderRadius: "22px",
          border: "2px solid #d4c4a8",
        }}
      >
        🖼️
      </div>
    ),
    {
      ...size,
    }
  );
}
