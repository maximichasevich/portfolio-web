"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

/**
 * El sello rojo de la portada, que se da vuelta como una moneda al tocarlo.
 * Adelante: "Horneado hoy en Pocitos". Atrás: "Desde 1987".
 */
export function SelloMoneda({ className }: { className?: string }) {
  const [vuelta, setVuelta] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setVuelta((v) => !v)}
      aria-pressed={vuelta}
      aria-label={
        vuelta
          ? "Sello de la casa: desde 1987, tres generaciones. Tocá para darlo vuelta."
          : "Sello de la casa: horneado hoy en Pocitos. Tocá para darlo vuelta."
      }
      className={cn("moneda rounded-full", className)}
    >
      <span className={cn("moneda-giro", vuelta && "moneda-vuelta")}>
        <span className="moneda-cara">
          <span className="text-[0.75rem] font-bold tracking-widest uppercase">
            Horneado
          </span>
          <span className="titulo text-[1.9rem] leading-none">hoy</span>
          <span className="text-[0.75rem] font-bold tracking-widest uppercase">
            en Pocitos
          </span>
        </span>
        <span className="moneda-cara moneda-dorso">
          <span className="text-[0.7rem] font-bold tracking-widest uppercase">
            Desde
          </span>
          <span className="titulo text-[1.75rem] leading-none">1987</span>
          <span className="text-[0.7rem] font-bold tracking-widest uppercase">
            3 generaciones
          </span>
        </span>
      </span>
    </button>
  )
}
