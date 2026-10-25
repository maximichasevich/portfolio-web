import { ImageResponse } from "next/og"

/**
 * Ícono de pestaña de Estudio Faro: un faro de líneas finas sobre carbón,
 * con el haz de luz en el acento latón del sitio.
 */
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
          background: "#0f0f0d",
        }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56">
          {/* Haz de luz. */}
          <path d="M31 15 L54 8 L54 22 Z" fill="#c9a96e" opacity="0.9" />
          {/* Linterna. */}
          <rect x="21" y="10" width="10" height="9" fill="#c9a96e" />
          <path d="M19 10 L26 4 L33 10 Z" fill="#efebe4" />
          {/* Torre. */}
          <path
            d="M21 21 H31 L34 50 H18 Z"
            fill="none"
            stroke="#efebe4"
            strokeWidth="2.5"
            strokeLinejoin="miter"
          />
          <path d="M20 32 H32" stroke="#efebe4" strokeWidth="2" />
          {/* Línea de horizonte. */}
          <path d="M6 51 H50" stroke="#efebe4" strokeWidth="2.5" />
        </svg>
      </div>
    ),
    size
  )
}
