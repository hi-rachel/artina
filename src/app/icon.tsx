import { ImageResponse } from "next/og";

export const runtime = "edge";

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
          fontSize: 24,
          background: "#fdf6e3",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8b4513",
          borderRadius: "6px",
          border: "1px solid #d4c4a8",
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
