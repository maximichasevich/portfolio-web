"use client"

import { useState } from "react"
import { DoorOpen } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * El horno de ladrillo en CSS 3D. La puerta de hierro bisagra abajo y se
 * abre al tocarla (o con el botón de texto); adentro se ve la bandeja de
 * la horneada que corresponde a esta hora.
 */
export function Horno3D({
  titulo,
  productos,
  estado,
}: {
  titulo: string
  productos: string[]
  estado: string
}) {
  const [abierto, setAbierto] = useState(false)
  const [vez, setVez] = useState(0)

  function alternar() {
    setAbierto((a) => !a)
    setVez((v) => v + 1)
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center">
      <div className="horno-escena">
        <div className={cn("horno", abierto && "horno-abierto")}>
          <div className="horno-techo" aria-hidden="true" />
          <div className="horno-boca" aria-hidden="true">
            <div className="horno-fuego" />
            <div className="horno-bandeja">
              <span className="pancito pancito-redondo" />
              <span className="pancito pancito-flauta" />
              <span className="pancito pancito-redondo pancito-chico" />
              <span className="pancito pancito-flauta pancito-flauta-2" />
            </div>
          </div>
          <div
            className="horno-puerta"
            onClick={alternar}
            aria-hidden="true"
          >
            <span className="puerta-frente">
              <span className="puerta-ventana" />
              <span className="puerta-manija" />
              <span className="puerta-remaches" />
            </span>
            <span className="puerta-dorso" />
          </div>
          {abierto && (
            <span key={vez} className="horno-vapores" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          )}
          <div className="horno-termometro" aria-hidden="true">
            <span className="termometro-aguja" />
            <span className="termometro-texto">°C</span>
          </div>
          <div className="horno-zocalo" aria-hidden="true">
            <span className="tiza">Horno de 1998</span>
          </div>
        </div>
      </div>

      <div>
        <p className="volanta text-[var(--rojo)]">{titulo}</p>
        <p className="titulo mt-1 text-[1.9rem] leading-tight">{estado}</p>
        <button
          type="button"
          onClick={alternar}
          aria-expanded={abierto}
          aria-controls="horno-adentro"
          className="boton-tinta mt-4 rounded-md px-5"
        >
          <DoorOpen className="size-5" aria-hidden="true" />
          {abierto ? "Cerrar la puerta del horno" : "Abrir la puerta del horno"}
        </button>
        <div
          id="horno-adentro"
          aria-live="polite"
          className="mt-4 min-h-[9.5rem] rounded-md border-2 border-dashed border-[var(--tinta-20)] p-4"
        >
          {abierto ? (
            <>
              <p className="font-bold">Adentro de esta tanda:</p>
              <ul className="mt-1 grid gap-1">
                {productos.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden="true" className="text-[var(--rojo)]">
                      ✦
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-[var(--tinta-70)]">
              Tocá la puerta del horno para espiar qué se está horneando. A
              220 °C, el pan de campo tarda 45 minutos.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
