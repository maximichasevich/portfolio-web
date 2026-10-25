"use client"

import { useAhora } from "@/components/demos/espiga/estado"
import {
  filasHorario,
  momentoMontevideo,
} from "@/components/demos/espiga/horario"
import { cn } from "@/lib/utils"

/** Horarios con el día de hoy marcado. */
export function TablaHorarios() {
  const ahora = useAhora()
  const hoy = ahora === null ? null : momentoMontevideo(ahora).dia
  return (
    <dl className="border-t-2 border-[var(--tinta)]">
      {filasHorario.map((f) => {
        const esHoy = hoy !== null && f.incluye.includes(hoy)
        return (
          <div
            key={f.dias}
            className={cn(
              "flex flex-wrap items-baseline justify-between gap-x-4 border-b border-dashed border-[var(--tinta-20)] px-2 py-3.5",
              esHoy && "bg-[var(--amarilla)]"
            )}
          >
            <dt className="flex items-center gap-2 text-[1.1rem]">
              {f.dias}
              {esHoy && (
                <span className="rounded bg-[var(--tinta)] px-1.5 py-0.5 text-[0.8rem] font-bold tracking-wide text-[var(--papel)] uppercase">
                  Hoy
                </span>
              )}
            </dt>
            <dd className="titulo text-[1.45rem] tabular-nums">{f.horas}</dd>
          </div>
        )
      })}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 px-2 py-3.5">
        <dt className="text-[1.1rem]">Feriados</dt>
        <dd className="text-[var(--tinta-70)]">
          Como los domingos, de 8:00 a 13:00
        </dd>
      </div>
    </dl>
  )
}
