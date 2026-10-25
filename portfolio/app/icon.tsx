import { ImageResponse } from "next/og"

/** Favicon generado: la "M." de la barra de navegación sobre fondo noche. */
export const size = { width: 64, height: 64 }
export const contentType = "image/png"

export default function Icon() {
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
          borderRadius: 14,
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
            borderRadius: 14,
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
            borderRadius: 14,
            background:
              "radial-gradient(circle at 80% 85%, rgba(57,213,255,0.5), rgba(5,6,15,0) 55%)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 800,
            color: "#f5f7ff",
            letterSpacing: -2,
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
