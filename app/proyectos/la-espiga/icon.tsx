import { ImageResponse } from "next/og"

/** Ícono de pestaña de La Espiga: sello rojo con una espiga, sobre papel. */
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
          background: "#f6efdf",
          borderRadius: 9999,
          border: "5px solid #a3301c",
        }}
      >
        <svg width="40" height="44" viewBox="0 0 40 44">
          <path
            d="M20 42 V8"
            stroke="#a3301c"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {[10, 18, 26].map((y) => (
            <g key={y}>
              <path
                d={`M20 ${y + 8} C 12 ${y + 6} 9 ${y} 9 ${y - 4} C 16 ${y - 2} 19 ${y + 2} 20 ${y + 8} Z`}
                fill="#a3301c"
              />
              <path
                d={`M20 ${y + 8} C 28 ${y + 6} 31 ${y} 31 ${y - 4} C 24 ${y - 2} 21 ${y + 2} 20 ${y + 8} Z`}
                fill="#a3301c"
              />
            </g>
          ))}
          <path d="M20 1 C 17 5 17 9 20 12 C 23 9 23 5 20 1 Z" fill="#a3301c" />
        </svg>
      </div>
    ),
    size
  )
}
