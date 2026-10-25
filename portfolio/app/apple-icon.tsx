import { ImageResponse } from "next/og"

/** Ícono para la pantalla de inicio en iPhone y Android. */
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "#05060f",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 25%, rgba(124,92,255,0.8), rgba(5,6,15,0) 62%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 80% 85%, rgba(57,213,255,0.5), rgba(5,6,15,0) 55%)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 112,
            fontWeight: 800,
            color: "#f5f7ff",
            letterSpacing: -6,
            lineHeight: 1,
          }}
        >
          M<span style={{ color: "#39d5ff" }}>.</span>
        </div>
      </div>
    ),
    size
  )
}
