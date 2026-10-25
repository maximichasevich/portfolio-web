import { ImageResponse } from "next/og"

import { perfil } from "@/data/perfil"

/**
 * Imagen que aparece al compartir el link por WhatsApp, Instagram o LinkedIn.
 * Misma paleta que la portada: noche, violeta y cian, con un globo en órbita.
 */
export const alt = `${perfil.nombre} · Páginas web que impresionan`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const noche = "#05060f"
const estrella = "#f5f7ff"
const cian = "#39d5ff"
const violeta = "#7c5cff"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: noche,
          color: estrella,
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Nebulosas de fondo. */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -120,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(124,92,255,0.45), rgba(5,6,15,0) 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            right: -60,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(57,213,255,0.32), rgba(5,6,15,0) 65%)",
          }}
        />

        {/* Globo con dos órbitas, a la derecha. */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 65,
            width: 500,
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 500,
              height: 500,
              borderRadius: 9999,
              border: "1.5px solid rgba(245,247,255,0.12)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 85,
              left: 85,
              width: 330,
              height: 330,
              borderRadius: 9999,
              border: "1.5px solid rgba(245,247,255,0.16)",
            }}
          />
          <div
            style={{
              width: 190,
              height: 190,
              borderRadius: 9999,
              background:
                "radial-gradient(circle at 35% 35%, rgba(124,92,255,0.95), rgba(12,15,34,1) 70%)",
              boxShadow: "0 0 90px 10px rgba(124,92,255,0.45)",
            }}
          />
          {/* Satélites. */}
          <div
            style={{
              position: "absolute",
              top: 2,
              left: 240,
              width: 20,
              height: 20,
              borderRadius: 9999,
              background: cian,
              boxShadow: "0 0 24px 4px rgba(57,213,255,0.7)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 390,
              left: 36,
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: estrella,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 230,
              left: 408,
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: violeta,
              boxShadow: "0 0 20px 4px rgba(124,92,255,0.8)",
            }}
          />
        </div>

        {/* Texto, a la izquierda. */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 0,
            bottom: 0,
            width: 640,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 26,
              color: cian,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: cian,
                boxShadow: "0 0 16px 3px rgba(57,213,255,0.8)",
              }}
            />
            {perfil.rol} · {perfil.ciudad.split(",")[0]}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            Tu negocio merece una página que impresione.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 30,
              color: "rgba(245,247,255,0.7)",
            }}
          >
            {perfil.nombre}
          </div>
        </div>

        {/* Línea de luz al pie, como la barra de progreso. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 6,
            background: `linear-gradient(90deg, ${cian}, ${violeta}, ${cian})`,
          }}
        />
      </div>
    ),
    size
  )
}
