"use client"

import { useAhora } from "@/components/demos/espiga/estado"
import {
  estadoLocal,
  momentoMontevideo,
} from "@/components/demos/espiga/horario"
import { cn } from "@/lib/utils"

/**
 * "Abierto ahora · cierra a las 20:00", calculado con la hora real de
 * Montevideo. Antes de hidratar muestra los horarios fijos.
 */
export function EstadoEnVivo({
  className,
  corto = false,
}: {
  className?: string
  /** Solo el título y la hora, sin "Hoy". */
  corto?: boolean
}) {
  const ahora = useAhora()
  if (ahora === null) {
    return (
      <p className={cn("inline-flex items-center gap-2", className)}>
        <span
          className="size-2.5 shrink-0 rounded-full bg-current opacity-60"
          aria-hidden="true"
        />
        Lun. a sáb. 7:00 a 20:00 · Dom. 8:00 a 13:00
      </p>
    )
  }
  const estado = estadoLocal(momentoMontevideo(ahora))
  return (
    <p className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
        <span
          className={cn(
            "size-2.5 rounded-full",
            estado.abierto ? "bg-[#5fd38a]" : "bg-[#ff8a72]"
          )}
        />
      </span>
      <span>
        <strong className="font-bold">{estado.titulo}</strong>
        {!corto && <span aria-hidden="true"> · </span>}
        {!corto && <span className="sr-only">, </span>}
        {!corto && estado.detalle}
      </span>
    </p>
  )
}
