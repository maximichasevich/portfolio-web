import { ImageResponse } from "next/og"

/**
 * Ícono de pestaña de Verde Tienda: sticker amarillo manteca con borde de
 * tinta y las dos hojas del logo.
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
          background: "#ffd84d",
          borderRadius: "46% 54% 50% 50% / 52% 46% 54% 48%",
          border: "4px solid #1f2a22",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 42 42">
          {/* Hoja izquierda. */}
          <path
            d="M20 36 C 10 32 4 22 6 8 C 16 12 22 22 20 36 Z"
            fill="#1e6b45"
            stroke="#1f2a22"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Hoja derecha. */}
          <path
            d="M22 36 C 24 24 30 14 38 10 C 40 22 34 32 22 36 Z"
            fill="#ff6542"
            stroke="#1f2a22"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size
  )
}
